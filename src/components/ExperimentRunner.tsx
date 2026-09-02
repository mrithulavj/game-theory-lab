import React, { useState, useRef } from 'react';
import { AgentConfig, ExperimentConfig, ExperimentData, PayoffMatrix } from '../types/game';
import { runExperiment } from '../engine/experimentRunner';
import { FlaskConical, Play, Square, Download, FileText, AlertTriangle, CheckCircle2, BarChart2, Layers } from 'lucide-react';

interface ExperimentRunnerProps {
  agentA: AgentConfig;
  agentB: AgentConfig;
  payoffMatrix: PayoffMatrix;
  noiseRate: number;
}

export const ExperimentRunner: React.FC<ExperimentRunnerProps> = ({
  agentA,
  agentB,
  payoffMatrix,
  noiseRate,
}) => {
  const [numberOfTrials, setNumberOfTrials] = useState<number>(5);
  const [roundsPerTrial, setRoundsPerTrial] = useState<number>(10);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [currentTrial, setCurrentTrial] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [showCostWarning, setShowCostWarning] = useState<boolean>(false);
  const [experimentData, setExperimentData] = useState<ExperimentData | null>(null);

  const cancelRef = useRef<boolean>(false);

  const countLLMAgents = (agentA.strategyId === 'llm-agent' ? 1 : 0) + (agentB.strategyId === 'llm-agent' ? 1 : 0);
  const totalLLMCalls = numberOfTrials * roundsPerTrial * countLLMAgents;

  const handleStartRequest = () => {
    if (countLLMAgents > 0 && totalLLMCalls > 25) {
      setShowCostWarning(true);
    } else {
      executeExperimentRun();
    }
  };

  const executeExperimentRun = async () => {
    setShowCostWarning(false);
    setIsRunning(true);
    cancelRef.current = false;

    const expId = `EXP_${Date.now()}`;
    const modelInfo = countLLMAgents > 0
      ? (agentA.llmConfig?.model || agentB.llmConfig?.model || 'gemini-1.5-flash')
      : undefined;

    const config: ExperimentConfig = {
      experimentId: expId,
      game: 'iterated_prisoners_dilemma',
      agentA,
      agentB,
      payoffMatrix,
      roundsPerTrial,
      numberOfTrials,
      noiseRate,
      timestamp: Date.now(),
      modelInfo,
    };

    try {
      const data = await runExperiment(
        config,
        (trialIdx, roundNum, msg) => {
          setCurrentTrial(trialIdx);
          setCurrentRound(roundNum);
          setProgressMsg(msg);
        },
        () => cancelRef.current
      );
      setExperimentData(data);
    } catch (err) {
      console.error('Experiment execution error:', err);
    } finally {
      setIsRunning(false);
      setProgressMsg('');
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setIsRunning(false);
  };

  const exportCSV = () => {
    if (!experimentData) return;
    const headers = [
      'ExperimentID',
      'TrialID',
      'TrialIndex',
      'Round',
      'AgentA_Name',
      'AgentB_Name',
      'AgentA_Strategy',
      'AgentB_Strategy',
      'MoveA',
      'MoveB',
      'PayoffA',
      'PayoffB',
      'CumulativeScoreA',
      'CumulativeScoreB',
      'ConfidenceA',
      'ConfidenceB',
      'PredictedCoopA',
      'PredictedCoopB',
      'DecisionPrincipleA',
      'DecisionPrincipleB',
      'RationaleA',
      'RationaleB',
      'Timestamp',
    ];

    const rows: string[][] = [];
    for (const trial of experimentData.trials) {
      for (const r of trial.rounds) {
        rows.push([
          experimentData.config.experimentId,
          trial.trialId,
          String(trial.trialIndex),
          String(r.round),
          `"${agentA.name.replace(/"/g, '""')}"`,
          `"${agentB.name.replace(/"/g, '""')}"`,
          agentA.strategyId,
          agentB.strategyId,
          r.moveA,
          r.moveB,
          String(r.payoffA),
          String(r.payoffB),
          String(r.cumulativeScoreA),
          String(r.cumulativeScoreB),
          r.confidenceA !== undefined ? String(r.confidenceA) : '',
          r.confidenceB !== undefined ? String(r.confidenceB) : '',
          r.predictedCoopA !== undefined ? String(r.predictedCoopA) : '',
          r.predictedCoopB !== undefined ? String(r.predictedCoopB) : '',
          `"${(r.decisionPrincipleA || '').replace(/"/g, '""')}"`,
          `"${(r.decisionPrincipleB || '').replace(/"/g, '""')}"`,
          `"${(r.reasonA || '').replace(/"/g, '""')}"`,
          `"${(r.reasonB || '').replace(/"/g, '""')}"`,
          String(experimentData.config.timestamp),
        ]);
      }
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${experimentData.config.experimentId}_observations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (!experimentData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(experimentData, null, 2)
    )}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `${experimentData.config.experimentId}_data.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-5">
      {/* Header title */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-orange-600" />
          <div>
            <h3 className="font-semibold text-neutral-900 text-sm">Controlled Experiment Runner (Phase 2)</h3>
            <p className="text-xs text-neutral-500">Run multiple independent trials for behavioral & research analysis</p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-neutral-100 border border-neutral-200 text-neutral-700 rounded uppercase">
          Multi-Trial System
        </span>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded border border-neutral-200">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Rounds Per Trial</label>
          <div className="flex items-center gap-1">
            {[5, 10, 20].map((r) => (
              <button
                key={r}
                onClick={() => setRoundsPerTrial(r)}
                disabled={isRunning}
                className={`flex-1 py-1 text-xs font-mono rounded font-medium transition ${
                  roundsPerTrial === r
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Number of Trials</label>
          <div className="flex items-center gap-1">
            {[3, 5, 10, 30].map((t) => (
              <button
                key={t}
                onClick={() => setNumberOfTrials(t)}
                disabled={isRunning}
                className={`flex-1 py-1 text-xs font-mono rounded font-medium transition ${
                  numberOfTrials === t
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Active Pairing</label>
          <div className="text-xs font-medium text-neutral-900 bg-white border border-neutral-200 rounded px-2.5 py-1.5 truncate">
            {agentA.name} <span className="text-neutral-400">vs</span> {agentB.name}
          </div>
        </div>

        <div className="flex items-end">
          {!isRunning ? (
            <button
              onClick={handleStartRequest}
              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> RUN EXPERIMENT
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-white" /> CANCEL EXPERIMENT
            </button>
          )}
        </div>
      </div>

      {/* Cost Confirmation Warning Modal */}
      {showCostWarning && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-orange-900">High API Call Safeguard</h4>
              <p className="text-xs text-orange-800 mt-0.5">
                This experiment configuration will execute approximately <strong className="font-mono">{totalLLMCalls} Gemini API calls</strong> ({numberOfTrials} trials × {roundsPerTrial} rounds).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCostWarning(false)}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              onClick={executeExperimentRun}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 rounded hover:bg-orange-700 shadow-sm"
            >
              Confirm & Run ({totalLLMCalls} calls)
            </button>
          </div>
        </div>
      )}

      {/* Running Execution Progress Status */}
      {isRunning && (
        <div className="p-4 bg-neutral-900 text-white rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
            <span className="font-semibold">Experiment Running...</span>
            <span className="font-mono text-neutral-400">
              Trial {currentTrial} / {numberOfTrials} • Round {currentRound} / {roundsPerTrial}
            </span>
          </div>
          <div className="font-mono text-neutral-300 truncate max-w-sm">
            {progressMsg}
          </div>
        </div>
      )}

      {/* Experiment Results & Summaries */}
      {experimentData && (
        <div className="space-y-4 pt-2 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-semibold text-neutral-900 text-sm">Experiment Results Summary</h4>
              <span className="text-xs font-mono text-neutral-500">ID: {experimentData.config.experimentId}</span>
            </div>

            {/* Export buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded border border-neutral-200 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export Experiment CSV
              </button>
              <button
                onClick={exportJSON}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded border border-neutral-200 transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-orange-600" /> Export Experiment JSON
              </button>
            </div>
          </div>

          {/* Aggregate Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Total Observations</span>
              <div className="text-xl font-bold text-neutral-900 mt-0.5">{experimentData.summary.totalRounds} rounds</div>
              <span className="text-[10px] text-neutral-400 font-mono">{experimentData.summary.totalTrials} trials</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">{agentA.name} Avg Score</span>
              <div className="text-xl font-bold text-neutral-900 mt-0.5">{experimentData.summary.avgPayoffA.toFixed(1)}</div>
              <span className="text-[10px] text-neutral-500 font-mono">{(experimentData.summary.coopRateA * 100).toFixed(0)}% Coop Rate</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">{agentB.name} Avg Score</span>
              <div className="text-xl font-bold text-neutral-900 mt-0.5">{experimentData.summary.avgPayoffB.toFixed(1)}</div>
              <span className="text-[10px] text-neutral-500 font-mono">{(experimentData.summary.coopRateB * 100).toFixed(0)}% Coop Rate</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Avg Payoff / Round (A)</span>
              <div className="text-xl font-bold text-orange-600 mt-0.5">{experimentData.summary.avgPayoffPerRoundA.toFixed(2)}</div>
              <span className="text-[10px] text-neutral-400 font-mono">pts per round</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Avg Payoff / Round (B)</span>
              <div className="text-xl font-bold text-orange-600 mt-0.5">{experimentData.summary.avgPayoffPerRoundB.toFixed(2)}</div>
              <span className="text-[10px] text-neutral-400 font-mono">pts per round</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Social Welfare</span>
              <div className="text-xl font-bold text-neutral-900 mt-0.5">{experimentData.summary.avgSocialWelfare.toFixed(2)}</div>
              <span className="text-[10px] text-neutral-400 font-mono">Joint avg / round</span>
            </div>
          </div>

          {/* Trial Level Results Table */}
          <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
            <table className="w-full text-left text-xs text-neutral-800">
              <thead className="bg-neutral-50 text-neutral-500 font-mono border-b border-neutral-200">
                <tr>
                  <th className="py-2 px-3 font-medium">Trial ID</th>
                  <th className="py-2 px-3 font-medium">{agentA.name} Score</th>
                  <th className="py-2 px-3 font-medium">{agentB.name} Score</th>
                  <th className="py-2 px-3 font-medium">{agentA.name} Coop %</th>
                  <th className="py-2 px-3 font-medium">{agentB.name} Coop %</th>
                  <th className="py-2 px-3 font-medium">Avg Joint Payoff / Round</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono text-xs">
                {experimentData.trials.map((tr) => (
                  <tr key={tr.trialId} className="hover:bg-neutral-50 transition">
                    <td className="py-2 px-3 font-semibold text-neutral-900">{tr.trialId}</td>
                    <td className="py-2 px-3 font-bold" style={{ color: agentA.color }}>{tr.totalScoreA} pts</td>
                    <td className="py-2 px-3 font-bold" style={{ color: agentB.color }}>{tr.totalScoreB} pts</td>
                    <td className="py-2 px-3 font-medium text-emerald-700">{(tr.coopRateA * 100).toFixed(0)}%</td>
                    <td className="py-2 px-3 font-medium text-emerald-700">{(tr.coopRateB * 100).toFixed(0)}%</td>
                    <td className="py-2 px-3 font-bold text-neutral-900">{tr.avgPayoffPerRound.toFixed(2)} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
