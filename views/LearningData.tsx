
import React from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Zap, 
  Brain, 
  Target, 
  Award, 
  Calendar, 
  Flame,
  ChevronRight,
  Clock,
  Rocket,
  Compass,
  Star,
  Activity
} from 'lucide-react';

const LearningData: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">成长数据中心</h1>
          <p className="text-slate-500 font-medium">可视化你的认知进化历程与成就里程碑。</p>
        </div>
        <div className="flex gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100">本月</button>
          <button className="px-4 py-2 text-slate-500 hover:text-slate-900 text-sm font-bold rounded-xl transition-colors">年度</button>
          <button className="px-4 py-2 text-slate-500 hover:text-slate-900 text-sm font-bold rounded-xl transition-colors">全部</button>
        </div>
      </header>

      {/* 第一行：认知成长曲线与核心指标 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={24} /> 认知成长曲线
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <span className="text-xs font-bold text-slate-500">理解深度</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-300 rounded-full" />
                <span className="text-xs font-bold text-slate-500">知识广度</span>
              </div>
            </div>
          </div>
          
          {/* 模拟图表：SVG 绘制 */}
          <div className="h-64 relative mt-12 mb-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* 背景线 */}
              <line x1="0" y1="0" x2="1000" y2="0" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* 数据曲线 1 (主曲线) */}
              <path 
                d="M0,180 C100,160 200,170 300,130 C400,90 500,110 600,60 C700,10 800,40 1000,5" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="animate-[dash_3s_ease-in-out]"
              />
              <path 
                d="M0,180 C100,160 200,170 300,130 C400,90 500,110 600,60 C700,10 800,40 1000,5 L1000,200 L0,200 Z" 
                fill="url(#gradient-blue)" 
              />
              
              {/* 数据点 */}
              <circle cx="300" cy="130" r="6" fill="white" stroke="#6366f1" strokeWidth="3" />
              <circle cx="600" cy="60" r="6" fill="white" stroke="#6366f1" strokeWidth="3" />
              <circle cx="1000" cy="5" r="8" fill="#6366f1" className="animate-pulse" />
            </svg>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white rounded-2xl shadow-xl text-xs font-bold -translate-y-full mb-2">
              认知突破点：系统思维 +20%
            </div>
          </div>
          <div className="flex justify-between px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>第1周</span>
            <span>第4周</span>
            <span>第8周</span>
            <span>第12周</span>
            <span>今天</span>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Brain className="text-indigo-600" size={24} /> 认知五维图
          </h3>
          <div className="space-y-6">
            <DimensionItem label="深度思考" value={85} color="bg-indigo-500" />
            <DimensionItem label="逻辑分析" value={72} color="bg-violet-500" />
            <DimensionItem label="知识广度" value={94} color="bg-pink-500" />
            <DimensionItem label="记忆留存" value={65} color="bg-amber-500" />
            <DimensionItem label="持续毅力" value={88} color="bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* 第二行：核心统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataCard icon={<Clock className="text-indigo-600" />} title="累计沉浸时长" value="1,248" unit="分钟" trend="+12% 较上周" />
        <DataCard icon={<Activity className="text-emerald-600" />} title="平均专注指数" value="88.5" unit="分" trend="极高水平" />
        <DataCard icon={<Zap className="text-amber-600" />} title="挑战成功率" value="94.2" unit="%" trend="顶尖水平" />
        <DataCard icon={<Flame className="text-orange-600" />} title="阅读连续打卡" value="45" unit="天" trend="历史最高" />
      </div>

      {/* 第三行：平台成就奖章 */}
      <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">平台成就奖章</h3>
            <p className="text-slate-500 text-sm font-medium">共 24 枚奖章，你已解锁 15 枚</p>
          </div>
          <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            查看全部 <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <BadgeItem icon={<Rocket size={24} />} title="启航者" date="2023.11.10" unlocked={true} color="bg-indigo-600" />
          <BadgeItem icon={<Target size={24} />} title="满分大师" date="2023.12.05" unlocked={true} color="bg-emerald-500" />
          <BadgeItem icon={<Flame size={24} />} title="打卡之王" date="2024.01.20" unlocked={true} color="bg-orange-500" />
          <BadgeItem icon={<Award size={24} />} title="博学先锋" date="2024.02.15" unlocked={true} color="bg-amber-500" />
          <BadgeItem icon={<Brain size={24} />} title="思维导师" date="2024.03.01" unlocked={true} color="bg-violet-600" />
          <BadgeItem icon={<Star size={24} />} title="知识之光" date="锁定中" unlocked={false} color="bg-slate-300" />
        </div>
      </div>

      {/* 底部：每周小结 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-100 flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10 space-y-4">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">本周最佳</div>
            <h4 className="text-2xl font-bold leading-tight">你在“心理学”领域的理解<br />已超过 98% 的用户</h4>
            <button className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xl hover:-translate-y-1 transition-all">
              查看周报报告
            </button>
          </div>
          <Compass className="absolute -right-10 -bottom-10 text-white/10 group-hover:rotate-12 transition-transform duration-1000" size={240} />
        </div>

        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="z-10 space-y-4">
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">即将达成</div>
            <h4 className="text-2xl font-bold leading-tight">再阅读 2250 字<br />解锁“深度阅读者”勋章</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: '75%' }} />
              </div>
              <span className="text-sm font-bold text-indigo-300">75%</span>
            </div>
          </div>
          <Star className="absolute -right-6 -top-6 text-indigo-500/20" size={160} />
        </div>
      </div>
    </div>
  );
};

const DimensionItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="text-xs font-bold text-slate-400">{value}/100</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const DataCard = ({ icon, title, value, unit, trend }: { icon: React.ReactNode; title: string; value: string; unit: string; trend: string }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="p-3 bg-slate-50 rounded-2xl w-fit mb-4">{icon}</div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
    <div className="flex items-baseline gap-1 mb-2">
      <span className="text-3xl font-bold text-slate-900">{value}</span>
      <span className="text-sm font-bold text-slate-500">{unit}</span>
    </div>
    <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
      <TrendingUp size={12} /> {trend}
    </p>
  </div>
);

const BadgeItem = ({ icon, title, date, unlocked, color }: { icon: React.ReactNode; title: string; date: string; unlocked: boolean; color: string }) => (
  <div className="flex flex-col items-center group cursor-pointer">
    <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center transition-all duration-500 ${
      unlocked 
        ? `${color} text-white shadow-lg shadow-indigo-100 group-hover:-translate-y-2 group-hover:rotate-6` 
        : 'bg-slate-100 text-slate-400 grayscale border-2 border-dashed border-slate-200'
    }`}>
      {icon}
    </div>
    <h5 className={`mt-4 text-sm font-bold ${unlocked ? 'text-slate-900' : 'text-slate-400'}`}>{title}</h5>
    <p className="text-[10px] font-medium text-slate-400">{date}</p>
  </div>
);

export default LearningData;
