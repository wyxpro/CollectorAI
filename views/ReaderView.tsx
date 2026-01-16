
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  X,
  Loader2,
  Zap,
  Layout,
  Globe,
  Monitor,
  Eye,
  Sparkles,
  Target,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface QuizStep {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  fragment: string;
  explanation: string;
}

interface ReaderViewProps {
  articleId: string;
  initialUrl?: string;
  onBack: () => void;
}

const ReaderView: React.FC<ReaderViewProps> = ({ articleId, initialUrl, onBack }) => {
  const [viewState, setViewState] = useState<'loading' | 'preview' | 'quiz' | 'completed'>('loading');
  const [readerMode, setReaderMode] = useState<'ai' | 'web'>('ai');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  // 辅助函数：检测链接是否允许嵌入
  const isEmbeddable = (url?: string) => {
    if (!url) return true;
    const blockedDomains = [
      'mp.weixin.qq.com',
      'medium.com',
      'github.com',
      'google.com',
      'zhihu.com',
      'juejin.cn',
      'twitter.com',
      'facebook.com'
    ];
    return !blockedDomains.some(domain => url.includes(domain));
  };

  const canEmbed = isEmbeddable(initialUrl);

  // 模拟 Quiz 数据
  const quizSteps: QuizStep[] = [
    {
      id: 1,
      question: "文中提到的 'Scaling Law' 的核心驱动力是什么？",
      options: ["算法架构的创新", "高质量标注数据的规模", "算力与能源的持续投入", "用户反馈的闭环"],
      correctAnswer: 2,
      fragment: "Scaling Law 并不是一种数学公式，而是一种关于‘资源投入与智能产出’的物理直觉。其本质是将能源转化为可利用的逻辑智能。",
      explanation: "Scaling Law 强调计算规模、数据规模和参数规模的协同演进。"
    }
  ];

  useEffect(() => {
    if (viewState === 'loading') {
      const duration = 1500;
      const step = 50;
      let current = 0;
      const interval = setInterval(() => {
        current += (100 / (duration / step));
        setParsingProgress(Math.min(Math.round(current), 100));
        if (current >= 100) {
          clearInterval(interval);
          setTimeout(() => setViewState('preview'), 300);
        }
      }, step);
      return () => clearInterval(interval);
    }
  }, [viewState]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
  };

  const nextStep = () => {
    if (currentStepIdx < quizSteps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setViewState('completed');
    }
  };

  const renderNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={22} className="text-slate-400" />
        </button>
        
        <div className="flex items-center bg-slate-100/50 p-1 rounded-[20px] border border-slate-200">
          <button 
            onClick={() => setReaderMode('ai')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[18px] text-xs font-black transition-all ${
              readerMode === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sparkles size={14} fill={readerMode === 'ai' ? "currentColor" : "none"} />
            AI 沉浸模式
          </button>
          <button 
            onClick={() => setReaderMode('web')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[18px] text-xs font-black transition-all ${
              readerMode === 'web' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Globe size={14} />
            网页原始视图
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-[18px] w-80">
          <Layout size={14} className="text-slate-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-400 truncate tracking-tight">
            {initialUrl || 'https://mp.weixin.qq.com/s/ai-insights-2024'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setViewState('quiz')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-[18px] font-black text-xs shadow-xl shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95 group"
        >
          <Zap size={14} fill="white" className="group-hover:animate-pulse" />
          进入博弈模式
        </button>
      </div>
    </nav>
  );

  const renderReader = () => (
    <div className="h-full pt-20 bg-[#fafafa] overflow-hidden">
      {renderNavbar()}
      
      <div className="h-full relative">
        {readerMode === 'web' ? (
          <div className="w-full h-full bg-white relative">
            {canEmbed ? (
              <iframe 
                src={initialUrl} 
                className="w-full h-full border-none"
                title="Original Content"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full bg-white border border-slate-200 rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 text-center space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mx-auto">
                    <ShieldAlert size={40} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">内容嵌入受限</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      由于该网站（{new URL(initialUrl || 'https://mp.weixin.qq.com').hostname}）的安全策略限制，我们无法在 App 内直接展示。
                    </p>
                  </div>
                  <div className="pt-4 space-y-3">
                    <a 
                      href={initialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[22px] font-black text-sm transition-all shadow-xl active:scale-95"
                    >
                      在新标签页中打开原文 <ArrowUpRight size={18} />
                    </a>
                    <button 
                      onClick={() => setReaderMode('ai')}
                      className="flex items-center justify-center gap-2 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-8 py-4 rounded-[22px] font-black text-sm transition-all"
                    >
                      <Sparkles size={16} /> 返回 AI 沉浸模式 (推荐)
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute top-4 right-8 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 flex items-center gap-2">
                <Monitor size={12} /> {canEmbed ? '全网页渲染就绪' : '安全沙盒受限'}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto scroll-smooth">
            <div className="max-w-4xl mx-auto py-16 px-8 md:px-12 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-100">深度洞察</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">预估 12 分钟读完</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1] tracking-tight serif">
                  Scaling Law 与 <br />
                  <span className="text-indigo-600">智能的物理终局</span>
                </h1>
                <div className="flex items-center gap-6 pb-12 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-indigo-50 overflow-hidden shadow-xl ring-1 ring-slate-100">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Felix" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 leading-tight">Felix Explorer & AI</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">联合创作 · 更新于今日 14:30</p>
                  </div>
                </div>
              </div>

              <article className="prose prose-slate prose-xl max-w-none text-slate-700 leading-relaxed font-medium space-y-12">
                <p className="text-2xl font-bold text-slate-900 leading-snug border-l-8 border-indigo-600 pl-8 py-2">
                  在大模型时代，Scaling Law（规模法则）已经从一个工程经验上升到了物理定律的高度。AI 正在重构我们对“阅读”的定义。
                </p>
                <p className="serif">
                  无论原网页是否允许嵌入，AI 都已经为您同步抓取了其中的关键信息，并在此处以最纯净的排版展示。每一块 GPU 的咆哮，都是在对抗整个宇宙的无序。
                </p>
                <div className="py-24 border-t border-slate-100 flex flex-col items-center text-center gap-10">
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center shadow-inner relative overflow-hidden group">
                    <Zap size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900">文本已完整解析</h3>
                    <p className="text-slate-500 font-bold max-w-sm mx-auto">
                      阅读只是开始。现在，通过博弈挑战来确保这些知识已经进入你的长期记忆。
                    </p>
                  </div>
                  <button 
                    onClick={() => setViewState('quiz')}
                    className="bg-slate-900 hover:bg-black text-white px-12 py-6 rounded-[32px] font-black shadow-2xl transition-all active:scale-95 flex items-center gap-3 group"
                  >
                    开启博弈挑战 
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500 bg-[#0a0a0a]">
      <div className="relative">
        <div className="w-40 h-40 rounded-full border-4 border-white/5 flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.2)]">
          <Loader2 className="text-indigo-500 animate-spin" size={56} strokeWidth={1} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-lg font-black text-indigo-400 tabular-nums">{parsingProgress}%</span>
        </div>
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-white tracking-tighter">正在提取思维锚点</h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          AI 正在实时分析原网页内容，<br />为您剔除干扰，生成沉浸式阅读空间。
        </p>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="h-full bg-[#0a0a0a] text-white flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 animate-pulse shadow-[0_0_20px_rgba(99,102,241,1)]"></div>
      </div>
      <header className="px-8 py-6 flex items-center justify-between relative z-10">
        <button onClick={() => setViewState('preview')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-black text-xs uppercase tracking-widest">
          <ChevronLeft size={16} /> 返回阅读预览
        </button>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">正在博弈关卡 {currentStepIdx + 1} / {quizSteps.length}</span>
          <div className="flex gap-2">
            {quizSteps.map((_, i) => (
              <div key={i} className={`h-1.5 w-16 rounded-full transition-all duration-700 ${i === currentStepIdx ? 'bg-indigo-500 w-24 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
        <div className="w-20"></div>
      </header>
      <main className="flex-1 overflow-y-auto px-8 py-12 relative z-10 flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-16">
          <h2 className="text-4xl md:text-5xl font-black leading-[1.2] text-white tracking-tight text-center">
            {quizSteps[currentStepIdx].question}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {quizSteps[currentStepIdx].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left px-10 py-8 rounded-[36px] font-black text-xl transition-all border-2 active:scale-95 ${
                  isAnswered && idx === quizSteps[currentStepIdx].correctAnswer 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : isAnswered && idx === selectedOption 
                    ? 'bg-rose-500 border-rose-500 text-white' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {isAnswered && (
            <button 
              onClick={nextStep}
              className="w-full bg-white text-black py-6 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              继续进化 <ArrowRight size={24} />
            </button>
          )}
        </div>
      </main>
    </div>
  );

  const renderCompleted = () => (
    <div className="h-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center space-y-12">
      <div className="w-40 h-40 bg-emerald-500 rounded-[56px] flex items-center justify-center text-white shadow-[0_30px_90px_rgba(16,185,129,0.5)]">
        <CheckCircle2 size={88} strokeWidth={1} />
      </div>
      <div className="space-y-4">
        <h1 className="text-7xl font-black text-white tracking-tighter">思维共鸣达成</h1>
        <p className="text-slate-400 text-2xl font-medium max-w-xl mx-auto leading-relaxed">
          你已彻底解构这篇文章。核心逻辑已同步至长期记忆。
        </p>
      </div>
      <button onClick={onBack} className="bg-indigo-600 text-white px-12 py-6 rounded-[36px] font-black text-xl active:scale-95 transition-all">
        返回指挥中心
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden relative">
      <main className="flex-1 relative z-10 h-full">
        {viewState === 'loading' && renderLoading()}
        {viewState === 'preview' && renderReader()}
        {viewState === 'quiz' && renderQuiz()}
        {viewState === 'completed' && renderCompleted()}
      </main>
    </div>
  );
};

export default ReaderView;
