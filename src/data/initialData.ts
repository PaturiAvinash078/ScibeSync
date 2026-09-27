import { DocumentItem, FolderItem, UnsyncedScan, PhysicalNoteItem, Quiz, StudyTask, MockExam, FriendItem, UserProfile, PrivacySettings, CloudStorageInfo } from '../types';

export const initialFolders: FolderItem[] = [
  {
    id: 'folder-ds',
    name: 'Data Structures',
    subjectCode: 'CS 201',
    color: '#ea5b5b', // Coral/Red from Page 3
    iconName: 'Layers',
    itemCount: 12,
    lastUpdated: 'Sep 15',
    description: 'Arrays, Trees, Graphs, Sorting & Dynamic Programming'
  },
  {
    id: 'folder-math',
    name: 'Engineering Mathematics',
    subjectCode: 'MATH 210',
    color: '#3aa6c8', // Cyan from Page 3
    iconName: 'Sigma',
    itemCount: 8,
    lastUpdated: 'Sep 08',
    description: 'Vector Calculus, Green’s Theorem, Stokes & Differential Equations'
  },
  {
    id: 'folder-dbms',
    name: 'DBMS',
    subjectCode: 'CS 302',
    color: '#36b37e', // Green from Page 3
    iconName: 'Database',
    itemCount: 7,
    lastUpdated: 'Sep 12',
    description: 'Relational algebra, SQL, Normalization & ACID properties'
  },
  {
    id: 'folder-cn',
    name: 'Computer Networks',
    subjectCode: 'CS 304',
    color: '#ea7a38', // Orange from Page 3
    iconName: 'Network',
    itemCount: 18,
    lastUpdated: 'Sep 10',
    description: 'OSI Reference Model, TCP/IP, Routing & Subnetting'
  },
  {
    id: 'folder-java',
    name: 'Java',
    subjectCode: 'CS 205',
    color: '#8755d9', // Purple from Page 3
    iconName: 'Coffee',
    itemCount: 12,
    lastUpdated: 'Sep 04',
    description: 'OOP, Polymorphism, Collections, Threads & Exceptions'
  },
  {
    id: 'folder-compiler',
    name: 'Compiler design',
    subjectCode: 'CS 401',
    color: '#d9369b', // Magenta/Pink from Page 3
    iconName: 'Cpu',
    itemCount: 3,
    lastUpdated: 'Aug 29',
    description: 'Lexical analysis, Parsers, AST & Code Generation'
  },
  {
    id: 'folder-os',
    name: 'Operating Systems',
    subjectCode: 'CS 301',
    color: '#4355a4', // Dark Blue/Indigo from Page 3
    iconName: 'Terminal',
    itemCount: 4,
    lastUpdated: 'Sep 02',
    description: 'Process scheduling, Deadlocks, Memory paging & Virtual memory'
  }
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-greens',
    title: 'Greens theorem',
    folderId: 'folder-math',
    subject: 'Engineering Mathematics',
    subjectColor: '#3aa6c8',
    date: 'Sep 08',
    updatedAt: 'Sep 08, 10:45 AM',
    pageCount: 3,
    wordCount: 840,
    fileSize: '8.4 MB',
    isFavorite: true,
    cloudSynced: true,
    cloudProvider: 'ScribeCloud',
    aiProcessed: true,
    keyTopics: ["Line Integrals", "Circulation Form", "Flux across Boundary", "Curl Field"],
    summary: "Lecture notes covering the conversion between line integrals over closed curves C and double integrals over planar regions D using ∂Q/∂x - ∂P/∂y.",
    ocrTranscribedText: `Theorem (Green's Theorem):
Let C be a positively oriented, piecewise-smooth, simple closed curve in the xy-plane and let D be the region bounded by C. If P and Q have continuous partial derivatives on an open region containing D, then:

∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA

Example: Calculate ∮_C (y³ dx - x³ dy) where C is the circle x² + y² = 4 oriented counter-clockwise.
P(x, y) = y³, Q(x, y) = -x³
∂Q/∂x = -3x², ∂P/∂y = 3y²
∂Q/∂x - ∂P/∂y = -3(x² + y²)
In polar coordinates: ∫[0 to 2π] ∫[0 to 2] (-3r²) r dr dθ = -24π.`,
    tags: ['#math', '#calculus', '#theorems'],
    source: 'camera_scan'
  },
  {
    id: 'doc-avl',
    title: 'AVL Trees',
    folderId: 'folder-ds',
    subject: 'Data Structures',
    subjectColor: '#ea5b5b',
    date: 'Sep 15',
    updatedAt: 'Sep 15, 2:30 PM',
    pageCount: 4,
    wordCount: 1120,
    fileSize: '1.2 MB',
    isFavorite: true,
    cloudSynced: true,
    cloudProvider: 'ScribeCloud',
    aiProcessed: true,
    keyTopics: ['Balance Factor (BF)', 'Single Left Rotation (LL)', 'Right-Left Rotation (RL)', 'O(log n) Lookup'],
    summary: 'Self-balancing binary search tree where height difference between left and right subtrees is at most 1 for all nodes.',
    ocrTranscribedText: `AVL Tree Definition:
A self-balancing Binary Search Tree where the Balance Factor (BF) for any node v is:
BF(v) = height(left_subtree) - height(right_subtree) ∈ {-1, 0, +1}

Rotations when |BF| > 1:
1. Left-Left (LL): Single Right Rotation at node A.
2. Right-Right (RR): Single Left Rotation at node A.
3. Left-Right (LR): Left rotation at left child, then Right rotation at A.
4. Right-Left (RL): Right rotation at right child, then Left rotation at A.
Lookup, Insertion, and Deletion are all guaranteed O(log n) worst-case.`,
    tags: ['#trees', '#algorithms', '#balanced'],
    source: 'camera_scan'
  },
  {
    id: 'doc-dbms',
    title: 'Relational Algebra & Normalization',
    folderId: 'folder-dbms',
    subject: 'DBMS',
    subjectColor: '#36b37e',
    date: 'Sep 12',
    updatedAt: 'Sep 12, 11:20 AM',
    pageCount: 2,
    wordCount: 750,
    fileSize: '4.1 MB',
    isFavorite: false,
    cloudSynced: true,
    cloudProvider: 'ScribeCloud',
    aiProcessed: true,
    keyTopics: ['Functional Dependencies', '1NF, 2NF, 3NF', 'Boyce-Codd (BCNF)', 'Lossless Decomposition'],
    summary: 'Rules for decomposing relation schemas to eliminate redundancy and update anomalies while preserving dependencies.',
    ocrTranscribedText: `Normalization Normal Forms:
- 1NF: Atomic values only, no multi-valued or composite attributes.
- 2NF: In 1NF and no non-prime attribute is partially dependent on any candidate key.
- 3NF: In 2NF and no transitive functional dependencies (X → Y where X is not a superkey).
- BCNF: For every non-trivial FD X → Y, X must be a superkey.`,
    tags: ['#dbms', '#normalization', '#keys'],
    source: 'camera_scan'
  },
  {
    id: 'doc-cn',
    title: 'OSI 7 Layer Reference Model',
    folderId: 'folder-cn',
    subject: 'Computer Networks',
    subjectColor: '#ea7a38',
    date: 'Sep 10',
    updatedAt: 'Sep 10, 4:00 PM',
    pageCount: 3,
    wordCount: 890,
    fileSize: '6.2 MB',
    isFavorite: false,
    cloudSynced: true,
    cloudProvider: 'ScribeCloud',
    aiProcessed: true,
    keyTopics: ['Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'],
    summary: 'Conceptual model standardizing telecommunication functions across 7 distinct abstract layers.',
    ocrTranscribedText: `7 Layers of the OSI Model:
7. Application: User-interface protocols (HTTP, DNS, FTP, SMTP)
6. Presentation: Encryption, compression, data translation (SSL/TLS)
5. Session: Connection management, synchronization (RPC, NetBIOS)
4. Transport: End-to-end delivery, flow control, segmentation (TCP, UDP)
3. Network: Logical addressing and routing (IP, ICMP, OSPF)
2. Data Link: Physical addressing and framing (Ethernet MAC, PPP)
1. Physical: Raw bit transmission over physical media (Cables, Fiber, RF)`,
    tags: ['#networks', '#osi', '#protocols'],
    source: 'gallery_upload'
  },
  {
    id: 'doc-java',
    title: 'Java Polymorphism & Interfaces',
    folderId: 'folder-java',
    subject: 'Java',
    subjectColor: '#8755d9',
    date: 'Sep 04',
    updatedAt: 'Sep 04, 3:15 PM',
    pageCount: 2,
    wordCount: 680,
    fileSize: '3.8 MB',
    isFavorite: false,
    cloudSynced: true,
    cloudProvider: 'ScribeCloud',
    aiProcessed: true,
    keyTopics: ['Method Overriding', 'Dynamic Method Dispatch', 'Default Interface Methods', 'Abstract Base Classes'],
    summary: 'Runtime polymorphism through inheritance hierarchies and multiple interface contracts in Java 17+.',
    ocrTranscribedText: `Polymorphism in Java:
- Compile-time: Method Overloading (same method name, different parameter signature).
- Runtime: Method Overriding (subclass provides specific implementation of parent method).
Resolved at runtime using virtual method tables (vtable).`,
    tags: ['#java', '#oop', '#polymorphism'],
    source: 'camera_scan'
  }
];

