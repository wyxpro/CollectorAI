// AI播客后端API实现

export interface Podcast {
  id: string;
  title: string;
  duration: string;
  summary: string;
  script: PodcastScript[];
  relatedCardId: string;
  createdAt: string;
  status: 'generating' | 'ready' | 'failed';
  audioUrl?: string;
  coverImage?: string;
  playCount: number;
  isFavorite: boolean;
}

export interface PodcastScript {
  role: 'host' | 'ai';
  text: string;
  timestamp: number;
}

export interface PodcastSettings {
  voice: 'calm' | 'energetic' | 'deep';
  speed: number;
  autoPlay: boolean;
  downloadQuality: 'standard' | 'high';
}

export interface GeneratePodcastRequest {
  content?: string;
  cardId?: string;
  style: 'educational' | 'conversational' | 'storytelling';
  duration: 'short' | 'medium' | 'long';
}

// 模拟数据库
class PodcastDatabase {
  private podcasts: Podcast[];
  private settings: PodcastSettings;
  private favoritePodcasts: Set<string>;

  constructor() {
    this.podcasts = [
      {
        id: 'podcast_001',
        title: '蔡格尼克效应的心理学原理',
        duration: '01:15',
        summary: '蔡格尼克效应揭示了人类对未完成任务的执念。本期播客将带你深入探讨这一心理机制，并结合 Quiz 挑战你的认知盲区。核心观点：未完成的任务会占据我们的认知带宽。',
        script: [
          { role: 'host', text: '大家好，欢迎来到 Collector + 每日洞察。今天我们要聊的是"蔡格尼克效应"。', timestamp: 0 },
          { role: 'ai', text: '简单来说，就是为什么你总是忘不了那些没做完的事。', timestamp: 8 },
          { role: 'host', text: '没错，研究发现未完成的任务会持续占用我们的短期记忆。', timestamp: 15 },
          { role: 'ai', text: '听完这段，来个小挑战：你觉得这种效应对拖延症是好是坏？', timestamp: 25 }
        ],
        relatedCardId: 'card_001',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ready',
        audioUrl: '/audio/podcast_001.mp3',
        coverImage: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400',
        playCount: 127,
        isFavorite: false
      },
      {
        id: 'podcast_002',
        title: 'AI 如何重塑人类的好奇心',
        duration: '01:30',
        summary: 'AI 时代，我们的好奇心是被喂养了还是被扼杀了？本期播客解析技术与认知的博弈。',
        script: [
          { role: 'host', text: 'AI 给了我们所有答案，那我们还需要提问吗？', timestamp: 0 },
          { role: 'ai', text: '这是个好问题。实际上，AI 可能会让我们更专注于提出高质量的问题。', timestamp: 10 },
          { role: 'host', text: '就像有了计算器，我们反而更关注数学思维本身。', timestamp: 20 },
          { role: 'ai', text: '对，工具解放了我们的认知资源，让我们能够探索更深层的问题。', timestamp: 30 }
        ],
        relatedCardId: 'card_002',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ready',
        audioUrl: '/audio/podcast_002.mp3',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        playCount: 89,
        isFavorite: true
      },
      {
        id: 'podcast_003',
        title: '深度工作的艺术：如何在碎片化时代保持专注',
        duration: '02:00',
        summary: '在信息爆炸的时代，深度工作成为稀缺能力。本期探讨如何培养专注力。',
        script: [
          { role: 'host', text: '你有多久没有连续专注工作2小时了？', timestamp: 0 },
          { role: 'ai', text: '研究显示，现代人平均每11分钟就会被打断一次。', timestamp: 8 },
          { role: 'host', text: '深度工作需要刻意练习，就像锻炼肌肉一样。', timestamp: 18 },
          { role: 'ai', text: '关键是创造无干扰环境，并设定明确的时间边界。', timestamp: 28 }
        ],
        relatedCardId: 'card_003',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'ready',
        audioUrl: '/audio/podcast_003.mp3',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        playCount: 45,
        isFavorite: false
      }
    ];

    this.settings = {
      voice: 'calm',
      speed: 1.0,
      autoPlay: false,
      downloadQuality: 'high'
    };

    this.favoritePodcasts = new Set(['podcast_002']);
  }

  // 获取所有播客
  getAllPodcasts(): Podcast[] {
    return this.podcasts.map(p => ({
      ...p,
      isFavorite: this.favoritePodcasts.has(p.id)
    }));
  }

