import React from 'react';
import { PayoffMatrix, RoundResult } from '../types/game';
import { Scale, ShieldCheck, CheckCircle2, Compass } from 'lucide-react';

interface NashEquilibriumProps {
  matrix: PayoffMatrix;
  history: RoundResult[];
}

export const NashEquilibriumCard: React.FC<NashEquilibriumProps> = ({ matrix, history }) => {
  const { reward: R, punishment: P } = matrix;

  const totalRounds = history.length;
  const totalScoreJoint = totalRounds > 0
    ? history.reduce((acc, r) => acc + r.payoffA + r.payoffB, 0)
    : 0;

  const avgJointPayoff = totalRounds > 0 ? totalScoreJoint / (totalRounds * 2) : 0;

  const efficiencyPercent = R > P
    ? Math.max(0, Math.min(100, ((avgJointPayoff - P) / (R - P)) * 100))
    : 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-neutral-500" />
          <div>
            <h3 className="font-semibold text-neutral-900 text-sm">Theoretical Nash Equilibrium & Analysis</h3>
            <p className="text-xs text-neutral-500">Game-theoretic baselines & social dilemma efficiency</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Nash Equilibrium */}
        <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" /> Nash Equilibrium
            </span>
            <span className="text-[10px] font-mono bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-semibold">
              (D, D)
            </span>
          </div>
          <p className="text-xs text-neutral-700 font-medium">Payoff: ({P}, {P}) per round</p>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
            Strict dominant strategy in 1-shot play. Neither agent can unilaterally gain by cooperating.
          </p>
        </div>

        {/* Pareto Optimal */}
        <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pareto Optimum
            </span>
            <span className="text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
              (C, C)
            </span>
          </div>
          <p className="text-xs text-neutral-700 font-medium">Payoff: ({R}, {R}) per round</p>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
            Socially optimal outcome. Both agents earn +{R - P} points more per round than at Nash equilibrium.
          </p>
        </div>

        {/* Folk Theorem */}
        <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-orange-600" /> Folk Theorem
            </span>
            <span className="text-[10px] font-mono bg-orange-50 border border-orange-200 text-orange-800 px-1.5 py-0.5 rounded font-semibold">
              Repeated Play
            </span>
          </div>
          <p className="text-xs text-neutral-700 font-medium">Shadow of the Future</p>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
            In repeated games, conditional reciprocity strategies (Tit-for-Tat) make cooperation sustainable.
          </p>
        </div>
      </div>

      {totalRounds > 0 && (
        <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-neutral-900">Empirical Social Surplus</div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Average joint payoff per round: <strong className="text-neutral-900">{avgJointPayoff.toFixed(2)}</strong> (Nash={P}.00, Pareto={R}.00)
            </p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 mb-1">
              <span>Nash (0%)</span>
              <span className="text-orange-600 font-bold">{efficiencyPercent.toFixed(0)}% Efficiency</span>
              <span>Pareto (100%)</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded overflow-hidden">
              <div
                className="h-full bg-orange-600 transition-all duration-300"
                style={{ width: `${efficiencyPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
