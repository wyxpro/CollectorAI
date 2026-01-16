
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Library, 
  BrainCircuit, 
  NotebookPen, 
  Settings, 
  Plus,
  Flame,
  Search,
  Trophy,
  BarChart3
} from 'lucide-react';
import Dashboard from './views/Dashboard';
import LibraryView from './views/LibraryView';
import ReaderView from './views/ReaderView';
import KnowledgeBase from './views/KnowledgeBase';
import SettingsView from './views/SettingsView';
import LearningData from './views/LearningData';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const navigateToReader = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentView(View.READER);
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onStartReading={navigateToReader} />;
      case View.LIBRARY:
        return <LibraryView onSelectArticle={navigateToReader} />;
      case View.READER:
        return <ReaderView articleId={selectedArticleId || '1'} onBack={() => setCurrentView(View.LIBRARY)} />;
      case View.KNOWLEDGE:
        return <KnowledgeBase />;
      case View.LEARNING_DATA:
        return <LearningData />;
      case View.SETTINGS:
        return <SettingsView />;
      default:
        return <Dashboard onStartReading={navigateToReader} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col items-center md:items-stretch py-6 transition-all duration-300 z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="hidden md:block text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Read2Play</span>
        </div>

        <div className="flex-1 space-y-2 px-3 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="仪表盘" 
            active={currentView === View.DASHBOARD} 
            onClick={() => setCurrentView(View.DASHBOARD)} 
          />
          <NavItem 
            icon={<Library size={20} />} 
            label="图书馆" 
            active={currentView === View.LIBRARY} 
            onClick={() => setCurrentView(View.LIBRARY)} 
          />
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="学习数据" 
            active={currentView === View.LEARNING_DATA} 
            onClick={() => setCurrentView(View.LEARNING_DATA)} 
          />
          <NavItem 
            icon={<NotebookPen size={20} />} 
            label="知识库" 
            active={currentView === View.KNOWLEDGE} 
            onClick={() => setCurrentView(View.KNOWLEDGE)} 
          />
        </div>

        <div className="px-3 py-6 border-t border-slate-100">
          <NavItem 
            icon={<Settings size={20} />} 
            label="个人中心" 
            active={currentView === View.SETTINGS} 
            onClick={() => setCurrentView(View.SETTINGS)} 
          />
          
          <div className="mt-6 px-3 hidden md:block">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="text-orange-500" size={16} />
                <span className="text-xs font-semibold uppercase text-slate-500">每周打卡</span>
              </div>
              <div className="flex gap-1">
                {[1,1,1,1,0,0,0].map((active, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${active ? 'bg-orange-500' : 'bg-slate-200'}`} />
                ))}
              </div>
              <p className="text-sm font-bold mt-2">连续 4 天</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
        {renderView()}
      </main>

      {/* Quick Actions (Floating) */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-[60]"
        title="快速导入"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-600 font-semibold' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    }`}
  >
    <span className={active ? 'scale-110' : ''}>{icon}</span>
    <span className="hidden md:block">{label}</span>
  </button>
);

export default App;
