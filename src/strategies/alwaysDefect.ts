import { IStrategy, StrategyContext, StrategyDecision } from './base';

export const alwaysDefectStrategy: IStrategy = {
  id: 'always-defect',
  name: 'Always Defect (Devil)',
  description: 'Unconditionally defects.',
  category: 'Deterministic',
  decide(): StrategyDecision {
    return {
      move: 'D',
      reason: 'Always Defect strategy: Unconditional defection.',
    };
  },
};
