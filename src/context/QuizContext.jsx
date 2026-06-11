import { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null); // { _id, topic, difficulty, questions }
  const [userAnswers, setUserAnswers] = useState([]); // array of selected options
  const [quizConfig, setQuizConfig] = useState({
    topic: '',
    difficulty: 'Medium',
    count: 5,
  });
  const [resultData, setResultData] = useState(null);

  const resetQuiz = () => {
    setQuizData(null);
    setUserAnswers([]);
    setResultData(null);
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        setQuizData,
        userAnswers,
        setUserAnswers,
        quizConfig,
        setQuizConfig,
        resultData,
        setResultData,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
