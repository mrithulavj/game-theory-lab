import { IStrategy, StrategyContext, StrategyDecision } from './base';

export const randomStrategy: IStrategy = {
  id: 'random',
  name: 'Random',
  description: 'Randomly chooses Cooperate or Defect (50/50 chance).',
  category: 'Stochastic',
  decide(): StrategyDecision {
    const isCooperate = Math.random() >= 0.5;
    return {
      move: isCooperate ? 'C' : 'D',
      reason: `Stochastic choice: ${isCooperate ? 'Cooperate' : 'Defect'} (p=0.50).`,
    };
  },
};
