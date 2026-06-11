import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { saveResult } from '../services/api';

const ResultPage = () => {
  const navigate = useNavigate();
  const { quizData, userAnswers, resultData, setUserAnswers, resetQuiz } = useQuiz();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!quizData || !resultData) navigate('/');
  }, [quizData, resultData, navigate]);

  useEffect(() => {
    const persistResult = async () => {
      if (!quizData?._id || !resultData || saved) return;
      try {
        setSaving(true);
        await saveResult({
          quizId: quizData._id,
          score: resultData.score,
          totalQuestions: resultData.totalQuestions,
          percentage: resultData.percentage,
        });
        setSaved(true);
      } catch (err) {
        console.error('Failed to save result:', err);
      } finally {
        setSaving(false);
      }
    };
    persistResult();
  }, [quizData, resultData]);

  if (!quizData || !resultData) return null;

  const { score, correctAnswers, wrongAnswers, totalQuestions, percentage, message } = resultData;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRingColor = () => {
    if (percentage >= 80) return '#22c55e';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  const handleRetake = () => {
    setUserAnswers(new Array(quizData.questions.length).fill(null));
    navigate('/quiz');
  };

  const handleNewQuiz = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card rounded-2xl p-6 sm:p-10 text-center mb-8 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-1">
            Quiz Completed!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {quizData.topic} • {quizData.difficulty} Level
          </p>

          <div className="relative w-36 h-36 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-200 dark:text-slate-700" />
              <circle cx="60" cy="60" r="54" stroke={getRingColor()} strokeWidth="10" fill="transparent"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold ${getScoreColor()}`}>{percentage}%</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Score</span>
            </div>
          </div>

          <p className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-200 mb-6">{message}</p>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700 p-4">
              <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{score}/{totalQuestions}</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Total Score</p>
            </div>
            <div className="rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4">
              <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">{correctAnswers}</p>
              <p className="text-xs sm:text-sm text-green-700/70 dark:text-green-400/70 mt-1">Correct</p>
            </div>
            <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4">
              <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{wrongAnswers}</p>
              <p className="text-xs sm:text-sm text-red-700/70 dark:text-red-400/70 mt-1">Wrong</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleRetake} className="btn-secondary flex items-center justify-center gap-2">
              Retake Quiz
            </button>
            <button onClick={handleNewQuiz} className="btn-primary flex items-center justify-center gap-2">
              Generate New Quiz
            </button>
          </div>

          {saving && <p className="text-xs text-slate-400 mt-4 animate-pulse">Saving your result...</p>}
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 px-1">Review Your Answers</h3>
        <div className="space-y-4">
          {quizData.questions.map((q, i) => {
            const userAnswer = userAnswers[i];
            const isCorrect = userAnswer === q.answer;
            return (
              <div key={i} className={`glass-card rounded-xl p-5 border ${
                !userAnswer ? 'border-slate-300 dark:border-slate-700'
                : isCorrect ? 'border-green-400 dark:border-green-600'
                : 'border-red-400 dark:border-red-600'
              }`}>
                <p className="font-semibold text-slate-800 dark:text-white mb-3">
                  Q{i + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <div key={j} className={`px-4 py-2 rounded-lg text-sm ${
                      opt === q.answer ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold'
                      : opt === userAnswer && !isCorrect ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                      : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {opt === q.answer ? '✓ ' : opt === userAnswer && !isCorrect ? '✗ ' : ''}{opt}
                    </div>
                  ))}
                </div>
                {!userAnswer && <p className="text-xs text-slate-400 mt-2 italic">Not answered</p>}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button onClick={handleRetake} className="btn-secondary">Retake Quiz</button>
          <button onClick={handleNewQuiz} className="btn-primary">Generate New Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;