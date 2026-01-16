
import React, { useState } from 'react';
import { Search, Tag, Filter, MoreHorizontal, Calendar, NotebookPen, Share2, Trash2 } from 'lucide-react';
import { KnowledgeCard } from '../types';

const KnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sampleCards: KnowledgeCard[] = [
    {
      id: '1',
      originalContent: "柏林咖啡馆的侍者对尚未结账的订单比已经结账的订单记忆更好。",
      reflection: "这说明大脑如何优先处理活跃的“闭环”而非已完成的任务。对我设计生产力系统的启发：让活跃的小任务保持可见！",
      tags: ['心理学', '生产力'],
      createdAt: '2023-11-20',
      articleTitle: '蔡格尼克效应'
    },
    {
      id: '2',
      originalContent: "标题党开启了大脑感到被迫关闭的“好奇心缺口”。",
      reflection: "应用到营销中：不要直接给结果，而是提出那个能引向结果的问题。",
      tags: ['营销', '认知偏差'],
      createdAt: '2023-11-21',
      articleTitle: '现代心理学'
    },
    {
      id: '3',
      originalContent: "格式塔知觉原理建议，大脑会自然地填补缺失的部分以创造一个整体。",
      reflection: "视觉设计的启示：我们不需要展示所有东西。部分信息有时更具吸引力。",
      tags: ['设计', '认知'],
      createdAt: '2023-11-22',
      articleTitle: '格式塔理论基础'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">我的知识卡片</h1>
          <p className="text-slate-500">已在 12 个领域收集了 256 条洞见。</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="搜索灵感、标签、文章..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['全部卡片', '心理学', '设计', '营销', '生产力', '生物'].map((tab, i) => (
          <button 
            key={tab} 
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {sampleCards.map(card => (
          <div key={card.id} className="break-inside-avoid-column bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">
                <NotebookPen size={12} /> {card.articleTitle}
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                 <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"><Share2 size={16} /></button>
                 <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={16} /></button>
              </div>
            </div>

            <blockquote className="border-l-4 border-slate-100 pl-4 py-1 mb-4 italic text-slate-500 text-sm leading-relaxed">
               "{card.originalContent}"
            </blockquote>

            <p className="text-slate-800 font-medium leading-relaxed mb-6">
               {card.reflection}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
               {card.tags.map(tag => (
                 <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                   <Tag size={10} /> {tag}
                 </span>
               ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                  <Calendar size={12} /> {card.createdAt}
               </div>
               <button className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-indigo-600 transition-colors">编辑卡片</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
