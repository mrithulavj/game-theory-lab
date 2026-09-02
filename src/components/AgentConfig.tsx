import React from 'react';
import { AgentConfig, StrategyId } from '../types/game';
import { STRATEGY_LIST, getStrategy } from '../strategies';
import { Cpu, Key } from 'lucide-react';

interface AgentConfigProps {
  agentA: AgentConfig;
  agentB: AgentConfig;
  onChangeAgentA: (config: AgentConfig) => void;
  onChangeAgentB: (config: AgentConfig) => void;
  onOpenLLMModal: (agentId: 'A' | 'B') => void;
  isSimulating: boolean;
}

export const AgentConfigCard: React.FC<{
  agent: AgentConfig;
  onChange: (config: AgentConfig) => void;
  onOpenLLMModal: (agentId: 'A' | 'B') => void;
  isSimulating: boolean;
}> = ({ agent, onChange, onOpenLLMModal, isSimulating }) => {
  const currentStrategy = getStrategy(agent.strategyId);

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm relative flex flex-col justify-between">
      {/* Top bar accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{ backgroundColor: agent.color }} 
      />

      <div>
        <div className="flex items-center justify-between mb-3 pt-1">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: agent.color }}
            />
            <h3 className="font-semibold text-neutral-900 text-sm">
              {agent.id === 'A' ? 'Agent A' : 'Agent B'}
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">ID-{agent.id}</span>
          </div>

          <input 
            type="color" 
            value={agent.color}
            onChange={(e) => onChange({ ...agent, color: e.target.value })}
            disabled={isSimulating}
            className="w-5 h-5 rounded cursor-pointer bg-transparent border border-neutral-300 p-0"
            title="Agent Color Accent"
          />
        </div>

        {/* Agent Name */}
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Agent Name
          </label>
          <input
            type="text"
            value={agent.name}
            onChange={(e) => onChange({ ...agent, name: e.target.value })}
            disabled={isSimulating}
            className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
          />
        </div>

        {/* Strategy Dropdown */}
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Strategy
          </label>
          <select
            value={agent.strategyId}
            onChange={(e) => onChange({ ...agent, strategyId: e.target.value as StrategyId })}
            disabled={isSimulating}
            className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 transition font-medium"
          >
            {STRATEGY_LIST.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>

        {/* Description box */}
        <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs mb-3">
          <div className="flex items-center justify-between text-neutral-800 font-medium mb-1">
            <span className="flex items-center gap-1.5 text-xs text-neutral-900">
              <Cpu className="w-3.5 h-3.5 text-neutral-500" /> {currentStrategy.name}
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-200 text-neutral-700">
              {currentStrategy.category}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            {currentStrategy.description}
          </p>
        </div>
      </div>

      {/* LLM Modal button */}
      {agent.strategyId === 'llm-agent' && (
        <button
          onClick={() => onOpenLLMModal(agent.id)}
          className="w-full py-1.5 px-3 text-xs bg-white hover:bg-orange-50 border border-orange-600 text-orange-600 rounded font-medium transition flex items-center justify-center gap-1.5"
        >
          <Key className="w-3.5 h-3.5" /> Configure LLM Credentials
        </button>
      )}
    </div>
  );
};

export const AgentConfigSection: React.FC<AgentConfigProps> = ({
  agentA,
  agentB,
  onChangeAgentA,
  onChangeAgentB,
  onOpenLLMModal,
  isSimulating,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <AgentConfigCard
        agent={agentA}
        onChange={onChangeAgentA}
        onOpenLLMModal={onOpenLLMModal}
        isSimulating={isSimulating}
      />
      <AgentConfigCard
        agent={agentB}
        onChange={onChangeAgentB}
        onOpenLLMModal={onOpenLLMModal}
        isSimulating={isSimulating}
      />
    </div>
  );
};
