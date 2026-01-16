
import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, X } from 'lucide-react';
import { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onSuccess, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selectedOption === quiz.correctAnswer;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">Q</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">知识挑战</span>
          </div>
          <button onClick={onCancel} className="p-1 text-slate-300 hover:text-slate-500"><X size={20} /></button>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">
          {quiz.question}
        </h3>

        <div className="space-y-3 mb-8">
          {quiz.options.map((option, idx) => (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(idx)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                isSubmitted
                  ? idx === quiz.correctAnswer
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : idx === selectedOption
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-slate-100 text-slate-400'
                  : selectedOption === idx
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-lg shadow-indigo-100'
                  : 'border-slate-100 hover:border-slate-300 text-slate-600'
              }`}
            >
              <span className="font-medium">{option}</span>
              {isSubmitted && idx === quiz.correctAnswer && <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
              {isSubmitted && idx === selectedOption && idx !== quiz.correctAnswer && <XCircle className="text-rose-500 shrink-0" size={20} />}
            </button>
          ))}
        </div>

        {isSubmitted ? (
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 animate-in fade-in duration-500">
            <h4 className={`font-bold mb-2 flex items-center gap-2 ${isCorrect ? 'text-emerald-600' : 'text-slate-800'}`}>
              {isCorrect ? '洞察深刻！' : '还差一点，再接再厉！'}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {quiz.explanation}
            </p>
          </div>
        ) : null}

        <div className="flex justify-end">
          {!isSubmitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl transition-all"
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={onSuccess}
              className={`font-bold px-10 py-4 rounded-2xl transition-all flex items-center gap-2 ${
                isCorrect ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isCorrect ? '继续解锁' : '再试一次'} <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
