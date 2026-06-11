import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';

const QuizPage = () => {
  const navigate = useNavigate();
  const { quizData, userAnswers, setUserAnswers, setResultData } = useQuiz();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
      navigate('/');
    }
  }, [quizData, navigate]);

  if (!quizData || !quizData.questions) return null;

  const { questions } = quizData;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  const handleSelectOption = (option) => {
    const updated = [...userAnswers];
    updated[currentIndex] = option;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) setCurrentIndex((prev) => prev - 1);
  };

  const computeResult = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) correct += 1;
    });
    const total = questions.length;
    const wrong = total - correct;
    const percentage = Math.round((correct / total) * 100);

    let message = '';
    if (percentage === 100) message = "Perfect score! You're a true expert! 🏆";
    else if (percentage >= 80) message = 'Excellent work! Almost flawless! 🌟';
    else if (percentage >= 60) message = 'Good job! Solid understanding. 👍';
    else if (percentage >= 40) message = 'Not bad, but there is room to improve. 📚';
    else message = 'Keep practicing — you’ll get better! 💪';

    return {
      score: correct,
      correctAnswers: correct,
      wrongAnswers: wrong,
      totalQuestions: total,
      percentage,
      message,
    };
  };

  const handleSubmit = () => {
    const unanswered = userAnswers.filter((a) => a === null || a === undefined).length;
    if (unanswered > 0 && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    const result = computeResult();
    setResultData(result);
    navigate('/result');
  };

  const answeredCount = userAnswers.filter((a) => a !== null && a !== undefined).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Topic header */}
        <div className="mb-6 text-center animate-fade-in">
          <h2 className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200">
            {quizData.topic}
          </h2>
          <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
            {quizData.difficulty} Level
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>

        {/* Question Card */}
        <QuestionCard
          key={currentIndex}
          question={currentQuestion}
          selectedOption={userAnswers[currentIndex]}
          onSelectOption={handleSelectOption}
        />

        {/* Confirm submit dialog */}
        {showConfirm && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-medium animate-fade-in">
            You have {totalQuestions - answeredCount} unanswered question(s). Submit anyway?
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => {
                  const result = computeResult();
                  setResultData(result);
                  navigate('/result');
                }}
                className="btn-primary !py-2 !px-4 text-sm"
              >
                Yes, Submit
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary !py-2 !px-4 text-sm"
              >
                Continue Quiz
              </button>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>

          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            {answeredCount} / {totalQuestions} answered
          </span>

          {isLastQuestion ? (
            <button onClick={handleSubmit} className="btn-primary flex items-center gap-2">
              Submit Quiz
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              Next
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Question dots navigation */}
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all
                ${
                  i === currentIndex
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md scale-110'
                    : userAnswers[i] !== null && userAnswers[i] !== undefined
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
