
import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  Zap, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  Star,
  Link as LinkIcon,
  FileText,
  Sparkles,
  Youtube,
  Globe,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { Article } from '../types';

interface DashboardProps {
  onStartReading: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartReading }) => {
  const [importMode, setImportMode] = useState<'url' | 'text'>('url');
  const [inputValue, setInputValue] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = () => {
    if (!inputValue.trim()) return;
    setIsImporting(true);
    // 模拟导入过程
    setTimeout(() => {
      setIsImporting(false);
      setInputValue('');
      alert('文章已加入图书馆，AI 正在解析中...');
    }, 2000);
  };

  const stats = [
    { label: '已读文章', value: '12', icon: <BookOpen className="text-blue-500" />, trend: '本周 +2' },
    { label: '完成挑战', value: '48', icon: <Zap className="text-yellow-500" />, trend: '98% 正确率' },
    { label: '知识卡片', value: '256', icon: <Star className="text-indigo-500" />, trend: '今日 +12' },
    { label: '阅读打卡', value: '4天', icon: <Flame className="text-orange-500" />, trend: '历史新高!' },
  ];

  const recentArticles: Article[] = [
    { 
      id: '1', 
      title: '蔡格尼克效应的心理学原理', 
      author: 'Dr. Jane Smith', 
      source: 'Medium', 
      progress: 45, 
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800&h=400',
      wordCount: 1200,
      estimatedTime: 8,
      status: 'quiz_generated'
    },
    { 
      id: '2', 
      title: 'AI 如何重塑人类的好奇心', 
      author: 'Tech Insight', 
      source: 'Scientific American', 
      progress: 0, 
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=400',
      wordCount: 2500,
      estimatedTime: 15,
      status: 'parsed'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">欢迎回来，探索者！ 👋</h1>
          <p className="text-slate-500">准备好今天解锁一些新知识了吗？</p>
        </div>
      </header>

      {/* 科技感导入组件 */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[40px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white border border-slate-200 rounded-[40px] p-8 md:p-10 shadow-xl overflow-hidden">
          {/* 背景装饰图标 */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <Sparkles size={120} />
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* 左侧：视觉引导 */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:w-1/3">
              <div className="flex -space-x-4 mb-2">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 border border-slate-100 rotate-[-10deg] hover:rotate-0 transition-transform cursor-pointer">
                  <img src="https://www.bilibili.com/favicon.ico" className="w-full grayscale group-hover:grayscale-0 transition-all" alt="Bilibili" />
                </div>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-3 border border-slate-100 z-10 hover:scale-110 transition-transform cursor-pointer">
                  <MessageCircle className="text-emerald-500" size={32} fill="currentColor" fillOpacity={0.1} />
                </div>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 border border-slate-100 rotate-[10deg] hover:rotate-0 transition-transform cursor-pointer">
                  <Youtube className="text-red-500" size={32} fill="currentColor" fillOpacity={0.1} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">收入你想收的</h2>
                <p className="text-slate-500 text-sm leading-relaxed">粘贴链接或文本内容，AI 将为你拆解重点，并转化为闯关模式。</p>
              </div>
            </div>

            {/* 右侧：输入区域 */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                <button 
                  onClick={() => setImportMode('url')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${importMode === 'url' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <LinkIcon size={16} /> 网页链接
                </button>
                <button 
                  onClick={() => setImportMode('text')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${importMode === 'text' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <FileText size={16} /> 粘贴文本
                </button>
              </div>

              <div className="relative group/input">
                {importMode === 'url' ? (
                  <div className="relative flex items-center">
                    <div className="absolute left-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                      <Globe size={20} />
                    </div>
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="https://mp.weixin.qq.com/s/..." 
                      className="w-full pl-14 pr-32 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-lg font-medium shadow-inner"
                    />
                    <button 
                      onClick={handleImport}
                      disabled={isImporting || !inputValue}
                      className="absolute right-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-[18px] font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95"
                    >
                      {isImporting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                      {isImporting ? '处理中' : '开始解析'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="在这里粘贴你想要阅读或学习的长文本内容..." 
                      className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:outline-none focus:border-indigo-500 focus:bg-white transition-all min-h-[160px] text-lg font-medium shadow-inner resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleImport}
                        disabled={isImporting || !inputValue}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-10 py-4 rounded-[18px] font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95"
                      >
                        {isImporting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {isImporting ? '解析内容中...' : '生成互动阅读'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl">{stat.icon}</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Continue Reading Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">继续阅读</h2>
            <button className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              查看全部 <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentArticles.map(article => (
              <div 
                key={article.id} 
                className="bg-white group overflow-hidden rounded-3xl border border-slate-200 flex flex-col md:flex-row hover:border-indigo-200 transition-all cursor-pointer"
                onClick={() => onStartReading(article.id)}
              >
                <div className="w-full md:w-48 h-32 md:h-auto overflow-hidden">
                  <img src={article.coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={article.title} />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-indigo-500 tracking-wider">{article.source}</span>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock size={12} /> {article.estimatedTime} 分钟阅读
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{article.title}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${article.progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{article.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gamification Sidebar */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">当前等级</p>
                <p className="text-lg font-bold">博学贤者</p>
              </div>
            </div>
            <p className="text-indigo-100 text-sm mb-4">还差 240 XP 即可到达 <b>神启者</b> 等级！</p>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-white rounded-full" style={{ width: '70%' }} />
            </div>
            <div className="flex justify-between text-xs font-medium text-indigo-100">
              <span>760 XP</span>
              <span>1000 XP</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">进行中的挑战</h3>
            <div className="space-y-4">
              <ChallengeItem title="深度探索者" desc="阅读 3 篇超过 2000 字的文章" progress={2} total={3} />
              <ChallengeItem title="挑战大师" desc="获得 10 次满分挑战" progress={7} total={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChallengeItem: React.FC<{ title: string; desc: string; progress: number; total: number }> = ({ title, desc, progress, total }) => (
  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
    <h4 className="text-sm font-bold text-slate-900">{title}</h4>
    <p className="text-xs text-slate-500 mb-3">{desc}</p>
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500" style={{ width: `${(progress/total)*100}%` }} />
      </div>
      <span className="text-xs font-bold text-indigo-600">{progress}/{total}</span>
    </div>
  </div>
);

export default Dashboard;
