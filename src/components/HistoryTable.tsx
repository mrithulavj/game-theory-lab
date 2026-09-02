import React, { useState } from 'react';
import { AgentConfig, RoundResult } from '../types/game';
import { Table, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryTableProps {
  history: RoundResult[];
  agentA: AgentConfig;
  agentB: AgentConfig;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, agentA, agentB }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const totalPages = Math.ceil(history.length / pageSize) || 1;
  const displayedHistory = history.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'Round',
      'AgentA_Move',
      'AgentB_Move',
      'AgentA_Payoff',
      'AgentB_Payoff',
      'AgentA_Score',
      'AgentB_Score',
      'ConfidenceA',
      'ConfidenceB',
      'PredictedCoopA',
      'PredictedCoopB',
      'PrincipleA',
      'PrincipleB',
      'ReasonA',
      'ReasonB',
    ];
    const rows = history.map(r => [
      r.round,
      r.moveA,
      r.moveB,
      r.payoffA,
      r.payoffB,
      r.cumulativeScoreA,
      r.cumulativeScoreB,
      r.confidenceA ?? '',
      r.confidenceB ?? '',
      r.predictedCoopA ?? '',
      r.predictedCoopB ?? '',
      `"${(r.decisionPrincipleA || '').replace(/"/g, '""')}"`,
      `"${(r.decisionPrincipleB || '').replace(/"/g, '""')}"`,
      `"${(r.reasonA || '').replace(/"/g, '""')}"`,
      `"${(r.reasonB || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `game_theory_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (history.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ agentA, agentB, history }, null, 2)
    )}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `game_theory_history_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-neutral-500" />
          <div>
            <h3 className="font-semibold text-neutral-900 text-sm">Game History Log & Structured Decision Data</h3>
            <p className="text-xs text-neutral-500">Round choices, confidence, predictions, decision principles, and rationale</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-800 font-medium rounded border border-neutral-200 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={exportJSON}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-800 font-medium rounded border border-neutral-200 transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-orange-600" /> Export JSON
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-12 text-center text-neutral-400 text-xs border border-dashed border-neutral-200 rounded bg-neutral-50">
          No round history recorded yet. Run the simulation to view data logs.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
            <table className="w-full text-left text-xs text-neutral-800">
              <thead className="bg-neutral-50 text-neutral-500 font-mono border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-medium">#</th>
                  <th className="py-2.5 px-4 font-medium">{agentA.name} Move</th>
                  <th className="py-2.5 px-4 font-medium">{agentB.name} Move</th>
                  <th className="py-2.5 px-4 font-medium">Payoffs (A, B)</th>
                  <th className="py-2.5 px-4 font-medium">Scores</th>
                  <th className="py-2.5 px-4 font-medium">Decision Principle</th>
                  <th className="py-2.5 px-4 font-medium">Pred. Opponent Coop %</th>
                  <th className="py-2.5 px-4 font-medium">Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-sans">
                {displayedHistory.map((r) => (
                  <tr key={r.round} className="hover:bg-neutral-50 transition">
                    <td className="py-2 px-4 font-mono text-neutral-500 font-medium">{r.round}</td>
                    
                    {/* Agent A Move */}
                    <td className="py-2 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          r.moveA === 'C'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {r.moveA === 'C' ? 'COOPERATE' : 'DEFECT'}
                      </span>
                    </td>

                    {/* Agent B Move */}
                    <td className="py-2 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          r.moveB === 'C'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {r.moveB === 'C' ? 'COOPERATE' : 'DEFECT'}
                      </span>
                    </td>

                    {/* Payoffs */}
                    <td className="py-2 px-4 font-mono font-medium">
                      <span style={{ color: agentA.color }}>+{r.payoffA}</span>
                      <span className="text-neutral-300 mx-1">,</span>
                      <span style={{ color: agentB.color }}>+{r.payoffB}</span>
                    </td>

                    {/* Cumulative Scores */}
                    <td className="py-2 px-4 font-mono font-bold text-neutral-900">
                      {r.cumulativeScoreA} <span className="text-neutral-400 font-normal">vs</span> {r.cumulativeScoreB}
                    </td>

                    {/* Decision Principle */}
                    <td className="py-2 px-4 text-[11px] font-mono text-neutral-600">
                      {r.decisionPrincipleA || r.decisionPrincipleB || 'rule'}
                    </td>

                    {/* Predicted Opponent Cooperation */}
                    <td className="py-2 px-4 font-mono text-[11px] text-neutral-700">
                      {r.predictedCoopA !== undefined ? `${(r.predictedCoopA * 100).toFixed(0)}%` : r.predictedCoopB !== undefined ? `${(r.predictedCoopB * 100).toFixed(0)}%` : '-'}
                    </td>

                    {/* Rationale */}
                    <td className="py-2 px-4 text-[11px] text-neutral-500 max-w-xs truncate" title={`A: ${r.reasonA}\nB: ${r.reasonB}`}>
                      {r.reasonA || r.reasonB || 'Standard rule output.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
              <span>
                Page {currentPage} of {totalPages} ({history.length} rounds total)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-800 rounded border border-neutral-200 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 text-neutral-800 rounded border border-neutral-200 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
