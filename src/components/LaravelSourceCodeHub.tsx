import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  FolderTree,
  Terminal,
} from 'lucide-react';
import { laravelCodeFiles } from '../utils/laravelCodeTemplates';
import { Language, translations } from '../i18n/translations';

interface LaravelSourceCodeHubProps {
  lang: Language;
}

export const LaravelSourceCodeHub: React.FC<LaravelSourceCodeHubProps> = ({ lang }) => {
  const t = translations[lang];

  const [selectedFile, setSelectedFile] = useState(laravelCodeFiles[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <Code2 className="h-3.5 w-3.5" />
              <span>Laravel 11 & Framework PHP Backend Source Code</span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {t.laravelHubTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              {t.laravelHubDesc}
            </p>
          </div>

          <button
            onClick={handleDownloadFile}
            className="flex items-center space-x-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/25 hover:bg-red-700 transition-all shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Berkas ({selectedFile.filename})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: File Explorer + Code Viewer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: File Tree */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center space-x-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <FolderTree className="h-4 w-4 text-red-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Struktur Proyek Laravel 11
            </h3>
          </div>

          <div className="space-y-1">
            {laravelCodeFiles.map((f) => {
              const isSelected = selectedFile.id === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFile(f)}
                  className={`flex w-full items-center justify-between rounded-xl p-2.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-red-50 text-red-600 font-bold dark:bg-red-950/50 dark:text-red-400'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode className="h-4 w-4 shrink-0 text-red-500" />
                    <span className="truncate">{f.filename}</span>
                  </div>

                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {f.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="rounded-2xl border border-slate-200 bg-slate-950 text-slate-200 shadow-xl lg:col-span-2 overflow-hidden flex flex-col">
          {/* Header toolbar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-red-400" />
              <span className="font-mono text-xs font-bold text-slate-200">
                {selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t.codeCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{t.copyCode}</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 border-b border-slate-800 bg-slate-900/50 text-xs text-slate-400">
            <span className="font-bold text-white">Deskripsi:</span> {selectedFile.description}
          </div>

          {/* Code content container */}
          <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed select-all">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
