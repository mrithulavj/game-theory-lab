import React, { useState } from 'react';
import { PayoffMatrix, RoundResult } from '../types/game';
import { Table, Settings2, AlertCircle } from 'lucide-react';

interface PayoffMatrixProps {
  matrix: PayoffMatrix;
  onChangeMatrix: (matrix: PayoffMatrix) => void;
  latestRound?: RoundResult;
  agentAName: string;
  agentBName: string;
  agentAColor: string;
  agentBColor: string;
  isSimulating: boolean;
}

export const PayoffMatrixCard: React.FC<PayoffMatrixProps> = ({
  matrix,
  onChangeMatrix,
  latestRound,
  agentAColor,
  agentBColor,
  isSimulating,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const { reward: R, punishment: P, temptation: T, sucker: S } = matrix;
  const isValidPD = T > R && R > P && P > S && 2 * R > T + S;

  const getCellHighlight = (moveA: 'C' | 'D', moveB: 'C' | 'D') => {
    if (!latestRound) return false;
    return latestRound.moveA === moveA && latestRound.moveB === moveB;
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-neutral-500" />
            <h3 className="font-semibold text-neutral-900 text-sm">2×2 Payoff Matrix</h3>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isSimulating}
            className="p-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition"
            title="Edit Matrix Values"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {!isValidPD && (
          <div className="mb-3 p-2.5 bg-orange-50 border border-orange-200 rounded flex items-center gap-2 text-orange-900 text-xs">
            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
            <span>Values violate standard Prisoner's Dilemma conditions (T &gt; R &gt; P &gt; S).</span>
          </div>
        )}

        {/* 2x2 Matrix */}
        <div className="border border-neutral-200 rounded p-2 bg-neutral-50">
          <div className="grid grid-cols-3 text-center text-[11px] font-mono font-medium text-neutral-400 mb-1 border-b border-neutral-200 pb-1">
            <div className="text-left text-neutral-400 pl-1">A \ B</div>
            <div className="text-neutral-700">Cooperate</div>
            <div className="text-neutral-700">Defect</div>
          </div>

          {/* Row 1: Agent A Cooperates */}
          <div className="grid grid-cols-3 gap-1 mb-1">
            <div className="flex items-center text-xs font-medium text-neutral-700 pl-1">
              Cooperate
            </div>

            {/* Cell (C, C) */}
            <div
              className={`p-2.5 rounded text-center border transition ${
                getCellHighlight('C', 'C')
                  ? 'bg-orange-50 border-orange-600 text-neutral-900 font-semibold'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="text-[10px] text-neutral-400 font-mono uppercase">Mutual Cooperate</div>
              <div className="mt-0.5 font-bold text-sm">
                <span style={{ color: agentAColor }}>+{R}</span>
                <span className="text-neutral-400 mx-0.5">,</span>
                <span style={{ color: agentBColor }}>+{R}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5 font-mono">Reward (R)</div>
            </div>

            {/* Cell (C, D) */}
            <div
              className={`p-2.5 rounded text-center border transition ${
                getCellHighlight('C', 'D')
                  ? 'bg-orange-50 border-orange-600 text-neutral-900 font-semibold'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="text-[10px] text-neutral-400 font-mono uppercase">Sucker vs Tempt</div>
              <div className="mt-0.5 font-bold text-sm">
                <span style={{ color: agentAColor }}>+{S}</span>
                <span className="text-neutral-400 mx-0.5">,</span>
                <span style={{ color: agentBColor }}>+{T}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5 font-mono">Sucker (S), Tempt (T)</div>
            </div>
          </div>

          {/* Row 2: Agent A Defects */}
          <div className="grid grid-cols-3 gap-1">
            <div className="flex items-center text-xs font-medium text-neutral-700 pl-1">
              Defect
            </div>

            {/* Cell (D, C) */}
            <div
              className={`p-2.5 rounded text-center border transition ${
                getCellHighlight('D', 'C')
                  ? 'bg-orange-50 border-orange-600 text-neutral-900 font-semibold'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="text-[10px] text-neutral-400 font-mono uppercase">Tempt vs Sucker</div>
              <div className="mt-0.5 font-bold text-sm">
                <span style={{ color: agentAColor }}>+{T}</span>
                <span className="text-neutral-400 mx-0.5">,</span>
                <span style={{ color: agentBColor }}>+{S}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5 font-mono">Tempt (T), Sucker (S)</div>
            </div>

            {/* Cell (D, D) */}
            <div
              className={`p-2.5 rounded text-center border transition ${
                getCellHighlight('D', 'D')
                  ? 'bg-orange-50 border-orange-600 text-neutral-900 font-semibold'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="text-[10px] text-neutral-400 font-mono uppercase">Mutual Defect</div>
              <div className="mt-0.5 font-bold text-sm">
                <span style={{ color: agentAColor }}>+{P}</span>
                <span className="text-neutral-400 mx-0.5">,</span>
                <span style={{ color: agentBColor }}>+{P}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5 font-mono">Punishment (P)</div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-3 p-3 bg-neutral-50 rounded border border-neutral-200">
          <h4 className="text-xs font-medium text-neutral-800 mb-2">Edit Payoff Values</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-neutral-500">Reward (R)</label>
              <input
                type="number"
                value={R}
                onChange={(e) => onChangeMatrix({ ...matrix, reward: Number(e.target.value) })}
                className="w-full mt-0.5 px-2 py-1 bg-white border border-neutral-200 rounded text-neutral-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-500">Temptation (T)</label>
              <input
                type="number"
                value={T}
                onChange={(e) => onChangeMatrix({ ...matrix, temptation: Number(e.target.value) })}
                className="w-full mt-0.5 px-2 py-1 bg-white border border-neutral-200 rounded text-neutral-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-500">Punishment (P)</label>
              <input
                type="number"
                value={P}
                onChange={(e) => onChangeMatrix({ ...matrix, punishment: Number(e.target.value) })}
                className="w-full mt-0.5 px-2 py-1 bg-white border border-neutral-200 rounded text-neutral-900"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-500">Sucker's Payoff (S)</label>
              <input
                type="number"
                value={S}
                onChange={(e) => onChangeMatrix({ ...matrix, sucker: Number(e.target.value) })}
                className="w-full mt-0.5 px-2 py-1 bg-white border border-neutral-200 rounded text-neutral-900"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
