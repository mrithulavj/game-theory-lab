import { IStrategy, StrategyContext, StrategyDecision } from './base';

export const generousTitForTatStrategy: IStrategy = {
  id: 'generous-tit-for-tat',
  name: 'Generous Tit-for-Tat',
  description: 'Mimics opponent, but forgives defection 10% of the time.',
  category: 'Stochastic',
  decide({ history, agentRole }: StrategyContext): StrategyDecision {
    if (history.length === 0) {
      return { move: 'C', reason: 'Initial round: Cooperate by default.' };
    }
    
    const lastRound = history[history.length - 1];
    const opponentMove = agentRole === 'A' ? lastRound.moveB : lastRound.moveA;
    
    if (opponentMove === 'C') {
      return { move: 'C', reason: 'Opponent cooperated; mimicking cooperation.' };
    }
    
    // Opponent defected -> 10% chance to forgive and Cooperate anyway
    const forgive = Math.random() < 0.10;
    if (forgive) {
      return { move: 'C', reason: 'Generous Tit-for-Tat: Forgiving opponent\'s defection (p=0.10).' };
    }
    
    return { move: 'D', reason: 'Opponent defected; retaliating with defection.' };
  },
};
