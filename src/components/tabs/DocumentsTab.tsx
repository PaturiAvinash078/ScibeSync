import React, { useState } from 'react';
import { Search, Plus, Folder, ArrowLeft, FileText, ChevronRight, X, Share2, Edit2, Trash2, FolderPlus, FolderInput, CheckCircle2 } from 'lucide-react';
import { DocumentItem, FolderItem } from '../../types';
import { ScribeSyncHeader } from '../ScribeSyncHeader';
import { ActionMenu } from '../ActionMenu';

interface DocumentsTabProps {
  documents: DocumentItem[];
  folders: FolderItem[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onCreateFolder: (name: string, subjectCode: string, color: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteDocument: (docId: string) => void;
  onRenameDocument: (docId: string, newTitle: string) => void;
  onMoveDocument: (docId: string, targetFolderId: string) => void;
  onTriggerScanForFolder?: (folderId: string) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  folders,
  selectedFolderId,
  onSelectFolder,
  onSelectDocument,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onDeleteDocument,
  onRenameDocument,
  onMoveDocument,
  onTriggerScanForFolder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#ea5b5b');
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

  const activeFolder = folders.find((f) => f.id === selectedFolderId);
  const q = searchQuery.toLowerCase().trim();

  // Search filtering logic:
  // In root view: filter folders by name, and also search documents
  const filteredFolders = folders.filter((f) => !q || f.name.toLowerCase().includes(q));

  // Documents matching current view & search query
  const currentDocs = documents.filter((doc) => {
    if (selectedFolderId && doc.folderId !== selectedFolderId) return false;
    if (!q) return true;
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.subject.toLowerCase().includes(q) ||
      doc.ocrTranscribedText.toLowerCase().includes(q)
    );
  });

  // Cross-folder matching documents in root search view
  const globalMatchingDocs = !selectedFolderId && q ? documents.filter((doc) =>
    doc.title.toLowerCase().includes(q) ||
    doc.subject.toLowerCase().includes(q) ||
    doc.ocrTranscribedText.toLowerCase().includes(q)
  ) : [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim(), 'CS 200', newFolderColor);
    showToast(`Created folder "${newFolderName.trim()}"`);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleShare = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
        showToast('Shared successfully!');
      } catch (err) {
        // Ignored if cancelled
      }
    } else {
      navigator.clipboard.writeText(`${title}\n${text}\nShared via ScribeSync`);
      showToast('Share link copied to clipboard!');
    }
  };

  const folderColors = [
    '#ea5b5b', // Coral/Red
    '#3aa6c8', // Cyan
    '#36b37e', // Green
    '#ea7a38', // Orange
    '#8755d9', // Purple
    '#d9369b', // Magenta
    '#4355a4'  // Navy/Indigo
  ];

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

      {/* Title & + New Folder Bar matching Page 3 */}
      <div className="flex items-center justify-between pt-1">
        {selectedFolderId ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelectFolder(null)}
              className="p-1.5 rounded-xl bg-white border border-slate-400 text-slate-800 hover:text-black cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900 truncate">
                {activeFolder?.name}
              </h2>
              <p className="text-[11px] text-slate-600 font-medium">
                {currentDocs.length} notes in folder
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
              Document Library
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Organized subject folders &amp; digital notes
            </p>
          </div>
        )}

        {/* + New Folder button matching Page 3 */}
        <button
          onClick={() => setIsCreatingFolder(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-semibold shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Folder</span>
        </button>
      </div>

      {/* Search Bar matching Page 3 - Now fully working for folders & notes */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={selectedFolderId ? `Search inside ${activeFolder?.name}...` : 'Search folders or notes...'}
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

      {/* CREATE NEW FOLDER DIALOG */}
      {isCreatingFolder && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-2xl bg-white border-2 border-slate-700/80 shadow-lg space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Create New Subject Folder
            </h4>
            <button
              type="button"
              onClick={() => setIsCreatingFolder(false)}
              className="text-slate-500 hover:text-black text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1">
              Folder Name
            </label>
            <input
              type="text"
              required
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Artificial Intelligence"
              className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs rounded-xl border border-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1.5">
              Folder Color
            </label>
            <div className="flex items-center space-x-2">
              {folderColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewFolderColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    newFolderColor === c ? 'scale-125 ring-2 ring-slate-900' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
          >
            Create Folder
          </button>
        </form>
      )}

      {/* FOLDERS GRID (ROOT VIEW) MATCHING PAGE 3 */}
      {!selectedFolderId ? (
        <div className="space-y-4 pt-1">
          {/* Section: Subject Folders */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span>Folders ({filteredFolders.length})</span>
              {searchQuery && (
                <span className="text-[11px] font-normal text-slate-500">
                  Filtered by "{searchQuery}"
                </span>
              )}
            </div>

            {filteredFolders.length === 0 ? (
              <div className="p-6 text-center bg-white/75 rounded-2xl border border-slate-300">
                <Folder className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-800">No folders match "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs font-bold text-slate-900 underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredFolders.map((folder) => {
                  const folderFilesCount = documents.filter((d) => d.folderId === folder.id).length;
                  const displayCount = folderFilesCount || folder.itemCount;

                  return (
                    <div
                      key={folder.id}
                      onClick={() => onSelectFolder(folder.id)}
                      className="relative p-3.5 rounded-2xl text-white shadow-md cursor-pointer hover:opacity-95 active:scale-98 transition-all flex flex-col justify-between h-26 group"
                      style={{ backgroundColor: folder.color }}
                    >
                      {/* Top row: Folder icon on left, 3-DOTS ACTION MENU ON TOP RIGHT */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Folder className="w-5 h-5 fill-none stroke-current stroke-2 opacity-90" />
                          <span className="text-[10px] italic font-mono text-white/90">
                            {displayCount} files
                          </span>
                        </div>

                        {/* 3-DOTS MENU ASSIGNED ON TOP RIGHT AS REQUESTED */}
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
                                onClick: () => handleShare(`ScribeSync - ${folder.name}`, `Study folder containing ${displayCount} handwritten & digital notes.`)
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
                                    showToast('Cannot delete the last remaining folder.');
                                    return;
                                  }
                                  onDeleteFolder(folder.id);
                                  showToast(`Deleted folder "${folder.name}"`);
                                }
                              }
                            ]}
                          />
                        </div>
                      </div>

                      {/* Folder Name */}
                      <h4 className="text-xs font-bold leading-tight text-white line-clamp-2 pr-1">
                        {folder.name}
                      </h4>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* If searching in root view, show matching notes directly below */}
          {q && globalMatchingDocs.length > 0 && (
            <div className="pt-2 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Matching Notes Across Folders ({globalMatchingDocs.length})
              </div>
              <div className="space-y-2">
                {globalMatchingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className="p-3 rounded-2xl bg-white/95 border-2 border-slate-300 hover:border-slate-800 transition-all cursor-pointer flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: `${doc.subjectColor}25`, color: doc.subjectColor }}
                      >
                        <FileText className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {doc.title}
                        </h4>
                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                          {doc.subject} · {doc.date}
                        </p>
                      </div>
                    </div>

                    {/* 3 Dots Menu for Note */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        buttonClassName="text-slate-700 hover:bg-slate-200"
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
                              onDeleteDocument(doc.id);
                              showToast(`Deleted "${doc.title}"`);
                            }
                          }
                        ]}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* INSIDE SELECTED FOLDER VIEW */
        <div className="space-y-2.5 pt-1">
          {currentDocs.length === 0 ? (
            <div className="p-8 text-center bg-white/70 rounded-2xl border border-slate-300">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No notes in this folder yet</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Scan handwritten pages from the center scan trigger or accept unsynced notes in Physical.
              </p>
            </div>
          ) : (
            currentDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="p-3 rounded-2xl bg-white/95 border-2 border-slate-300 hover:border-slate-800 transition-all cursor-pointer flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${doc.subjectColor}25`, color: doc.subjectColor }}
                  >
                    <FileText className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {doc.title}
                    </h4>
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                      {doc.date} · {doc.pageCount} pages · {doc.fileSize}
                    </p>
                  </div>
                </div>

                {/* Right: Open link + 3-DOTS MENU ON TOP RIGHT */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <div className="flex items-center text-xs text-slate-700 font-bold">
                    <span>Open</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>

                  {/* 3-DOTS ACTION MENU ON TOP RIGHT FOR EACH DOCUMENT */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      buttonClassName="text-slate-700 hover:bg-slate-200"
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
                            onDeleteDocument(doc.id);
                            showToast(`Deleted "${doc.title}"`);
                          }
                        }
                      ]}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* RENAME FOLDER MODAL */}
      {renamingFolder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-300">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Rename Folder</h4>
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
                  if (renamedFolderName.trim()) {
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
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-300">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Rename Document Note</h4>
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
                  if (renamedDocTitle.trim()) {
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
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-300">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Move Note to Folder</h4>
            <p className="text-[11px] text-slate-600">Select target folder for "{movingDoc.title}":</p>
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
                  if (targetMoveFolderId) {
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
