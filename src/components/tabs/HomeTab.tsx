import React, { useState } from 'react';
import { Search, Pin, Clock, Sparkles, ChevronRight, FileText, X, FolderPlus, Share2, Edit2, Trash2, FolderInput, CheckCircle2 } from 'lucide-react';
import { DocumentItem, FolderItem, TabType } from '../../types';
import { ScribeSyncHeader } from '../ScribeSyncHeader';
import { ActionMenu } from '../ActionMenu';

interface HomeTabProps {
  documents: DocumentItem[];
  folders: FolderItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onSelectFolder: (folderId: string) => void;
  onNavigateTab: (tab: TabType) => void;
  onTriggerAIQuiz: (doc: DocumentItem) => void;
  onDeleteDocument?: (docId: string) => void;
  onRenameDocument?: (docId: string, newTitle: string) => void;
  onMoveDocument?: (docId: string, targetFolderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  onRenameFolder?: (folderId: string, newName: string) => void;
  onTriggerScanForFolder?: (folderId: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  documents,
  folders,
  onSelectDocument,
  onSelectFolder,
  onNavigateTab,
  onTriggerAIQuiz,
  onDeleteDocument,
  onRenameDocument,
  onMoveDocument,
  onDeleteFolder,
  onRenameFolder,
  onTriggerScanForFolder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals for 3-dots actions
  const [renamingFolder, setRenamingFolder] = useState<FolderItem | null>(null);
  const [renamedFolderName, setRenamedFolderName] = useState('');

  const [renamingDoc, setRenamingDoc] = useState<DocumentItem | null>(null);
  const [renamedDocTitle, setRenamedDocTitle] = useState('');

  const [movingDoc, setMovingDoc] = useState<DocumentItem | null>(null);
  const [targetMoveFolderId, setTargetMoveFolderId] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShare = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
        showToast('Shared successfully!');
      } catch (err) {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(`${title}\n${text}\nShared via ScribeSync`);
      showToast('Share link copied to clipboard!');
    }
  };

  // Filtered documents matching search
  const filteredDocs = documents.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.subject.toLowerCase().includes(q) ||
      doc.ocrTranscribedText.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Top 4 Quick Access folders matching Page 2
  const quickAccessFolders = [
    folders.find((f) => f.name === 'Data Structures') || folders[0],
    folders.find((f) => f.name === 'Engineering Mathematics') || folders[1],
    folders.find((f) => f.name === 'DBMS') || folders[2],
    folders.find((f) => f.name === 'Computer Networks') || folders[3]
  ].filter(Boolean) as FolderItem[];

