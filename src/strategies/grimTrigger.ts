import { IStrategy, StrategyContext, StrategyDecision } from './base';

export const grimTriggerStrategy: IStrategy = {
  id: 'grim-trigger',
  name: 'Grim Trigger',
  description: 'Cooperates until opponent defects once; then defects forever.',
  category: 'Deterministic',
  decide({ history, agentRole }: StrategyContext): StrategyDecision {
    const opponentDefected = history.some(r => (agentRole === 'A' ? r.moveB : r.moveA) === 'D');
    
    if (opponentDefected) {
      return {
        move: 'D',
        reason: 'Grim Trigger activated: Opponent defected in a prior round. Permanently defecting.',
      };
    }
    
    return {
      move: 'C',
      reason: 'Opponent has never defected. Continuing mutual cooperation.',
    };
  },
};
