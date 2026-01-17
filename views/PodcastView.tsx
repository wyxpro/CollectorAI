import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Mic2, Settings2, Volume2, Gauge, Sparkles,
  Headphones, BookOpen, BrainCircuit, Wand2, Search, Heart, Trash2, Download,
  Loader2, CheckCircle, X, AlertCircle
} from 'lucide-react';
import { KnowledgeCard } from '../types';
import { usePodcasts, usePodcast, usePodcastSettings } from '../api/podcastHooks';
import { GeneratePodcastRequest } from '../api/podcastApi';
import { useAudioPlayer } from '../api/useAudioPlayer';

const MOCK_CARDS: KnowledgeCard[] = [
  {
    id: 'card-1',
    originalContent: '蔡格尼克效应：人们对未完成任务的记忆优于已完成任务。',
    reflection: '利用这一效应，我可以先把大任务拆解开头，利用"未完成感"驱动自己继续。',
    tags: ['心理学', '效率'],
    createdAt: '2023-10-24',
    articleTitle: '蔡格尼克效应的心理学原理'
  }
];

const PodcastView: React.FC = () => {
  // 使用Hooks
  const podcastsHook = usePodcasts();
  const { podcasts, isLoading: podcastsLoading, loadPodcasts, loadFavorites, searchPodcasts, deletePodcast, toggleFavorite, generatePodcast } = podcastsHook;
  
  const [selectedPodcastId, setSelectedPodcastId] = useState<string | null>(null);
  const podcastHook = usePodcast(selectedPodcastId);
  const { podcast: activePodcast, incrementPlayCount, downloadPodcast } = podcastHook;
  
  const settingsHook = usePodcastSettings();
  const { settings, updateVoice, updateSpeed } = settingsHook;
  
  // 使用增强的音频播放器
  const audioPlayer = useAudioPlayer(activePodcast, settings?.speed || 1.0);
  
  // UI状态
  const [showControls, setShowControls] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');
  const [showError, setShowError] = useState('');

  // 搜索处理
  useEffect(() => {
    if (searchQuery) {
      searchPodcasts(searchQuery);
    } else if (showFavoritesOnly) {
      loadFavorites();
    } else {
      loadPodcasts();
    }
  }, [searchQuery, showFavoritesOnly]);

  // 显示错误信息
  useEffect(() => {
    if (audioPlayer.error) {
      setShowError(audioPlayer.error);
      setTimeout(() => setShowError(''), 3000);
    }
  }, [audioPlayer.error]);

  // 播放控制
  const handlePlayPause = async () => {
    if (!activePodcast) {
      setShowSuccess('请先选择一个播客');
      setTimeout(() => setShowSuccess(''), 2000);
      return;
    }
    
    try {
      await audioPlayer.togglePlayPause();
      
      // 首次播放时增加播放计数
      if (!audioPlayer.isPlaying && audioPlayer.currentTime === 0) {
        incrementPlayCount();
      }
    } catch (error: any) {
      console.error('播放失败:', error);
      setShowError(error.message || '播放失败');
      setTimeout(() => setShowError(''), 3000);
    }
  };
  
  // 快进/快退
  const handleSkipForward = () => {
    audioPlayer.skipForward(10);
  };
  
  const handleSkipBackward = () => {
    audioPlayer.skipBackward(10);
  };
  
  // 进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const targetTime = Math.max(0, Math.min(percent, 1)) * audioPlayer.duration;
    audioPlayer.seek(targetTime);
  };

  const handleSelectPodcast = (id: string) => {
    setSelectedPodcastId(id);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await deletePodcast(id);
    if (result.success) {
      setShowSuccess('播客已删除');
      setTimeout(() => setShowSuccess(''), 2000);
      if (selectedPodcastId === id) {
        setSelectedPodcastId(podcasts[0]?.id || null);
      }
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await toggleFavorite(id);
    if (result.success) {
      setShowSuccess(result.isFavorite ? '已添加到收藏' : '已取消收藏');
      setTimeout(() => setShowSuccess(''), 2000);
    }
  };

  const handleDownload = async (quality: 'standard' | 'high') => {
    if (!activePodcast) return;
    const result = await downloadPodcast(quality);
    if (result.success) {
      setShowSuccess(`开始下载 (${result.fileSize})`);
      setTimeout(() => setShowSuccess(''), 2000);
    }
  };

  const handleGenerate = async (request: GeneratePodcastRequest) => {
    const result = await generatePodcast(request);
    if (result.success) {
      setShowSuccess('播客生成中...');
      setShowGenerateModal(false);
      setTimeout(() => setShowSuccess(''), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  // 自动选择第一个播客
  useEffect(() => {
    if (!selectedPodcastId && podcasts.length > 0) {
      setSelectedPodcastId(podcasts[0].id);
    }
  }, [podcasts, selectedPodcastId]);

  if (!settings) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
  }

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-50/50 overflow-hidden">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in slide-in-from-top-2">
          <CheckCircle size={16} /> {showSuccess}
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto bg-red-500 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in slide-in-from-top-2">
          <AlertCircle size={16} /> {showError}
        </div>
      )}

      {/* Left Sidebar: Playlist */}
      <div className="w-full lg:w-80 bg-white border-r border-slate-100 flex flex-col z-10 max-h-[50vh] lg:max-h-full">
        <div className="p-4 sm:p-6 border-b border-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <Headphones size={20} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">AI 播客生成</h2>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索播客..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-300"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                !showFavoritesOnly ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setShowFavoritesOnly(true)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                showFavoritesOnly ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              收藏
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {podcastsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-rose-600" size={32} />
            </div>
          ) : podcasts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Headphones size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">暂无播客</p>
            </div>
          ) : (
            podcasts.map(pod => (
              <div 
                key={pod.id}
                onClick={() => handleSelectPodcast(pod.id)}
                className={`p-3 sm:p-4 rounded-2xl cursor-pointer transition-all border group relative min-h-touch ${
                  selectedPodcastId === pod.id 
                    ? 'bg-rose-50 border-rose-200 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-rose-100 active:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img src={pod.coverImage} alt={pod.title} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm sm:text-base mb-1 line-clamp-2 ${selectedPodcastId === pod.id ? 'text-rose-700' : 'text-slate-700'}`}>
                      {pod.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{pod.duration}</span>
                      <span>•</span>
                      <span>{pod.playCount} 播放</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleToggleFavorite(pod.id, e)}
                    className={`p-1.5 rounded-lg transition-colors min-w-touch min-h-touch flex items-center justify-center ${pod.isFavorite ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400 hover:text-rose-600'}`}
                  >
                    <Heart size={14} className={pod.isFavorite ? 'fill-rose-600' : ''} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(pod.id, e)}
                    className="p-1.5 bg-slate-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors min-w-touch min-h-touch flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
          
          <button
            onClick={() => setShowGenerateModal(true)}
            className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2 hover:border-rose-200 hover:bg-rose-50/30 transition-colors group min-h-touch"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
              <Wand2 size={18} />
            </div>
            <span className="text-xs font-medium">生成新播客</span>
          </button>
        </div>
      </div>

      {/* Main Content: Player & Script */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="h-14 sm:h-16 border-b border-slate-100 bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-8">
           <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm min-w-0">
              <span className="font-medium text-slate-900 truncate">正在播放</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="truncate hidden sm:inline">{activePodcast?.title || '选择播客'}</span>
           </div>
           <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setShowControls(!showControls)}
                className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-touch ${
                  showControls ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Settings2 size={14} />
                <span className="hidden sm:inline">语音调节</span>
              </button>
              {activePodcast && (
                <button
                  onClick={() => handleDownload('high')}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors min-h-touch"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">下载</span>
                </button>
              )}
           </div>
        </div>

        {/* Controls Overlay */}
        {showControls && (
          <div className="absolute top-16 right-8 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                  <Gauge size={12} /> 语速调节
                </label>
                <div className="flex gap-2">
                  {[0.75, 1.0, 1.25, 1.5].map(s => (
                    <button 
                      key={s}
                      onClick={() => updateSpeed(s)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        settings.speed === s 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                  <Mic2 size={12} /> AI 声线
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'calm', label: '知性沉稳', desc: '适合深度阅读' },
                    { id: 'energetic', label: '活力激昂', desc: '适合通勤唤醒' },
                    { id: 'deep', label: '深邃磁性', desc: '适合晚间助眠' }
                  ].map(v => (
                    <button 
                      key={v.id}
                      onClick={() => updateVoice(v.id as any)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                        settings.voice === v.id 
                          ? 'bg-indigo-50 border-indigo-200' 
                          : 'bg-white border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-xs font-bold ${settings.voice === v.id ? 'text-indigo-700' : 'text-slate-700'}`}>{v.label}</span>
                      <span className="text-[10px] text-slate-400">{v.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activePodcast ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-32 sm:pb-32 smooth-scroll">
              <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
                {/* Waveform */}
                <div className="bg-gradient-to-r from-rose-500 to-indigo-600 h-24 sm:h-32 rounded-2xl sm:rounded-3xl shadow-lg flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-black/10"></div>
                   {audioPlayer.isLoading ? (
                     <div className="flex items-center gap-2 text-white">
                       <Loader2 className="animate-spin" size={24} />
                       <span className="text-sm font-medium">正在生成音频...</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-1 h-12">
                       {[...Array(20)].map((_, i) => (
                         <div 
                            key={i} 
                            className="w-1.5 bg-white/80 rounded-full animate-pulse" 
                            style={{ 
                              height: audioPlayer.isPlaying ? `${Math.random() * 100}%` : '20%',
                              animationDuration: `${0.5 + Math.random()}s`,
                              animationPlayState: audioPlayer.isPlaying ? 'running' : 'paused'
                            }} 
                         />
                       ))}
                     </div>
                   )}
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100">
                  <h3 className="font-black text-base sm:text-lg text-slate-900 mb-3">播客简介</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{activePodcast.summary}</p>
                </div>

                {/* Script */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={20} />
                    AI 播客脚本
                  </h3>
                  <div className="space-y-4">
                    {activePodcast.script.map((line, i) => (
                      <div key={i} className="flex gap-3 sm:gap-4 group">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                          line.role === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {line.role === 'ai' ? <BrainCircuit size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Volume2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm sm:text-[15px] text-slate-800 leading-relaxed group-hover:bg-slate-50 p-2 rounded-lg -ml-2 transition-colors">
                            {line.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Card */}
                <div className="pt-6 sm:pt-8 border-t border-slate-100">
                   <div className="flex items-center gap-2 mb-4">
                     <BookOpen className="text-emerald-600" size={18} />
                     <h4 className="font-bold text-sm sm:text-base text-slate-700">关联AI 问答</h4>
                   </div>
                   {MOCK_CARDS.map(card => (
                     <div key={card.id} className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 sm:p-5">
                        <p className="text-sm sm:text-base text-slate-800 font-medium mb-3">"{card.originalContent}"</p>
                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-white/50 w-fit px-2 py-1 rounded-md">
                           <BrainCircuit size={12} />
                           <span>{card.reflection}</span>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Bottom Player Bar */}
            <div className="h-20 sm:h-24 bg-white border-t border-slate-100 absolute bottom-0 w-full px-4 sm:px-8 flex items-center justify-between z-30 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] safe-area-bottom">
               <div className="flex items-center gap-3 sm:gap-4 w-1/3 min-w-0">
                  <img src={activePodcast.coverImage} alt={activePodcast.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-md" />
                  <div className="hidden sm:block min-w-0">
                     <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{activePodcast.title}</h4>
                     <p className="text-xs text-slate-500">AI Generated Podcast</p>
                  </div>
               </div>

               <div className="flex flex-col items-center gap-2 w-1/3">
                  <div className="flex items-center gap-4 sm:gap-6">
                     <button 
                       onClick={handleSkipBackward}
                       className="text-slate-400 hover:text-indigo-600 transition-colors min-w-touch min-h-touch flex items-center justify-center"
                       title="后退10秒"
                       disabled={audioPlayer.isLoading}
                     >
                       <SkipBack size={18} className="sm:w-5 sm:h-5" />
                     </button>
                     <button 
                       onClick={handlePlayPause}
                       disabled={audioPlayer.isLoading}
                       className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {audioPlayer.isLoading ? (
                         <Loader2 size={20} className="sm:w-6 sm:h-6 animate-spin" />
                       ) : audioPlayer.isPlaying ? (
                         <Pause size={20} className="sm:w-6 sm:h-6" fill="currentColor" />
                       ) : (
                         <Play size={20} className="sm:w-6 sm:h-6 ml-0.5" fill="currentColor" />
                       )}
                     </button>
                     <button 
                       onClick={handleSkipForward}
                       className="text-slate-400 hover:text-indigo-600 transition-colors min-w-touch min-h-touch flex items-center justify-center"
                       title="前进10秒"
                       disabled={audioPlayer.isLoading}
                     >
                       <SkipForward size={18} className="sm:w-5 sm:h-5" />
                     </button>
                  </div>
                  <div className="w-full flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400 font-medium font-mono">
                     <span>{formatTime(audioPlayer.currentTime)}</span>
                     <div 
                       className="flex-1 h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden cursor-pointer"
                       onClick={handleProgressClick}
                     >
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-100" style={{ width: `${audioPlayer.progress}%` }}></div>
                     </div>
                     <span>{formatTime(audioPlayer.duration)}</span>
                  </div>
               </div>

               <div className="w-1/3 flex justify-end items-center gap-2 sm:gap-4">
                   <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-50 rounded-lg text-[10px] sm:text-xs font-bold text-slate-600 border border-slate-100">
                      <Gauge size={12} className="sm:w-[14px] sm:h-[14px] text-indigo-500" />
                      <span>{settings.speed}x</span>
                   </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <Headphones size={48} className="sm:w-16 sm:h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-sm sm:text-base text-slate-500">选择一个播客开始播放</p>
            </div>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <GenerateModal
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
};

// Generate Modal Component
interface GenerateModalProps {
  onClose: () => void;
  onGenerate: (request: GeneratePodcastRequest) => void;
}

const GenerateModal: React.FC<GenerateModalProps> = ({ onClose, onGenerate }) => {
  const [content, setContent] = useState('');
  const [style, setStyle] = useState<'educational' | 'conversational' | 'storytelling'>('educational');
  const [duration, setDuration] = useState<'short' | 'medium' | 'long'>('medium');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onGenerate({ content, style, duration });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">生成新播客</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">播客内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入你想要生成播客的内容..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">播客风格</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'educational', label: '教育讲解', desc: '深度分析' },
                { value: 'conversational', label: '对话交流', desc: '轻松互动' },
                { value: 'storytelling', label: '故事叙述', desc: '引人入胜' }
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value as any)}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    style === s.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold mb-1">{s.label}</div>
                  <div className={`text-xs ${style === s.value ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {s.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">播客时长</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'short', label: '1 分钟', desc: '快速浏览' },
                { value: 'medium', label: '3 分钟', desc: '适中深度' },
                { value: 'long', label: '5 分钟', desc: '深度解析' }
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value as any)}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    duration === d.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold mb-1">{d.label}</div>
                  <div className={`text-xs ${duration === d.value ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {d.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles size={18} /> 开始生成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastView;
