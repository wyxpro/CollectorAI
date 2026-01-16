
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings2, 
  Share2, 
  Volume2, 
  BookOpen, 
  Lock, 
  MessageCircleQuestion, 
  Heart,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import QuizCard from '../components/QuizCard';
import { Quiz } from '../types';

interface ReaderViewProps {
  articleId: string;
  onBack: () => void;
}

const ReaderView: React.FC<ReaderViewProps> = ({ articleId, onBack }) => {
  const [unlockedSections, setUnlockedSections] = useState<number>(1);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  const articleData = {
    title: "蔡格尼克效应的心理学原理",
    author: "Dr. Jane Smith",
    source: "Medium",
    content: [
      {
        id: 1,
        title: "未完成任务的心理张力",
        text: "蔡格尼克效应（Zeigarnik effect）是一种心理学现象，指出人们对于未完成或中断的任务比已完成的任务记忆更深刻。在苏联心理学中，布鲁玛·蔡格尼克在她的教授、格式塔心理学家库尔特·勒温注意到一位侍者对尚未结账的订单比已经结账的订单记忆更好后，首次研究了这一现象。",
        unlocked: true
      },
      {
        id: 2,
        title: "侍者悖论",
        text: "勒温观察到柏林一家咖啡馆的侍者似乎能清晰地记住未结账的订单。然而，一旦账单结算完毕，相关信息似乎就从他们的脑海中消失了。蔡格尼克将这一观察带入实验室，发现未完成任务创造的张力使该任务在我们的认知过程中保持活跃。",
        unlocked: false
      },
      {
        id: 3,
        title: "现代生活中的应用",
        text: "今天，蔡格尼克效应无处不在：电视剧中的悬念（cliffhangers）、开启好奇心缺口的标题党，以及软件中驱使我们达到 100% 的进度条。通过理解这种认知偏差，我们可以设计更好的学习系统和个人生产力工作流。",
        unlocked: false
      }
    ]
  };

  const sampleQuiz: Quiz = {
    id: 'q1',
    question: "为什么柏林的侍者在结账后会立即忘记订单信息？",
    options: [
      "结账解除了任务带来的心理张力",
      "侍者被新客户分散了注意力",
      "侍者接受过清除短期记忆的训练",
      "结账作为一种物理屏障阻碍了回忆"
    ],
    correctAnswer: 0,
    explanation: "根据勒温和蔡格尼克的理论，任务的完成（结账）消除了维持工作记忆中信息的“心理张力”。",
    style: 'philosophical'
  };

  const handleQuizSuccess = () => {
    setUnlockedSections(prev => Math.min(prev + 1, articleData.content.length));
    setShowQuiz(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Fixed Top Bar */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{articleData.title}</h1>
              <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">正在解锁第 {unlockedSections} 章</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><Volume2 size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><Share2 size={20} /></button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><Settings2 size={20} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-12">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-4">
             <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{articleData.source}</span>
          </div>
          <h2 className="serif text-4xl md:text-5xl text-slate-900 mb-6 leading-tight">{articleData.title}</h2>
          <div className="flex items-center justify-center gap-4 text-slate-500 font-medium">
             <span>作者：{articleData.author}</span>
             <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
             <span>8 分钟阅读</span>
          </div>
        </header>

        {articleData.content.map((section, idx) => (
          <div key={section.id} className="relative">
            {idx < unlockedSections ? (
              <article className="prose prose-slate prose-lg max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-xl font-bold text-slate-800 mb-4">{section.id}. {section.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {section.text}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-all">
                    <Heart size={16} /> 收藏此灵感
                  </button>
                  <button className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                    暂不收藏
                  </button>
                </div>
              </article>
            ) : (
              <div className="bg-white rounded-[32px] p-10 border-2 border-dashed border-slate-200 flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Lock className="text-slate-400" size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">内容已锁定</h4>
                <p className="text-slate-500 mb-8 max-w-md">通过一个小挑战来解锁下一章节，并赢取 50 XP！</p>
                
                {!showQuiz ? (
                  <button 
                    onClick={() => setShowQuiz(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 flex items-center gap-2"
                  >
                    <MessageCircleQuestion size={20} /> 开始挑战
                  </button>
                ) : (
                  <QuizCard quiz={sampleQuiz} onSuccess={handleQuizSuccess} onCancel={() => setShowQuiz(false)} />
                )}
              </div>
            )}
            
            {idx < articleData.content.length - 1 && (
              <div className="h-24 flex items-center justify-center">
                <div className="w-px h-full bg-gradient-to-b from-slate-200 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Progress */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
          <div className="flex-1">
             <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">知识解锁进度</span>
                <span className="text-xs font-bold text-indigo-600">{Math.round((unlockedSections/articleData.content.length)*100)}%</span>
             </div>
             <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(unlockedSections/articleData.content.length)*100}%` }} />
             </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
             生成播客 <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReaderView;
