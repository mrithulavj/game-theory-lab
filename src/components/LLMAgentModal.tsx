import React, { useState } from 'react';
import { AgentConfig, LLMConfig } from '../types/game';
import { X, Key } from 'lucide-react';

interface LLMAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentConfig;
  onSaveConfig: (llmConfig: LLMConfig) => void;
}

export const LLMAgentModal: React.FC<LLMAgentModalProps> = ({
  isOpen,
  onClose,
  agent,
  onSaveConfig,
}) => {
  if (!isOpen) return null;

  const [provider, setProvider] = useState<'gemini' | 'openai' | 'custom'>(agent.llmConfig?.provider || 'gemini');
  const [apiKey, setApiKey] = useState(agent.llmConfig?.apiKey || '');
  const [model, setModel] = useState(agent.llmConfig?.model || 'gemini-1.5-flash');

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey,
      model,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/40 flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200 rounded-lg max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <Key className="w-5 h-5 text-orange-600" />
          <div>
            <h3 className="font-semibold text-neutral-900 text-base">LLM Agent Credentials</h3>
            <p className="text-xs text-neutral-500">Configure provider parameters for {agent.name}</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Provider</label>
            <select
              value={provider}
              onChange={(e) => {
                const p = e.target.value as 'gemini' | 'openai' | 'custom';
                setProvider(p);
                setModel(p === 'gemini' ? 'gemini-1.5-flash' : p === 'openai' ? 'gpt-4o-mini' : 'custom-model');
              }}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
            >
              <option value="gemini">Google Gemini API</option>
              <option value="openai">OpenAI API</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Model Name</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. gemini-1.5-flash"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste API key..."
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Leave blank to use the built-in local LLM simulation adapter without API keys.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded transition shadow-sm"
          >
            Save Credentials
          </button>
        </div>
      </div>
    </div>
  );
};
