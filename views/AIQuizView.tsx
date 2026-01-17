import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  BarChart, 
  BookOpen, 
  ChevronRight,
  HelpCircle,
  Lightbulb,
  XCircle,
  Target
} from 'lucide-react';
import { Article, QuizQuestion, QuizResult, QuizReport } from '../types';
import { MOCK_ARTICLES } from '../data/mockData';

// --- Mock Questions Generator ---
const generateMockQuestions = (articles: Article[]): QuizQuestion[] => {
  return [
    {
      id: 'q1',
      type: 'single',
      question: '根据蔡格尼克效应，人们更容易记住什么样的任务？',
      options: ['已完成的任务', '未完成的任务', '简单的任务', '复杂的任务'],
      correctAnswer: 1,
      explanation: '蔡格尼克效应指出，人们对于尚未处理完的事情，比已处理完成的事情印象更加深刻。',
      relatedArticleId: '1',
      difficulty: 'easy'
    },
    {
      id: 'q2',
      type: 'multiple',
      question: '以下哪些因素可能增强学习的好奇心？',
      options: ['信息缺口', '适当的难度', '完全确定的答案', '认知冲突'],
      correctAnswer: [0, 1, 3],
      explanation: '好奇心通常由信息缺口（想知道不知道的）、最佳挑战难度（不太难也不太简单）以及认知冲突（已有知识与新信息矛盾）激发。',
      relatedArticleId: '2',
      difficulty: 'medium'
    },
    {
      id: 'q3',
      type: 'single',
      question: '神经接口技术主要面临的伦理挑战不包括：',
      options: ['隐私泄露', '身份认同危机', '技术成本过低', '增强后的不平等'],
      correctAnswer: 2,
      explanation: '技术成本高昂导致的获取不平等是挑战之一，而非“成本过低”。',
      relatedArticleId: '4',
      difficulty: 'hard'
    }
  ];
};

