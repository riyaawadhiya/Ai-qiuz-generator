import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { generateQuiz } from '../services/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const { setQuizData, setQuizConfig, setUserAnswers, resetQuiz } = useQuiz();

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    if (!topic.trim()) {
      setError('Please enter a topic to generate a quiz.');
      return;
    }
    try {
      setLoading(true);
      resetQuiz();
      setQuizConfig({ topic: topic.trim(), difficulty, count: Number(count) });
      const data = await generateQuiz({ topic: topic.trim(), difficulty, count: Number(count) });
      const quiz = data?.data || data?.quiz || data;
      setQuizData(quiz);
      setUserAnswers(new Array(quiz.questions.length).fill(null));
      navigate('/quiz');
    } catch (err) {
      setError(err?.message || 'Failed to generate quiz. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Generating your quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12 sm:py-20">
      <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
        <span className="inline-block px-4 py-1.5 mb-5 rounded-full text-sm font-semibold bg-white/60 dark:bg-slate-800/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-sm">
          ✨ Powered by Google Gemini AI
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-white mb-5 leading-tight">
          Generate Smart Quizzes
          <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            on Any Topic, Instantly
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Enter any topic, choose your difficulty and number of questions — our AI
          will craft a custom multiple-choice quiz and grade your performance in real time.
        </p>
      </div>

      <div className="w-full max-w-xl glass-card rounded-2xl p-6 sm:p-8 animate-slide-up">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Quiz Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Python Programming, World History, Cricket..."
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Number of Questions
              </label>
              <select
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
            ✨ Generate Quiz
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mt-12 animate-fade-in">
        {[
          { icon: '🤖', title: 'AI Generated', desc: 'Unique questions powered by Gemini AI' },
          { icon: '⚡', title: 'Instant Results', desc: 'Get scored feedback immediately' },
          { icon: '🌙', title: 'Dark Mode', desc: 'Comfortable on the eyes, anytime' },
        ].map((f) => (
          <div key={f.title} className="glass-card rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">{f.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;