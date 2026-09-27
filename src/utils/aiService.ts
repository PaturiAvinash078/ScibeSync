import { DocumentItem, Quiz, StudyTask, MockExam } from '../types';

/**
 * Intelligent helper for ScribeSync AI Features:
 * - Generates custom quizzes from selected notes
 * - Generates study action items & tasks from notes
 * - Generates mock exams
 * - Predicts folder categorization for raw physical handwritten strokes
 */

export function autoClassifyHandwrittenText(snippet: string, availableFolders: { id: string; name: string; subjectCode: string }[]): {
  folderId: string;
  folderName: string;
  confidence: number;
} {
  const lower = snippet.toLowerCase();
  
  if (lower.includes('integral') || lower.includes('curl') || lower.includes('stokes') || lower.includes('vector') || lower.includes('derivative') || lower.includes('theorem')) {
    const calc = availableFolders.find(f => f.name.toLowerCase().includes('calc') || f.subjectCode.includes('MATH'));
    if (calc) return { folderId: calc.id, folderName: calc.name, confidence: 0.98 };
  }

  if (lower.includes('benzene') || lower.includes('sn1') || lower.includes('sn2') || lower.includes('carbocation') || lower.includes('electrophil') || lower.includes('reaction')) {
    const chem = availableFolders.find(f => f.name.toLowerCase().includes('chem'));
    if (chem) return { folderId: chem.id, folderName: chem.name, confidence: 0.96 };
  }

  if (lower.includes('tree') || lower.includes('heap') || lower.includes('dijkstra') || lower.includes('algorithm') || lower.includes('graph') || lower.includes('complexity')) {
    const cs = availableFolders.find(f => f.name.toLowerCase().includes('data') || f.subjectCode.includes('CS'));
    if (cs) return { folderId: cs.id, folderName: cs.name, confidence: 0.97 };
  }

  if (lower.includes('schrödinger') || lower.includes('wave') || lower.includes('quantum') || lower.includes('energy') || lower.includes('potential')) {
    const phys = availableFolders.find(f => f.name.toLowerCase().includes('phys'));
    if (phys) return { folderId: phys.id, folderName: phys.name, confidence: 0.95 };
  }

  if (lower.includes('market') || lower.includes('cournot') || lower.includes('equilibrium') || lower.includes('nash') || lower.includes('profit')) {
    const econ = availableFolders.find(f => f.name.toLowerCase().includes('econ'));
    if (econ) return { folderId: econ.id, folderName: econ.name, confidence: 0.94 };
  }

  // Fallback to first folder
  return {
    folderId: availableFolders[0]?.id || 'folder-calc',
    folderName: availableFolders[0]?.name || 'General Notes',
    confidence: 0.82
  };
}

export function generateCustomQuizFromNotes(selectedNotes: DocumentItem[], questionCount: number = 4): Quiz {
  const primaryNote = selectedNotes[0];
  const combinedTopics = selectedNotes.flatMap(n => n.keyTopics).slice(0, 5);

  const questionsPool = [
    {
      id: `gen-q-${Date.now()}-1`,
      question: `Based on your handwritten notes in "${primaryNote?.title || 'Selected Notes'}", what is the primary operational condition or formula highlighted?`,
      options: [
        `Verification that all partial derivatives or boundary conditions remain continuous and bounded`,
        `Application of unrestricted exponential growth without asymptotic limits`,
        `Assuming discrete binary states with uniform probabilistic distribution`,
        `Zero friction and infinite conductance approximation`
      ],
      correctAnswerIndex: 0,
      explanation: `As recorded in your notes, verifying continuous conditions is crucial before applying the main theorem/methodology.`,
      sourceNoteTitle: primaryNote?.title || 'Notes',
      difficulty: 'medium' as const
    },
    {
      id: `gen-q-${Date.now()}-2`,
      question: `Which key topic appeared most frequently across your selected notes: [${combinedTopics.slice(0, 3).join(', ')}]?`,
      options: [
        `${combinedTopics[0] || 'Core Foundation'}`,
        `Empirical regression modeling without mechanistic proof`,
        `Random walk walk-through in finite Markov spaces`,
        `Legacy procedural architecture`
      ],
      correctAnswerIndex: 0,
      explanation: `${combinedTopics[0] || 'This concept'} is flagged as high-yield in your ScribePad summary.`,
      sourceNoteTitle: primaryNote?.title || 'Notes',
      difficulty: 'easy' as const
    },
    {
      id: `gen-q-${Date.now()}-3`,
      question: `In an exam setting, what is the most common pitfall when solving problems related to ${primaryNote?.subject || 'this subject'}?`,
      options: [
        `Neglecting orientation signs or boundary orientations in coordinate transformations`,
        `Using standard SI units instead of imperial units`,
        `Calculating arithmetic too quickly with floating point roundoffs`,
        `Applying logarithmic scales unnecessarily`
      ],
      correctAnswerIndex: 0,
      explanation: `Orientation errors and coordinate mismatch account for over 45% of lost marks on this topic according to ScribeSync analytics.`,
      sourceNoteTitle: primaryNote?.title || 'Notes',
      difficulty: 'hard' as const
    },
    {
      id: `gen-q-${Date.now()}-4`,
      question: `What secondary insight was synthesized in the AI summary for "${primaryNote?.title}"?`,
      options: [
        primaryNote ? primaryNote.summary.slice(0, 80) + '...' : 'Fundamental equilibrium between constraints and targets',
        'Arbitrary parameter tuning without objective validation',
        'Pure memorization with zero conceptual intuition',
        'Disregarding all boundary limits'
      ],
      correctAnswerIndex: 0,
      explanation: `This aligns with your ScribePad digitized lecture summary.`,
      sourceNoteTitle: primaryNote?.title || 'Notes',
      difficulty: 'medium' as const
    }
  ];

  return {
    id: `quiz-gen-${Date.now()}`,
    title: `AI Review: ${selectedNotes.map(n => n.title.slice(0, 18)).join(' & ')}`,
    subject: primaryNote?.subject || 'Multi-Subject Review',
    targetNoteIds: selectedNotes.map(n => n.id),
    questionsCount: Math.min(questionCount, questionsPool.length),
    questions: questionsPool.slice(0, questionCount),
    estimatedMinutes: Math.round(questionCount * 1.5)
  };
}

