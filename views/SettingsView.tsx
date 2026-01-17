
import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Palette, 
  Database, 
  Heart, 
  Trash2, 
  HelpCircle, 
  ChevronRight, 
  Camera, 
  Smartphone, 
  Mail, 
  Key, 
  Monitor, 
  Globe, 
  Bell, 
  RotateCcw,
  Search,
  Sparkles,
  CreditCard,
  Crown
} from 'lucide-react';
import { useUserSettings } from '../api/userHooks';
import { useTheme } from '../hooks/useTheme';

interface SettingsViewProps {
  onUpgrade: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'subscription' | 'personal' | 'insights' | 'help'>('profile');
  
  // 使用用户设置Hook
  const userId = 'user_demo_123'; // 实际应该从认证系统获取
  const { settings, updateTheme: updateUserTheme, updateNotifications } = useUserSettings(userId);
  
  // 使用深色模式Hook
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // 处理主题切换
  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    await updateUserTheme(newTheme);
  };

  const menuItems = [
    { id: 'profile', label: '个人资料', icon: <User size={18} /> },
    { id: 'security', label: '账户安全', icon: <ShieldCheck size={18} /> },
    { id: 'subscription', label: '订阅计划', icon: <CreditCard size={18} /> },
    { id: 'personal', label: '个性化设置', icon: <Palette size={18} /> },
    { id: 'insights', label: '收藏与清理', icon: <Heart size={18} /> },
    { id: 'help', label: '帮助中心', icon: <HelpCircle size={18} /> },
  ];
  const sortedMenu = (() => {
    const order = ['subscription', 'profile', 'security', 'personal', 'insights', 'help'];
    const pos: Record<string, number> = {};
    order.forEach((id, i) => (pos[id] = i));
    return [...menuItems].sort((a, b) => (pos[a.id] ?? 999) - (pos[b.id] ?? 999));
  })();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'subscription':
        return <SubscriptionSection onUpgrade={onUpgrade} />;
      case 'personal':
        return <PersonalizationSection theme={theme} setTheme={handleThemeChange} updateNotifications={updateNotifications} resolvedTheme={resolvedTheme} />;
      case 'insights':
        return <InsightsManagementSection />;
      case 'help':
        return <HelpSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">个人中心</h1>
        <p className="text-slate-500 dark:text-slate-400">管理您的账户设置、偏好以及阅读数据。</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-2 sticky top-24">
            {sortedMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50 scale-[1.02]' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 md:p-12 shadow-sm min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

/* --- Profile Section --- */
const ProfileSection = () => (
  <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
    <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
      <div className="relative group cursor-pointer">
        <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl ring-1 ring-slate-100 dark:ring-slate-700 transition-transform group-hover:scale-105">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/40 rounded-[40px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Camera className="text-white" size={24} />
        </div>
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Felix 探索者</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">加入于 2023年11月 · 博学贤者 LV.4</p>
        <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-5 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">编辑个人简介</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">用户名</label>
        <input type="text" defaultValue="felix_reader_01" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">个人格言</label>
        <input type="text" placeholder="在这里写下你的读书信条..." className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>
    </div>

    <div className="bg-slate-50 dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-indigo-600 dark:text-indigo-400" size={20} />
        <h4 className="font-bold text-slate-900 dark:text-white">数据统计</h4>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">累计阅读时长</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">128 小时</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">存储空间</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">1.2 GB / 5 GB</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">本月活跃度</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">85%</p>
        </div>
      </div>
    </div>
  </div>
);

/* --- Security Section --- */
const SecuritySection = () => (
  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
    <h3 className="text-xl font-bold text-slate-900 mb-6">安全概览</h3>
    
    <div className="space-y-4">
      <SecurityItem icon={<Key className="text-blue-500" />} label="登录密码" status="上次修改：3个月前" action="修改密码" />
      <SecurityItem icon={<Smartphone className="text-emerald-500" />} label="手机号绑定" status="138****8888" action="更换绑定" />
      <SecurityItem icon={<Mail className="text-orange-500" />} label="邮箱验证" status="felix@example.com" action="重新验证" />
    </div>

    <div className="mt-12">
      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Monitor size={18} className="text-slate-400" /> 最近登录设备
      </h4>
      <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl"><Monitor size={20} /></div>
            <div>
              <p className="text-sm font-bold">MacOS · Chrome 浏览器</p>
              <p className="text-xs text-slate-400">北京 · 当前设备</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">在线</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl"><Smartphone size={20} /></div>
            <div>
              <p className="text-sm font-bold">iPhone 15 Pro</p>
              <p className="text-xs text-slate-400">上海 · 2天前登录</p>
            </div>
          </div>
          <button className="text-xs font-bold text-rose-500 hover:underline">下线</button>
        </div>
      </div>
    </div>
  </div>
);

const SecurityItem = ({ icon, label, status, action }: any) => (
  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white rounded-2xl shadow-sm">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{status}</p>
      </div>
    </div>
    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">{action}</button>
  </div>
);

/* --- Subscription Section --- */
const SubscriptionSection = ({ onUpgrade }: { onUpgrade: () => void }) => (
  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
    <h3 className="text-xl font-bold text-slate-900 mb-6">我的订阅</h3>
    
    <div className="p-8 rounded-[40px] bg-gradient-to-br from-slate-900 to-indigo-900 text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
            当前计划
          </div>
          <h4 className="text-4xl font-black tracking-tight">Collector + 免费版</h4>
          <p className="text-indigo-200/70 text-sm font-medium">体验 AI 阅读的魅力，升级以解锁更多特权。</p>
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
               每日 3 篇 AI 网页解析剩余
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
               限制导出 PDF 等高阶功能
            </div>
          </div>
        </div>
        <button 
          onClick={onUpgrade}
          className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-10 py-5 rounded-[28px] font-black text-sm shadow-xl shadow-amber-900/40 transition-all active:scale-95 flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <Crown size={20} /> 立即升级到 PRO
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="p-6 border border-slate-100 rounded-3xl space-y-4">
          <h5 className="font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-widest">
            <Database size={16} className="text-indigo-600" /> 存储额度
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>1.2 GB / 5 GB 已使用</span>
              <span>24%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[24%]" />
            </div>
          </div>
       </div>
       <div className="p-6 border border-slate-100 rounded-3xl space-y-4">
          <h5 className="font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-widest">
            <Bell size={16} className="text-amber-600" /> 续费提醒
          </h5>
          <p className="text-xs text-slate-400 font-medium">您当前处于免费模式，订阅 PRO 后可在此管理自动续费开关。</p>
       </div>
    </div>
  </div>
);

/* --- Personalization Section --- */
const PersonalizationSection = ({ theme, setTheme, updateNotifications, resolvedTheme }: any) => {
  const [notificationSettings, setNotificationSettings] = useState({
    dailyChallenge: true,
    knowledgeReview: false,
    communityInteraction: true
  });
  
  const handleNotificationToggle = async (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    await updateNotifications({ [key]: value });
  };
  
  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Palette size={20} className="text-indigo-600 dark:text-indigo-400" /> 主题偏好
          </h4>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            当前: {resolvedTheme === 'dark' ? '深色' : '浅色'}模式
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['light', 'dark', 'system'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex flex-col items-center gap-3 p-6 rounded-[24px] border-2 transition-all ${
                theme === t 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                t === 'light' 
                  ? 'bg-orange-100 text-orange-600' 
                  : t === 'dark' 
                  ? 'bg-slate-900 text-slate-200' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {t === 'light' ? <Sparkles size={20} /> : t === 'dark' ? <Monitor size={20} /> : <Globe size={20} />}
              </div>
              <span className={`text-sm font-bold capitalize ${
                theme === t ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {t === 'light' ? '浅色' : t === 'dark' ? '深色' : '跟随系统'}
              </span>
            </button>
          ))}
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4">
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
            💡 提示：选择"跟随系统"将根据您的设备设置自动切换主题
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell size={20} className="text-indigo-600 dark:text-indigo-400" /> 通知偏好
        </h4>
        <div className="space-y-3">
          <ToggleItem 
            label="每日阅读挑战提醒" 
            active={notificationSettings.dailyChallenge}
            onToggle={(value) => handleNotificationToggle('dailyChallenge', value)}
          />
          <ToggleItem 
            label="知识点复习提醒" 
            active={notificationSettings.knowledgeReview}
            onToggle={(value) => handleNotificationToggle('knowledgeReview', value)}
          />
          <ToggleItem 
            label="社区互动消息通知" 
            active={notificationSettings.communityInteraction}
            onToggle={(value) => handleNotificationToggle('communityInteraction', value)}
          />
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    <button
      onClick={() => onToggle?.(!active)}
      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
        active ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
        active ? 'right-1' : 'left-1'
      }`} />
    </button>
  </div>
);

/* --- Insights Section --- */
const InsightsManagementSection = () => {
  const [subTab, setSubTab] = useState<'kept' | 'discarded'>('kept');

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setSubTab('kept')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${subTab === 'kept' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Heart size={16} /> 已 Keep 卡片
        </button>
        <button 
          onClick={() => setSubTab('discarded')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${subTab === 'discarded' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Trash2 size={16} /> 已 Throw Away
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input type="text" placeholder="搜索已归档的知识碎片..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500" />
      </div>

      <div className="space-y-4">
        {subTab === 'kept' ? (
          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-between group">
            <div>
              <p className="text-sm font-medium text-slate-800 line-clamp-1">“蔡格尼克效应指出未完成任务比完成任务记忆更深。”</p>
              <p className="text-xs text-indigo-500 font-bold mt-1">归档于 3天前</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
          </div>
        ) : (
          <div className="p-6 bg-slate-50 border border-slate-200 border-dashed rounded-3xl flex items-center justify-between group">
            <div>
              <p className="text-sm font-medium text-slate-400 line-clamp-1 italic">“侍者记得未付账单的故事...”</p>
              <p className="text-xs text-slate-400 font-bold mt-1">清理于 1周前</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
              <RotateCcw size={14} /> 恢复
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Help Section --- */
const HelpSection = () => (
  <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
    <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden">
      <Sparkles className="absolute -top-4 -right-4 text-white/10" size={120} />
      <h3 className="text-2xl font-bold mb-2">有什么可以帮您？</h3>
      <p className="text-indigo-100 text-sm mb-6">查看 FAQ 或联系我们的 7x24 小时 AI 智能助理。</p>
      <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-900/20 active:scale-95 transition-all">联系客服</button>
    </div>

    <div className="space-y-4">
      <h4 className="font-bold text-slate-900 mb-4">常见问题</h4>
      <FAQItem question="如何生成更高质量的挑战题目？" answer="您可以尝试导入结构更加清晰的文章，或者在系统设置中调整 AI 的分析倾向（深度/广度）。" />
      <FAQItem question="答错题会影响我的 XP 吗？" answer="答错不会扣除 XP，但只有答对才能解锁下一章节并获得该章对应的 XP 奖励。" />
      <FAQItem question="支持离线阅读吗？" answer="目前需要联网解析文章。一旦解析完成并加载，只要浏览器不刷新，您可以在断网情况下完成已加载内容的闯关。" />
    </div>
  </div>
);

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
        <span className="text-sm font-bold text-slate-800">{question}</span>
        <ChevronRight size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-300">
          <p className="text-sm text-slate-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
