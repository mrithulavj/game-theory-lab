import React from 'react';
import { AgentConfig, RoundResult } from '../types/game';
import { Award, CheckCircle2, XCircle } from 'lucide-react';

interface StatisticsProps {
  history: RoundResult[];
  agentA: AgentConfig;
  agentB: AgentConfig;
}

export const Statistics: React.FC<StatisticsProps> = ({ history, agentA, agentB }) => {
  const totalRounds = history.length;

  const scoreA = totalRounds > 0 ? history[history.length - 1].cumulativeScoreA : 0;
  const scoreB = totalRounds > 0 ? history[history.length - 1].cumulativeScoreB : 0;

  const avgScoreA = totalRounds > 0 ? (scoreA / totalRounds).toFixed(2) : '0.00';
  const avgScoreB = totalRounds > 0 ? (scoreB / totalRounds).toFixed(2) : '0.00';

  const coopCountA = history.filter(r => r.moveA === 'C').length;
  const defectCountA = totalRounds - coopCountA;
  const coopRateA = totalRounds > 0 ? (coopCountA / totalRounds) * 100 : 0;

  const coopCountB = history.filter(r => r.moveB === 'C').length;
  const defectCountB = totalRounds - coopCountB;
  const coopRateB = totalRounds > 0 ? (coopCountB / totalRounds) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Agent A Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agentA.color }} />
            <h4 className="font-semibold text-neutral-900 text-sm">{agentA.name}</h4>
          </div>
          {totalRounds > 0 && scoreA > scoreB && (
            <span className="px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-orange-600" /> Leading
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Total Score</span>
            <div className="text-2xl font-bold text-neutral-900 mt-0.5">{scoreA}</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Avg / Round</span>
            <div className="text-2xl font-bold text-neutral-900 mt-0.5">{avgScoreA}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-neutral-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cooperate: {coopRateA.toFixed(0)}% ({coopCountA})
            </span>
            <span className="text-neutral-500 font-medium flex items-center gap-1">
              Defect: {(100 - coopRateA).toFixed(0)}% ({defectCountA}) <XCircle className="w-3.5 h-3.5 text-rose-600" />
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded overflow-hidden flex">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${coopRateA}%` }}
            />
          </div>
        </div>
      </div>

      {/* Agent B Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agentB.color }} />
            <h4 className="font-semibold text-neutral-900 text-sm">{agentB.name}</h4>
          </div>
          {totalRounds > 0 && scoreB > scoreA && (
            <span className="px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-orange-600" /> Leading
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Total Score</span>
            <div className="text-2xl font-bold text-neutral-900 mt-0.5">{scoreB}</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Avg / Round</span>
            <div className="text-2xl font-bold text-neutral-900 mt-0.5">{avgScoreB}</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-neutral-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cooperate: {coopRateB.toFixed(0)}% ({coopCountB})
            </span>
            <span className="text-neutral-500 font-medium flex items-center gap-1">
              Defect: {(100 - coopRateB).toFixed(0)}% ({defectCountB}) <XCircle className="w-3.5 h-3.5 text-rose-600" />
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded overflow-hidden flex">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${coopRateB}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
