
import React, { useState } from 'react';
import { 
  Search, 
  Tag, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  NotebookPen, 
  Share2, 
  Trash2,
  RefreshCcw,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Download,
  Sparkles,
  Zap
} from 'lucide-react';
import { KnowledgeCard } from '../types';

const KnowledgeBase: React.FC = () => {
  const [viewMode, setViewMode] = useState<'gallery' | 'grid'>('gallery');
  const [activeIndex, setActiveIndex] = useState(0);

  const sampleCards: KnowledgeCard[] = [
    {
      id: '1',
      originalContent: "Scaling Law 的本质并不是工程参数的堆砌，而是将‘能源’转化为‘逻辑熵’的物理过程。",
      reflection: "这意味着 AI 的竞争终局可能是能源成本的竞争。对于个人而言，这意味着我们应该更关注‘提问的质量’而非‘计算的速度’，因为逻辑序的产出成本正在急剧下降。",
      tags: ['AI 哲学', '物理学'],
      createdAt: '2024-03-20',
      articleTitle: 'Scaling Law 与智能终局',
    },
    {
      id: '2',
      originalContent: "蔡格尼克效应：大脑对尚未结账的订单，比已经结账的订单记忆更好。",
      reflection: "这是一个关于‘任务闭环’的诅咒。要对抗焦虑，不是去完成所有事，而是学会如何优雅地‘挂起’那些无法立即完成的事，欺骗大脑它已进入存储区。",
      tags: ['心理学', '生产力'],
      createdAt: '2024-03-18',
      articleTitle: '心智的逻辑缺陷',
    },
    {
      id: '3',
      originalContent: "未来的设计不再是关于像素的排列，而是关于‘意图’的捕获与共鸣。",
      reflection: "界面（UI）将消失，取而代之的是服务（Service）。设计师的角色将从‘画师’转变为‘行为剧作家’，为 AI 设定剧本。这对传统 UX 是一次降维打击。",
      tags: ['设计趋势', 'UX'],
      createdAt: '2024-03-15',
      articleTitle: '为持续参与而设计',
    }
  ];

  const themes = [
    "from-indigo-600 to-violet-700",
    "from-emerald-500 to-teal-700",
    "from-rose-500 to-orange-600",
    "from-blue-600 to-cyan-500",
    "from-amber-500 to-orange-500"
  ];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % sampleCards.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + sampleCards.length) % sampleCards.length);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">知识博弈库</h1>
          <p className="text-slate-500 font-medium">已同步 256 个思维切片，它们正潜伏在你的直觉中。</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode('gallery')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'gallery' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            沉浸画廊
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            全量矩阵
          </button>
        </div>
      </header>

      {viewMode === 'gallery' ? (
        <div className="flex-1 flex flex-col items-center justify-center relative py-10 overflow-hidden">
          <div className="w-full max-w-lg relative perspective-1000 h-[500px]">
            {sampleCards.map((card, idx) => {
              const offset = idx - activeIndex;
              const isCenter = idx === activeIndex;
              const isVisible = Math.abs(offset) <= 1 || (idx === 0 && activeIndex === sampleCards.length - 1) || (idx === sampleCards.length - 1 && activeIndex === 0);
              
              if (!isVisible) return null;

              // Use correct typing for pointerEvents to satisfy React.CSSProperties
              const pointerEvents: 'auto' | 'none' = isCenter ? 'auto' : 'none';

              return (
                <InteractiveCard 
                  key={card.id} 
                  card={card} 
                  theme={themes[idx % themes.length]}
                  style={{
                    transform: `translateX(${offset * 105}%) scale(${isCenter ? 1 : 0.85}) rotate(${offset * 5}deg)`,
                    opacity: isCenter ? 1 : 0.4,
                    zIndex: isCenter ? 10 : 5,
                    pointerEvents,
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-12 mt-16">
            <button onClick={handlePrev} className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all active:scale-95">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              {sampleCards.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
              ))}
            </div>
            <button onClick={handleNext} className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all active:scale-95">
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
           {sampleCards.map((card, idx) => (
             <div key={card.id} className="bg-white border border-slate-200 rounded-[32px] p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                <div className="flex justify-between items-start mb-6">
                   <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg tracking-widest">{card.articleTitle}</span>
                   <MoreHorizontal size={16} className="text-slate-300" />
                </div>
                <p className="text-slate-800 font-bold mb-8 leading-relaxed line-clamp-3">"{card.originalContent}"</p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map(t => <span key={t} className="text-[10px] font-bold text-slate-400">#{t}</span>)}
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

// Define InteractiveCard as a React.FC to handle standard props like 'key' correctly
interface InteractiveCardProps {
  card: KnowledgeCard;
  theme: string;
  style: React.CSSProperties;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ card, theme, style }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="absolute inset-0 cursor-pointer transition-all duration-700 ease-out preserve-3d"
      style={style}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full flip-card-inner preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* 正面: 金句/观点 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme} rounded-[48px] p-12 text-white flex flex-col backface-hidden shadow-2xl overflow-hidden`}>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
           
           <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Sparkles size={20} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-[0.2em]">{card.articleTitle}</span>
              </div>
              <Share2 size={20} className="text-white/60" />
           </div>

           <div className="flex-1 flex flex-col justify-center relative z-10">
              <span className="text-6xl serif text-white/20 mb-4 leading-none select-none">“</span>
              <p className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                {card.originalContent}
              </p>
              <div className="mt-8 flex gap-3">
                 {card.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest">
                     {tag}
                   </span>
                 ))}
              </div>
           </div>

           <div className="mt-12 flex items-center justify-between relative z-10">
              <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">点击翻转以深入解构</div>
              <RefreshCcw size={16} className="text-white/50" />
           </div>
        </div>

        {/* 背面: AI 解读/反面思维 */}
        <div className="absolute inset-0 bg-white border-4 border-slate-50 rounded-[48px] p-12 text-slate-900 flex flex-col backface-hidden rotate-y-180 shadow-2xl">
           <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                 <Zap size={20} fill="white" />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-indigo-600 tracking-widest">AI 思维沉淀</span>
                <span className="block text-[10px] font-bold text-slate-400">GENERATED BY GEMINI 2.0</span>
              </div>
           </div>

           <div className="flex-1">
              <h4 className="text-xl font-black mb-6 text-slate-900">反面视角与深度复盘：</h4>
              <p className="text-lg font-medium text-slate-600 leading-relaxed italic border-l-4 border-indigo-100 pl-6">
                {card.reflection}
              </p>
           </div>

           <div className="mt-auto space-y-6 pt-10 border-t border-slate-50">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-slate-300">
                    <Calendar size={14} />
                    <span className="text-[10px] font-black">{card.createdAt}</span>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all" title="保存为图片">
                       <Download size={18} />
                    </button>
                    <button className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 px-6">
                       <Maximize2 size={18} />
                       <span className="text-xs font-black">展开讨论</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default KnowledgeBase;
