
import React, { useState, useRef } from 'react';
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
  Zap,
  X,
  QrCode,
  Link as LinkIcon,
  BrainCircuit,
  Palette,
  Check,
  Star
} from 'lucide-react';
import { KnowledgeCard } from '../types';

// --- Theme System ---

interface CardTheme {
  id: string;
  name: string;
  type: 'tech' | 'art' | 'business' | 'minimal';
  bgClass: string;
  textClass: string; // For main text
  subTextClass: string; // For labels/secondary text
  accentClass: string; // For icons/highlights
  description: string;
  renderBackground?: () => React.ReactNode; // Custom dynamic background
}

const THEMES: CardTheme[] = [
  {
    id: 'default-indigo',
    name: '极光紫',
    type: 'tech',
    bgClass: 'bg-gradient-to-br from-indigo-600 to-violet-700',
    textClass: 'text-white',
    subTextClass: 'text-white/60',
    accentClass: 'bg-white/20 text-white',
    description: '经典的科技感渐变，适合大多数场景。'
  },
  {
    id: 'cosmos',
    name: '星空流转',
    type: 'tech',
    bgClass: 'bg-slate-900',
    textClass: 'text-white',
    subTextClass: 'text-slate-400',
    accentClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    description: '深邃的宇宙背景，带有微弱的星光闪烁动画。',
    renderBackground: () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-white rounded-full top-1/4 left-1/4 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ animationDuration: '3s' }} />
        <div className="absolute w-1 h-1 bg-blue-200 rounded-full top-3/4 left-1/3 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-1/3 right-1/4 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent rotate-45 animate-[spin_20s_linear_infinite]" />
      </div>
    )
  },
  {
    id: 'paper',
    name: '纸张翻页',
    type: 'art',
    bgClass: 'bg-[#fdfbf7]',
    textClass: 'text-slate-800',
    subTextClass: 'text-slate-500',
    accentClass: 'bg-stone-200 text-stone-600',
    description: '温暖的纸质触感，适合人文社科类内容。',
    renderBackground: () => (
      <div className="absolute inset-0 pointer-events-none opacity-50" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")` }} 
      />
    )
  },
  {
    id: 'sunset',
    name: '晨曦微光',
    type: 'art',
    bgClass: 'bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200',
    textClass: 'text-slate-900',
    subTextClass: 'text-slate-700',
    accentClass: 'bg-white/30 text-rose-700 backdrop-blur-sm',
    description: '柔和的暖色调，充满希望与活力。',
    renderBackground: () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-overlay">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>
    )
  },
  {
    id: 'business-blue',
    name: '深蓝商务',
    type: 'business',
    bgClass: 'bg-gradient-to-b from-slate-800 to-slate-900',
    textClass: 'text-white',
    subTextClass: 'text-slate-400',
    accentClass: 'bg-sky-500/20 text-sky-400 border border-sky-500/20',
    description: '专业冷静的商务风格。',
    renderBackground: () => (
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
    )
  }
];

