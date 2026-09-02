export type Move = 'C' | 'D';

export interface PayoffMatrix {
  reward: number;     // R: Both Cooperate (e.g. 3)
  punishment: number; // P: Both Defect (e.g. 1)
  temptation: number; // T: Defect while opponent Cooperates (e.g. 5)
  sucker: number;     // S: Cooperate while opponent Defects (e.g. 0)
}

export interface RoundResult {
  round: number;
  moveA: Move;
  moveB: Move;
  payoffA: number;
  payoffB: number;
  cumulativeScoreA: number;
  cumulativeScoreB: number;
  reasonA?: string;
  reasonB?: string;
  confidenceA?: number;
  confidenceB?: number;
  predictedCoopA?: number;
  predictedCoopB?: number;
  decisionPrincipleA?: string;
  decisionPrincipleB?: string;
}

export type StrategyId = 
  | 'tit-for-tat'
  | 'random'
  | 'always-cooperate'
  | 'always-defect'
  | 'grim-trigger'
  | 'generous-tit-for-tat'
  | 'llm-agent';

export interface LLMConfig {
  provider: 'gemini' | 'openai' | 'custom';
  apiKey: string;
  model: string;
  endpoint?: string;
  systemPrompt?: string;
}

export interface AgentConfig {
  id: 'A' | 'B';
  name: string;
  strategyId: StrategyId;
  color: string;
  llmConfig?: LLMConfig;
}

export interface GameSettings {
  totalRounds: number;
  noiseRate: number; // Probability of accidental flip (0 to 0.25)
  payoffMatrix: PayoffMatrix;
  playbackSpeedMs: number;
}

export interface StrategyInfo {
  id: StrategyId;
  name: string;
  description: string;
  category: 'Deterministic' | 'Stochastic' | 'AI / LLM';
  isLLM?: boolean;
}

/* ===================================================
   PHASE 2 EXPERIMENT RUNNER TYPES
   =================================================== */

export interface ExperimentConfig {
  experimentId: string;
  game: 'iterated_prisoners_dilemma';
  agentA: AgentConfig;
  agentB: AgentConfig;
  payoffMatrix: PayoffMatrix;
  roundsPerTrial: number;
  numberOfTrials: number;
  noiseRate: number;
  timestamp: number;
  modelInfo?: string;
}

export interface TrialResult {
  trialId: string;
  trialIndex: number; // 1-indexed
  rounds: RoundResult[];
  totalScoreA: number;
  totalScoreB: number;
  coopRateA: number;
  coopRateB: number;
  avgPayoffPerRound: number;
}

export interface ExperimentSummary {
  totalTrials: number;
  totalRounds: number;
  avgPayoffA: number;
  avgPayoffB: number;
  avgPayoffPerRoundA: number;
  avgPayoffPerRoundB: number;
  coopRateA: number;
  coopRateB: number;
  defectRateA: number;
  defectRateB: number;
  avgSocialWelfare: number;
}

export interface ExperimentData {
  config: ExperimentConfig;
  trials: TrialResult[];
  summary: ExperimentSummary;
  completedAt: number;
}
