import { IStrategy, StrategyContext, StrategyDecision } from './base';
import { Move } from '../types/game';

export const llmAgentStrategy: IStrategy = {
  id: 'llm-agent',
  name: 'Gemini AI Agent (Google Gemini API)',
  description: 'Uses Google Gemini API to evaluate game state, past rounds, and payoff incentives to output structured decision metadata.',
  category: 'AI / LLM',
  isLLM: true,

  async decide({ history, agentRole, settings, agentConfig }: StrategyContext): Promise<StrategyDecision> {
    const config = agentConfig.llmConfig;

    // Retrieve API key from agent config modal input OR environment variable
    const apiKey = config?.apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    const model = config?.model || 'gemini-1.5-flash';

    // Construct history log for prompt
    const historyText = history.length === 0
      ? 'No prior rounds played yet. This is Round 1.'
      : history.map(r => {
          const myMove = agentRole === 'A' ? r.moveA : r.moveB;
          const oppMove = agentRole === 'A' ? r.moveB : r.moveA;
          const myPayoff = agentRole === 'A' ? r.payoffA : r.payoffB;
          const oppPayoff = agentRole === 'A' ? r.payoffB : r.payoffA;
          return `Round ${r.round}: You played ${myMove === 'C' ? 'Cooperate (C)' : 'Defect (D)'}, Opponent played ${oppMove === 'C' ? 'Cooperate (C)' : 'Defect (D)'}. Payoffs: You=${myPayoff}, Opponent=${oppPayoff}`;
        }).join('\n');

    const prompt = `You are an AI research agent playing an Iterated Prisoner's Dilemma game as Agent ${agentRole}.
Objective: Maximize your cumulative payoff across all rounds.

Available Actions:
- "C": Cooperate
- "D": Defect

Payoff Matrix:
- Both Cooperate (C, C): You get ${settings.payoffMatrix.reward}, Opponent gets ${settings.payoffMatrix.reward}
- You Cooperate, Opponent Defects (C, D): You get ${settings.payoffMatrix.sucker}, Opponent gets ${settings.payoffMatrix.temptation}
- You Defect, Opponent Cooperates (D, C): You get ${settings.payoffMatrix.temptation}, Opponent gets ${settings.payoffMatrix.sucker}
- Both Defect (D, D): You get ${settings.payoffMatrix.punishment}, Opponent gets ${settings.payoffMatrix.punishment}

Current Round: ${history.length + 1} of ${settings.totalRounds}.
Match History:
${historyText}

Analyze the opponent's strategy and choose your move for this round.
Reply strictly with a valid JSON object in the following format with no markdown code blocks outside:
{
  "move": "C" or "D",
  "confidence": 0.0 to 1.0 (number representing your confidence in this decision),
  "predicted_opponent_cooperation": 0.0 to 1.0 (estimated probability opponent plays C next round),
  "decision_principle": "short category like 'reciprocity', 'self-defense', 'optimism', 'exploitation', or 'forgiveness'",
  "rationale": "brief explanation under 25 words"
}`;

    // Attempt real Gemini API call if key is present (with 1 automatic retry)
    if (apiKey) {
      const maxAttempts = 2;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second safety timeout

        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2,
                maxOutputTokens: 200,
              }
            })
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

            if (rawText) {
              const parsed = JSON.parse(rawText);
              const rawMove = String(parsed.move || '').toUpperCase();
              const move: Move = rawMove === 'D' ? 'D' : 'C';

              const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0.8));
              const predictedCoop = Math.max(0, Math.min(1, Number(parsed.predicted_opponent_cooperation) || 0.5));
              const decisionPrinciple = String(parsed.decision_principle || 'payoff-maximization');
              const rationale = String(parsed.rationale || 'Evaluated optimal payoff return.').slice(0, 150);

              return {
                move,
                reason: `🤖 [Gemini API] ${rationale}`,
                confidence,
                predictedOpponentCooperation: predictedCoop,
                decisionPrinciple,
              };
            }
          } else {
            console.warn(`Gemini API Attempt ${attempt} HTTP Error:`, response.status);
            if (attempt === maxAttempts) {
              return {
                move: 'C',
                reason: `⚠️ [Gemini API HTTP ${response.status}] Defaulted to Cooperate.`,
                confidence: 0.5,
                predictedOpponentCooperation: 0.5,
                decisionPrinciple: 'fallback',
              };
            }
          }
        } catch (err: any) {
          clearTimeout(timeoutId);
          console.warn(`Gemini API Attempt ${attempt} failed:`, err.message);
          if (attempt === maxAttempts) {
            return {
              move: 'C',
              reason: `⚠️ [Gemini API Error] Fallback choice to Cooperate.`,
              confidence: 0.5,
              predictedOpponentCooperation: 0.5,
              decisionPrinciple: 'fallback',
            };
          }
        }
      }
    }

    // Heuristic Fallback if no API Key provided
    if (history.length === 0) {
      return {
        move: 'C',
        reason: '🤖 [Gemini Simulated] Round 1 heuristic: Initial optimistic cooperation.',
        confidence: 0.85,
        predictedOpponentCooperation: 0.70,
        decisionPrinciple: 'optimistic-trust',
      };
    }

    const recentOpponentMoves = history.slice(-3).map(r => (agentRole === 'A' ? r.moveB : r.moveA));
    const defectCount = recentOpponentMoves.filter(m => m === 'D').length;

    if (defectCount >= 2) {
      return {
        move: 'D',
        reason: '🤖 [Gemini Simulated] Detected opponent defection trend. Defecting in self-defense.',
        confidence: 0.90,
        predictedOpponentCooperation: 0.20,
        decisionPrinciple: 'self-defense',
      };
    }

    return {
      move: 'C',
      reason: '🤖 [Gemini Simulated] Mutual cooperation detected. Reciprocating cooperation.',
      confidence: 0.85,
      predictedOpponentCooperation: 0.80,
      decisionPrinciple: 'reciprocity',
    };
  },
};
