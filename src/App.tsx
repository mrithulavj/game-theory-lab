import React, { useState, useEffect, useRef } from 'react';
import { AgentConfig, GameSettings, PayoffMatrix, RoundResult, LLMConfig } from './types/game';
import { playNextRound } from './engine/simulator';
import { Header } from './components/Header';
import { AgentConfigSection } from './components/AgentConfig';
import { PayoffMatrixCard } from './components/PayoffMatrix';
import { GameControls } from './components/GameControls';
import { ScoreChart } from './components/ScoreChart';
import { Statistics } from './components/Statistics';
import { NashEquilibriumCard } from './components/NashEquilibrium';
import { HistoryTable } from './components/HistoryTable';
import { LLMAgentModal } from './components/LLMAgentModal';
import { ExperimentRunner } from './components/ExperimentRunner';

const DEFAULT_PAYOFF_MATRIX: PayoffMatrix = {
  reward: 3,
  punishment: 1,
  temptation: 5,
  sucker: 0,
};

const DEFAULT_AGENT_A: AgentConfig = {
  id: 'A',
  name: 'Agent A (Tit-for-Tat)',
  strategyId: 'tit-for-tat',
  color: '#18181b', // Solid charcoal
};

const DEFAULT_AGENT_B: AgentConfig = {
  id: 'B',
  name: 'Agent B (Random)',
  strategyId: 'random',
  color: '#ea580c', // Orange accent
};

