import React, { useState } from 'react';
import { 
  X, Bookmark, Download, Sparkles, FileText, 
  PenTool, CheckCircle2, Copy, Check, BrainCircuit,
  FolderOpen
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  onGenerateQuizFromNote?: (doc: DocumentItem) => void;
  onOpenInFolder?: (folderId: string) => void;
  isReadOnly?: boolean;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
  onToggleFavorite,
  onGenerateQuizFromNote,
  onOpenInFolder,
  isReadOnly = false
}) => {
  const [viewTab, setViewTab] = useState<'handwriting' | 'ocr' | 'summary'>('handwriting');
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopyOCR = () => {
    navigator.clipboard.writeText(document.ocrTranscribedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 text-slate-900 shadow-2xl flex flex-col space-y-3.5 max-h-[92vh] border-2 border-slate-700/80">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="min-w-0 pr-2">
            <div className="flex items-center space-x-2">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: document.subjectColor }}
              >
                {document.subject}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {document.date} · {document.pageCount} Pages · {document.fileSize}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 truncate mt-1">
              {document.title}
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(document.id)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-amber-500 transition-colors cursor-pointer"
                title="Star note"
              >
                <Bookmark className={`w-4 h-4 ${document.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Tab Switcher: Handwriting / Digital OCR / AI Summary */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setViewTab('handwriting')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              viewTab === 'handwriting' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Handwritten</span>
          </button>
          <button
            onClick={() => setViewTab('ocr')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              viewTab === 'ocr' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Digital OCR</span>
          </button>
          <button
            onClick={() => setViewTab('summary')}
            className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              viewTab === 'summary' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Summary</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: HANDWRITING */}
          {viewTab === 'handwriting' && (
            <div className="bg-[#fcfdfd] rounded-2xl border border-slate-300 p-5 min-h-[300px] relative overflow-hidden shadow-inner flex flex-col justify-between">
              {/* Lined paper simulation */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(#3aa6c8 0, #3aa6c8 1px, transparent 1px, transparent 28px)'
                }}
              />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between border-b border-sky-300 pb-2">
                  <span className="font-handwriting text-2xl text-slate-800 font-bold">
                    {document.title}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Page 1 / {document.pageCount}
                  </span>
                </div>

                <div className="space-y-4 pt-1">
                  <p className="font-handwriting text-xl text-slate-800 leading-relaxed">
                    {document.ocrTranscribedText.split('\n')[0]}
                  </p>

                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-center my-2">
                    <span className="font-mono text-sky-900 text-xs font-semibold tracking-wider">
                      {document.keyTopics.join('  •  ')}
                    </span>
                  </div>

                  <p className="font-handwriting text-xl text-slate-700 leading-relaxed">
                    {document.ocrTranscribedText.split('\n').slice(1).join(' ')}
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-4 mt-6 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Digitized via ScribeSync Vision OCR</span>
                </span>
                <span>Scanned Document Page #1</span>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITAL OCR */}
          {viewTab === 'ocr' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Machine OCR Text (99.4% Accuracy)
                </span>
                <button
                  onClick={handleCopyOCR}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
                {document.ocrTranscribedText}
              </div>
            </div>
          )}

          {/* TAB 3: AI SUMMARY */}
          {viewTab === 'summary' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                  AI Summary
                </span>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {document.summary}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                  Key Topics &amp; Formulas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {document.keyTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {document.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-200 flex items-center space-x-2">
          {onOpenInFolder && (
            <button
              onClick={() => onOpenInFolder(document.folderId)}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-1 border border-slate-300 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-slate-700" />
              <span>Open in Folder</span>
            </button>
          )}

          {onGenerateQuizFromNote && !isReadOnly && (
            <button
              onClick={() => onGenerateQuizFromNote(document)}
              className="flex-1 py-2 rounded-xl bg-[#3aa6c8] hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-sky-600/20 cursor-pointer transition-colors"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Quiz on Note</span>
            </button>
          )}

          <button
            onClick={() => alert(`Exporting "${document.title}.pdf" to device...`)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black cursor-pointer transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