  return (
    <div className="flex flex-col space-y-4 pb-24 px-4 pt-3 select-none">
      {/* Top Header Logo */}
      <ScribeSyncHeader />

      {/* Toast */}
      {toastMessage && (
        <div className="p-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl animate-in fade-in flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Bar - Crisp rectangular border matching Page 2 */}
      <div className="relative mt-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes"
          className="w-full bg-white/90 text-slate-800 placeholder-slate-600 text-sm font-medium py-3 pl-4 pr-11 rounded-sm border-2 border-slate-700/80 shadow-xs focus:outline-none focus:border-slate-950"
        />
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-700">
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-5 h-5 stroke-[2.2] pointer-events-none" />
          )}
        </div>
      </div>

      {/* QUICK ACCESS SECTION */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
          <div className="flex items-center space-x-1.5">
            <Pin className="w-4 h-4 fill-slate-900 text-slate-900 rotate-45" />
            <span className="text-sm tracking-tight font-bold">Quick Access</span>
          </div>
          <button
            onClick={() => onNavigateTab('docs')}
            className="text-xs text-slate-800 hover:text-black font-semibold flex items-center cursor-pointer transition-colors"
          >
            <span>View All Folders&gt;</span>
          </button>
        </div>

        {/* 2x2 Colorful Folder Grid matching Page 2 with 3-DOTS MENU ON TOP RIGHT */}
        <div className="grid grid-cols-2 gap-3">
          {quickAccessFolders.map((folder, idx) => {
            const folderFilesCount = documents.filter((d) => d.folderId === folder.id).length;
            const displayCount = folderFilesCount || folder.itemCount;

            const cardBg =
              idx === 0
                ? 'bg-[#ea5b5b]'
                : idx === 1
                ? 'bg-[#3aa6c8]'
                : idx === 2
                ? 'bg-[#36b37e]'
                : 'bg-[#ea7a38]';

            return (
              <div
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className={`relative p-3.5 rounded-2xl ${cardBg} text-white shadow-md cursor-pointer hover:opacity-95 active:scale-98 transition-all flex flex-col justify-between h-25 group`}
              >
                {/* Top row: Spiral/Lines notebook icon on left, 3-DOTS MENU ON TOP RIGHT */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-1.5">
                    {/* Notebook icon */}
                    <div className="w-4 h-4 flex flex-col justify-between py-0.5 opacity-90">
                      <div className="h-0.5 w-3.5 bg-white rounded-full" />
                      <div className="h-0.5 w-3.5 bg-white rounded-full" />
                      <div className="h-0.5 w-3 bg-white rounded-full" />
                    </div>
                    <span className="text-[10px] italic font-mono text-white/90">
                      {displayCount} files
                    </span>
                  </div>

                  {/* 3 DOTS MENU FOR QUICK ACCESS FOLDER */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      buttonClassName="text-white hover:bg-white/20 p-1"
                      items={[
                        {
                          label: 'Add Notes to Folder',
                          icon: <FolderPlus className="w-4 h-4 text-emerald-600" />,
                          onClick: () => {
                            if (onTriggerScanForFolder) {
                              onTriggerScanForFolder(folder.id);
                            } else {
                              onSelectFolder(folder.id);
                            }
                          }
                        },
                        {
                          label: 'Share Folder',
                          icon: <Share2 className="w-4 h-4 text-sky-600" />,
                          onClick: () => handleShare(`ScribeSync - ${folder.name}`, `Study folder with ${displayCount} files.`)
                        },
                        {
                          label: 'Rename Folder',
                          icon: <Edit2 className="w-4 h-4 text-amber-600" />,
                          onClick: () => {
                            setRenamingFolder(folder);
                            setRenamedFolderName(folder.name);
                          }
                        },
                        {
                          label: 'Delete Folder',
                          icon: <Trash2 className="w-4 h-4" />,
                          variant: 'danger',
                          onClick: () => {
                            if (folders.length <= 1) {
                              showToast('Cannot delete last folder.');
                              return;
                            }
                            if (onDeleteFolder) {
                              onDeleteFolder(folder.id);
                              showToast(`Deleted folder "${folder.name}"`);
                            }
                          }
                        }
                      ]}
                    />
                  </div>
                </div>

                {/* Center text: Folder / Course Name */}
                <h4 className="text-xs font-bold leading-tight text-white line-clamp-2 pr-1">
                  {folder.name}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENTS SECTION */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-slate-800" />
            <span className="text-sm tracking-tight font-bold">Recents</span>
          </div>
          <span className="text-xs font-semibold text-slate-800 font-mono">
            {filteredDocs.length} Items
          </span>
        </div>

        {/* Recent Document Cards matching Page 2 with 3-DOTS ON TOP RIGHT */}
        <div className="space-y-3">
          {filteredDocs.map((doc, idx) => {
            const cardBg = idx % 2 === 0 ? 'bg-[#3aa6c8]' : 'bg-[#ea5b5b]';

            return (
              <div
                key={doc.id}
                className={`relative p-3.5 rounded-2xl ${cardBg} text-white shadow-md flex items-center justify-between transition-all`}
              >
                {/* Left: Document icon + Metadata */}
                <div
                  onClick={() => onSelectDocument(doc)}
                  className="flex items-center space-x-3 min-w-0 pr-2 cursor-pointer flex-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
                    <FileText className="w-5 h-5 text-white" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-white/90 truncate font-medium">
                      {doc.subject}
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-white/80 mt-1">
                      <span>{doc.date}</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>
                </div>

                {/* Right: AI Quiz Button, Open Notes Link, AND 3-DOTS MENU ON TOP RIGHT */}
                <div className="flex flex-col items-end space-y-1.5 shrink-0 pl-1">
                  {/* Top right row: 3-DOTS ACTION MENU */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onTriggerAIQuiz(doc)}
                      className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/35 active:scale-95 text-white text-[11px] font-bold flex items-center space-x-1 border border-white/40 shadow-xs cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>AI Quiz</span>
                    </button>

                    {/* 3 Dots Menu for Recent Doc */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        buttonClassName="text-white hover:bg-white/20 p-1"
                        items={[
                          {
                            label: 'Move / Add to Folder',
                            icon: <FolderInput className="w-4 h-4 text-indigo-600" />,
                            onClick: () => {
                              setMovingDoc(doc);
                              setTargetMoveFolderId(doc.folderId);
                            }
                          },
                          {
                            label: 'Share Note',
                            icon: <Share2 className="w-4 h-4 text-sky-600" />,
                            onClick: () => handleShare(doc.title, `${doc.summary || doc.title}`)
                          },
                          {
                            label: 'Rename Note',
                            icon: <Edit2 className="w-4 h-4 text-amber-600" />,
                            onClick: () => {
                              setRenamingDoc(doc);
                              setRenamedDocTitle(doc.title);
                            }
                          },
                          {
                            label: 'Delete Note',
                            icon: <Trash2 className="w-4 h-4" />,
                            variant: 'danger',
                            onClick: () => {
                              if (onDeleteDocument) {
                                onDeleteDocument(doc.id);
                                showToast(`Deleted "${doc.title}"`);
                              }
                            }
                          }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Open Notes > Link */}
                  <button
                    onClick={() => onSelectDocument(doc)}
                    className="text-xs font-bold text-white hover:underline flex items-center cursor-pointer pt-0.5"
                  >
                    <span>Open Notes&gt;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RENAME FOLDER MODAL */}
      {renamingFolder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-300 text-slate-900">
            <h4 className="text-xs font-bold uppercase">Rename Folder</h4>
            <input
              type="text"
              value={renamedFolderName}
              onChange={(e) => setRenamedFolderName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
            />
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setRenamingFolder(null)}
                className="flex-1 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (renamedFolderName.trim() && onRenameFolder) {
                    onRenameFolder(renamingFolder.id, renamedFolderName.trim());
                    showToast(`Renamed to "${renamedFolderName.trim()}"`);
                  }
                  setRenamingFolder(null);
                }}
                className="flex-1 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME DOCUMENT MODAL */}
      {renamingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-300 text-slate-900">
            <h4 className="text-xs font-bold uppercase">Rename Note</h4>
            <input
              type="text"
              value={renamedDocTitle}
              onChange={(e) => setRenamedDocTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
            />
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setRenamingDoc(null)}
                className="flex-1 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (renamedDocTitle.trim() && onRenameDocument) {
                    onRenameDocument(renamingDoc.id, renamedDocTitle.trim());
                    showToast(`Renamed note to "${renamedDocTitle.trim()}"`);
                  }
                  setRenamingDoc(null);
                }}
                className="flex-1 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOVE DOCUMENT MODAL */}
      {movingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-300 text-slate-900">
            <h4 className="text-xs font-bold uppercase">Move Note to Folder</h4>
            <p className="text-[11px] text-slate-600">Select destination folder for "{movingDoc.title}":</p>
            <select
              value={targetMoveFolderId}
              onChange={(e) => setTargetMoveFolderId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setMovingDoc(null)}
                className="flex-1 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (targetMoveFolderId && onMoveDocument) {
                    onMoveDocument(movingDoc.id, targetMoveFolderId);
                    const targetName = folders.find((f) => f.id === targetMoveFolderId)?.name || 'folder';
                    showToast(`Moved to "${targetName}"`);
                  }
                  setMovingDoc(null);
                }}
                className="flex-1 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