  // 获取单个播客
  getPodcast(id: string): Podcast | null {
    const podcast = this.podcasts.find(p => p.id === id);
    if (podcast) {
      return {
        ...podcast,
        isFavorite: this.favoritePodcasts.has(id)
      };
    }
    return null;
  }

  // 生成新播客
  async generatePodcast(request: GeneratePodcastRequest): Promise<{ podcastId: string; estimatedTime: number; status: string; audioUrl?: string }> {
    const newPodcast: Podcast = {
      id: `podcast_${Date.now()}`,
      title: request.content ? `${request.content.substring(0, 30)}...的深度解析` : '新生成的播客',
      duration: request.duration === 'short' ? '01:00' : request.duration === 'long' ? '05:00' : '03:00',
      summary: '正在生成播客内容...',
      script: [
        { role: 'host', text: '正在为您生成个性化播客内容...', timestamp: 0 }
      ],
      relatedCardId: request.cardId || '',
      createdAt: new Date().toISOString(),
      status: 'generating',
      audioUrl: '',
      coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc678?w=400',
      playCount: 0,
      isFavorite: false
    };

    this.podcasts.unshift(newPodcast);

    // 异步生成播客内容和音频
    this.generatePodcastContent(newPodcast.id, request).catch(error => {
      console.error('播客生成失败:', error);
      const podcast = this.podcasts.find(p => p.id === newPodcast.id);
      if (podcast) {
        podcast.status = 'failed';
      }
    });

    return {
      podcastId: newPodcast.id,
      estimatedTime: 3,
      status: 'processing'
    };
  }

  // 生成播客内容（异步）
  private async generatePodcastContent(podcastId: string, request: GeneratePodcastRequest): Promise<void> {
    // 模拟AI生成脚本
    await new Promise(resolve => setTimeout(resolve, 2000));

    const podcast = this.podcasts.find(p => p.id === podcastId);
    if (!podcast) return;

    // 根据风格生成不同的脚本
    let script: PodcastScript[] = [];
    const content = request.content || '人工智能正在改变我们的生活方式';

    switch (request.style) {
      case 'educational':
        script = [
          { role: 'host', text: `欢迎来到 Collector + AI播客。今天我们要深入探讨：${content}`, timestamp: 0 },
          { role: 'ai', text: '让我们从基础概念开始，逐步深入理解这个话题的核心要点。', timestamp: 8 },
          { role: 'host', text: '这个观点确实很有启发性，它揭示了问题的本质。', timestamp: 18 },
          { role: 'ai', text: '通过实际案例，我们可以更好地理解这些理论如何应用到实践中。', timestamp: 28 },
          { role: 'host', text: '总结一下，关键在于理解背后的原理，并将其应用到日常工作中。', timestamp: 40 }
        ];
        break;
      case 'conversational':
        script = [
          { role: 'host', text: `嘿，今天聊点有意思的：${content}`, timestamp: 0 },
          { role: 'ai', text: '哈哈，这个话题确实很有趣！让我分享一些我的看法。', timestamp: 6 },
          { role: 'host', text: '对对对，我也是这么想的！你觉得这会对我们产生什么影响？', timestamp: 14 },
          { role: 'ai', text: '影响可大了！简单来说，它会改变我们思考和工作的方式。', timestamp: 22 },
          { role: 'host', text: '说得太对了！听完这期播客，相信大家都有新的启发。', timestamp: 32 }
        ];
        break;
      case 'storytelling':
        script = [
          { role: 'host', text: `让我给你讲个故事，关于${content}的故事。`, timestamp: 0 },
          { role: 'ai', text: '故事要从很久以前说起，那时候人们还没有意识到这个问题的重要性。', timestamp: 8 },
          { role: 'host', text: '直到有一天，一切都改变了。人们开始重新思考这个问题。', timestamp: 18 },
          { role: 'ai', text: '这个转变带来了深远的影响，改变了整个行业的发展方向。', timestamp: 28 },
          { role: 'host', text: '故事还在继续，而我们每个人都是这个故事的一部分。', timestamp: 38 }
        ];
        break;
    }

    // 更新播客信息
    podcast.script = script;
    podcast.summary = `基于您的内容生成的${request.style === 'educational' ? '教育讲解' : request.style === 'conversational' ? '对话交流' : '故事叙述'}风格播客，深入浅出地解析核心观点。`;
    
    // 生成音频URL（使用audioService）
    // 注意：这里使用标记来表示音频已生成，实际URL会在前端通过audioService生成
    podcast.audioUrl = `generated://${podcastId}`;
    podcast.status = 'ready';

    console.log('播客生成完成:', podcastId);
  }

