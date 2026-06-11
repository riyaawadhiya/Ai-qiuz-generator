const ResultCard = ({ question, userAnswer, index }) => {
  const isCorrect = userAnswer === question.answer;
  const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 animate-slide-up">
      <div className="flex items-start gap-3 mb-4">
        <span
          className={`flex items-center justify-center w-8 h-8 min-w-[2rem] rounded-full font-bold text-sm text-white
            ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {index + 1}
        </span>
        <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-relaxed">
          {question.question}
        </h4>
      </div>

      <div className="space-y-2 ml-11">
        {question.options.map((option, i) => {
          const isCorrectOption = option === question.answer;
          const isUserChoice = option === userAnswer;

          let classes =
            'flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm sm:text-base ';

          if (isCorrectOption) {
            classes += 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold';
          } else if (isUserChoice && !isCorrectOption) {
            classes += 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-semibold';
          } else {
            classes += 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';
          }

          return (
            <div key={i} className={classes}>
              <span>{option}</span>
              <span className="flex items-center gap-2">
                {isUserChoice && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700">
                    Your answer
                  </span>
                )}
                {isCorrectOption && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                  </svg>
                )}
                {isUserChoice && !isCorrectOption && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                    <path d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.715a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.715a.75.75 0 01-1.06-1.06l4.714-4.715-4.714-4.715a.75.75 0 010-1.06z" />
                  </svg>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {!isAnswered && (
        <p className="ml-11 mt-3 text-sm text-amber-600 dark:text-amber-400 font-medium">
          You did not answer this question.
        </p>
      )}
    </div>
  );
};

export default ResultCard;
