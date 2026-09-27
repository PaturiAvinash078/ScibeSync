export type TabType = 'home' | 'docs' | 'physical' | 'ai' | 'connect' | 'settings';

export interface DocumentItem {
  id: string;
  title: string;
  folderId: string;
  subject: string;
  subjectColor: string;
  date: string;
  updatedAt: string;
  pageCount: number;
  wordCount: number;
  fileSize: string;
  isFavorite: boolean;
  cloudSynced: boolean;
  cloudProvider: 'ScribeCloud' | 'GoogleDrive' | 'OneDrive';
  aiProcessed: boolean;
  keyTopics: string[];
  summary: string;
  ocrTranscribedText: string;
  handwrittenPreviewText?: string;
  tags: string[];
  source: 'camera_scan' | 'gallery_upload';
  imageUri?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  subjectCode: string;
  color: string;
  iconName: string;
  itemCount: number;
  lastUpdated: string;
  description: string;
}

export interface UnsyncedScan {
  id: string;
  title: string;
  scannedAt: string;
  suggestedFolderId: string;
  suggestedSubject: string;
  confidenceScore: number;
  snippet: string;
  imageUri?: string;
  handwrittenPreview?: string;
}

export interface PhysicalNoteItem {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  folderId: string;
  description: string;
  date: string;
  handwrittenExcerpt: string;
  ocrText: string;
  aiSummary: string;
  keyConcepts: string[];
  pageCount: number;
  fileSize: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceNoteTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  targetNoteIds: string[];
  questionsCount: number;
  questions: QuizQuestion[];
  estimatedMinutes: number;
  lastScore?: number;
  completedAt?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  noteId: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  type: 'review_formula' | 'practice_problem' | 'summarize_chapter' | 'diagram_redraw';
}

export interface MockExam {
  id: string;
  title: string;
  subjects: string[];
  targetNoteIds: string[];
  durationMinutes: number;
  totalMarks: number;
  sections: {
    name: string;
    description: string;
    questions: {
      id: string;
      prompt: string;
      marks: number;
      type: 'multiple_choice' | 'free_response';
      options?: string[];
      sampleAnswer: string;
      keyConcepts: string[];
    }[];
  }[];
}

export interface FriendItem {
  id: string;
  name: string;
  college: string;
  major: string;
  avatarUrl: string;
  isAdded: boolean;
  mutualFriendsCount: number;
  sharedNotesCount: number;
  notes: DocumentItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'friend';
  text: string;
  time: string;
  sharedDoc?: {
    id: string;
    title: string;
    subject: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  college: string;
  major: string;
  avatarUrl: string;
  studentId: string;
}

export interface PrivacySettings {
  biometricLock: boolean;
  endToEndEncryption: boolean;
}

export interface CloudStorageInfo {
  usedGB: number;
  totalGB: number;
  physicalGB: number;
  digitalGB: number;
}
