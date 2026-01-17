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
          { role: 'host', text: '大家好，欢迎来到 Read AI 每日洞察。今天我们要聊的是"蔡格尼克效应"。', timestamp: 0 },
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
  generatePodcast(request: GeneratePodcastRequest): { podcastId: string; estimatedTime: number; status: string } {
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

    // 模拟生成过程
    setTimeout(() => {
      const podcast = this.podcasts.find(p => p.id === newPodcast.id);
      if (podcast) {
        podcast.status = 'ready';
        podcast.summary = '基于您的内容生成的AI播客，深入浅出地解析核心观点。';
        podcast.script = [
          { role: 'host', text: '欢迎来到 Read AI，今天我们来聊聊这个有趣的话题。', timestamp: 0 },
          { role: 'ai', text: '让我们从核心概念开始，逐步深入探讨。', timestamp: 8 },
          { role: 'host', text: '这个观点确实很有启发性，值得我们深入思考。', timestamp: 18 },
          { role: 'ai', text: '总结一下，关键在于理解背后的原理并应用到实践中。', timestamp: 28 }
        ];
        podcast.audioUrl = `/audio/${newPodcast.id}.mp3`;
      }
    }, 3000);

    return {
      podcastId: newPodcast.id,
      estimatedTime: 3,
      status: 'processing'
    };
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
