import React, { useState, useEffect } from 'react';
import {
  TabType,
  DocumentItem,
  FolderItem,
  UnsyncedScan,
  PhysicalNoteItem,
  Quiz,
  StudyTask,
  MockExam,
  FriendItem,
  UserProfile,
  PrivacySettings,
  CloudStorageInfo
} from './types';
import {
  initialDocuments,
  initialFolders,
  initialUnsyncedScans,
  initialPhysicalNotes,
  initialQuizzes,
  initialTasks,
  initialMockExams,
  initialFriends,
  initialProfile,
  initialPrivacy,
  initialCloudStorage
} from './data/initialData';
import { SplashScreen } from './components/SplashScreen';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { DocumentsTab } from './components/tabs/DocumentsTab';
import { PhysicalNotesTab } from './components/tabs/PhysicalNotesTab';
import { ScannerModal } from './components/tabs/ScannerModal';
import { AIFeaturesTab } from './components/tabs/AIFeaturesTab';
import { ConnectTab } from './components/tabs/ConnectTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { generateCustomQuizFromNotes } from './utils/aiService';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Theme State: 'light' (white grid paper) | 'dark' (black grid paper)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('scribesync_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // App Navigation: 'home' | 'docs' | 'physical' | 'ai' | 'connect' | 'settings'
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Core Data States
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('scribesync_docs_v2');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [folders, setFolders] = useState<FolderItem[]>(() => {
    const saved = localStorage.getItem('scribesync_folders_v2');
    return saved ? JSON.parse(saved) : initialFolders;
  });

  const [unsyncedScans, setUnsyncedScans] = useState<UnsyncedScan[]>(() => {
    const saved = localStorage.getItem('scribesync_unsynced_v2');
    return saved ? JSON.parse(saved) : initialUnsyncedScans;
  });

  const [physicalNotes, setPhysicalNotes] = useState<PhysicalNoteItem[]>(() => {
    const saved = localStorage.getItem('scribesync_physical_v2');
    return saved ? JSON.parse(saved) : initialPhysicalNotes;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('scribesync_quizzes_v2');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('scribesync_tasks_v2');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [mockExams, setMockExams] = useState<MockExam[]>(() => {
    const saved = localStorage.getItem('scribesync_exams_v2');
    return saved ? JSON.parse(saved) : initialMockExams;
  });

  const [friends, setFriends] = useState<FriendItem[]>(() => {
    const saved = localStorage.getItem('scribesync_friends_v2');
    return saved ? JSON.parse(saved) : initialFriends;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('scribesync_profile_v2');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>(initialPrivacy);
  const [storage, setStorage] = useState<CloudStorageInfo>(() => {
    const saved = localStorage.getItem('scribesync_storage_v2');
    return saved ? JSON.parse(saved) : initialCloudStorage;
  });

  // Modals & triggers
  const [inspectingDocument, setInspectingDocument] = useState<DocumentItem | null>(null);
  const [isReadOnlyInspection, setIsReadOnlyInspection] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [directQuizToPlay, setDirectQuizToPlay] = useState<Quiz | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('scribesync_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist storage & collections
  useEffect(() => {
    localStorage.setItem('scribesync_docs_v2', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('scribesync_folders_v2', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('scribesync_unsynced_v2', JSON.stringify(unsyncedScans));
  }, [unsyncedScans]);

  useEffect(() => {
    localStorage.setItem('scribesync_physical_v2', JSON.stringify(physicalNotes));
  }, [physicalNotes]);

  useEffect(() => {
    localStorage.setItem('scribesync_profile_v2', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('scribesync_friends_v2', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('scribesync_storage_v2', JSON.stringify(storage));
  }, [storage]);

  // Center Scanner Complete -> Adds to Unsync Notes and navigates to Physical
  const handleScanComplete = (newScan: UnsyncedScan) => {
    setUnsyncedScans((prev) => [newScan, ...prev]);
    setActiveTab('physical');
  };

  // Discard Scan
  const handleDiscardScan = (scanId: string) => {
    setUnsyncedScans((prev) => prev.filter((s) => s.id !== scanId));
  };

  // Accept & Sort a scanned document
  const handleAcceptAndSort = (scanId: string, folderId?: string, title?: string) => {
    const scan = unsyncedScans.find((s) => s.id === scanId);
    if (!scan) return;

    const targetFolderId = folderId || scan.suggestedFolderId;
    const targetFolder = folders.find((f) => f.id === targetFolderId) || folders[0];
    const docTitle = title || scan.title;

    // Create DocumentItem for Docs library
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: docTitle,
      folderId: targetFolder.id,
      subject: targetFolder.name,
      subjectColor: targetFolder.color,
      date: 'Today',
      updatedAt: 'Just now',
      pageCount: 1,
      wordCount: scan.snippet.split(' ').length,
      fileSize: '1.4 MB',
      isFavorite: false,
      cloudSynced: true,
      cloudProvider: 'ScribeCloud',
      aiProcessed: true,
      keyTopics: [targetFolder.name, 'Scanned Note'],
      summary: scan.snippet,
      ocrTranscribedText: `${docTitle}\n\n${scan.snippet}`,
      tags: ['#scan', `#${targetFolder.name.toLowerCase().replace(/\s+/g, '-')}`],
      source: 'camera_scan',
      imageUri: scan.imageUri
    };

    // Also add to Physical notes list
    const newPhysical: PhysicalNoteItem = {
      id: `phys-${Date.now()}`,
      title: docTitle,
      subject: targetFolder.name,
      subjectColor: targetFolder.color,
      folderId: targetFolder.id,
      description: scan.snippet,
      date: 'Today',
      handwrittenExcerpt: scan.snippet,
      ocrText: scan.snippet,
      aiSummary: `AI summary of ${docTitle}.`,
      keyConcepts: [targetFolder.name],
      pageCount: 1,
      fileSize: '1.4 MB'
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setPhysicalNotes((prev) => [newPhysical, ...prev]);
    setUnsyncedScans((prev) => prev.filter((s) => s.id !== scanId));
    setStorage((prev) => ({
      ...prev,
      usedGB: parseFloat((prev.usedGB + 0.1).toFixed(1)),
      physicalGB: parseFloat((prev.physicalGB + 0.1).toFixed(1))
    }));
  };

  // Auto Sort ALL Unsynced Scans
  const handleAutoSortAll = () => {
    const newDocs: DocumentItem[] = [];
    const newPhysicalList: PhysicalNoteItem[] = [];

    unsyncedScans.forEach((scan) => {
      const targetFolder = folders.find((f) => f.id === scan.suggestedFolderId) || folders[0];
      newDocs.push({
        id: `doc-${Date.now()}-${scan.id}`,
        title: scan.title,
        folderId: targetFolder.id,
        subject: targetFolder.name,
        subjectColor: targetFolder.color,
        date: 'Today',
        updatedAt: 'Just now',
        pageCount: 1,
        wordCount: scan.snippet.split(' ').length,
        fileSize: '1.4 MB',
        isFavorite: false,
        cloudSynced: true,
        cloudProvider: 'ScribeCloud',
        aiProcessed: true,
        keyTopics: [targetFolder.name, 'Auto-Sorted'],
        summary: scan.snippet,
        ocrTranscribedText: `${scan.title}\n\n${scan.snippet}`,
        tags: ['#auto-sort', `#${targetFolder.name.toLowerCase().replace(/\s+/g, '-')}`],
        source: 'camera_scan'
      });

      newPhysicalList.push({
        id: `phys-${Date.now()}-${scan.id}`,
        title: scan.title,
        subject: targetFolder.name,
        subjectColor: targetFolder.color,
        folderId: targetFolder.id,
        description: scan.snippet,
        date: 'Today',
        handwrittenExcerpt: scan.snippet,
        ocrText: scan.snippet,
        aiSummary: `AI summary of ${scan.title}.`,
        keyConcepts: [targetFolder.name],
        pageCount: 1,
        fileSize: '1.4 MB'
      });
    });

    setDocuments((prev) => [...newDocs, ...prev]);
    setPhysicalNotes((prev) => [...newPhysicalList, ...prev]);
    setUnsyncedScans([]);
    setStorage((prev) => ({
      ...prev,
      usedGB: parseFloat((prev.usedGB + 0.2).toFixed(1)),
      physicalGB: parseFloat((prev.physicalGB + 0.2).toFixed(1))
    }));
  };

  // Open Physical Note item into full 3-tab inspector
  const handleOpenPhysicalNote = (note: PhysicalNoteItem) => {
    const docFormat: DocumentItem = {
      id: note.id,
      title: note.title,
      folderId: note.folderId,
      subject: note.subject,
      subjectColor: note.subjectColor,
      date: note.date,
      updatedAt: 'Recently',
      pageCount: note.pageCount,
      wordCount: note.ocrText.split(' ').length,
      fileSize: note.fileSize,
      isFavorite: false,
      cloudSynced: true,
      cloudProvider: 'ScribeCloud',
      aiProcessed: true,
      keyTopics: note.keyConcepts,
      summary: note.aiSummary,
      ocrTranscribedText: note.ocrText,
      tags: ['#physical-note'],
      source: 'camera_scan'
    };
    setIsReadOnlyInspection(false);
    setInspectingDocument(docFormat);
  };

  // Trigger AI Quiz directly from recent doc card
  const handleTriggerAIQuizFromHome = (doc: DocumentItem) => {
    let targetQuiz = quizzes.find((q) => q.targetNoteIds.includes(doc.id));
    if (!targetQuiz) {
      targetQuiz = generateCustomQuizFromNotes([doc], 4);
      setQuizzes((prev) => [targetQuiz!, ...prev]);
    }
    setDirectQuizToPlay(targetQuiz);
    setActiveTab('ai');
  };

  // Add friend
  const handleAddFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, isAdded: true } : f))
    );
  };

  // Open friend note read-only
  const handleOpenNoteReadOnly = (doc: DocumentItem) => {
    setIsReadOnlyInspection(true);
    setInspectingDocument(doc);
  };

  // Open in folder from modal
  const handleOpenInFolder = (folderId: string) => {
    setInspectingDocument(null);
    setSelectedFolderId(folderId);
    setActiveTab('docs');
  };

  // Folder Operations
  const handleCreateFolder = (name: string, subjectCode: string, color: string) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      subjectCode,
      color,
      iconName: 'Folder',
      itemCount: 0,
      lastUpdated: 'Just now',
      description: `Course notes for ${name}`
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleDeleteFolder = (folderId: string) => {
    const remaining = folders.filter((f) => f.id !== folderId);
    if (remaining.length === 0) return;
    const fallbackFolderId = remaining[0].id;
    // Reassign documents from deleted folder to fallback folder
    setDocuments((prev) =>
      prev.map((d) => (d.folderId === folderId ? { ...d, folderId: fallbackFolderId, subject: remaining[0].name } : d))
    );
    setPhysicalNotes((prev) =>
      prev.map((p) => (p.folderId === folderId ? { ...p, folderId: fallbackFolderId, subject: remaining[0].name } : p))
    );
    setFolders(remaining);
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name: newName } : f))
    );
    setDocuments((prev) =>
      prev.map((d) => (d.folderId === folderId ? { ...d, subject: newName } : d))
    );
    setPhysicalNotes((prev) =>
      prev.map((p) => (p.folderId === folderId ? { ...p, subject: newName } : p))
    );
  };

  // Document Operations
  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    setStorage((prev) => ({
      ...prev,
      usedGB: Math.max(0.1, parseFloat((prev.usedGB - 0.1).toFixed(1))),
      digitalGB: Math.max(0.1, parseFloat((prev.digitalGB - 0.1).toFixed(1)))
    }));
  };

  const handleRenameDocument = (docId: string, newTitle: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, title: newTitle } : d))
    );
  };

  const handleMoveDocument = (docId: string, targetFolderId: string) => {
    const targetFolder = folders.find((f) => f.id === targetFolderId);
    if (!targetFolder) return;
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, folderId: targetFolder.id, subject: targetFolder.name, subjectColor: targetFolder.color }
          : d
      )
    );
  };

  // Physical Note Operations
  const handleDeletePhysicalNote = (noteId: string) => {
    setPhysicalNotes((prev) => prev.filter((p) => p.id !== noteId));
    setStorage((prev) => ({
      ...prev,
      usedGB: Math.max(0.1, parseFloat((prev.usedGB - 0.1).toFixed(1))),
      physicalGB: Math.max(0.1, parseFloat((prev.physicalGB - 0.1).toFixed(1)))
    }));
  };

  const handleRenamePhysicalNote = (noteId: string, newTitle: string) => {
    setPhysicalNotes((prev) =>
      prev.map((p) => (p.id === noteId ? { ...p, title: newTitle } : p))
    );
  };

  const handleMovePhysicalNote = (noteId: string, targetFolderId: string) => {
    const targetFolder = folders.find((f) => f.id === targetFolderId);
    if (!targetFolder) return;
    setPhysicalNotes((prev) =>
      prev.map((p) =>
        p.id === noteId
          ? { ...p, folderId: targetFolder.id, subject: targetFolder.name, subjectColor: targetFolder.color }
          : p
      )
    );
  };

  // Optimize Storage
  const handleOptimizeStorage = () => {
    setStorage((prev) => ({
      ...prev,
      usedGB: Math.max(0.2, parseFloat((prev.usedGB - 0.4).toFixed(1))),
      physicalGB: Math.max(0.1, parseFloat((prev.physicalGB - 0.2).toFixed(1))),
      digitalGB: Math.max(0.1, parseFloat((prev.digitalGB - 0.2).toFixed(1)))
    }));
  };

  // If Intro Loading Screen is active, show the 7s animation
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const bgPaperClass = theme === 'dark' ? 'bg-graph-paper-dark' : 'bg-graph-paper';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-200/90 text-slate-900'} flex flex-col items-center justify-start select-none transition-colors duration-200`}>
      {/* Top Device Viewport Switcher */}
      <header className={`w-full max-w-lg mx-auto py-1 px-4 flex items-center justify-between text-[11px] ${theme === 'dark' ? 'bg-slate-900/90 text-slate-300 border-slate-800' : 'bg-white/80 text-slate-700 border-slate-300'} backdrop-blur-md border-b sticky top-0 z-30`}>
        <div className="flex items-center space-x-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ScribeSync Mobile</span>
          <span className="text-[10px] font-mono text-slate-500 font-normal">
            ({theme === 'dark' ? 'Black Grid' : 'White Grid'})
          </span>
        </div>

        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] border cursor-pointer transition-colors ${
            theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
        >
          {isPhoneFrame ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
          <span>{isPhoneFrame ? 'Full Width' : 'Phone Frame'}</span>
        </button>
      </header>

      {/* Main Mobile App Container with Graph Paper Background */}
      <main
        className={`w-full transition-all duration-300 relative flex flex-col ${bgPaperClass} ${
          isPhoneFrame
            ? `max-w-md min-h-[92vh] my-2 rounded-3xl border-2 ${theme === 'dark' ? 'border-slate-800 shadow-slate-900/80' : 'border-slate-800/80 shadow-2xl'} overflow-hidden`
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Dynamic Tab Views */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeTab
              documents={documents}
              folders={folders}
              onSelectDocument={(doc) => {
                setIsReadOnlyInspection(false);
                setInspectingDocument(doc);
              }}
              onSelectFolder={(fId) => {
                setSelectedFolderId(fId);
                setActiveTab('docs');
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onTriggerAIQuiz={handleTriggerAIQuizFromHome}
              onDeleteDocument={handleDeleteDocument}
              onRenameDocument={handleRenameDocument}
              onMoveDocument={handleMoveDocument}
              onDeleteFolder={handleDeleteFolder}
              onRenameFolder={handleRenameFolder}
              onTriggerScanForFolder={(fId) => {
                setSelectedFolderId(fId);
                setIsScannerOpen(true);
              }}
            />
          )}

          {activeTab === 'docs' && (
            <DocumentsTab
              documents={documents}
              folders={folders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={(fId) => setSelectedFolderId(fId)}
              onSelectDocument={(doc) => {
                setIsReadOnlyInspection(false);
                setInspectingDocument(doc);
              }}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              onRenameFolder={handleRenameFolder}
              onDeleteDocument={handleDeleteDocument}
              onRenameDocument={handleRenameDocument}
              onMoveDocument={handleMoveDocument}
              onTriggerScanForFolder={(fId) => {
                setSelectedFolderId(fId);
                setIsScannerOpen(true);
              }}
            />
          )}

          {activeTab === 'physical' && (
            <PhysicalNotesTab
              unsyncedScans={unsyncedScans}
              physicalNotes={physicalNotes}
              folders={folders}
              onDiscardScan={handleDiscardScan}
              onAcceptAndSort={handleAcceptAndSort}
              onAutoSortAll={handleAutoSortAll}
              onOpenPhysicalNote={handleOpenPhysicalNote}
              onDeletePhysicalNote={handleDeletePhysicalNote}
              onRenamePhysicalNote={handleRenamePhysicalNote}
              onMovePhysicalNote={handleMovePhysicalNote}
              onOpenInDocsFolder={handleOpenInFolder}
            />
          )}

          {activeTab === 'ai' && (
            <AIFeaturesTab
              documents={documents}
              quizzes={quizzes}
              tasks={tasks}
              mockExams={mockExams}
              activeQuizDirectly={directQuizToPlay}
              onClearDirectQuiz={() => setDirectQuizToPlay(null)}
              onAddQuiz={(quiz) => setQuizzes((prev) => [quiz, ...prev])}
              onAddTask={(task) => setTasks((prev) => [task, ...prev])}
              onAddExam={(exam) => setMockExams((prev) => [exam, ...prev])}
              onToggleTask={(tId) =>
                setTasks((prev) =>
                  prev.map((t) => (t.id === tId ? { ...t, completed: !t.completed } : t))
                )
              }
            />
          )}

          {activeTab === 'connect' && (
            <ConnectTab
              friends={friends}
              userNotes={documents}
              onAddFriend={handleAddFriend}
              onOpenNoteReadOnly={handleOpenNoteReadOnly}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              profile={profile}
              privacy={privacy}
              storage={storage}
              documents={documents}
              folders={folders}
              physicalNotes={physicalNotes}
              unsyncedScans={unsyncedScans}
              theme={theme}
              onToggleTheme={(newTheme) => setTheme(newTheme)}
              onUpdateProfile={(updated) => setProfile(updated)}
              onUpdatePrivacy={(updated) => setPrivacy(updated)}
              onDeleteDocument={handleDeleteDocument}
              onDeletePhysicalNote={handleDeletePhysicalNote}
              onDeleteUnsyncedScan={handleDiscardScan}
              onDeleteFolder={handleDeleteFolder}
              onOptimizeStorage={handleOptimizeStorage}
              onReplaySplash={() => setShowSplash(true)}
            />
          )}
        </div>

        {/* 7-Tab Bottom Navigation Bar matching PDF */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'docs') setSelectedFolderId(null);
          }}
          onTriggerScan={() => setIsScannerOpen(true)}
          unsyncedCount={unsyncedScans.length}
        />
      </main>

      {/* Center Scan Trigger Modal (Capture Now + Import from Gallery with Crop) */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* Full 3-Tab Document Inspector Modal */}
      <DocumentViewerModal
        document={inspectingDocument}
        onClose={() => setInspectingDocument(null)}
        onToggleFavorite={(id) =>
          setDocuments((prev) =>
            prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
          )
        }
        onGenerateQuizFromNote={(doc) => {
          setInspectingDocument(null);
          handleTriggerAIQuizFromHome(doc);
        }}
        onOpenInFolder={handleOpenInFolder}
        isReadOnly={isReadOnlyInspection}
      />
    </div>
  );
}
