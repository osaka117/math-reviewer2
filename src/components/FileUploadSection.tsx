import React, { useRef, useState } from 'react';
import { DocumentAnalysisResult, MathTopic } from '../types/math';
import { extractTextFromFile, analyzeMathContent } from '../utils/mathParser';
import { DEFAULT_DOCUMENT_NAME, DEFAULT_RAW_TEXT } from '../utils/sampleData';
import { Upload, FileText, CheckCircle2, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface FileUploadSectionProps {
  analysis: DocumentAnalysisResult;
  onAnalysisUpdate: (analysis: DocumentAnalysisResult) => void;
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  analysis,
  onAnalysisUpdate,
  selectedTopicId,
  onSelectTopic,
  isLoading,
  setIsLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const processFile = async (file: File) => {
    setIsLoading(true);
    try {
      const rawText = await extractTextFromFile(file);
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      const result = analyzeMathContent(rawText, file.name, sizeStr);
      onAnalysisUpdate(result);
    } catch (err) {
      console.error('File parsing error:', err);
      onAnalysisUpdate({
        fileName: file.name,
        detectedTopics: [],
        extractedTextPreview: '',
        rawText: '',
        formulaCount: 0,
        conceptCount: 0,
        isValidMathDocument: false,
        warningMessage: 'Could not parse the uploaded file. Please verify it is a valid PDF or text document containing math material.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleLoadSample = () => {
    setIsLoading(true);
    setTimeout(() => {
      const result = analyzeMathContent(DEFAULT_RAW_TEXT, DEFAULT_DOCUMENT_NAME, '142 KB');
      onAnalysisUpdate(result);
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-5 shadow-xs">
      {/* Header & Source Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Source Study Material
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Problems are generated specifically from topics detected in your uploaded file
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="load-sample-material-btn"
            onClick={handleLoadSample}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Load the attached Mathematics 10 sample activity"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Load Attached Activity</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.json,.csv,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="math-file-upload-input"
          />

          <button
            id="browse-upload-file-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:bg-stone-800 dark:hover:bg-stone-200"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New File</span>
          </button>
        </div>
      </div>

      {/* Drag and drop banner if dragging */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mt-3.5 p-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-between gap-3 text-xs ${
          isDragging
            ? 'border-stone-800 bg-stone-50 dark:border-stone-300 dark:bg-stone-800/80'
            : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="w-4 h-4 text-stone-500 shrink-0" />
          <div className="truncate">
            <span className="font-medium text-stone-900 dark:text-stone-100">
              {analysis.fileName || 'No file selected'}
            </span>
            {analysis.fileSize && (
              <span className="text-stone-500 dark:text-stone-400 ml-2">
                ({analysis.fileSize})
              </span>
            )}
          </div>
        </div>

        <div className="text-stone-500 dark:text-stone-400 hidden sm:block shrink-0">
          Drag & drop any PDF or text file here
        </div>
      </div>

      {/* Warning message if invalid math file */}
      {!analysis.isValidMathDocument && analysis.warningMessage && (
        <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{analysis.warningMessage}</p>
            <p className="mt-1 text-amber-700 dark:text-amber-400">
              Click &ldquo;Load Attached Activity&rdquo; above to use the verified Mathematics 10 study sheet.
            </p>
          </div>
        </div>
      )}

      {/* Detected Topics Bar */}
      {analysis.isValidMathDocument && analysis.detectedTopics.length > 0 && (
        <div className="mt-3.5 pt-3.5 border-t border-stone-100 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Detected Topics in Material
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                {analysis.detectedTopics.length} topics detected
              </span>
            </div>

            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>{showFormulaDetails ? 'Hide Formulas & Concepts' : 'View Formulas & Rules'}</span>
              {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Topic filter chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              id="topic-filter-all-btn"
              onClick={() => onSelectTopic('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                selectedTopicId === 'all'
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-800/70 dark:hover:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
              }`}
            >
              All Topics ({analysis.detectedTopics.length})
            </button>

            {analysis.detectedTopics.map((topic: MathTopic) => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  id={`topic-filter-${topic.id}-btn`}
                  onClick={() => onSelectTopic(topic.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-800/70 dark:hover:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500"></span>
                  <span>{topic.name}</span>
                </button>
              );
            })}
          </div>

          {/* Collapsible formula details panel */}
          {showFormulaDetails && (
            <div className="mt-3 p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-lg border border-stone-200/80 dark:border-stone-700/60 space-y-3">
              {analysis.detectedTopics.map((topic: MathTopic) => (
                <div key={topic.id} className="text-xs">
                  <div className="font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    {topic.name} &bull; <span className="text-stone-500 font-normal">{topic.description}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1.5">
                    <div className="bg-white dark:bg-stone-800 p-2 rounded border border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">Formulas:</span>
                      <div className="space-y-1">
                        {topic.formulas.map((form, idx) => (
                          <div key={idx} className="text-stone-700 dark:text-stone-300 font-mono text-[11px]">
                            <MathRenderer text={`$${form}$`} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-stone-800 p-2 rounded border border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">Key Concepts:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-stone-600 dark:text-stone-300 text-[11px]">
                        {topic.keyConcepts.map((concept, idx) => (
                          <li key={idx}>{concept}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
