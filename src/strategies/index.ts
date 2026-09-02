import { IStrategy, STRATEGY_LIST } from './base';
import { titForTatStrategy } from './titForTat';
import { randomStrategy } from './random';
import { alwaysCooperateStrategy } from './alwaysCooperate';
import { alwaysDefectStrategy } from './alwaysDefect';
import { grimTriggerStrategy } from './grimTrigger';
import { generousTitForTatStrategy } from './generousTitForTat';
import { llmAgentStrategy } from './llmStrategy';
import { StrategyId } from '../types/game';

export * from './base';

const strategyMap: Record<StrategyId, IStrategy> = {
  'tit-for-tat': titForTatStrategy,
  'random': randomStrategy,
  'always-cooperate': alwaysCooperateStrategy,
  'always-defect': alwaysDefectStrategy,
  'grim-trigger': grimTriggerStrategy,
  'generous-tit-for-tat': generousTitForTatStrategy,
  'llm-agent': llmAgentStrategy,
};

export function getStrategy(id: StrategyId): IStrategy {
  return strategyMap[id] || titForTatStrategy;
}

export { STRATEGY_LIST };
