import React from 'react';
import { RoundResult } from '../types/game';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { LineChart as ChartIcon, TrendingUp } from 'lucide-react';

interface ScoreChartProps {
  history: RoundResult[];
  agentAName: string;
  agentBName: string;
  agentAColor: string;
  agentBColor: string;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({
  history,
  agentAName,
  agentBName,
  agentAColor,
  agentBColor,
}) => {
  const chartData = history.map((r) => ({
    round: `R${r.round}`,
    roundNum: r.round,
    [agentAName]: r.cumulativeScoreA,
    [agentBName]: r.cumulativeScoreB,
    payoffA: r.payoffA,
    payoffB: r.payoffB,
    moveA: r.moveA === 'C' ? 'Cooperate' : 'Defect',
    moveB: r.moveB === 'C' ? 'Cooperate' : 'Defect',
  }));

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-4 h-4 text-neutral-500" />
          <div>
            <h3 className="font-semibold text-neutral-900 text-sm">Cumulative Score Trajectory</h3>
            <p className="text-xs text-neutral-500">Score accumulation across rounds</p>
          </div>
        </div>
        {history.length > 0 && (
          <span className="text-xs font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-semibold">
            {history.length} Rounds
          </span>
        )}
      </div>

      {history.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-neutral-200 rounded bg-neutral-50 text-neutral-400 text-xs">
          <TrendingUp className="w-6 h-6 opacity-30 mb-2" />
          <span>No rounds played yet. Click "Run Game" or "Step 1 Round" to visualize scores.</span>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="round" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                  color: '#111827',
                }}
                itemStyle={{ padding: '2px 0' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey={agentAName}
                stroke={agentAColor}
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: agentAColor }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey={agentBName}
                stroke={agentBColor}
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: agentBColor }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
