import React from 'react';
import { X, ShieldAlert, Github, CheckCircle2, Globe, Cpu, Key } from 'lucide-react';

interface GithubPagesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubPagesGuideModal: React.FC<GithubPagesGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 text-stone-900 dark:text-stone-100">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h3 className="text-base font-semibold">GitHub Pages Deployment & Security Architecture</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          {/* Static Compatibility Guarantee */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Static & Client-Side Execution</span>
            </div>
            <p>
              This entire math practice application runs directly in the client browser using vanilla Web APIs, PDF.js for parsing study materials, and procedural mathematical generators with KaTeX rendering. No backend database or Node.js server is required for live hosting.
            </p>
          </div>

          {/* Steps to deploy to GitHub Pages */}
          <div>
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <span>How to Deploy to GitHub Pages in 3 Steps</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg border border-stone-200 dark:border-stone-700">
              <li>
                <strong className="text-stone-800 dark:text-stone-200">Build the static assets:</strong> Run <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded font-mono">npm run build</code> to produce the static output directory in <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded font-mono">/dist</code>.
              </li>
              <li>
                <strong className="text-stone-800 dark:text-stone-200">Push to GitHub:</strong> Commit the source code to your GitHub repository.
              </li>
              <li>
                <strong className="text-stone-800 dark:text-stone-200">Enable GitHub Pages:</strong> In your GitHub repository settings under <em>Pages</em>, select <em>Deploy from a branch</em> (<code className="font-mono">gh-pages</code> or <code className="font-mono">dist</code>) or configure GitHub Actions with the default Vite static workflow.
              </li>
            </ol>
          </div>

          {/* Security Notice for Client-Side AI API Keys */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Client-Side API Key Security Advisory</span>
            </div>
            <p className="mb-2">
              GitHub Pages serves purely static public HTML/JS files:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800 dark:text-amber-300">
              <li><strong>Never hardcode private API keys</strong> into frontend source files, Git commits, or public repositories.</li>
              <li>Because GitHub Pages has no hidden server environment, all network requests from the browser are visible in Browser DevTools.</li>
              <li>This application is built with <strong>self-contained procedural math engines</strong> that generate infinite accurate questions and step-by-step solutions without requiring any external API key.</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg text-xs font-medium cursor-pointer hover:bg-stone-800 dark:hover:bg-stone-200"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
