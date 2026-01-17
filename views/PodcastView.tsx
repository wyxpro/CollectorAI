import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Mic2, Settings2, Volume2, Gauge, Sparkles,
  Headphones, BookOpen, BrainCircuit, Wand2, Search, Heart, Trash2, Download,
  Loader2, CheckCircle, X
} from 'lucide-react';
import { KnowledgeCard } from '../types';
import { usePodcasts, usePodcast, usePodcastSettings } from '../api/podcastHooks';
import { GeneratePodcastRequest } from '../api/podcastApi';

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
  
  // UI状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');
  
  // 音频播放器引用
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 初始化音频播放器
  useEffect(() => {
    // 创建音频元素
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous'; // 处理CORS
      audioRef.current.preload = 'metadata'; // 预加载元数据
      
      // 监听播放进度
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(progress || 0);
        }
      });
      
      // 监听音频加载完成
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
          console.log('音频加载完成，时长:', audioRef.current.duration);
        }
      });
      
      // 监听播放事件
      audioRef.current.addEventListener('play', () => {
        console.log('音频开始播放');
        setIsPlaying(true);
      });
      
      // 监听暂停事件
      audioRef.current.addEventListener('pause', () => {
        console.log('音频已暂停');
        setIsPlaying(false);
      });
      
      // 监听播放结束
      audioRef.current.addEventListener('ended', () => {
        console.log('音频播放结束');
        setIsPlaying(false);
        setProgress(0);
      });
      
      // 监听错误
      audioRef.current.addEventListener('error', (e) => {
        console.error('音频加载错误:', e);
        setShowSuccess('音频加载失败，请检查网络连接');
        setTimeout(() => setShowSuccess(''), 3000);
        setIsPlaying(false);
      });
      
      // 监听加载中
      audioRef.current.addEventListener('loadstart', () => {
        console.log('开始加载音频...');
      });
      
      // 监听可以播放
      audioRef.current.addEventListener('canplay', () => {
        console.log('音频可以播放');
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // 自动选择第一个播客
  useEffect(() => {
    if (!selectedPodcastId && podcasts.length > 0) {
      setSelectedPodcastId(podcasts[0].id);
    }
  }, [podcasts, selectedPodcastId]);

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

  // 更新播放速度
  useEffect(() => {
    if (audioRef.current && settings) {
      audioRef.current.playbackRate = settings.speed;
    }
  }, [settings?.speed]);
  
  // 加载音频文件
  useEffect(() => {
    if (activePodcast && audioRef.current) {
      // 停止当前播放
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      
      // 使用多个备用音频源
      const audioSources = [
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg'
      ];
      
      // 尝试加载第一个音频源
      audioRef.current.src = audioSources[0];
      audioRef.current.load();
      
      console.log('加载播客音频:', activePodcast.title);
    }
  }, [activePodcast]);

  // 播放控制
  const handlePlayPause = async () => {
    if (!audioRef.current) {
      console.error('音频播放器未初始化');
      return;
    }
    
    if (!activePodcast) {
      setShowSuccess('请先选择一个播客');
      setTimeout(() => setShowSuccess(''), 2000);
      return;
    }
    
    try {
      if (isPlaying) {
        // 暂停播放
        audioRef.current.pause();
        console.log('暂停播放');
      } else {
        // 开始播放
        console.log('尝试播放音频...');
        console.log('音频源:', audioRef.current.src);
        console.log('音频就绪状态:', audioRef.current.readyState);
        
        // 确保音频已加载
        if (audioRef.current.readyState < 2) {
          console.log('音频未就绪，等待加载...');
          setShowSuccess('正在加载音频...');
          await new Promise((resolve) => {
            const onCanPlay = () => {
              audioRef.current?.removeEventListener('canplay', onCanPlay);
              resolve(true);
            };
            audioRef.current?.addEventListener('canplay', onCanPlay);
            audioRef.current?.load();
          });
          setShowSuccess('');
        }
        
        // 播放音频
        await audioRef.current.play();
        console.log('播放成功');
        
        // 首次播放时增加播放计数
        if (progress === 0 || currentTime === 0) {
          incrementPlayCount();
        }
      }
    } catch (error: any) {
      console.error('播放失败:', error);
      
      // 详细的错误处理
      let errorMessage = '播放失败';
      if (error.name === 'NotAllowedError') {
        errorMessage = '浏览器阻止了自动播放，请点击播放按钮';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = '音频格式不支持';
      } else if (error.name === 'AbortError') {
        errorMessage = '音频加载被中断';
      } else {
        errorMessage = `播放失败: ${error.message}`;
      }
      
      setShowSuccess(errorMessage);
      setTimeout(() => setShowSuccess(''), 3000);
      setIsPlaying(false);
    }
  };
  
  // 快进/快退
  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
    }
  };
  
  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };
  
  // 进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const targetTime = Math.max(0, Math.min(percent, 1)) * (audioRef.current.duration || 0);
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    const nextProgress = (audioRef.current.duration ? (targetTime / audioRef.current.duration) * 100 : 0);
    setProgress(nextProgress);
  };

  const handleSelectPodcast = (id: string) => {
    setSelectedPodcastId(id);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
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
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

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
                   <div className="flex items-center gap-1 h-12">
                     {[...Array(20)].map((_, i) => (
                       <div 
                          key={i} 
                          className="w-1.5 bg-white/80 rounded-full animate-pulse" 
                          style={{ 
                            height: isPlaying ? `${Math.random() * 100}%` : '20%',
                            animationDuration: `${0.5 + Math.random()}s`,
                            animationPlayState: isPlaying ? 'running' : 'paused'
                          }} 
                       />
                     ))}
                   </div>
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
                     >
                       <SkipBack size={18} className="sm:w-5 sm:h-5" />
                     </button>
                     <button 
                       onClick={handlePlayPause}
                       className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                     >
                       {isPlaying ? <Pause size={20} className="sm:w-6 sm:h-6" fill="currentColor" /> : <Play size={20} className="sm:w-6 sm:h-6 ml-0.5" fill="currentColor" />}
                     </button>
                     <button 
                       onClick={handleSkipForward}
                       className="text-slate-400 hover:text-indigo-600 transition-colors min-w-touch min-h-touch flex items-center justify-center"
                       title="前进10秒"
                     >
                       <SkipForward size={18} className="sm:w-5 sm:h-5" />
                     </button>
                  </div>
                  <div className="w-full flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400 font-medium font-mono">
                     <span>{formatTime(currentTime)}</span>
                     <div 
                       className="flex-1 h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden cursor-pointer"
                       onClick={handleProgressClick}
                     >
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                     </div>
                     <span>{formatTime(duration)}</span>
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
