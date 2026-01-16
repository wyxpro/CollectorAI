
import React, { useState } from 'react';
import { 
  Search, 
  Grid2X2, 
  List, 
  Plus, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  Link as LinkIcon
} from 'lucide-react';
import { Article } from '../types';

interface LibraryViewProps {
  onSelectArticle: (id: string) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ onSelectArticle }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const statusMap: Record<string, string> = {
    'pending': '等待处理',
    'parsed': '已解析',
    'quiz_generated': '挑战已生成',
    'completed': '已读完'
  };

  const articles: Article[] = [
    { 
      id: '1', 
      title: '蔡格尼克效应的心理学原理', 
      author: 'Dr. Jane Smith', 
      source: 'Medium', 
      progress: 45, 
      coverImage: 'https://picsum.photos/seed/psy/800/600',
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
      coverImage: 'https://picsum.photos/seed/ai/800/600',
      wordCount: 2500,
      estimatedTime: 15,
      status: 'parsed'
    },
    { 
      id: '3', 
      title: '为持续参与而设计', 
      author: 'Liam Chen', 
      source: 'UX Collective', 
      progress: 100, 
      coverImage: 'https://picsum.photos/seed/design/800/600',
      wordCount: 1800,
      estimatedTime: 12,
      status: 'completed'
    },
    { 
      id: '4', 
      title: '神经接口的未来', 
      author: 'Sarah Jenkins', 
      source: 'ArXiv', 
      progress: 0, 
      coverImage: 'https://picsum.photos/seed/neuro/800/600',
      wordCount: 5000,
      estimatedTime: 30,
      status: 'pending'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">图书馆</h1>
          <p className="text-slate-500">整理并处理你收藏的阅读材料。</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus size={20} /> 添加新文章
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索文章..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
              />
           </div>
           <select className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 focus:outline-none">
              <option>所有状态</option>
              <option>未读</option>
              <option>阅读中</option>
              <option>已完成</option>
           </select>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-200/50 rounded-xl self-start">
           <button 
             onClick={() => setViewMode('grid')}
             className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <Grid2X2 size={18} />
           </button>
           <button 
             onClick={() => setViewMode('list')}
             className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <List size={18} />
           </button>
        </div>
      </div>

      {/* Article Grid/List */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
        {articles.map(article => (
          <div 
            key={article.id} 
            onClick={() => onSelectArticle(article.id)}
            className={`group bg-white border border-slate-200 transition-all cursor-pointer ${
              viewMode === 'grid' 
              ? "rounded-3xl overflow-hidden hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5" 
              : "rounded-2xl p-4 flex items-center gap-6 hover:border-indigo-300"
            }`}
          >
            {/* Cover Image */}
            <div className={`${viewMode === 'grid' ? 'h-48 w-full' : 'w-20 h-20 shrink-0'} overflow-hidden bg-slate-100 relative`}>
              <img src={article.coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={article.title} />
              {article.progress === 100 && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-emerald-600 p-1.5 rounded-xl shadow-lg animate-in zoom-in">
                  <CheckCircle2 size={16} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1'}`}>
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{article.source}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400">{article.estimatedTime}分钟</span>
                 </div>
                 <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
              </div>
              <h3 className={`font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors ${viewMode === 'grid' ? 'line-clamp-2 leading-tight' : 'text-lg'}`}>
                {article.title}
              </h3>
              
              <div className="flex items-center justify-between mt-auto">
                 <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${article.progress}%` }} />
                 </div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{statusMap[article.status]}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Import Blank Card */}
        {viewMode === 'grid' && (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer group h-full min-h-[300px]">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <LinkIcon className="text-slate-400" size={24} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">从 URL 导入</h4>
            <p className="text-sm text-slate-500">粘贴来自 Medium、微信或任何网页文章的链接。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