export const initialUnsyncedScans: UnsyncedScan[] = [
  {
    id: 'scan-greedy',
    title: 'Greedy method',
    scannedAt: 'Just now (10:42 AM)',
    suggestedFolderId: 'folder-ds',
    suggestedSubject: 'Data Structures',
    confidenceScore: 0.98,
    snippet: 'Greedy choice property: an optimal global solution can be reached by making a locally optimal choice at each stage. Examples: Fractional Knapsack, Huffman Coding, Kruskal Algorithm...',
    handwrittenPreview: 'M 20 40 Q 80 20 180 40 T 300 45 M 30 80 L 150 80'
  },
  {
    id: 'scan-dp',
    title: 'Dynamic Programming',
    scannedAt: 'Today, 8:15 AM',
    suggestedFolderId: 'folder-ds',
    suggestedSubject: 'Data Structures',
    confidenceScore: 0.96,
    snippet: 'Principle of Optimality: Bellman equation. Overlapping subproblems and optimal substructure. Memoization (Top-down) vs Tabulation (Bottom-up). Longest Common Subsequence LCS[i][j]...',
    handwrittenPreview: 'M 25 50 Q 90 30 190 55 T 280 40 M 40 90 L 220 90'
  }
];

export const initialPhysicalNotes: PhysicalNoteItem[] = [
  {
    id: 'phys-oops',
    title: 'Introduction to oops',
    subject: 'Java',
    subjectColor: '#8755d9', // Purple
    folderId: 'folder-java',
    description: "Object-Oriented Programming (OOP) is a programming model that organizes software design around data, or 'objects,' rather than functions and logic.",
    date: 'Sep 24',
    handwrittenExcerpt: "OOP Core Pillars: Encapsulation, Abstraction, Inheritance, and Polymorphism. Objects encapsulate state (fields) and behavior (methods).",
    ocrText: `Object-Oriented Programming (OOP) is a programming model that organizes software design around data, or "objects," rather than functions and logic.

Four Pillars of OOP:
1. Encapsulation: Binding data with code that manipulates it (private fields with public getters/setters).
2. Abstraction: Hiding internal complexity and showing only essential features (abstract classes and interfaces).
3. Inheritance: Mechanism where one object acquires all properties and behaviors of a parent object.
4. Polymorphism: Ability of an object to take on many forms (overriding and overloading).`,
    aiSummary: "Foundational notes on OOP paradigms, modular architecture, and class-object relationships.",
    keyConcepts: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'],
    pageCount: 3,
    fileSize: '3.2 MB'
  },
  {
    id: 'phys-lists',
    title: 'Lists',
    subject: 'Data Structures',
    subjectColor: '#3aa6c8', // Cyan/Blue
    folderId: 'folder-ds',
    description: "In Python, a list is a built-in, ordered collection of items enclosed in square brackets [] that can hold duplicate values and multiple data types simultaneously. [1, 2, 3]",
    date: 'Sep 21',
    handwrittenExcerpt: "Lists are dynamic arrays. Appending is amortized O(1), indexing is O(1), while arbitrary insertion and deletion requires O(n) shifting.",
    ocrText: `In Python, a list is a built-in, ordered collection of items enclosed in square brackets [] that can hold duplicate values and multiple data types simultaneously. [1, 2, 3]

Key Operations & Time Complexities:
- Access by index: O(1)
- Append element to end: O(1) amortized
- Insert/Delete at arbitrary index: O(n) due to element shifting
- Slicing [start:end]: O(k) where k is slice length
- Memory: Contiguous array of object pointers with dynamic over-allocation doubling strategy.`,
    aiSummary: "Detailed breakdown of contiguous list memory buffers, amortized complexity, and list comprehensions.",
    keyConcepts: ['Dynamic Arrays', 'Amortized O(1)', 'Slicing', 'Memory Contiguity'],
    pageCount: 2,
    fileSize: '2.1 MB'
  },
  {
    id: 'phys-kmaps',
    title: 'K-maps',
    subject: 'Engineering Mathematics',
    subjectColor: '#d9369b', // Pink
    folderId: 'folder-math',
    description: "A Karnaugh Map (K-map) is a visual tool used in Digital Logic and Computer Organization (DLCO) to simplify Boolean algebra expressions without using complex mathematical theorems",
    date: 'Sep 19',
    handwrittenExcerpt: "Gray code ordering: 00, 01, 11, 10. Only 1 bit flips between adjacent cells. Grouping powers of 2 (1, 2, 4, 8, 16) eliminates variables.",
    ocrText: `A Karnaugh Map (K-map) is a visual tool used in Digital Logic and Computer Organization (DLCO) to simplify Boolean algebra expressions without using complex mathematical theorems.

Rules for Simplification:
1. Cells are arranged in Gray Code sequence (adjacent cells differ by strictly 1 bit).
2. Group adjacent 1s in sizes of powers of two (2^k: 1, 2, 4, 8, 16).
3. Groups can wrap around edges and corners (toroidal topology).
4. Each group must be as large as possible to eliminate redundant literals.
5. Every 1 must be covered in at least one group.`,
    aiSummary: "Visual simplification of Sum-of-Products (SOP) and Product-of-Sums (POS) boolean expressions using Gray Code matrices.",
    keyConcepts: ['Gray Code Sequence', 'Power-of-2 Grouping', 'Toroidal Wrap', 'Essential Prime Implicants'],
    pageCount: 4,
    fileSize: '4.5 MB'
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-math',
    title: 'Vector Calculus and greens theorem',
    subject: 'Engineering Mathematics',
    targetNoteIds: ['doc-greens'],
    questionsCount: 4,
    estimatedMinutes: 5,
    lastScore: 100,
    questions: [
      {
        id: 'qm-1',
        question: "Under Green's Theorem, what does ∮_C (P dx + Q dy) convert into over the bounded region D?",
        options: [
          "∬_D (∂P/∂x + ∂Q/∂y) dA",
          "∬_D (∂Q/∂x - ∂P/∂y) dA",
          "∬_D (∂P/∂y - ∂Q/∂x) dA",
          "∫_a^b (P · Q) dt"
        ],
        correctAnswerIndex: 1,
        explanation: "Green's Theorem equates line circulation to the surface integral of the 2D scalar curl (∂Q/∂x - ∂P/∂y) dA.",
        sourceNoteTitle: 'Greens theorem',
        difficulty: 'medium'
      },
      {
        id: 'qm-2',
        question: "What is the standard positive orientation of the closed boundary curve C in Green's theorem?",
        options: [
          "Clockwise",
          "Counter-clockwise, keeping region D to the left",
          "Either direction produces the same sign",
          "Towards the origin"
        ],
        correctAnswerIndex: 1,
        explanation: "Positive orientation designates counter-clockwise traversal where the enclosed region stays strictly on the left.",
        sourceNoteTitle: 'Greens theorem',
        difficulty: 'easy'
      },
      {
        id: 'qm-3',
        question: "If the vector field F = (P, Q) is conservative on a simply-connected domain, what is ∮_C F · dr for any closed loop C?",
        options: [
          "Equal to the area of D",
          "Strictly positive",
          "Zero (0)",
          "Undefined"
        ],
        correctAnswerIndex: 2,
        explanation: "Since conservative vector fields possess path independence, any closed loop integral evaluates to 0.",
        sourceNoteTitle: 'Greens theorem',
        difficulty: 'easy'
      },
      {
        id: 'qm-4',
        question: "How can Green's Theorem be used to compute the enclosed planar area of region D?",
        options: [
          "Area = ∮_C (x + y) ds",
          "Area = 1/2 ∮_C (-y dx + x dy)",
          "Area = ∬_D (x² + y²) dA",
          "Area = ∮_C (x dy + y dx)"
        ],
        correctAnswerIndex: 1,
        explanation: "Setting P = -y/2 and Q = x/2 gives ∂Q/∂x - ∂P/∂y = 1/2 - (-1/2) = 1, so ∬_D 1 dA yields Area(D).",
        sourceNoteTitle: 'Greens theorem',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'quiz-ds',
    title: 'Graph traversal & shortest path algorithms',
    subject: 'Data Structures',
    targetNoteIds: ['doc-avl'],
    questionsCount: 4,
    estimatedMinutes: 5,
    questions: [
      {
        id: 'qds-1',
        question: "What is the maximum allowed balance factor |BF| for any node in a valid AVL tree?",
        options: [
          "0",
          "1",
          "2",
          "log(n)"
        ],
        correctAnswerIndex: 1,
        explanation: "In an AVL tree, the height difference between left and right subtrees must never exceed 1 (|BF| ≤ 1).",
        sourceNoteTitle: 'AVL Trees',
        difficulty: 'easy'
      },
      {
        id: 'qds-2',
        question: "Which double rotation restores balance when a node is inserted into the right subtree of a left child?",
        options: [
          "Left-Left (LL) rotation",
          "Right-Right (RR) rotation",
          "Left-Right (LR) rotation",
          "Right-Left (RL) rotation"
        ],
        correctAnswerIndex: 2,
        explanation: "An insertion into the right child of a left subtree creates an LR imbalance, resolved by an LR rotation.",
        sourceNoteTitle: 'AVL Trees',
        difficulty: 'medium'
      },
      {
        id: 'qds-3',
        question: "What is the guaranteed worst-case search time complexity in an AVL tree with n nodes?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n log n)"
        ],
        correctAnswerIndex: 1,
        explanation: "Because AVL trees are strictly height-balanced, the tree height is bounded by ~1.44 log₂(n), yielding O(log n).",
        sourceNoteTitle: 'AVL Trees',
        difficulty: 'easy'
      },
      {
        id: 'qds-4',
        question: "Why does Dijkstra's shortest path algorithm fail on graphs with negative edge weights?",
        options: [
          "It enters an infinite recursion",
          "It greedily marks nodes as finalized and never re-relaxes shorter paths discovered later",
          "Priority queues cannot store negative numbers",
          "It only works on trees, not graphs"
        ],
        correctAnswerIndex: 1,
        explanation: "Dijkstra assumes shortest distances only increase; negative edges break this greedy invariant.",
        sourceNoteTitle: 'AVL Trees',
        difficulty: 'medium'
      }
    ]
  }
];

export const initialTasks: StudyTask[] = [
  {
    id: 'task-1',
    title: "Solve 3 Green's Theorem boundary problems for upcoming math quiz",
    subject: 'Engineering Mathematics',
    noteId: 'doc-greens',
    dueDate: 'Tomorrow',
    completed: false,
    priority: 'high',
    type: 'practice_problem'
  },
  {
    id: 'task-2',
    title: 'Draw AVL tree step-by-step insertions for [15, 20, 24, 10, 13, 7]',
    subject: 'Data Structures',
    noteId: 'doc-avl',
    dueDate: 'In 2 days',
    completed: true,
    priority: 'medium',
    type: 'diagram_redraw'
  },
  {
    id: 'task-3',
    title: 'Summarize 1NF to BCNF decomposition rules and lossless join test',
    subject: 'DBMS',
    noteId: 'doc-dbms',
    dueDate: 'Sep 29',
    completed: false,
    priority: 'high',
    type: 'summarize_chapter'
  }
];

export const initialMockExams: MockExam[] = [
  {
    id: 'exam-stem',
    title: 'Midterm Simulation: Engineering Math & Algorithms',
    subjects: ['Engineering Mathematics', 'Data Structures'],
    targetNoteIds: ['doc-greens', 'doc-avl'],
    durationMinutes: 45,
    totalMarks: 50,
    sections: [
      {
        name: 'Part 1: Vector Line Integrals',
        description: 'Circulation and curl transformations.',
        questions: [
          {
            id: 'ex-1',
            prompt: "Evaluate ∮_C (3y dx + 2x dy) around the square with vertices (0,0), (2,0), (2,2), (0,2) counter-clockwise.",
            marks: 15,
            type: 'free_response',
            sampleAnswer: "By Green's Theorem, ∂Q/∂x = 2 and ∂P/∂y = 3. ∂Q/∂x - ∂P/∂y = 2 - 3 = -1. The integral is -1 * Area(Square) = -1 * (2 * 2) = -4.",
            keyConcepts: ["Green's theorem application", "Curl scalar constant"]
          }
        ]
      },
      {
        name: 'Part 2: Tree Rebalancing',
        description: 'AVL rotation derivations and proofs.',
        questions: [
          {
            id: 'ex-2',
            prompt: "Demonstrate why a single rotation is insufficient to balance a tree with an LR or RL zig-zag shape.",
            marks: 20,
            type: 'free_response',
            sampleAnswer: "A single rotation on an LR shape merely transforms the bend into an RR or LL shape of identical total height. A double rotation is required to bring the innermost bottom node up to become the new root of the 3-node subtree.",
            keyConcepts: ["Subtree depth", "Zig-zag imbalance", "Double rotation"]
          }
        ]
      }
    ]
  }
];

export const initialFriends: FriendItem[] = [
  {
    id: 'friend-raju',
    name: 'Raju',
    college: 'Raghu engineering college',
    major: 'Computer Science & Engineering',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Raju&backgroundColor=ffb74d',
    isAdded: false,
    mutualFriendsCount: 14,
    sharedNotesCount: 24,
    notes: [
      {
        id: 'raju-note-1',
        title: 'Dynamic Programming Patterns: Knapsack & Grid',
        folderId: 'folder-ds',
        subject: 'Data Structures',
        subjectColor: '#ea5b5b',
        date: 'Sep 22',
        updatedAt: 'Sep 22',
        pageCount: 5,
        wordCount: 1420,
        fileSize: '3.9 MB',
        isFavorite: false,
        cloudSynced: true,
        cloudProvider: 'ScribeCloud',
        aiProcessed: true,
        keyTopics: ['0/1 Knapsack', 'Unbounded Knapsack', 'Grid Unique Paths'],
        summary: 'Raju’s comprehensive handwritten study guide on recurrence relations and memoization arrays.',
        ocrTranscribedText: `Recurrence for 0/1 Knapsack:
dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]]) if wt[i] <= w else dp[i-1][w].
Space optimization: single 1D array traversed backwards from W to wt[i].`,
        tags: ['#dp', '#raju-notes'],
        source: 'camera_scan'
      }
    ]
  },
  {
    id: 'friend-keerthi',
    name: 'Keerthi',
    college: 'Raghu engineering college',
    major: 'Artificial Intelligence & Data Science',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Keerthi&backgroundColor=f48fb1',
    isAdded: false,
    mutualFriendsCount: 9,
    sharedNotesCount: 18,
    notes: [
      {
        id: 'keerthi-note-1',
        title: 'Convolutional Neural Networks & Kernels',
        folderId: 'folder-math',
        subject: 'Engineering Mathematics',
        subjectColor: '#3aa6c8',
        date: 'Sep 20',
        updatedAt: 'Sep 20',
        pageCount: 4,
        wordCount: 1180,
        fileSize: '4.2 MB',
        isFavorite: false,
        cloudSynced: true,
        cloudProvider: 'ScribeCloud',
        aiProcessed: true,
        keyTopics: ['2D Convolution', 'Sobel Filter', 'Stride & Padding', 'Feature Maps'],
        summary: 'Matrix calculus derivations of cross-correlation and backpropagation gradients for CNNs.',
        ocrTranscribedText: `Discrete 2D Convolution equation:
S(i, j) = (I * K)(i, j) = Σ_m Σ_n I(i-m, j-n) K(m, n).
Output dimension: W_out = floor((W_in - F + 2P)/S) + 1.`,
        tags: ['#ai', '#cnn', '#keerthi'],
        source: 'camera_scan'
      }
    ]
  },
  {
    id: 'friend-bunty',
    name: 'Bunty',
    college: 'Raghu engineering college',
    major: 'Electronics & Communication Eng',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bunty&backgroundColor=81c784',
    isAdded: false,
    mutualFriendsCount: 11,
    sharedNotesCount: 15,
    notes: [
      {
        id: 'bunty-note-1',
        title: 'Fourier Transform & Frequency Responses',
        folderId: 'folder-math',
        subject: 'Engineering Mathematics',
        subjectColor: '#3aa6c8',
        date: 'Sep 18',
        updatedAt: 'Sep 18',
        pageCount: 3,
        wordCount: 910,
        fileSize: '2.8 MB',
        isFavorite: false,
        cloudSynced: true,
        cloudProvider: 'ScribeCloud',
        aiProcessed: true,
        keyTopics: ['CTFT', 'Impulse Response', 'Bode Plots', 'Parseval Theorem'],
        summary: 'Frequency domain analysis, poles, zeroes and transfer function stability.',
        ocrTranscribedText: `Continuous-Time Fourier Transform:
X(jω) = ∫[-∞ to ∞] x(t) e^(-jωt) dt.
Inverse: x(t) = (1/2π) ∫[-∞ to ∞] X(jω) e^(jωt) dω.`,
        tags: ['#signals', '#fourier', '#bunty'],
        source: 'camera_scan'
      }
    ]
  },
  {
    id: 'friend-rani',
    name: 'Rani',
    college: 'Raghu engineering college',
    major: 'Information Technology',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rani&backgroundColor=4dd0e1',
    isAdded: false,
    mutualFriendsCount: 16,
    sharedNotesCount: 22,
    notes: [
      {
        id: 'rani-note-1',
        title: 'TCP 3-Way Handshake & Congestion Control',
        folderId: 'folder-cn',
        subject: 'Computer Networks',
        subjectColor: '#ea7a38',
        date: 'Sep 16',
        updatedAt: 'Sep 16',
        pageCount: 3,
        wordCount: 980,
        fileSize: '3.1 MB',
        isFavorite: false,
        cloudSynced: true,
        cloudProvider: 'ScribeCloud',
        aiProcessed: true,
        keyTopics: ['SYN, SYN-ACK, ACK', 'Slow Start', 'Congestion Avoidance', 'Fast Retransmit'],
        summary: 'Handwritten timing diagrams for TCP connection teardown and window scaling.',
        ocrTranscribedText: `TCP Connection Setup:
Client -> Server: SYN (seq = x)
Server -> Client: SYN-ACK (seq = y, ack = x + 1)
Client -> Server: ACK (seq = x + 1, ack = y + 1)
AIMD: Additive Increase Multiplicative Decrease algorithm for cwnd.`,
        tags: ['#tcp', '#networks', '#rani'],
        source: 'camera_scan'
      }
    ]
  }
];

export const initialProfile: UserProfile = {
  name: 'Alex',
  email: 'alex@raghu.edu',
  college: 'Raghu engineering college',
  major: 'B.Tech Computer Science & Engineering',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexStudent&backgroundColor=b6e3f4',
  studentId: 'REC-2024-CS084'
};

export const initialPrivacy: PrivacySettings = {
  biometricLock: true,
  endToEndEncryption: true
};

export const initialCloudStorage: CloudStorageInfo = {
  usedGB: 8.2,
  totalGB: 15.0,
  physicalGB: 4.8,
  digitalGB: 3.4
};
