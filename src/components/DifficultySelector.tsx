import React from 'react';
import { DifficultyLevel } from '../types/math';
import { DIFFICULTY_LEVELS } from '../utils/sampleData';
import { Gauge } from 'lucide-react';

interface DifficultySelectorProps {
  selectedLevel: DifficultyLevel;
  onSelectLevel: (level: DifficultyLevel) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedLevel,
  onSelectLevel
}) => {
  const currentInfo = DIFFICULTY_LEVELS.find(l => l.level === selectedLevel) || DIFFICULTY_LEVELS[0];

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">Practice Difficulty</span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-normal">
            (Adjust anytime to adapt problem complexity)
          </span>
        </div>
        <div className="text-xs px-2.5 py-1 rounded-full font-medium border inline-flex items-center self-start sm:self-auto bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700">
          Selected: {currentInfo.label}
        </div>
      </div>

      {/* Level Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {DIFFICULTY_LEVELS.map(item => {
          const isSelected = item.level === selectedLevel;
          return (
            <button
              key={item.level}
              id={`difficulty-level-${item.level}-btn`}
              onClick={() => onSelectLevel(item.level)}
              className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left flex flex-col justify-between border cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold">L{item.level}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-600"></span>
                )}
              </div>
              <div className="text-[11px] truncate mt-0.5 opacity-90">{item.name}</div>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-1.5">
        <span className="font-medium text-stone-700 dark:text-stone-300 shrink-0">Level {currentInfo.level} Focus:</span>
        <span>{currentInfo.description}</span>
      </div>
    </div>
  );
};