const KnowledgeBase: React.FC = () => {
  const [viewMode, setViewMode] = useState<'gallery' | 'grid'>('gallery');
  const [activeIndex, setActiveIndex] = useState(0);
  const [shareCard, setShareCard] = useState<KnowledgeCard | null>(null);
  
  // Theme States
  const [currentThemeId, setCurrentThemeId] = useState('default-indigo');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [favoriteThemes, setFavoriteThemes] = useState<string[]>(['default-indigo', 'cosmos']);

  const sampleCards: KnowledgeCard[] = [
    {
      id: '1',
      originalContent: "Scaling Law 的本质并不是工程参数的堆砌，而是转化为“逻辑熵",
      reflection: "这意味着 AI 的竞争终局可能是能源成本的竞争。对于个人而言，这意味着 we 应该更关注‘提问的质量’而非‘计算的速度’，因为逻辑序的产出成本正在急剧下降。",
      tags: ['AI 哲学', '物理学'],
      createdAt: '2024-03-20',
      articleTitle: 'Scaling Law 与智能终局',
      articleImage: 'https://picsum.photos/seed/ai/800/600'
    },
    {
      id: '2',
      originalContent: "蔡格尼克效应：大脑对尚未结账的订单，比已经结账的订单记忆更好。",
      reflection: "这是一个关于‘任务闭环’的诅咒。要对抗焦虑，不是去完成所有事，而是学会如何优雅地‘挂起’那些无法立即完成的事，欺骗大脑它已进入存储区。",
      tags: ['心理学', '生产力'],
      createdAt: '2024-03-18',
      articleTitle: '心智的逻辑缺陷',
      articleImage: 'https://picsum.photos/seed/psy/800/600'
    },
    {
      id: '3',
      originalContent: "未来的设计不再是关于像素的排列，而是关于‘意图’的捕获与共鸣。",
      reflection: "界面（UI）将消失，取而代之的是服务（Service）。设计师的角色将从‘画师’转变为‘行为剧作家’，为 AI 设定剧本。这对传统 UX 是一次降维打击。",
      tags: ['设计趋势', 'UX'],
      createdAt: '2024-03-15',
      articleTitle: '为持续参与而设计',
      articleImage: 'https://picsum.photos/seed/design/800/600'
    },
    {
      id: '4',
      originalContent: "深度工作（Deep Work）不是一种过时的技能，而是一项在 21 世纪经济中日益罕见的‘超能力’。",
      reflection: "在碎片化信息轰炸的时代，能够长时间专注处理高认知任务的能力就是核心竞争力。这不仅是工作方法，更是大脑认知的再训练过程。",
      tags: ['生产力', '认知'],
      createdAt: '2024-03-12',
      articleTitle: '专注力夺还战',
      articleImage: 'https://picsum.photos/seed/work/800/600'
    },
    {
      id: '5',
      originalContent: "我们不是在阅读书籍，而是在通过书籍阅读自己。",
      reflection: "每一本引起共鸣的书都是一面镜子。阅读的本质不是获取外部信息，而是激活内部已有的认知种子，并让它们在新的上下文中发芽。",
      tags: ['哲学', '阅读方法'],
      createdAt: '2024-03-10',
      articleTitle: '镜面阅读法',
      articleImage: 'https://picsum.photos/seed/book/800/600'
    }
  ];

  // Smart Recommendation Logic
  const currentCard = sampleCards[activeIndex];
  const recommendedThemeId = React.useMemo(() => {
    const tags = currentCard.tags.join(' ');
    if (tags.includes('设计') || tags.includes('心理')) return 'paper';
    if (tags.includes('AI') || tags.includes('物理')) return 'cosmos';
    if (tags.includes('生产力')) return 'business-blue';
    return 'default-indigo';
  }, [currentCard]);

  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteThemes(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % sampleCards.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + sampleCards.length) % sampleCards.length);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 h-full flex flex-col relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 shrink-0 z-20 relative">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">知识博弈库</h1>
          <p className="text-slate-500 font-medium">已同步 256 个思维切片，它们正潜伏在你的直觉中。</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
             onClick={() => setShowThemeSelector(!showThemeSelector)}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border ${showThemeSelector ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
          >
             <Palette size={16} />
             <span>皮肤库</span>
             <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded text-[10px]">{THEMES.length}</span>
          </button>

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
        </div>
      </header>

      {/* Theme Selector Panel */}
      {showThemeSelector && (
        <div className="absolute top-28 right-6 z-30 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-slate-800">动态皮肤库</h3>
             <button onClick={() => setShowThemeSelector(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={16} /></button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
             {/* Recommended Section */}
             {recommendedThemeId && (
               <div className="mb-2">
                  <div className="flex items-center gap-2 mb-2">
                     <Sparkles size={14} className="text-amber-500" />
                     <span className="text-xs font-bold text-amber-600 uppercase">AI 智能推荐</span>
                  </div>
                  <div 
                    onClick={() => setCurrentThemeId(recommendedThemeId)}
                    className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${currentThemeId === recommendedThemeId ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-100 hover:border-indigo-300'}`}
                  >
                     <div className={`h-20 ${THEMES.find(t => t.id === recommendedThemeId)?.bgClass}`}></div>
                     <div className="p-3 bg-white">
                        <div className="flex justify-between items-center">
                           <span className="font-bold text-sm text-slate-800">{THEMES.find(t => t.id === recommendedThemeId)?.name}</span>
                           {currentThemeId === recommendedThemeId && <Check size={16} className="text-indigo-600" />}
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {/* All Themes */}
             <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">所有皮肤</h4>
               <div className="grid grid-cols-1 gap-3">
                 {THEMES.map(theme => (
                   <div 
                     key={theme.id}
                     onClick={() => setCurrentThemeId(theme.id)}
                     className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all flex ${currentThemeId === theme.id ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200 bg-white'}`}
                   >
                      <div className={`w-20 h-20 shrink-0 ${theme.bgClass}`}></div>
                      <div className="p-3 flex-1 min-w-0 flex flex-col justify-center">
                         <div className="flex justify-between items-start mb-1">
                            <span className={`font-bold text-sm ${currentThemeId === theme.id ? 'text-indigo-700' : 'text-slate-800'}`}>{theme.name}</span>
                            <button onClick={(e) => toggleFavorite(theme.id, e)} className="text-slate-300 hover:text-amber-400 transition-colors">
                               <Star size={14} fill={favoriteThemes.includes(theme.id) ? "currentColor" : "none"} className={favoriteThemes.includes(theme.id) ? "text-amber-400" : ""} />
                            </button>
                         </div>
                         <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{theme.description}</p>
                      </div>
                      {currentThemeId === theme.id && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                      )}
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      )}

      {viewMode === 'gallery' ? (
        <div className="flex-1 flex flex-col items-center justify-center relative py-10 overflow-hidden">
          <div className="w-full max-w-lg relative perspective-1000 h-[500px]">
            {sampleCards.map((card, idx) => {
              const offset = idx - activeIndex;
              const isCenter = idx === activeIndex;
              const isVisible = Math.abs(offset) <= 1 || (idx === 0 && activeIndex === sampleCards.length - 1) || (idx === sampleCards.length - 1 && activeIndex === 0);
              
              if (!isVisible) return null;

              const pointerEvents: 'auto' | 'none' = isCenter ? 'auto' : 'none';

              return (
                <InteractiveCard 
                  key={card.id} 
                  card={card} 
                  theme={THEMES[idx % THEMES.length]}
                  onShare={() => setShareCard(card)}
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
                   <div className="flex gap-2">
                     <button onClick={() => setShareCard(card)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                       <Share2 size={16} />
                     </button>
                     <MoreHorizontal size={16} className="text-slate-300" />
                   </div>
                </div>
                <p className="text-slate-800 font-bold mb-8 leading-relaxed line-clamp-3">"{card.originalContent}"</p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map(t => <span key={t} className="text-[10px] font-bold text-slate-400">#{t}</span>)}
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Share Poster Modal */}
      {shareCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="absolute top-8 right-8">
            <button 
              onClick={() => setShareCard(null)}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/10"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-6 max-w-full scale-90 md:scale-100">
            {/* The Poster Image UI */}
            <div id="share-poster" className="bg-white w-[360px] rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500 border border-white/20">
              <div className={`h-40 ${currentTheme.bgClass} p-8 ${currentTheme.textClass} relative overflow-hidden`}>
                {currentTheme.renderBackground && currentTheme.renderBackground()}
                {!currentTheme.renderBackground && <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>}
                
                <div className="relative z-10 flex flex-col justify-end h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 ${currentTheme.accentClass} backdrop-blur-md rounded-md flex items-center justify-center`}>
                      <BrainCircuit size={12} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${currentTheme.subTextClass} opacity-80`}>Collector + 思维切片</span>
                  </div>
                  <h3 className="text-xl font-black leading-tight line-clamp-2 tracking-tight">{shareCard.articleTitle}</h3>
                </div>
              </div>
              
              <div className="p-8 space-y-6 bg-white">
                <div className="relative">
                  <span className="text-6xl text-indigo-50 font-serif absolute -top-8 -left-4 select-none leading-none">“</span>
                  <p className="text-lg font-black text-slate-900 leading-[1.6] relative z-10 tracking-tight">
                    {shareCard.originalContent}
                  </p>
                </div>
  
                {/* Image Replaces Reflection */}
                {shareCard.articleImage && (
                  <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-video group transform transition-all hover:shadow-md">
                     <img 
                       src={shareCard.articleImage} 
                       alt="Article Cover"
                       className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                     <div className="absolute bottom-2 left-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <LinkIcon size={10} />
                        <span>阅读原文</span>
                     </div>
                  </div>
                )}
  
                <div className="flex items-end justify-between pt-6 border-t border-slate-100">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {shareCard.tags.map(t => (
                        <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200/50">#{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <BrainCircuit size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 leading-none mb-0.5">Collector +</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Gamified Mastery</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2 shrink-0">
                    <div className="p-2 bg-white border-2 border-slate-50 rounded-[20px] shadow-sm ring-1 ring-slate-100">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://readai.app/share/${shareCard.id}&bgcolor=ffffff&color=4f46e5`} 
                        alt="Article QR" 
                        className="w-16 h-16"
                      />
                    </div>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">扫码探索全文</p>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="flex gap-6 w-full max-w-[400px]">
              <button 
                onClick={() => {
                  alert('正在生成高清图片并保存到相册...');
                }}
                className="flex-1 bg-white text-slate-900 px-8 py-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Download size={22} />
                <span>保存海报</span>
              </button>
              <button className="flex-1 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-5 rounded-3xl font-black hover:bg-white/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                <Share2 size={20} />
                <span>分享</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InteractiveCardProps {
  card: KnowledgeCard;
  theme: CardTheme;
  style: React.CSSProperties;
  onShare: () => void;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ card, theme, style, onShare }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="absolute inset-0 cursor-pointer transition-all duration-700 ease-out preserve-3d"
      style={style}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full flip-card-inner preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* 正面: 金句/观点 */}
        <div className={`absolute inset-0 ${theme.bgClass} rounded-[48px] p-12 ${theme.textClass} flex flex-col backface-hidden shadow-2xl overflow-hidden`}>
           {/* Dynamic Background Render */}
           {theme.renderBackground && theme.renderBackground()}

           {!theme.renderBackground && <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>}
           
           <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 ${theme.accentClass} backdrop-blur rounded-xl flex items-center justify-center`}>
                    <Sparkles size={20} />
                 </div>
                 <span className={`text-xs font-black uppercase tracking-[0.2em] ${theme.subTextClass}`}>{card.articleTitle}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className={`p-2 hover:bg-white/10 rounded-full transition-all ${theme.subTextClass} hover:opacity-100 opacity-60`}
              >
                <Share2 size={20} />
              </button>
           </div>

           <div className="flex-1 flex flex-col justify-center relative z-10">
              <span className={`text-6xl serif ${theme.subTextClass} opacity-20 mb-4 leading-none select-none`}>“</span>
              <p className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                {card.originalContent}
              </p>
              <div className="mt-8 flex gap-3">
                 {card.tags.map(tag => (
                   <span key={tag} className={`px-3 py-1 ${theme.accentClass} backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest`}>
                     {tag}
                   </span>
                 ))}
              </div>
           </div>

           <div className="mt-12 flex items-center justify-between relative z-10">
              <div className={`text-[10px] font-black ${theme.subTextClass} uppercase tracking-widest opacity-60`}>点击翻转以深入解构</div>
              <RefreshCcw size={16} className={`${theme.subTextClass} opacity-60`} />
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
                <span className="block text-[10px] font-bold text-slate-400">GENERATED BY GEMINI 3</span>
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
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare();
                      }}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all" 
                      title="生成分享海报"
                    >
                       <QrCode size={18} />
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
