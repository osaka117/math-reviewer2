import React, { useState, useEffect, useRef } from 'react';
import { PracticeProblem, AnswerSubmission, DifficultyLevel } from '../types/math';
import { validateAnswer } from '../utils/answerValidator';
import { MathRenderer } from './MathRenderer';
import { CheckCircle, XCircle, ArrowRight, RotateCw, Lightbulb, HelpCircle, Send, Sparkles } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../utils/sampleData';

interface ProblemCardProps {
  problem: PracticeProblem;
  difficulty: DifficultyLevel;
  onNextProblem: () => void;
  onRegenerateProblem: () => void;
  isGenerating?: boolean;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  difficulty,
  onNextProblem,
  onRegenerateProblem,
  isGenerating = false
}) => {
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [submission, setSubmission] = useState<AnswerSubmission | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when problem changes
  useEffect(() => {
    setSelectedOptionLabel('');
    setTypedInput('');
    setSubmission(null);
    setShowExplanation(false);
  }, [problem.id]);

  const currentLevelInfo = DIFFICULTY_LEVELS.find(l => l.level === difficulty) || DIFFICULTY_LEVELS[0];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submission) return; // already submitted

    const activeAnswer = selectedOptionLabel
      ? selectedOptionLabel
      : typedInput;

    if (!activeAnswer.trim()) return;

    const result = validateAnswer(typedInput, problem, selectedOptionLabel || undefined);

    setSubmission({
      userAnswer: selectedOptionLabel ? `Option (${selectedOptionLabel.toUpperCase()})` : typedInput,
      isCorrect: result.isCorrect,
      feedbackText: result.feedback,
      timestamp: Date.now()
    });
    setShowExplanation(true);
  };

  const handleOptionClick = (label: string) => {
    if (submission) return; // Locked once answered
    setSelectedOptionLabel(label);
    const chosen = problem.options.find(o => o.label === label);
    if (chosen) {
      setTypedInput(chosen.text);
    }
  };

  const insertSymbol = (sym: string) => {
    if (submission) return;
    setTypedInput(prev => prev + sym);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 sm:p-7 shadow-xs">
      {/* Problem Header: Topic Tag & Difficulty Level */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
            {problem.topicName}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${currentLevelInfo.badgeColor}`}>
            {currentLevelInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="regenerate-problem-btn"
            onClick={onRegenerateProblem}
            disabled={isGenerating}
            className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Generate a different problem on this topic"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Variation</span>
          </button>
        </div>
      </div>

      {/* Main Question Text */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
          <MathRenderer text={problem.questionText} />
        </h3>
      </div>

      {/* Multiple Choice Options (4 Choices) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        {problem.options.map(option => {
          const isSelected = selectedOptionLabel === option.label;
          const isSubmitted = !!submission;
          const isCorrectOption = problem.correctOptionLabel === option.label;
          const isUserChoice = selectedOptionLabel === option.label;

          let btnStyles = 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-stone-400 dark:hover:border-stone-500';

          if (isSelected && !isSubmitted) {
            btnStyles = 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-xs';
          }

          if (isSubmitted) {
            if (isCorrectOption) {
              btnStyles = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100 font-medium ring-1 ring-emerald-500';
            } else if (isUserChoice && !submission.isCorrect) {
              btnStyles = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-200 opacity-90';
            } else {
              btnStyles = 'bg-stone-50/50 dark:bg-stone-800/30 border-stone-200/60 dark:border-stone-800/60 text-stone-400 dark:text-stone-500 opacity-60';
            }
          }

          return (
            <button
              key={option.label}
              id={`question-option-${option.label}-btn`}
              onClick={() => handleOptionClick(option.label)}
              disabled={isSubmitted}
              className={`p-3.5 rounded-lg border text-left text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyles} ${
                isSubmitted ? 'cursor-default' : ''
              }`}
            >
              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 uppercase ${
                isSelected && !isSubmitted
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-stone-900'
                  : 'bg-stone-200/70 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}>
                {option.label}
              </span>
              <div className="pt-0.5 leading-snug flex-1">
                <MathRenderer text={option.text} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Submission Form */}
      {!submission ? (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                id="math-answer-input"
                type="text"
                value={typedInput}
                onChange={e => {
                  setTypedInput(e.target.value);
                  setSelectedOptionLabel(''); // clear option if typing manually
                }}
                placeholder="Select an option above or type your answer here..."
                className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500"
              />
            </div>

            <button
              id="submit-math-answer-btn"
              type="submit"
              disabled={!selectedOptionLabel && !typedInput.trim()}
              className="px-5 py-2.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 dark:hover:bg-stone-200"
            >
              <Send className="w-4 h-4" />
              <span>Submit Answer</span>
            </button>
          </div>

          {/* Quick Math Symbols Insert Helper */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500 dark:text-stone-400 pt-1">
            <span className="text-[11px] font-medium text-stone-600 dark:text-stone-300">Quick keys:</span>
            {['^2', '√', '≤', '≥', '°', '( , )', '[ , ]', '±', 'π'].map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => insertSymbol(sym === '( , )' ? '(, )' : sym === '[ , ]' ? '[, ]' : sym)}
                className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono text-[11px] border border-stone-200 dark:border-stone-700 cursor-pointer"
              >
                {sym}
              </button>
            ))}
          </div>
        </form>
      ) : (
        /* Post-Submission Result & Detailed Solution Display */
        <div className="space-y-4 pt-2 border-t border-stone-100 dark:border-stone-800">
          {/* Result Banner */}
          <div
            id="submission-result-banner"
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              submission.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            }`}
          >
            {submission.isCorrect ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {submission.isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
                <span className="text-xs opacity-75">
                  Your Answer: {submission.userAnswer}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {submission.feedbackText}
              </p>
            </div>
          </div>

          {/* Correct Answer Highlight */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3 text-sm">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Correct Answer:
            </span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
              {problem.correctOptionLabel ? `(${problem.correctOptionLabel.toUpperCase()}) ` : ''}
              <MathRenderer text={problem.correctAnswer} />
            </span>
          </div>

          {/* Explanation & Step-by-Step Methodology */}
          <div className="p-4 bg-stone-50/70 dark:bg-stone-800/40 rounded-xl border border-stone-200/80 dark:border-stone-700/60 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Brief Explanation</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                <MathRenderer text={problem.shortExplanation} />
              </p>
            </div>

            {/* Formula / Methodology Used */}
            <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
              <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Methodology & Formula:
              </div>
              <div className="p-2.5 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-800 dark:text-stone-200">
                <MathRenderer text={`$$${problem.formulaUsed}$$`} block />
                <span className="block text-[11px] font-sans text-stone-500 dark:text-stone-400 mt-1">
                  {problem.methodology}
                </span>
              </div>
            </div>

            {/* Step-by-step calculations */}
            {problem.stepByStep && problem.stepByStep.length > 0 && (
              <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Step-by-Step Solution:
                </div>
                <div className="space-y-2">
                  {problem.stepByStep.map(step => (
                    <div
                      key={step.stepNumber}
                      className="p-2.5 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 text-xs"
                    >
                      <div className="font-semibold text-stone-800 dark:text-stone-200 mb-0.5 flex items-center justify-between">
                        <span>Step {step.stepNumber}: {step.title}</span>
                        {step.result && (
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                            {step.result}
                          </span>
                        )}
                      </div>
                      <div className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs">
                        <MathRenderer text={step.explanation} />
                      </div>
                      {step.mathFormula && (
                        <div className="mt-1.5 p-1.5 bg-stone-50 dark:bg-stone-900 rounded font-mono text-[11px] text-stone-800 dark:text-stone-200">
                          <MathRenderer text={`$${step.mathFormula}$`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action to proceed to next problem */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              id="try-another-variation-btn"
              onClick={onRegenerateProblem}
              disabled={isGenerating}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Try Another at Level {difficulty}</span>
            </button>

            <button
              id="next-problem-btn"
              onClick={onNextProblem}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer hover:bg-stone-800 dark:hover:bg-stone-200 shadow-xs"
            >
              <span>Next Problem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
