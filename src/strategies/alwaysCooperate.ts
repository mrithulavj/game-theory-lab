import { IStrategy, StrategyContext, StrategyDecision } from './base';

export const alwaysCooperateStrategy: IStrategy = {
  id: 'always-cooperate',
  name: 'Always Cooperate (Angel)',
  description: 'Unconditionally cooperates.',
  category: 'Deterministic',
  decide(): StrategyDecision {
    return {
      move: 'C',
      reason: 'Always Cooperate strategy: Unconditional cooperation.',
    };
  },
};
