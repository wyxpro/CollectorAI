
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  BookOpen, 
  Star,
  Sparkles,
  Youtube,
  MessageCircle,
  Loader2,
  Tv,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  History,
  Link as LinkIcon
} from 'lucide-react';

interface DashboardProps {
  onStartReading: (id: string, url?: string) => void;
}

interface HistoryItem {
  id: string;
  url: string;
  title: string;
  timestamp: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartReading }) => {
  const [inputValue, setInputValue] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('read_history');
    if (saved) {
      setHistory(JSON.parse(saved).slice(0, 3));
    }
  }, []);

  const handleImport = (urlToUse?: string) => {
    const url = urlToUse || inputValue;
    if (!url.trim()) return;
    
    setIsImporting(true);
    // Simulate high-speed AI analysis
    setTimeout(() => {
      setIsImporting(false);
      onStartReading('new_article_id', url);
    }, 800);
  };

  const stats = [
    { label: '已读文章', value: '12', icon: <BookOpen className="text-blue-500" size={18} />, trend: '+2', color: 'blue' },
    { label: '挑战积分', value: '1,280', icon: <Target className="text-emerald-500" size={18} />, trend: '98%', color: 'emerald' },
    { label: '知识卡片', value: '256', icon: <Star className="text-indigo-500" size={18} />, trend: '+12', color: 'indigo' },
    { label: '连续打卡', value: '4', icon: <Flame className="text-orange-500" size={18} />, trend: '天', color: 'orange' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:px-10 space-y-10 animate-in fade-in duration-700">
      
      {/* 头部：品牌感欢迎语 */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">探索者等级 4</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400 text-xs font-medium">距离升级还需 240 XP</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">你好, Felix! 👋</h1>
          <p className="text-slate-500 font-medium text-sm">今天想从哪里开始你的思维博弈？</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左侧主行动区 (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 核心导入面板 */}
          <section className="relative overflow-hidden bg-white border border-slate-200/60 rounded-[48px] p-8 md:p-12 shadow-xl shadow-slate-200/30">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none select-none">
               <div className="absolute top-10 right-10 opacity-[0.05] rotate-12">
                 <Sparkles size={240} />
               </div>
            </div>

            <div className="relative z-10 flex flex-col items-center md:items-start gap-10">
              <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                <div className="relative h-24 w-40 shrink-0 hidden sm:block">
                  <div className="absolute top-2 left-0 w-16 h-16 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center -rotate-12 shadow-md">
                    <Youtube className="text-red-500" size={24} />
                  </div>
                  <div className="absolute top-0 left-12 w-20 h-20 bg-white rounded-3xl border border-slate-100 flex items-center justify-center shadow-2xl z-10 scale-110">
                    <MessageCircle className="text-emerald-500" size={36} fill="currentColor" fillOpacity={0.1} />
                  </div>
                  <div className="absolute top-2 right-0 w-16 h-16 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center rotate-12 shadow-md">
                    <Tv className="text-blue-500" size={24} />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">知识解构指挥中心</h2>
                  <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                    AI 将为你拆解深度长文、视频或对话，提取认知切片并转化为互动挑战。
                  </p>
                </div>
              </div>

              <div className="w-full space-y-6">
                <div className="flex items-center bg-slate-50/80 border border-slate-200 rounded-[28px] p-2 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/20 transition-all duration-300 shadow-inner">
                  <div className="pl-6 text-slate-400">
                    <LinkIcon size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                    placeholder="粘贴文章、博客或 YouTube 链接..." 
                    className="flex-1 bg-transparent px-4 py-4 outline-none text-slate-800 placeholder:text-slate-400 font-medium text-sm"
                  />
                  <button 
                    onClick={() => handleImport()}
                    disabled={isImporting || !inputValue}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-[22px] text-sm font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center gap-2 group disabled:opacity-30 disabled:grayscale"
                  >
                    {isImporting ? <Loader2 className="animate-spin" size={18} /> : (
                      <>
                        立即分析
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* 历史记录/快速访问 */}
                {history.length > 0 && (
                  <div className="animate-in slide-in-from-top-2 duration-500 space-y-3">
                    <div className="flex items-center gap-2 px-4">
                      <History size={14} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最近分析过的链接</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {history.map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => handleImport(item.url)}
                          className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl text-[11px] font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md transition-all flex items-center gap-2 max-w-[200px]"
                        >
                          <span className="truncate">{item.title}</span>
                          <ArrowRight size={12} className="shrink-0 opacity-40" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 每日挑战卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[40px] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-indigo-100">
                <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                   <Target size={180} />
                </div>
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center gap-2">
                     <Zap size={16} className="text-emerald-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">每日任务</span>
                   </div>
                   <h3 className="text-2xl font-black">完成 3 场知识博弈</h3>
                   <p className="text-indigo-100/70 text-sm leading-relaxed">解锁 3 个知识片段，可获得“深度阅读者”双倍积分奖励。</p>
                </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-[40px] p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                     <TrendingUp size={16} className="text-indigo-600" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">热门讨论</span>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 line-clamp-2">Scaling Law 的终局是什么？</h3>
                </div>
                <button className="mt-6 flex items-center gap-2 text-indigo-600 font-black text-sm group-hover:translate-x-2 transition-all">
                   加入挑战 <ArrowRight size={16} />
                </button>
             </div>
          </div>
        </div>

        {/* 右侧边栏 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50/50 rounded-[40px] border border-slate-200 p-6 space-y-6">
             <div className="px-2 flex items-center justify-between">
                <h3 className="font-black text-slate-900 tracking-tight">学习快报</h3>
                <Clock size={18} className="text-slate-300" />
             </div>

             <div className="grid grid-cols-1 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-[28px] border border-white shadow-sm flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        stat.color === 'blue' ? 'bg-blue-50' : 
                        stat.color === 'emerald' ? 'bg-emerald-50' : 
                        stat.color === 'indigo' ? 'bg-indigo-50' : 'bg-orange-50'
                      }`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                        <p className="text-xl font-black text-slate-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
