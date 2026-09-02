import React from 'react';
import { GameSettings } from '../types/game';
import { Play, Pause, FastForward, RotateCcw, Sliders, Dices, Zap } from 'lucide-react';

interface GameControlsProps {
  settings: GameSettings;
  onChangeSettings: (settings: GameSettings) => void;
  onRunGame: () => void;
  onStepRound: () => void;
  onPauseResume: () => void;
  onReset: () => void;
  isSimulating: boolean;
  isPaused: boolean;
  currentRound: number;
  hasFinished: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  settings,
  onChangeSettings,
  onRunGame,
  onStepRound,
  onPauseResume,
  onReset,
  isSimulating,
  isPaused,
  currentRound,
  hasFinished,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neutral-500" />
            <h3 className="font-semibold text-neutral-900 text-sm">Simulation Engine</h3>
          </div>

          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200">
            Round: {currentRound} / {settings.totalRounds}
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {!isSimulating && !hasFinished ? (
            <button
              onClick={onRunGame}
              className="py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded transition shadow-sm flex items-center justify-center gap-1.5 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Run Game
            </button>
          ) : isSimulating ? (
            <button
              onClick={onPauseResume}
              className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded transition shadow-sm flex items-center justify-center gap-1.5 text-xs"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" /> Resume
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" /> Pause
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onReset}
              className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded border border-neutral-200 transition flex items-center justify-center gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Game
            </button>
          )}

          <button
            onClick={onStepRound}
            disabled={isSimulating && !isPaused}
            className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-neutral-800 font-semibold rounded border border-neutral-200 transition flex items-center justify-center gap-1.5 text-xs"
          >
            <FastForward className="w-3.5 h-3.5 text-orange-600" /> Step 1 Round
          </button>
        </div>

        {/* Parameters */}
        <div className="space-y-3 pt-3 border-t border-neutral-200">
          {/* Total Rounds */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-neutral-700">Total Rounds</span>
              <span className="font-mono text-neutral-900 font-bold">{settings.totalRounds}</span>
            </div>
            <div className="flex items-center gap-1 mb-1.5">
              {[5, 10, 20, 50, 100].map((r) => (
                <button
                  key={r}
                  onClick={() => onChangeSettings({ ...settings, totalRounds: r })}
                  disabled={isSimulating}
                  className={`flex-1 py-1 text-[11px] font-mono rounded font-medium transition ${
                    settings.totalRounds === r
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={settings.totalRounds}
              onChange={(e) => onChangeSettings({ ...settings, totalRounds: Number(e.target.value) })}
              disabled={isSimulating}
              className="w-full h-1.5 bg-neutral-200 rounded appearance-none cursor-pointer accent-orange-600"
            />
          </div>

          {/* Noise / Tremble Rate */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-neutral-700 flex items-center gap-1">
                <Dices className="w-3.5 h-3.5 text-neutral-400" /> Noise / Tremble Rate
              </span>
              <span className="font-mono text-neutral-900 font-semibold">
                {(settings.noiseRate * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.25"
              step="0.01"
              value={settings.noiseRate}
              onChange={(e) => onChangeSettings({ ...settings, noiseRate: Number(e.target.value) })}
              disabled={isSimulating}
              className="w-full h-1.5 bg-neutral-200 rounded appearance-none cursor-pointer accent-orange-600"
            />
          </div>

          {/* Step Delay */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-neutral-700 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-neutral-400" /> Step Delay
              </span>
              <span className="font-mono text-neutral-900 font-semibold">
                {settings.playbackSpeedMs} ms
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={settings.playbackSpeedMs}
              onChange={(e) => onChangeSettings({ ...settings, playbackSpeedMs: Number(e.target.value) })}
              className="w-full h-1.5 bg-neutral-200 rounded appearance-none cursor-pointer accent-orange-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
