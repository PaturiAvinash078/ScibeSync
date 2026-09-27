import React, { useState } from 'react';
import { Search, Cloud, BookOpen, Trash2, Edit3, Check, CheckCircle2, ChevronRight, X, FolderOpen, Share2, FolderInput, Edit2 } from 'lucide-react';
import { FolderItem, PhysicalNoteItem, UnsyncedScan } from '../../types';
import { ScribeSyncHeader } from '../ScribeSyncHeader';
import { ActionMenu } from '../ActionMenu';

interface PhysicalNotesTabProps {
  unsyncedScans: UnsyncedScan[];
  physicalNotes: PhysicalNoteItem[];
  folders: FolderItem[];
  onDiscardScan: (scanId: string) => void;
  onAcceptAndSort: (scanId: string, folderId?: string, title?: string) => void;
  onAutoSortAll: () => void;
  onOpenPhysicalNote: (note: PhysicalNoteItem) => void;
  onDeletePhysicalNote?: (noteId: string) => void;
  onRenamePhysicalNote?: (noteId: string, newTitle: string) => void;
  onMovePhysicalNote?: (noteId: string, targetFolderId: string) => void;
  onOpenInDocsFolder?: (folderId: string) => void;
}

export const PhysicalNotesTab: React.FC<PhysicalNotesTabProps> = ({
  unsyncedScans,
  physicalNotes,
  folders,
  onDiscardScan,
  onAcceptAndSort,
  onAutoSortAll,
  onOpenPhysicalNote,
  onDeletePhysicalNote,
  onRenamePhysicalNote,
  onMovePhysicalNote,
  onOpenInDocsFolder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewingScan, setReviewingScan] = useState<UnsyncedScan | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editFolderId, setEditFolderId] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals for 3-dots actions
  const [renamingNote, setRenamingNote] = useState<PhysicalNoteItem | null>(null);
  const [renamedNoteTitle, setRenamedNoteTitle] = useState('');

  const [movingNote, setMovingNote] = useState<PhysicalNoteItem | null>(null);
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
        // Cancelled
      }
    } else {
      navigator.clipboard.writeText(`${title}\n${text}\nShared via ScribeSync`);
      showToast('Note share link copied to clipboard!');
    }
  };

  const handleOpenReview = (scan: UnsyncedScan) => {
    setReviewingScan(scan);
    setEditTitle(scan.title);
    setEditFolderId(scan.suggestedFolderId);
  };

  const handleConfirmReview = () => {
    if (!reviewingScan) return;
    onAcceptAndSort(reviewingScan.id, editFolderId, editTitle);
    setReviewingScan(null);
    showToast(`Saved and sorted "${editTitle}" into folder`);
  };

  // Filter unsynced and physical notes
  const q = searchQuery.toLowerCase().trim();
  const filteredUnsynced = unsyncedScans.filter((s) =>
    !q || s.title.toLowerCase().includes(q) || s.suggestedSubject.toLowerCase().includes(q)
  );

  const filteredPhysical = physicalNotes.filter((p) =>
    !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

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

      {/* Search Bar matching Page 4 */}
      <div className="relative">
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

      {/* SECTION 1: UNSYNC NOTES MATCHING PAGE 4 */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
            <Cloud className="w-4 h-4 stroke-[2.2] text-slate-800" />
            <span className="text-sm font-serif">Unsync Notes</span>
          </div>

          {unsyncedScans.length > 0 && (
            <button
              onClick={() => {
                onAutoSortAll();
                showToast('All unsynced notes automatically organized into subject folders!');
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#36b37e] hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Auto Sort ALL
            </button>
          )}
        </div>

        {filteredUnsynced.length === 0 ? (
          <div className="p-4 bg-white/70 rounded-2xl border border-slate-300 text-center">
            <p className="text-xs text-slate-600 font-medium">
              No unsynced notes. All captured scans have been organized into folders.
            </p>
          </div>
        ) : (
          filteredUnsynced.map((scan) => (
            <div
              key={scan.id}
              className="relative p-3.5 rounded-2xl bg-slate-800 text-white shadow-md flex items-start space-x-3 transition-all"
            >
              {/* Hand writing on paper sketch on left */}
              <div className="w-14 h-16 rounded-xl bg-slate-700/60 border border-slate-600 flex items-center justify-center shrink-0 p-1">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[2.5]">
                  <rect x="15" y="20" width="55" height="65" rx="3" stroke="white" />
                  <line x1="25" y1="35" x2="55" y2="35" stroke="white" strokeWidth="2" />
                  <line x1="25" y1="48" x2="50" y2="48" stroke="white" strokeWidth="2" />
                  <line x1="25" y1="60" x2="45" y2="60" stroke="white" strokeWidth="2" />
                  <path d="M 45 75 L 75 40 Q 80 35 85 40 Q 90 45 85 50 L 55 85 Z" fill="#64748b" stroke="white" />
                  <line x1="45" y1="75" x2="38" y2="82" stroke="white" strokeWidth="3" />
                </svg>
              </div>

              {/* Middle details & buttons */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-white truncate pr-2">
                    {scan.title}
                  </h4>

                  {/* 3 Dots for Unsynced Scan */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      buttonClassName="text-slate-300 hover:bg-slate-700 p-1"
                      items={[
                        {
                          label: 'Accept & Sort',
                          icon: <Check className="w-4 h-4 text-emerald-400" />,
                          onClick: () => {
                            onAcceptAndSort(scan.id);
                            showToast(`Sorted "${scan.title}" into folder`);
                          }
                        },
                        {
                          label: 'Review & Edit',
                          icon: <Edit3 className="w-4 h-4 text-amber-400" />,
                          onClick: () => handleOpenReview(scan)
                        },
                        {
                          label: 'Share Scan',
                          icon: <Share2 className="w-4 h-4 text-sky-400" />,
                          onClick: () => handleShare(scan.title, scan.snippet)
                        },
                        {
                          label: 'Discard Scan',
                          icon: <Trash2 className="w-4 h-4" />,
                          variant: 'danger',
                          onClick: () => {
                            onDiscardScan(scan.id);
                            showToast(`Discarded "${scan.title}"`);
                          }
                        }
                      ]}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-amber-300 font-medium italic mt-0.5 truncate">
                  AI suggestion match to {scan.suggestedSubject}
                </p>

                {/* 3 Action Buttons matching Page 4 */}
                <div className="flex items-center space-x-2 mt-2.5 flex-wrap gap-y-1.5">
                  <button
                    onClick={() => {
                      onDiscardScan(scan.id);
                      showToast(`Discarded "${scan.title}"`);
                    }}
                    className="flex items-center space-x-1 text-slate-300 hover:text-rose-400 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Discard</span>
                  </button>

                  <button
                    onClick={() => handleOpenReview(scan)}
                    className="px-2.5 py-1 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    Review &amp; Edit
                  </button>

                  <button
                    onClick={() => {
                      onAcceptAndSort(scan.id);
                      showToast(`Accepted and sorted "${scan.title}"`);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    Accept &amp; Sort
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SECTION 2: PHYSICAL NOTES MATCHING PAGE 4 WITH 3-DOTS ON TOP RIGHT */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
          <BookOpen className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-serif">Physical Notes</span>
        </div>

        {filteredPhysical.map((note) => (
          <div
            key={note.id}
            className="relative p-3.5 rounded-2xl text-white shadow-md flex items-start space-x-3 transition-all"
            style={{ backgroundColor: note.subjectColor }}
          >
            {/* Click to open note inspector */}
            <div
              onClick={() => onOpenPhysicalNote(note)}
              className="flex items-start space-x-3 flex-1 min-w-0 cursor-pointer"
            >
              {/* Hand writing sketch on left */}
              <div className="w-14 h-16 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 p-1">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[2.5]">
                  <rect x="15" y="20" width="55" height="65" rx="3" stroke="white" />
                  <line x1="25" y1="35" x2="55" y2="35" stroke="white" strokeWidth="2" />
                  <line x1="25" y1="48" x2="50" y2="48" stroke="white" strokeWidth="2" />
                  <line x1="25" y1="60" x2="45" y2="60" stroke="white" strokeWidth="2" />
                  <path d="M 45 75 L 75 40 Q 80 35 85 40 Q 90 45 85 50 L 55 85 Z" fill="rgba(255,255,255,0.3)" stroke="white" />
                  <line x1="45" y1="75" x2="38" y2="82" stroke="white" strokeWidth="3" />
                </svg>
              </div>

              {/* Note details */}
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {note.title}
                </h4>
                <p className="text-[11px] text-white/95 leading-relaxed line-clamp-3 mt-1 font-normal">
                  {note.description}
                </p>
                <div className="flex items-center space-x-2 mt-1.5 text-[10px] font-mono text-white/80">
                  <span>{note.subject}</span>
                  <span>·</span>
                  <span>{note.date}</span>
                </div>
              </div>
            </div>

            {/* 3-DOTS ACTION MENU ON TOP RIGHT OF EACH PHYSICAL NOTE */}
            <div onClick={(e) => e.stopPropagation()} className="shrink-0 -mt-1 -mr-1">
              <ActionMenu
                buttonClassName="text-white hover:bg-white/20 p-1"
                items={[
                  {
                    label: 'Open in Folder',
                    icon: <FolderOpen className="w-4 h-4 text-emerald-600" />,
                    onClick: () => {
                      if (onOpenInDocsFolder) {
                        onOpenInDocsFolder(note.folderId);
                      } else {
                        onOpenPhysicalNote(note);
                      }
                    }
                  },
                  {
                    label: 'Move / Change Folder',
                    icon: <FolderInput className="w-4 h-4 text-indigo-600" />,
                    onClick: () => {
                      setMovingNote(note);
                      setTargetMoveFolderId(note.folderId);
                    }
                  },
                  {
                    label: 'Share Note',
                    icon: <Share2 className="w-4 h-4 text-sky-600" />,
                    onClick: () => handleShare(note.title, note.description)
                  },
                  {
                    label: 'Rename Note',
                    icon: <Edit2 className="w-4 h-4 text-amber-600" />,
                    onClick: () => {
                      setRenamingNote(note);
                      setRenamedNoteTitle(note.title);
                    }
                  },
                  {
                    label: 'Delete Note',
                    icon: <Trash2 className="w-4 h-4" />,
                    variant: 'danger',
                    onClick: () => {
                      if (onDeletePhysicalNote) {
                        onDeletePhysicalNote(note.id);
                        showToast(`Deleted physical note "${note.title}"`);
                      }
                    }
                  }
                ]}
              />
            </div>
          </div>
        ))}
      </div>

      {/* RENAME PHYSICAL NOTE MODAL */}
      {renamingNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-300 text-slate-900">
            <h4 className="text-xs font-bold uppercase">Rename Note</h4>
            <input
              type="text"
              value={renamedNoteTitle}
              onChange={(e) => setRenamedNoteTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
            />
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setRenamingNote(null)}
                className="flex-1 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (renamedNoteTitle.trim() && onRenamePhysicalNote) {
                    onRenamePhysicalNote(renamingNote.id, renamedNoteTitle.trim());
                    showToast(`Renamed note to "${renamedNoteTitle.trim()}"`);
                  }
                  setRenamingNote(null);
                }}
                className="flex-1 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOVE PHYSICAL NOTE MODAL */}
      {movingNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-300 text-slate-900">
            <h4 className="text-xs font-bold uppercase">Change Note Folder</h4>
            <p className="text-[11px] text-slate-600">Select target folder for "{movingNote.title}":</p>
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
                onClick={() => setMovingNote(null)}
                className="flex-1 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (targetMoveFolderId && onMovePhysicalNote) {
                    onMovePhysicalNote(movingNote.id, targetMoveFolderId);
                    const targetName = folders.find((f) => f.id === targetMoveFolderId)?.name || 'folder';
                    showToast(`Moved to "${targetName}"`);
                  }
                  setMovingNote(null);
                }}
                className="flex-1 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW & EDIT MODAL */}
      {reviewingScan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="text-sm font-bold flex items-center space-x-1.5">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                <span>Review Scanned Note</span>
              </h3>
              <button
                onClick={() => setReviewingScan(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:text-black flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Note Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Destination Folder
              </label>
              <select
                value={editFolderId}
                onChange={(e) => setEditFolderId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono max-h-24 overflow-y-auto">
              {reviewingScan.snippet}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => setReviewingScan(null)}
                className="flex-1 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReview}
                className="flex-1 py-2 rounded-xl bg-[#36b37e] hover:bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save &amp; Sort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
