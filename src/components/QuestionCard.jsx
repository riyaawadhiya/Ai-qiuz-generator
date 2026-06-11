const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

const QuestionCard = ({ question, selectedOption, onSelectOption }) => {
  if (!question) return null;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-6 leading-relaxed">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={index}
              onClick={() => onSelectOption(option)}
              className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-200 group
                ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 shadow-md scale-[1.01]'
                    : 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 hover:scale-[1.01]'
                }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 min-w-[2rem] rounded-full font-bold text-sm transition-colors
                  ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900'
                  }`}
              >
                {optionLabels[index]}
              </span>
              <span className={`text-base sm:text-lg ${isSelected ? 'text-indigo-700 dark:text-indigo-200 font-semibold' : 'text-slate-700 dark:text-slate-200'}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
