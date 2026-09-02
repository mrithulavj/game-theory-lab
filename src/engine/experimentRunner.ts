import {
  AgentConfig,
  ExperimentConfig,
  ExperimentData,
  ExperimentSummary,
  GameSettings,
  RoundResult,
  TrialResult
} from '../types/game';
import { playNextRound } from './simulator';

/**
 * Computes aggregate summary statistics from raw trial observations.
 */
export function calculateExperimentSummary(
  config: ExperimentConfig,
  trials: TrialResult[]
): ExperimentSummary {
  const totalTrials = trials.length;
  const totalRounds = totalTrials * config.roundsPerTrial;

  if (totalTrials === 0 || totalRounds === 0) {
    return {
      totalTrials: 0,
      totalRounds: 0,
      avgPayoffA: 0,
      avgPayoffB: 0,
      avgPayoffPerRoundA: 0,
      avgPayoffPerRoundB: 0,
      coopRateA: 0,
      coopRateB: 0,
      defectRateA: 0,
      defectRateB: 0,
      avgSocialWelfare: 0,
    };
  }

  let sumScoreA = 0;
  let sumScoreB = 0;
  let totalCoopA = 0;
  let totalCoopB = 0;

  for (const trial of trials) {
    sumScoreA += trial.totalScoreA;
    sumScoreB += trial.totalScoreB;
    for (const r of trial.rounds) {
      if (r.moveA === 'C') totalCoopA++;
      if (r.moveB === 'C') totalCoopB++;
    }
  }

  const avgPayoffA = sumScoreA / totalTrials;
  const avgPayoffB = sumScoreB / totalTrials;
  const avgPayoffPerRoundA = sumScoreA / totalRounds;
  const avgPayoffPerRoundB = sumScoreB / totalRounds;
  const coopRateA = totalCoopA / totalRounds;
  const coopRateB = totalCoopB / totalRounds;
  const defectRateA = 1 - coopRateA;
  const defectRateB = 1 - coopRateB;
  const avgSocialWelfare = (sumScoreA + sumScoreB) / totalRounds; // Average joint payoff per round

  return {
    totalTrials,
    totalRounds,
    avgPayoffA,
    avgPayoffB,
    avgPayoffPerRoundA,
    avgPayoffPerRoundB,
    coopRateA,
    coopRateB,
    defectRateA,
    defectRateB,
    avgSocialWelfare,
  };
}

/**
 * Runs a multi-trial experiment calling the existing simulation engine.
 * Ensures every trial starts from a clean initial state with zero history leakage.
 */
export async function runExperiment(
  config: ExperimentConfig,
  onProgress?: (trialIndex: number, roundNum: number, statusMsg: string) => void,
  shouldCancel?: () => boolean
): Promise<ExperimentData> {
  const trials: TrialResult[] = [];
  const settings: GameSettings = {
    totalRounds: config.roundsPerTrial,
    noiseRate: config.noiseRate,
    payoffMatrix: config.payoffMatrix,
    playbackSpeedMs: 0, // Run as fast as possible or async per round
  };

  const isLLM = config.agentA.strategyId === 'llm-agent' || config.agentB.strategyId === 'llm-agent';

  for (let t = 1; t <= config.numberOfTrials; t++) {
    if (shouldCancel && shouldCancel()) {
      break;
    }

    const trialId = `${config.experimentId}_T${t}`;
    const trialHistory: RoundResult[] = []; // Clean independent history per trial

    for (let r = 1; r <= config.roundsPerTrial; r++) {
      if (shouldCancel && shouldCancel()) {
        break;
      }

      if (onProgress) {
        const msg = isLLM
          ? `Trial ${t}/${config.numberOfTrials} • Round ${r}/${config.roundsPerTrial} (Calling LLM API...)`
          : `Trial ${t}/${config.numberOfTrials} • Round ${r}/${config.roundsPerTrial}`;
        onProgress(t, r, msg);
      }

      const roundResult = await playNextRound(
        trialHistory,
        config.agentA,
        config.agentB,
        settings
      );

      trialHistory.push(roundResult);
    }

    const totalScoreA = trialHistory.length > 0 ? trialHistory[trialHistory.length - 1].cumulativeScoreA : 0;
    const totalScoreB = trialHistory.length > 0 ? trialHistory[trialHistory.length - 1].cumulativeScoreB : 0;
    const coopCountA = trialHistory.filter(round => round.moveA === 'C').length;
    const coopCountB = trialHistory.filter(round => round.moveB === 'C').length;

    trials.push({
      trialId,
      trialIndex: t,
      rounds: trialHistory,
      totalScoreA,
      totalScoreB,
      coopRateA: trialHistory.length > 0 ? coopCountA / trialHistory.length : 0,
      coopRateB: trialHistory.length > 0 ? coopCountB / trialHistory.length : 0,
      avgPayoffPerRound: trialHistory.length > 0 ? (totalScoreA + totalScoreB) / (trialHistory.length * 2) : 0,
    });
  }

  const summary = calculateExperimentSummary(config, trials);

  return {
    config,
    trials,
    summary,
    completedAt: Date.now(),
  };
}
