import React, { useState, useEffect, useCallback } from 'react';
import { DifficultyLevel, DocumentAnalysisResult, PracticeProblem } from './types/math';
import { analyzeMathContent } from './utils/mathParser';
import { DEFAULT_DOCUMENT_NAME, DEFAULT_RAW_TEXT } from './utils/sampleData';
import { generateProblemForTopic } from './utils/problemGenerators';
import { FileUploadSection } from './components/FileUploadSection';
import { DifficultySelector } from './components/DifficultySelector';
import { ProblemCard } from './components/ProblemCard';
import { GithubPagesGuideModal } from './components/GithubPagesGuideModal';
import { Calculator, Github, HelpCircle, Layers, Moon, Sun } from 'lucide-react';

export default function App() {
  // Initial state loads the sample study document by default so the user can immediately practice
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult>(() =>
    analyzeMathContent(DEFAULT_RAW_TEXT, DEFAULT_DOCUMENT_NAME, '142 KB')
  );

  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [currentProblem, setCurrentProblem] = useState<PracticeProblem | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Generate a problem based on the current active topics and difficulty level
  const generateNewProblem = useCallback((overrideTopicId?: string, overrideDifficulty?: DifficultyLevel) => {
    setIsGenerating(true);

    const activeDifficulty = overrideDifficulty ?? difficulty;
    const activeTopicId = overrideTopicId ?? selectedTopicId;

    let targetTopicId = activeTopicId;

    // If 'all' topics selected, choose a random topic among detected topics
    if (activeTopicId === 'all' && analysis.detectedTopics.length > 0) {
      const randomIndex = Math.floor(Math.random() * analysis.detectedTopics.length);
      targetTopicId = analysis.detectedTopics[randomIndex].id;
    } else if (analysis.detectedTopics.length === 0) {
      targetTopicId = 'transformations';
    }

    // Small timeout for smooth feedback
    setTimeout(() => {
      const newProblem = generateProblemForTopic(targetTopicId, activeDifficulty);
      setCurrentProblem(newProblem);
      setIsGenerating(false);
    }, 120);
  }, [difficulty, selectedTopicId, analysis.detectedTopics]);

  // Initial load
  useEffect(() => {
    generateNewProblem();
  }, []);

  // When difficulty changes, update difficulty state and generate a fresh problem at that level
  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel);
    generateNewProblem(selectedTopicId, newLevel);
  };

  // When topic filter changes, generate a problem matching that topic
  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId);
    generateNewProblem(topicId, difficulty);
  };

  // When study material is uploaded/analyzed
  const handleAnalysisUpdate = (newAnalysis: DocumentAnalysisResult) => {
    setAnalysis(newAnalysis);
    setSelectedTopicId('all');
    if (newAnalysis.isValidMathDocument && newAnalysis.detectedTopics.length > 0) {
      const firstTopicId = newAnalysis.detectedTopics[0].id;
      generateNewProblem(firstTopicId, difficulty);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Application Bar */}
      <header className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Math Practice
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                Level-adaptive practice generated specifically from your study material
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* GitHub Pages Deploy Info */}
            <button
              id="github-pages-info-btn"
              onClick={() => setIsGithubModalOpen(true)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="View static deployment and GitHub Pages compatibility notes"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden md:inline">GitHub Pages Ready</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle-btn"
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title="Toggle dark/light appearance"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Page Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Section 1: Study Material & Detected Topics */}
        <section id="study-material-section" aria-label="Study Material Source">
          <FileUploadSection
            analysis={analysis}
            onAnalysisUpdate={handleAnalysisUpdate}
            selectedTopicId={selectedTopicId}
            onSelectTopic={handleTopicChange}
            isLoading={isGenerating}
            setIsLoading={setIsGenerating}
          />
        </section>

        {/* Section 2: Difficulty Selector */}
        <section id="difficulty-selector-section" aria-label="Difficulty Selector">
          <DifficultySelector
            selectedLevel={difficulty}
            onSelectLevel={handleDifficultyChange}
          />
        </section>

        {/* Section 3: Single Practice Problem Experience */}
        <section id="practice-problem-section" aria-label="Current Math Problem">
          {currentProblem && analysis.isValidMathDocument ? (
            <ProblemCard
              key={currentProblem.id}
              problem={currentProblem}
              difficulty={difficulty}
              onNextProblem={() => generateNewProblem()}
              onRegenerateProblem={() => generateNewProblem()}
              isGenerating={isGenerating}
            />
          ) : (
            <div className="p-8 text-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                Please upload a study material with mathematical content or click &ldquo;Load Attached Activity&rdquo; to begin practicing.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 py-4 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Topic-Driven Math Practice &bull; Client-Side Static Execution</span>
          <span className="text-[11px] text-stone-400">
            One problem at a time &bull; User-controlled difficulty (Levels 1–5)
          </span>
        </div>
      </footer>

      {/* Modal for GitHub Pages & Deployment Guidance */}
      <GithubPagesGuideModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </div>
  );
}
