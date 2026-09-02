import { AgentConfig, GameSettings, Move, PayoffMatrix, RoundResult } from '../types/game';
import { getStrategy } from '../strategies';

/**
 * Calculates individual payoffs based on authoritative 2x2 matrix
 */
export function calculatePayoffs(moveA: Move, moveB: Move, matrix: PayoffMatrix): { payoffA: number; payoffB: number } {
  if (moveA === 'C' && moveB === 'C') {
    return { payoffA: matrix.reward, payoffB: matrix.reward };
  }
  if (moveA === 'C' && moveB === 'D') {
    return { payoffA: matrix.sucker, payoffB: matrix.temptation };
  }
  if (moveA === 'D' && moveB === 'C') {
    return { payoffA: matrix.temptation, payoffB: matrix.sucker };
  }
  // moveA === 'D' && moveB === 'D'
  return { payoffA: matrix.punishment, payoffB: matrix.punishment };
}

/**
 * Applies noise (hand tremble) to a move with probability noiseRate
 */
export function applyNoise(move: Move, noiseRate: number): Move {
  if (noiseRate > 0 && Math.random() < noiseRate) {
    return move === 'C' ? 'D' : 'C';
  }
  return move;
}

/**
 * Executes a single round of the repeated Prisoner's Dilemma
 * Game engine is the authoritative source for valid actions, payoffs, and state.
 */
export async function playNextRound(
  history: RoundResult[],
  agentA: AgentConfig,
  agentB: AgentConfig,
  settings: GameSettings
): Promise<RoundResult> {
  const currentRoundNum = history.length + 1;
  const stratA = getStrategy(agentA.strategyId);
  const stratB = getStrategy(agentB.strategyId);

  const [decisionA, decisionB] = await Promise.all([
    stratA.decide({ history, agentRole: 'A', settings, agentConfig: agentA }),
    stratB.decide({ history, agentRole: 'B', settings, agentConfig: agentB }),
  ]);

  const moveA = applyNoise(decisionA.move, settings.noiseRate);
  const moveB = applyNoise(decisionB.move, settings.noiseRate);

  // Authoritative payoff calculation
  const { payoffA, payoffB } = calculatePayoffs(moveA, moveB, settings.payoffMatrix);

  const prevScoreA = history.length > 0 ? history[history.length - 1].cumulativeScoreA : 0;
  const prevScoreB = history.length > 0 ? history[history.length - 1].cumulativeScoreB : 0;

  return {
    round: currentRoundNum,
    moveA,
    moveB,
    payoffA,
    payoffB,
    cumulativeScoreA: prevScoreA + payoffA,
    cumulativeScoreB: prevScoreB + payoffB,
    reasonA: decisionA.reason,
    reasonB: decisionB.reason,
    confidenceA: decisionA.confidence,
    confidenceB: decisionB.confidence,
    predictedCoopA: decisionA.predictedOpponentCooperation,
    predictedCoopB: decisionB.predictedOpponentCooperation,
    decisionPrincipleA: decisionA.decisionPrinciple,
    decisionPrincipleB: decisionB.decisionPrinciple,
  };
}

/**
 * Executes the complete simulation synchronously/async in batch
 */
export async function runFullSimulation(
  agentA: AgentConfig,
  agentB: AgentConfig,
  settings: GameSettings
): Promise<RoundResult[]> {
  const history: RoundResult[] = [];
  for (let i = 0; i < settings.totalRounds; i++) {
    const roundResult = await playNextRound(history, agentA, agentB, settings);
    history.push(roundResult);
  }
  return history;
}
