import { AgentConfig, GameSettings, Move, RoundResult, StrategyId, StrategyInfo } from '../types/game';

export interface StrategyContext {
  history: RoundResult[];
  agentRole: 'A' | 'B';
  settings: GameSettings;
  agentConfig: AgentConfig;
}

export interface StrategyDecision {
  move: Move;
  reason?: string;
  confidence?: number;                      // 0.0 to 1.0
  predictedOpponentCooperation?: number;    // 0.0 to 1.0
  decisionPrinciple?: string;
}

export interface IStrategy {
  id: StrategyId;
  name: string;
  description: string;
  category: 'Deterministic' | 'Stochastic' | 'AI / LLM';
  isLLM?: boolean;
  decide(context: StrategyContext): Promise<StrategyDecision> | StrategyDecision;
}

export const STRATEGY_LIST: StrategyInfo[] = [
  {
    id: 'tit-for-tat',
    name: 'Tit-for-Tat',
    description: 'Starts with Cooperate. In each subsequent round, copies the opponent\'s move from the previous round.',
    category: 'Deterministic',
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Randomly chooses Cooperate or Defect with equal 50% probability.',
    category: 'Stochastic',
  },
  {
    id: 'always-cooperate',
    name: 'Always Cooperate (Angel)',
    description: 'Unconditionally chooses Cooperate every single round.',
    category: 'Deterministic',
  },
  {
    id: 'always-defect',
    name: 'Always Defect (Devil)',
    description: 'Unconditionally chooses Defect every single round.',
    category: 'Deterministic',
  },
  {
    id: 'grim-trigger',
    name: 'Grim Trigger',
    description: 'Cooperates until the opponent defects even once; then permanently defects for all remaining rounds.',
    category: 'Deterministic',
  },
  {
    id: 'generous-tit-for-tat',
    name: 'Generous Tit-for-Tat',
    description: 'Like Tit-for-Tat, but occasionally forgives defection (10% chance to Cooperate even after opponent defects).',
    category: 'Stochastic',
  },
  {
    id: 'llm-agent',
    name: 'Gemini AI Agent (Google Gemini API)',
    description: 'Invokes Google Gemini API to reason and return structured move, confidence, predicted opponent cooperation, and decision principle.',
    category: 'AI / LLM',
    isLLM: true,
  },
];