export const App: React.FC = () => {
  const [agentA, setAgentA] = useState<AgentConfig>(DEFAULT_AGENT_A);
  const [agentB, setAgentB] = useState<AgentConfig>(DEFAULT_AGENT_B);
  
  // Default to 5 rounds to save API usage
  const [settings, setSettings] = useState<GameSettings>({
    totalRounds: 5,
    noiseRate: 0.0,
    payoffMatrix: DEFAULT_PAYOFF_MATRIX,
    playbackSpeedMs: 500,
  });

  const [history, setHistory] = useState<RoundResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGeneratingLLM, setIsGeneratingLLM] = useState(false);
  const [activeLLMAgentId, setActiveLLMAgentId] = useState<'A' | 'B' | null>(null);

  const historyRef = useRef(history);
  const settingsRef = useRef(settings);
  const agentARef = useRef(agentA);
  const agentBRef = useRef(agentB);

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { agentARef.current = agentA; }, [agentA]);
  useEffect(() => { agentBRef.current = agentB; }, [agentB]);

  // Execute round step with LLM generation indicator
  const executeRoundStep = async () => {
    const isLLMActive = agentARef.current.strategyId === 'llm-agent' || agentBRef.current.strategyId === 'llm-agent';
    if (isLLMActive) {
      setIsGeneratingLLM(true);
    }

    try {
      const nextRound = await playNextRound(
        historyRef.current,
        agentARef.current,
        agentBRef.current,
        settingsRef.current
      );
      setHistory(prev => [...prev, nextRound]);
    } finally {
      setIsGeneratingLLM(false);
    }
  };

  // Simulation timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating && !isPaused && !isGeneratingLLM) {
      if (history.length < settings.totalRounds) {
        timer = setTimeout(() => {
          executeRoundStep();
        }, settings.playbackSpeedMs);
      } else {
        setIsSimulating(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isSimulating, isPaused, isGeneratingLLM, history.length, settings.totalRounds, settings.playbackSpeedMs]);

  // Controls Handlers
  const handleRunGame = () => {
    if (history.length >= settings.totalRounds) {
      setHistory([]);
    }
    setIsSimulating(true);
    setIsPaused(false);
  };

  const handleStepRound = () => {
    if (history.length < settings.totalRounds && !isGeneratingLLM) {
      executeRoundStep();
    }
  };

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setIsPaused(false);
    setIsGeneratingLLM(false);
    setHistory([]);
  };

  const handleQuickPreset = (preset: 'tft-vs-random' | 'gemini-vs-tft' | 'tft-vs-tft' | 'angel-vs-devil') => {
    handleReset();
    if (preset === 'gemini-vs-tft') {
      setAgentA({
        id: 'A',
        name: 'Gemini AI Agent',
        strategyId: 'llm-agent',
        color: '#ea580c', // Orange
      });
      setAgentB({
        id: 'B',
        name: 'Agent B (Tit-for-Tat)',
        strategyId: 'tit-for-tat',
        color: '#18181b',
      });
    } else if (preset === 'tft-vs-random') {
      setAgentA({ ...DEFAULT_AGENT_A, strategyId: 'tit-for-tat', name: 'Agent A (Tit-for-Tat)' });
      setAgentB({ ...DEFAULT_AGENT_B, strategyId: 'random', name: 'Agent B (Random)' });
    } else if (preset === 'tft-vs-tft') {
      setAgentA({ ...DEFAULT_AGENT_A, strategyId: 'tit-for-tat', name: 'Agent A (Tit-for-Tat)' });
      setAgentB({ ...DEFAULT_AGENT_B, strategyId: 'tit-for-tat', name: 'Agent B (Tit-for-Tat)' });
    } else if (preset === 'angel-vs-devil') {
      setAgentA({ ...DEFAULT_AGENT_A, strategyId: 'always-cooperate', name: 'Agent A (Angel)' });
      setAgentB({ ...DEFAULT_AGENT_B, strategyId: 'always-defect', name: 'Agent B (Devil)' });
    }
  };

  const handleSaveLLMConfig = (llmConfig: LLMConfig) => {
    if (activeLLMAgentId === 'A') {
      setAgentA(prev => ({ ...prev, llmConfig }));
    } else if (activeLLMAgentId === 'B') {
      setAgentB(prev => ({ ...prev, llmConfig }));
    }
  };

  const latestRound = history.length > 0 ? history[history.length - 1] : undefined;
  const hasFinished = history.length >= settings.totalRounds && history.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-900 font-sans pb-16">
      <Header
        onQuickPreset={handleQuickPreset}
        onReset={handleReset}
        isSimulating={isSimulating}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Status bar when LLM API call is generating */}
        {isGeneratingLLM && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between text-orange-900 text-xs shadow-sm animate-pulse">
            <span className="font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
              Generating move via Gemini API...
            </span>
            <span className="font-mono text-[11px] text-orange-700">Evaluating payoff incentives & match history</span>
          </div>
        )}

        {/* Top Section: Agent Configuration, Payoff Matrix, Simulation Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Agent Selection Card (5 cols) */}
          <div className="lg:col-span-5">
            <AgentConfigSection
              agentA={agentA}
              agentB={agentB}
              onChangeAgentA={setAgentA}
              onChangeAgentB={setAgentB}
              onOpenLLMModal={(id) => setActiveLLMAgentId(id)}
              isSimulating={isSimulating}
            />
          </div>

          {/* Payoff Matrix Card (4 cols) */}
          <div className="lg:col-span-4">
            <PayoffMatrixCard
              matrix={settings.payoffMatrix}
              onChangeMatrix={(matrix) => setSettings(s => ({ ...s, payoffMatrix: matrix }))}
              latestRound={latestRound}
              agentAName={agentA.name}
              agentBName={agentB.name}
              agentAColor={agentA.color}
              agentBColor={agentB.color}
              isSimulating={isSimulating}
            />
          </div>

          {/* Game Controls Card (3 cols) */}
          <div className="lg:col-span-3">
            <GameControls
              settings={settings}
              onChangeSettings={setSettings}
              onRunGame={handleRunGame}
              onStepRound={handleStepRound}
              onPauseResume={handlePauseResume}
              onReset={handleReset}
              isSimulating={isSimulating}
              isPaused={isPaused}
              currentRound={history.length}
              hasFinished={hasFinished}
            />
          </div>
        </div>

        {/* Phase 2: Controlled Experiment Runner */}
        <ExperimentRunner
          agentA={agentA}
          agentB={agentB}
          payoffMatrix={settings.payoffMatrix}
          noiseRate={settings.noiseRate}
        />

        {/* Real-time Single Game Statistics Cards */}
        <Statistics
          history={history}
          agentA={agentA}
          agentB={agentB}
        />

        {/* Score Chart Over Time */}
        <ScoreChart
          history={history}
          agentAName={agentA.name}
          agentBName={agentB.name}
          agentAColor={agentA.color}
          agentBColor={agentB.color}
        />

        {/* Theoretical Nash Equilibrium Card */}
        <NashEquilibriumCard
          matrix={settings.payoffMatrix}
          history={history}
        />

        {/* Single Game History Table & Data Export */}
        <HistoryTable
          history={history}
          agentA={agentA}
          agentB={agentB}
        />
      </main>

      {/* Modal for LLM API Setup */}
      {activeLLMAgentId && (
        <LLMAgentModal
          isOpen={!!activeLLMAgentId}
          onClose={() => setActiveLLMAgentId(null)}
          agent={activeLLMAgentId === 'A' ? agentA : agentB}
          onSaveConfig={handleSaveLLMConfig}
        />
      )}
    </div>
  );
};