  // 删除播客
  deletePodcast(id: string): { success: boolean; message: string } {
    const index = this.podcasts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.podcasts.splice(index, 1);
      this.favoritePodcasts.delete(id);
      return { success: true, message: '播客已删除' };
    }
    return { success: false, message: '播客不存在' };
  }

  // 收藏/取消收藏播客
  toggleFavorite(id: string): { success: boolean; isFavorite: boolean; message: string } {
    if (this.favoritePodcasts.has(id)) {
      this.favoritePodcasts.delete(id);
      return { success: true, isFavorite: false, message: '已取消收藏' };
    } else {
      this.favoritePodcasts.add(id);
      return { success: true, isFavorite: true, message: '已添加到收藏' };
    }
  }

  // 增加播放次数
  incrementPlayCount(id: string): { success: boolean; playCount: number } {
    const podcast = this.podcasts.find(p => p.id === id);
    if (podcast) {
      podcast.playCount++;
      return { success: true, playCount: podcast.playCount };
    }
    return { success: false, playCount: 0 };
  }

  // 获取播客设置
  getSettings(): PodcastSettings {
    return { ...this.settings };
  }

  // 更新播客设置
  updateSettings(updates: Partial<PodcastSettings>): PodcastSettings {
    this.settings = { ...this.settings, ...updates };
    return this.getSettings();
  }

  // 下载播客
  downloadPodcast(id: string, quality: 'standard' | 'high'): { success: boolean; downloadUrl?: string; fileSize?: string; message: string } {
    const podcast = this.podcasts.find(p => p.id === id);
    if (podcast && podcast.status === 'ready') {
      return {
        success: true,
        downloadUrl: `${podcast.audioUrl}?quality=${quality}`,
        fileSize: quality === 'high' ? '15.2 MB' : '8.5 MB',
        message: '开始下载'
      };
    }
    return { success: false, message: '播客不可用' };
  }

  // 搜索播客
  searchPodcasts(query: string): Podcast[] {
    const lowerQuery = query.toLowerCase();
    return this.podcasts.filter(p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.summary.toLowerCase().includes(lowerQuery)
    ).map(p => ({
      ...p,
      isFavorite: this.favoritePodcasts.has(p.id)
    }));
  }

  // 获取收藏的播客
  getFavoritePodcasts(): Podcast[] {
    return this.podcasts
      .filter(p => this.favoritePodcasts.has(p.id))
      .map(p => ({
        ...p,
        isFavorite: true
      }));
  }

  // 获取播客统计
  getStatistics() {
    return {
      totalPodcasts: this.podcasts.length,
      totalPlayCount: this.podcasts.reduce((sum, p) => sum + p.playCount, 0),
      favoritesCount: this.favoritePodcasts.size,
      totalDuration: this.podcasts.reduce((sum, p) => {
        const [min, sec] = p.duration.split(':').map(Number);
        return sum + min * 60 + sec;
      }, 0),
      recentPodcasts: this.podcasts.slice(0, 5).map(p => ({
        id: p.id,
        title: p.title,
        playCount: p.playCount
      }))
    };
  }
}

// 创建数据库实例
const podcastDB = new PodcastDatabase();

// 导出API
export const PodcastAPI = {
  // 播客列表
  list: {
    getAll: () => podcastDB.getAllPodcasts(),
    getFavorites: () => podcastDB.getFavoritePodcasts(),
    search: (query: string) => podcastDB.searchPodcasts(query)
  },

  // 单个播客
  podcast: {
    get: (id: string) => podcastDB.getPodcast(id),
    delete: (id: string) => podcastDB.deletePodcast(id),
    toggleFavorite: (id: string) => podcastDB.toggleFavorite(id),
    incrementPlayCount: (id: string) => podcastDB.incrementPlayCount(id),
    download: (id: string, quality: 'standard' | 'high') => podcastDB.downloadPodcast(id, quality)
  },

  // 生成播客
  generate: (request: GeneratePodcastRequest) => podcastDB.generatePodcast(request),

  // 设置
  settings: {
    get: () => podcastDB.getSettings(),
    update: (updates: Partial<PodcastSettings>) => podcastDB.updateSettings(updates)
  },

  // 统计
  statistics: () => podcastDB.getStatistics()
};