export function generateTasksFromNotes(selectedNotes: DocumentItem[]): StudyTask[] {
  const tasks: StudyTask[] = [];

  selectedNotes.forEach((note, idx) => {
    tasks.push({
      id: `task-gen-${Date.now()}-${idx}-1`,
      title: `Practice 2 exam problems on ${note.keyTopics[0] || note.title}`,
      subject: note.subject,
      noteId: note.id,
      dueDate: idx === 0 ? 'Tomorrow' : 'In 3 days',
      completed: false,
      priority: idx === 0 ? 'high' : 'medium',
      type: 'practice_problem'
    });

    if (note.keyTopics[1]) {
      tasks.push({
        id: `task-gen-${Date.now()}-${idx}-2`,
        title: `Write a 1-page condensed formula reference sheet for ${note.keyTopics[1]}`,
        subject: note.subject,
        noteId: note.id,
        dueDate: 'Next Monday',
        completed: false,
        priority: 'medium',
        type: 'review_formula'
      });
    }
  });

  return tasks;
}

export function generateMockExamFromNotes(selectedNotes: DocumentItem[], title?: string): MockExam {
  const subjects = Array.from(new Set(selectedNotes.map(n => n.subject)));
  const examTitle = title || `AI Exam Simulation: ${subjects.join(' + ')}`;

  return {
    id: `exam-gen-${Date.now()}`,
    title: examTitle,
    subjects: subjects,
    targetNoteIds: selectedNotes.map(n => n.id),
    durationMinutes: 45,
    totalMarks: 50,
    sections: [
      {
        name: 'Part 1: Foundational Diagnostic & Short Answer',
        description: 'Verify conceptual mastery from digitized handwritten notes.',
        questions: selectedNotes.slice(0, 2).map((note, qIdx) => ({
          id: `ex-q-${qIdx}`,
          prompt: `From your notes on "${note.title}": Detail the primary theorem or equation and state the required assumptions for validity.`,
          marks: 15,
          type: 'free_response',
          sampleAnswer: `According to your transcribed notes: "${note.summary}" The core relation must satisfy non-degeneracy and proper domain continuity.`,
          keyConcepts: note.keyTopics.slice(0, 3)
        }))
      },
      {
        name: 'Part 2: Analytical Application & Synthesis',
        description: 'Synthesize formulas across your selected course folders.',
        questions: [
          {
            id: `ex-q-final`,
            prompt: `Propose an end-to-end derivation or algorithmic proof incorporating elements from: ${selectedNotes.map(n => n.title).join(', ')}.`,
            marks: 20,
            type: 'free_response',
            sampleAnswer: `A comprehensive answer requires connecting the theoretical framework with practical step-by-step problem solving.`,
            keyConcepts: selectedNotes.flatMap(n => n.keyTopics).slice(0, 4)
          }
        ]
      }
    ]
  };
}
