import React, { useState } from 'react';
import { Sparkles, BrainCircuit, CheckSquare, GraduationCap, Plus, Clock, Play, ArrowRight, Check, X, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentItem, MockExam, Quiz, StudyTask } from '../../types';
import { ScribeSyncHeader } from '../ScribeSyncHeader';
import { generateCustomQuizFromNotes, generateTasksFromNotes, generateMockExamFromNotes } from '../../utils/aiService';

interface AIFeaturesTabProps {
  documents: DocumentItem[];
  quizzes: Quiz[];
  tasks: StudyTask[];
  mockExams: MockExam[];
  activeQuizDirectly?: Quiz | null;
  onClearDirectQuiz?: () => void;
  onAddQuiz: (quiz: Quiz) => void;
  onAddTask: (task: StudyTask) => void;
  onAddExam: (exam: MockExam) => void;
  onToggleTask: (taskId: string) => void;
}

export const AIFeaturesTab: React.FC<AIFeaturesTabProps> = ({
  documents,
  quizzes,
  tasks,
  mockExams,
  activeQuizDirectly,
  onClearDirectQuiz,
  onAddQuiz,
  onAddTask,
  onAddExam,
  onToggleTask
}) => {
  const [activeMode, setActiveMode] = useState<'quizzes' | 'tasks' | 'exams'>('quizzes');
  const [isNoteSelectorOpen, setIsNoteSelectorOpen] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([documents[0]?.id || '']);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active quiz gameplay
  const [activePlayingQuiz, setActivePlayingQuiz] = useState<Quiz | null>(activeQuizDirectly || null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Active mock exam
  const [activeViewingExam, setActiveViewingExam] = useState<MockExam | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Sync direct quiz trigger from Home tab
  React.useEffect(() => {
    if (activeQuizDirectly) {
      setActivePlayingQuiz(activeQuizDirectly);
      setCurrentQuestionIdx(0);
      setSelectedAnswerIdx(null);
      setHasSubmittedAnswer(false);
      setUserScore(0);
      setQuizFinished(false);
      if (onClearDirectQuiz) onClearDirectQuiz();
    }
  }, [activeQuizDirectly, onClearDirectQuiz]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActivePlayingQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setHasSubmittedAnswer(false);
    setUserScore(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedAnswerIdx(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswerIdx === null || !activePlayingQuiz) return;
    const isCorrect = selectedAnswerIdx === activePlayingQuiz.questions[currentQuestionIdx].correctAnswerIndex;
    if (isCorrect) setUserScore((s) => s + 1);
    setHasSubmittedAnswer(true);
  };

  const handleNextQuestion = () => {
    if (!activePlayingQuiz) return;
    if (currentQuestionIdx + 1 < activePlayingQuiz.questions.length) {
      setCurrentQuestionIdx((i) => i + 1);
      setSelectedAnswerIdx(null);
      setHasSubmittedAnswer(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleConfirmGenerate = () => {
    setIsGenerating(true);
    const chosenDocs = documents.filter((d) => selectedNoteIds.includes(d.id));

    setTimeout(() => {
      if (activeMode === 'quizzes') {
        const newQuiz = generateCustomQuizFromNotes(chosenDocs, 4);
        onAddQuiz(newQuiz);
        handleStartQuiz(newQuiz);
      } else if (activeMode === 'tasks') {
        const newTasks = generateTasksFromNotes(chosenDocs);
        newTasks.forEach((t) => onAddTask(t));
      } else {
        const newExam = generateMockExamFromNotes(chosenDocs);
        onAddExam(newExam);
        setActiveViewingExam(newExam);
      }
      setIsGenerating(false);
      setIsNoteSelectorOpen(false);
    }, 700);
  };

  return (
    <div className="flex flex-col space-y-4 pb-24 px-4 pt-3 select-none">
      {/* Top Header Logo */}
      <ScribeSyncHeader />

      {/* Title & Subtitle matching Page 5 */}
      <div className="pt-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
          AI Study Intelligence
        </h2>
        <p className="text-xs text-slate-600 font-medium italic mt-0.5">
          Extract Quizzez,tasks And mock exams directly from handwritten notes
        </p>
      </div>

      {/* Mode Switcher Tabs matching Page 5 */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800 rounded-full text-xs font-semibold text-white shadow-md">
        <button
          onClick={() => setActiveMode('quizzes')}
          className={`py-2 rounded-full transition-all cursor-pointer ${
            activeMode === 'quizzes' ? 'bg-slate-200 text-slate-900 font-bold shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          Quizes
        </button>
        <button
          onClick={() => setActiveMode('tasks')}
          className={`py-2 rounded-full transition-all cursor-pointer ${
            activeMode === 'tasks' ? 'bg-slate-200 text-slate-900 font-bold shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveMode('exams')}
          className={`py-2 rounded-full transition-all cursor-pointer ${
            activeMode === 'exams' ? 'bg-slate-200 text-slate-900 font-bold shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          mock exams
        </button>
      </div>

      {/* Action Card: "Create custom Quizes from notes" matching Page 5 */}
      <div className="p-3.5 rounded-sm bg-white/95 border-2 border-slate-700/80 shadow-xs flex items-center justify-between">
        <div className="pr-2">
          <h4 className="text-xs font-bold text-slate-900">
            Create custom {activeMode === 'quizzes' ? 'Quizes' : activeMode === 'tasks' ? 'Tasks' : 'Mock Exams'} from notes
          </h4>
          <p className="text-[11px] text-slate-600 font-medium italic mt-0.5">
            Pick specific handwritten chapters or letures to test retention
          </p>
        </div>

        <button
          onClick={() => setIsNoteSelectorOpen(true)}
          className="px-3 py-1.5 rounded-full bg-[#36b37e] hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold shadow-xs cursor-pointer transition-all shrink-0"
        >
          Select Notes
        </button>
      </div>

      {/* MODE 1: QUIZZES MATCHING PAGE 5 */}
      {activeMode === 'quizzes' && (
        <div className="space-y-3 pt-1">
          <span className="text-xs font-bold text-slate-900 font-serif">
            Practice Quizes
          </span>

          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-3.5 rounded-sm bg-white/95 border-2 border-slate-700/80 shadow-xs flex items-center justify-between"
            >
              <div className="pr-3 min-w-0">
                <span className="text-xs font-semibold text-slate-900 block truncate">
                  {quiz.subject}
                </span>
                <h4 className="text-xs text-slate-700 font-medium mt-0.5 truncate">
                  {quiz.title}
                </h4>
              </div>

              <button
                onClick={() => handleStartQuiz(quiz)}
                className="px-3.5 py-1.5 rounded-full bg-[#3aa6c8] hover:bg-sky-600 active:scale-95 text-white text-xs font-bold shadow-xs cursor-pointer transition-all shrink-0"
              >
                Take Quiz
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: TASKS */}
      {activeMode === 'tasks' && (
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-bold text-slate-900 font-serif">
            Study Tasks ({tasks.filter((t) => !t.completed).length} Pending)
          </span>

          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-sm border-2 transition-all cursor-pointer flex items-start space-x-3 ${
                task.completed
                  ? 'bg-slate-100/70 border-slate-400 opacity-60'
                  : 'bg-white/95 border-slate-700/80 shadow-xs'
              }`}
            >
              <div
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                  task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-600 bg-white'
                }`}
              >
                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`text-xs font-semibold ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </h4>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-600 mt-1">
                  <span className="font-bold text-emerald-700">{task.subject}</span>
                  <span>·</span>
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 3: MOCK EXAMS */}
      {activeMode === 'exams' && (
        <div className="space-y-3 pt-1">
          <span className="text-xs font-bold text-slate-900 font-serif">
            Mock Exam Simulations
          </span>

          {mockExams.map((exam) => (
            <div
              key={exam.id}
              className="p-3.5 rounded-sm bg-white/95 border-2 border-slate-700/80 shadow-xs flex items-center justify-between"
            >
              <div className="pr-3 min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {exam.title}
                </span>
                <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                  {exam.durationMinutes} mins · {exam.totalMarks} Marks
                </p>
              </div>

              <button
                onClick={() => setActiveViewingExam(exam)}
                className="px-3.5 py-1.5 rounded-full bg-[#ea7a38] hover:bg-amber-600 active:scale-95 text-white text-xs font-bold shadow-xs cursor-pointer transition-all shrink-0"
              >
                Start Exam
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: SELECT NOTES */}
      {isNoteSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4 border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="text-sm font-bold">Select Notes for AI Generation</h3>
              <button
                onClick={() => setIsNoteSelectorOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:text-black flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {documents.map((doc) => {
                const isSelected = selectedNoteIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedNoteIds.length > 1) {
                          setSelectedNoteIds(selectedNoteIds.filter((id) => id !== doc.id));
                        }
                      } else {
                        setSelectedNoteIds([...selectedNoteIds, doc.id]);
                      }
                    }}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold truncate">{doc.title}</h4>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{doc.subject}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleConfirmGenerate}
              disabled={isGenerating || selectedNoteIds.length === 0}
              className="w-full py-2.5 bg-[#36b37e] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'AI Synthesizing...' : `Generate ${activeMode.toUpperCase()} (${selectedNoteIds.length} Notes)`}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE QUIZ PLAYER */}
      {activePlayingQuiz && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4 border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <span className="text-[10px] font-bold text-[#3aa6c8] uppercase">
                  {activePlayingQuiz.subject}
                </span>
                <h3 className="text-xs font-bold truncate">{activePlayingQuiz.title}</h3>
              </div>
              <button
                onClick={() => setActivePlayingQuiz(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:text-black flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!quizFinished ? (
              <div className="space-y-3.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Question {currentQuestionIdx + 1} of {activePlayingQuiz.questions.length}</span>
                  <span>Score: {userScore}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold leading-relaxed">
                    {activePlayingQuiz.questions[currentQuestionIdx].question}
                  </p>
                </div>

                <div className="space-y-2">
                  {activePlayingQuiz.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                    const q = activePlayingQuiz.questions[currentQuestionIdx];
                    let optClass = 'bg-white border-slate-300 hover:border-slate-700 text-slate-800';

                    if (hasSubmittedAnswer) {
                      if (oIdx === q.correctAnswerIndex) {
                        optClass = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold';
                      } else if (oIdx === selectedAnswerIdx) {
                        optClass = 'bg-rose-100 border-rose-600 text-rose-950';
                      }
                    } else if (selectedAnswerIdx === oIdx) {
                      optClass = 'bg-sky-100 border-sky-600 text-sky-950 font-bold';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full p-2.5 rounded-xl border-2 text-left text-xs transition-all flex items-start space-x-2 cursor-pointer ${optClass}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {hasSubmittedAnswer && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-emerald-700 block">Explanation:</span>
                    <p className="text-[11px]">{activePlayingQuiz.questions[currentQuestionIdx].explanation}</p>
                  </div>
                )}

                <div className="pt-1">
                  {!hasSubmittedAnswer ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedAnswerIdx === null}
                      className="w-full py-2.5 bg-[#3aa6c8] hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-40"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md"
                    >
                      <span>
                        {currentQuestionIdx + 1 < activePlayingQuiz.questions.length ? 'Next Question' : 'View Results'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Quiz Completed!</h4>
                <p className="text-xs text-slate-600">
                  You scored {userScore} / {activePlayingQuiz.questions.length} ({Math.round((userScore / activePlayingQuiz.questions.length) * 100)}%)
                </p>
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => handleStartQuiz(activePlayingQuiz)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                  >
                    Retake
                  </button>
                  <button
                    onClick={() => setActivePlayingQuiz(null)}
                    className="flex-1 py-2 bg-[#3aa6c8] hover:bg-sky-600 text-white text-xs font-bold rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: MOCK EXAM VIEWER */}
      {activeViewingExam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4 border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="text-xs font-bold">{activeViewingExam.title}</h3>
              <button
                onClick={() => setActiveViewingExam(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:text-black flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {activeViewingExam.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <div className="p-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                    {section.name}
                  </div>
                  {section.questions.map((q, qIdx) => (
                    <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="text-xs font-medium text-slate-900">
                        Q{qIdx + 1}. {q.prompt}
                      </div>
                      <button
                        onClick={() =>
                          setRevealedAnswers((prev) => ({
                            ...prev,
                            [q.id]: !prev[q.id]
                          }))
                        }
                        className="text-[11px] font-bold text-[#3aa6c8] hover:underline"
                      >
                        {revealedAnswers[q.id] ? 'Hide Solution' : 'Show Model Answer'}
                      </button>
                      {revealedAnswers[q.id] && (
                        <div className="p-2 bg-white rounded-lg border border-slate-300 text-[11px] font-mono text-slate-800 leading-relaxed">
                          {q.sampleAnswer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveViewingExam(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
