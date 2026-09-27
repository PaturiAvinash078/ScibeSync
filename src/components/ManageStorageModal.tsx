import React, { useState } from 'react';
import { X, HardDrive, Trash2, FileText, BookOpen, Cloud, Folder, Sparkles, CheckCircle2 } from 'lucide-react';
import { CloudStorageInfo, DocumentItem, FolderItem, PhysicalNoteItem, UnsyncedScan } from '../types';

interface ManageStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  storage: CloudStorageInfo;
  documents: DocumentItem[];
  folders: FolderItem[];
  physicalNotes: PhysicalNoteItem[];
  unsyncedScans: UnsyncedScan[];
  onDeleteDocument: (docId: string) => void;
  onDeletePhysicalNote: (noteId: string) => void;
  onDeleteUnsyncedScan: (scanId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onOptimizeStorage: () => void;
}

export const ManageStorageModal: React.FC<ManageStorageModalProps> = ({
  isOpen,
  onClose,
  storage,
  documents,
  folders,
  physicalNotes,
  unsyncedScans,
  onDeleteDocument,
  onDeletePhysicalNote,
  onDeleteUnsyncedScan,
  onDeleteFolder,
  onOptimizeStorage
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'docs' | 'physical' | 'unsynced' | 'folders'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const physicalPercent = Math.round((storage.physicalGB / storage.totalGB) * 100);
  const digitalPercent = Math.round((storage.digitalGB / storage.totalGB) * 100);
  const freeGB = parseFloat((storage.totalGB - storage.usedGB).toFixed(1));

  // Filter items
  const q = searchQuery.toLowerCase();

  const filteredDocs = documents.filter((d) => !q || d.title.toLowerCase().includes(q) || d.subject.toLowerCase().includes(q));
  const filteredPhysical = physicalNotes.filter((p) => !q || p.title.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q));
  const filteredUnsynced = unsyncedScans.filter((u) => !q || u.title.toLowerCase().includes(q) || u.suggestedSubject.toLowerCase().includes(q));
  const filteredFolders = folders.filter((f) => !q || f.name.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden border-2 border-slate-700/80">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
              <HardDrive className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif leading-tight">Manage Cloud Storage</h3>
              <p className="text-[11px] text-slate-300 font-medium">Free up space by deleting documents, notes &amp; folders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Storage Bar Overview */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              {storage.usedGB} GB used of {storage.totalGB} GB
            </span>
            <span className="font-semibold text-emerald-700 font-mono">
              {freeGB} GB Available
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-[#36b37e] transition-all duration-300"
              style={{ width: `${physicalPercent}%` }}
              title={`Physical: ${storage.physicalGB} GB`}
            />
            <div
              className="h-full bg-[#4355a4] transition-all duration-300"
              style={{ width: `${digitalPercent}%` }}
              title={`Digital: ${storage.digitalGB} GB`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#36b37e]" />
                <span>Physical: {storage.physicalGB} GB</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4355a4]" />
                <span>Digital: {storage.digitalGB} GB</span>
              </span>
            </div>

            <button
              onClick={() => {
                onOptimizeStorage();
                showToast('Storage optimized! Cleared 0.4 GB of temporary stroke caches.');
              }}
              className="flex items-center space-x-1 text-slate-800 font-bold hover:text-black cursor-pointer underline text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Clean Cache</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center border-b border-slate-200 px-3 py-2 bg-white space-x-1 overflow-x-auto text-xs font-bold no-scrollbar">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'docs', label: `Digital (${documents.length})` },
            { id: 'physical', label: `Physical (${physicalNotes.length})` },
            { id: 'unsynced', label: `Unsynced (${unsyncedScans.length})` },
            { id: 'folders', label: `Folders (${folders.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search inside storage */}
        <div className="px-4 py-2 bg-white border-b border-slate-100">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items to delete..."
            className="w-full px-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-500 border border-slate-300 focus:outline-none focus:border-slate-800"
          />
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
          {/* DIGITAL DOCS */}
          {(activeCategory === 'all' || activeCategory === 'docs') &&
            filteredDocs.map((doc) => (
              <div key={doc.id} className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{doc.title}</h5>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {doc.subject} · {doc.fileSize} · {doc.date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onDeleteDocument(doc.id);
                    showToast(`Deleted document "${doc.title}"`);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold flex items-center space-x-1 shrink-0 cursor-pointer transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            ))}

          {/* PHYSICAL NOTES */}
          {(activeCategory === 'all' || activeCategory === 'physical') &&
            filteredPhysical.map((note) => (
              <div key={note.id} className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{note.title}</h5>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Physical Note · {note.subject} · {note.fileSize}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onDeletePhysicalNote(note.id);
                    showToast(`Deleted note "${note.title}"`);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold flex items-center space-x-1 shrink-0 cursor-pointer transition-colors"
                  title="Delete Physical Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            ))}

          {/* UNSYNCED SCANS */}
          {(activeCategory === 'all' || activeCategory === 'unsynced') &&
            filteredUnsynced.map((scan) => (
              <div key={scan.id} className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{scan.title}</h5>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Unsynced Scan · ~1.2 MB · {scan.scannedAt}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onDeleteUnsyncedScan(scan.id);
                    showToast(`Discarded scan "${scan.title}"`);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold flex items-center space-x-1 shrink-0 cursor-pointer transition-colors"
                  title="Discard Scan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            ))}

          {/* FOLDERS */}
          {(activeCategory === 'all' || activeCategory === 'folders') &&
            filteredFolders.map((folder) => {
              const count = documents.filter((d) => d.folderId === folder.id).length;
              return (
                <div key={folder.id} className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div
                      className="w-8 h-8 rounded-lg text-white flex items-center justify-center shrink-0"
                      style={{ backgroundColor: folder.color }}
                    >
                      <Folder className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{folder.name}</h5>
                      <p className="text-[10px] text-slate-500 font-mono">{count} notes in folder</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (folders.length <= 1) {
                        showToast('Cannot delete the last remaining folder.');
                        return;
                      }
                      onDeleteFolder(folder.id);
                      showToast(`Deleted folder "${folder.name}"`);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold flex items-center space-x-1 shrink-0 cursor-pointer transition-colors"
                    title="Delete Folder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Storage changes update immediately in ScribeCloud
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