const AIQuizView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'mistakes' | 'report'>('quiz');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // For current question
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Current question submitted
  const [quizComplete, setQuizComplete] = useState(false); // All questions done

  // Load questions on mount
  useEffect(() => {
    // In real app, this would be an API call or AI generation
    const mocks = generateMockQuestions(MOCK_ARTICLES);
    setQuestions(mocks);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;

    if (currentQuestion.type === 'single') {
      setSelectedAnswers([index]);
    } else if (currentQuestion.type === 'multiple') {
      setSelectedAnswers(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswers.length === 0) return;

    setIsSubmitted(true);
    
    // Check correctness
    let isCorrect = false;
    if (currentQuestion.type === 'single') {
      isCorrect = selectedAnswers[0] === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'multiple') {
      const correct = currentQuestion.correctAnswer as number[];
      isCorrect = selectedAnswers.length === correct.length && 
                  selectedAnswers.every(a => correct.includes(a));
    }

    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswers,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    setQuizResults(prev => [...prev, result]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setIsSubmitted(false);
    } else {
      setQuizComplete(true);
      setActiveTab('report');
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizResults([]);
    setIsSubmitted(false);
    setQuizComplete(false);
    setActiveTab('quiz');
  };

  // --- Render Components ---

  const renderSidebar = () => (
    <div className="w-full md:w-80 bg-white border-r border-slate-100 flex flex-col h-full z-10">
      <div className="p-6 border-b border-slate-50">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <BrainCircuit className="text-indigo-600" />
          AI 问答
        </h2>
        <p className="text-xs text-slate-500 mt-2">基于你的收录夹自动生成的个性化挑战。</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
            activeTab === 'quiz' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <HelpCircle size={18} />
            <span>每日挑战</span>
          </div>
          {activeTab === 'quiz' && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
        </button>

        <button 
          onClick={() => setActiveTab('mistakes')}
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
            activeTab === 'mistakes' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <XCircle size={18} />
            <span>错题本</span>
          </div>
          <span className="bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full font-bold">
            {quizResults.filter(r => !r.isCorrect).length}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('report')}
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
            activeTab === 'report' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <BarChart size={18} />
            <span>学习报告</span>
          </div>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-50">
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-amber-300" />
            <span className="font-bold text-sm">连胜挑战</span>
          </div>
          <p className="text-xs opacity-90 mb-3">你已连续答对 {quizResults.filter(r => r.isCorrect).length} 题！保持势头。</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-300 h-full w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuizArea = () => {
    if (quizComplete) {
      return renderReport(); // Show report if done
    }

    if (!currentQuestion) return <div className="p-10">Loading questions...</div>;

    const relatedArticle = MOCK_ARTICLES.find(a => a.id === currentQuestion.relatedArticleId);

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/30">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100">
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            {/* Question Header */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} / {questions.length}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {currentQuestion.question}
              </h1>
              {currentQuestion.type === 'multiple' && (
                <span className="text-sm text-slate-500 mt-2 block">(多选题)</span>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.options?.map((option, idx) => {
                const isSelected = selectedAnswers.includes(idx);
                let optionStyle = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
                
                if (isSubmitted) {
                  const isCorrect = Array.isArray(currentQuestion.correctAnswer) 
                    ? currentQuestion.correctAnswer.includes(idx)
                    : currentQuestion.correctAnswer === idx;
                  
                  if (isCorrect) optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500";
                  else if (isSelected) optionStyle = "bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500";
                  else optionStyle = "opacity-50 border-slate-200";
                } else if (isSelected) {
                  optionStyle = "bg-indigo-50 border-indigo-600 text-indigo-800 ring-1 ring-indigo-600 shadow-md";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isSubmitted}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${optionStyle}`}
                  >
                    <span className="font-bold text-lg">{option}</span>
                    {isSubmitted && (
                       (Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(idx) : currentQuestion.correctAnswer === idx) 
                       ? <CheckCircle2 className="text-emerald-500" />
                       : (isSelected ? <XCircle className="text-rose-500" /> : null)
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Area (Post-Submit) */}
            {isSubmitted && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold">
                  <Lightbulb size={20} />
                  <h3>AI 解析</h3>
                </div>
                <p className="text-slate-700 leading-relaxed mb-6">{currentQuestion.explanation}</p>
                
                {relatedArticle && (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-slate-400">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">来源文章</p>
                      <h4 className="font-bold text-slate-900 text-sm">{relatedArticle.title}</h4>
                    </div>
                    <ChevronRight className="ml-auto text-slate-300" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="p-6 bg-white border-t border-slate-100 flex justify-center md:justify-end">
          {!isSubmitted ? (
            <button 
              onClick={handleSubmitAnswer}
              disabled={selectedAnswers.length === 0}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center gap-2"
            >
              提交答案
            </button>
          ) : (
            <button 
              onClick={handleNextQuestion}
              className="px-8 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
            >
              {currentQuestionIndex < questions.length - 1 ? '下一题' : '查看报告'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderReport = () => {
    const correctCount = quizResults.filter(r => r.isCorrect).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-slate-50/30 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-100">
          <div className="bg-indigo-600 p-10 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <BrainCircuit size={400} className="-translate-x-1/2 -translate-y-1/2" />
             </div>
             <div className="relative z-10">
               <h2 className="text-lg font-medium opacity-80 mb-2">本次挑战完成</h2>
               <div className="text-6xl font-black mb-2">{accuracy}%</div>
               <p className="font-bold">答对 {correctCount} / {questions.length} 题</p>
             </div>
          </div>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <h4 className="text-emerald-800 font-bold mb-1 flex items-center gap-2">
                    <Target size={16} /> 掌握强项
                  </h4>
                  <p className="text-sm text-emerald-600">心理学基础概念理解透彻</p>
               </div>
               <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                  <h4 className="text-rose-800 font-bold mb-1 flex items-center gap-2">
                    <AlertCircle size={16} /> 待加强
                  </h4>
                  <p className="text-sm text-rose-600">神经科学伦理应用</p>
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">推荐阅读</h3>
              {MOCK_ARTICLES.slice(0, 2).map(article => (
                <div key={article.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
                      <img src={article.coverImage} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{article.title}</h4>
                      <p className="text-xs text-slate-400">{article.author}</p>
                   </div>
                   <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>

            <button 
              onClick={handleRetry}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl"
            >
              <RotateCcw size={18} /> 再来一次
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMistakes = () => {
    const wrongAnswers = quizResults.filter(r => !r.isCorrect);

    if (wrongAnswers.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <Trophy size={40} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">太棒了！</h3>
           <p className="text-slate-500">你目前没有错题记录，保持这个状态！</p>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/30">
        <h2 className="text-2xl font-black text-slate-900 mb-8">错题回顾</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {wrongAnswers.map((result, i) => {
            const question = questions.find(q => q.id === result.questionId);
            if (!question) return null;
            return (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center font-bold shrink-0">
                       {i + 1}
                    </div>
                    <div className="flex-1">
                       <h3 className="font-bold text-slate-800 text-lg mb-3">{question.question}</h3>
                       <div className="p-4 bg-slate-50 rounded-xl mb-4">
                          <p className="text-sm text-slate-600 font-medium">你的回答: <span className="text-rose-600 font-bold">{
                            Array.isArray(result.userAnswer) 
                              ? result.userAnswer.map(idx => question.options?.[idx]).join(', ')
                              : question.options?.[result.userAnswer as number]
                          }</span></p>
                       </div>
                       <div className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 p-4 rounded-xl">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                          <p>{question.explanation}</p>
                       </div>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-white">
      {renderSidebar()}
      
      {activeTab === 'quiz' && renderQuizArea()}
      {activeTab === 'mistakes' && renderMistakes()}
      {activeTab === 'report' && renderReport()}
    </div>
  );
};

export default AIQuizView;
