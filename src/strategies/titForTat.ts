import { IStrategy, StrategyContext, StrategyDecision } from './base';

export const titForTatStrategy: IStrategy = {
  id: 'tit-for-tat',
  name: 'Tit-for-Tat',
  description: 'Starts with Cooperate, then mimics opponent\'s previous move.',
  category: 'Deterministic',
  decide({ history, agentRole }: StrategyContext): StrategyDecision {
    if (history.length === 0) {
      return { move: 'C', reason: 'Initial round: Cooperate by default.' };
    }
    
    const lastRound = history[history.length - 1];
    const opponentMove = agentRole === 'A' ? lastRound.moveB : lastRound.moveA;
    
    return {
      move: opponentMove,
      reason: `Mimicking opponent's previous move (${opponentMove === 'C' ? 'Cooperate' : 'Defect'}).`,
    };
  },
};
