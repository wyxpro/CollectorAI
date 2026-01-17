// 知识卡片后端API实现

import { KnowledgeCard } from '../types';

export interface CardTheme {
  id: string;
  name: string;
  type: 'tech' | 'art' | 'business' | 'minimal';
  bgClass: string;
  textClass: string;
  subTextClass: string;
  accentClass: string;
  description: string;
}

export interface SharePosterOptions {
  cardId: string;
  themeId: string;
  format: 'png' | 'jpg' | 'webp';
  quality: 'standard' | 'high';
  includeQR: boolean;
}

export interface ShareResult {
  success: boolean;
  shareUrl?: string;
  posterUrl?: string;
  qrCodeUrl?: string;
  shareId?: string;
  message: string;
}

export interface CardStatistics {
  totalCards: number;
  totalShares: number;
  totalViews: number;
  popularTags: Array<{ tag: string; count: number }>;
  recentCards: KnowledgeCard[];
}

// 模拟数据库
class KnowledgeCardDatabase {
  private cards: KnowledgeCard[];
  private shareRecords: Map<string, { cardId: string; shareCount: number; viewCount: number; createdAt: string }>;
  private favoriteCards: Set<string>;
  private themes: CardTheme[];

  constructor() {
    this.cards = [
      {
        id: 'card_001',
        originalContent: "Scaling Law 的本质并不是工程参数的堆砌，而是转化为'逻辑熵'。",
        reflection: "这意味着 AI 的竞争终局可能是能源成本的竞争。对于个人而言，这意味着我们应该更关注'提问的质量'而非'计算的速度'，因为逻辑序的产出成本正在急剧下降。",
        tags: ['AI 哲学', '物理学'],
        createdAt: '2024-03-20',
        articleTitle: 'Scaling Law 与智能终局',
        articleImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
      },
      {
        id: 'card_002',
        originalContent: "蔡格尼克效应：大脑对尚未结账的订单，比已经结账的订单记忆更好。",
        reflection: "这是一个关于'任务闭环'的诅咒。要对抗焦虑，不是去完成所有事，而是学会如何优雅地'挂起'那些无法立即完成的事，欺骗大脑它已进入存储区。",
        tags: ['心理学', '生产力'],
        createdAt: '2024-03-18',
        articleTitle: '心智的逻辑缺陷',
        articleImage: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800'
      },
      {
        id: 'card_003',
        originalContent: "未来的设计不再是关于像素的排列，而是关于'意图'的捕获与共鸣。",
        reflection: "界面（UI）将消失，取而代之的是服务（Service）。设计师的角色将从'画师'转变为'行为剧作家'，为 AI 设定剧本。这对传统 UX 是一次降维打击。",
        tags: ['设计趋势', 'UX'],
        createdAt: '2024-03-15',
        articleTitle: '为持续参与而设计',
        articleImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'
      },
      {
        id: 'card_004',
        originalContent: "深度工作（Deep Work）不是一种过时的技能，而是一项在 21 世纪经济中日益罕见的'超能力'。",
        reflection: "在碎片化信息轰炸的时代，能够长时间专注处理高认知任务的能力就是核心竞争力。这不仅是工作方法，更是大脑认知的再训练过程。",
        tags: ['生产力', '认知'],
        createdAt: '2024-03-12',
        articleTitle: '专注力夺还战',
        articleImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
      },
      {
        id: 'card_005',
        originalContent: "我们不是在阅读书籍，而是在通过书籍阅读自己。",
        reflection: "每一本引起共鸣的书都是一面镜子。阅读的本质不是获取外部信息，而是激活内部已有的认知种子，并让它们在新的上下文中发芽。",
        tags: ['哲学', '阅读方法'],
        createdAt: '2024-03-10',
        articleTitle: '镜面阅读法',
        articleImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
      }
    ];

    this.shareRecords = new Map();
    this.favoriteCards = new Set(['card_001', 'card_003']);

    this.themes = [
      {
        id: 'default-indigo',
        name: '极光紫',
        type: 'tech',
        bgClass: 'bg-gradient-to-br from-indigo-600 to-violet-700',
        textClass: 'text-white',
        subTextClass: 'text-white/60',
        accentClass: 'bg-white/20 text-white',
        description: '经典的科技感渐变，适合大多数场景。'
      },
      {
        id: 'cosmos',
        name: '星空流转',
        type: 'tech',
        bgClass: 'bg-slate-900',
        textClass: 'text-white',
        subTextClass: 'text-slate-400',
        accentClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
        description: '深邃的宇宙背景，带有微弱的星光闪烁动画。'
      },
      {
        id: 'paper',
        name: '纸张翻页',
        type: 'art',
        bgClass: 'bg-[#fdfbf7]',
        textClass: 'text-slate-800',
        subTextClass: 'text-slate-500',
        accentClass: 'bg-stone-200 text-stone-600',
        description: '温暖的纸质触感，适合人文社科类内容。'
      },
      {
        id: 'sunset',
        name: '晨曦微光',
        type: 'art',
        bgClass: 'bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200',
        textClass: 'text-slate-900',
        subTextClass: 'text-slate-700',
        accentClass: 'bg-white/30 text-rose-700 backdrop-blur-sm',
        description: '柔和的暖色调，充满希望与活力。'
      },
      {
        id: 'business-blue',
        name: '深蓝商务',
        type: 'business',
        bgClass: 'bg-gradient-to-b from-slate-800 to-slate-900',
        textClass: 'text-white',
        subTextClass: 'text-slate-400',
        accentClass: 'bg-sky-500/20 text-sky-400 border border-sky-500/20',
        description: '专业冷静的商务风格。'
      }
    ];
  }

  // 获取所有卡片
  getAllCards(): KnowledgeCard[] {
    return this.cards;
  }

  // 获取单个卡片
  getCard(id: string): KnowledgeCard | null {
    return this.cards.find(c => c.id === id) || null;
  }

  // 创建新卡片
  createCard(card: Omit<KnowledgeCard, 'id' | 'createdAt'>): { success: boolean; card?: KnowledgeCard; message: string } {
    const newCard: KnowledgeCard = {
      ...card,
      id: `card_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.cards.unshift(newCard);

    return {
      success: true,
      card: newCard,
      message: '卡片创建成功'
    };
  }

  // 更新卡片
  updateCard(id: string, updates: Partial<KnowledgeCard>): { success: boolean; card?: KnowledgeCard; message: string } {
    const index = this.cards.findIndex(c => c.id === id);
    if (index === -1) {
      return { success: false, message: '卡片不存在' };
    }

    this.cards[index] = { ...this.cards[index], ...updates };

    return {
      success: true,
      card: this.cards[index],
      message: '卡片更新成功'
    };
  }

  // 删除卡片
  deleteCard(id: string): { success: boolean; message: string } {
    const index = this.cards.findIndex(c => c.id === id);
    if (index === -1) {
      return { success: false, message: '卡片不存在' };
    }

    this.cards.splice(index, 1);
    this.favoriteCards.delete(id);
    this.shareRecords.delete(id);

    return { success: true, message: '卡片已删除' };
  }

  // 搜索卡片
  searchCards(query: string): KnowledgeCard[] {
    const lowerQuery = query.toLowerCase();
    return this.cards.filter(c =>
      c.originalContent.toLowerCase().includes(lowerQuery) ||
      c.reflection.toLowerCase().includes(lowerQuery) ||
      c.articleTitle.toLowerCase().includes(lowerQuery) ||
      c.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  // 按标签筛选
  filterByTag(tag: string): KnowledgeCard[] {
    return this.cards.filter(c => c.tags.includes(tag));
  }

  // 收藏/取消收藏
  toggleFavorite(id: string): { success: boolean; isFavorite: boolean; message: string } {
    if (this.favoriteCards.has(id)) {
      this.favoriteCards.delete(id);
      return { success: true, isFavorite: false, message: '已取消收藏' };
    } else {
      this.favoriteCards.add(id);
      return { success: true, isFavorite: true, message: '已添加到收藏' };
    }
  }

  // 获取收藏的卡片
  getFavoriteCards(): KnowledgeCard[] {
    return this.cards.filter(c => this.favoriteCards.has(c.id));
  }

  // 检查是否收藏
  isFavorite(id: string): boolean {
    return this.favoriteCards.has(id);
  }

  // 生成分享链接
  generateShareLink(cardId: string, themeId: string = 'default-indigo'): ShareResult {
    const card = this.getCard(cardId);
    if (!card) {
      return { success: false, message: '卡片不存在' };
    }

    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shareUrl = `https://readai.app/share/${shareId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff&color=4f46e5`;

    // 记录分享
    if (!this.shareRecords.has(cardId)) {
      this.shareRecords.set(cardId, {
        cardId,
        shareCount: 0,
        viewCount: 0,
        createdAt: new Date().toISOString()
      });
    }

    const record = this.shareRecords.get(cardId)!;
    record.shareCount++;

    return {
      success: true,
      shareUrl,
      qrCodeUrl,
      shareId,
      message: '分享链接生成成功'
    };
  }

  // 生成分享海报
  async generateSharePoster(options: SharePosterOptions): Promise<ShareResult> {
    const card = this.getCard(options.cardId);
    if (!card) {
      return { success: false, message: '卡片不存在' };
    }

    // 模拟海报生成
    await new Promise(resolve => setTimeout(resolve, 1000));

    const shareLink = this.generateShareLink(options.cardId, options.themeId);
    const posterUrl = `https://readai.app/posters/${options.cardId}_${options.themeId}.${options.format}`;

    return {
      success: true,
      posterUrl,
      shareUrl: shareLink.shareUrl,
      qrCodeUrl: shareLink.qrCodeUrl,
      shareId: shareLink.shareId,
      message: '海报生成成功'
    };
  }

  // 下载海报
  async downloadPoster(cardId: string, themeId: string, format: 'png' | 'jpg' | 'webp' = 'png'): Promise<{ success: boolean; downloadUrl?: string; message: string }> {
    const card = this.getCard(cardId);
    if (!card) {
      return { success: false, message: '卡片不存在' };
    }

    // 模拟下载准备
    await new Promise(resolve => setTimeout(resolve, 500));

    const downloadUrl = `https://readai.app/download/${cardId}_${themeId}_${Date.now()}.${format}`;

    return {
      success: true,
      downloadUrl,
      message: '海报准备完成'
    };
  }

  // 复制分享链接
  copyShareLink(cardId: string): ShareResult {
    return this.generateShareLink(cardId);
  }

  // 分享到社交平台
  shareToSocial(cardId: string, platform: 'wechat' | 'weibo' | 'twitter' | 'facebook'): ShareResult {
    const shareLink = this.generateShareLink(cardId);
    if (!shareLink.success) {
      return shareLink;
    }

    const card = this.getCard(cardId);
    const shareText = `${card?.articleTitle} - ${card?.originalContent.substring(0, 50)}...`;

    let platformUrl = '';
    switch (platform) {
      case 'wechat':
        // 微信分享需要特殊处理
        platformUrl = shareLink.shareUrl!;
        break;
      case 'weibo':
        platformUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareLink.shareUrl!)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        platformUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink.shareUrl!)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink.shareUrl!)}`;
        break;
    }

    return {
      ...shareLink,
      shareUrl: platformUrl,
      message: `准备分享到${platform}`
    };
  }

  // 获取所有主题
  getAllThemes(): CardTheme[] {
    return this.themes;
  }

  // 获取单个主题
  getTheme(id: string): CardTheme | null {
    return this.themes.find(t => t.id === id) || null;
  }

  // AI推荐主题
  recommendTheme(cardId: string): CardTheme {
    const card = this.getCard(cardId);
    if (!card) return this.themes[0];

    const tags = card.tags.join(' ').toLowerCase();
    
    if (tags.includes('设计') || tags.includes('心理')) {
      return this.themes.find(t => t.id === 'paper') || this.themes[0];
    }
    if (tags.includes('ai') || tags.includes('物理')) {
      return this.themes.find(t => t.id === 'cosmos') || this.themes[0];
    }
    if (tags.includes('生产力') || tags.includes('商务')) {
      return this.themes.find(t => t.id === 'business-blue') || this.themes[0];
    }

    return this.themes[0];
  }

  // 获取统计信息
  getStatistics(): CardStatistics {
    const totalShares = Array.from(this.shareRecords.values()).reduce((sum, r) => sum + r.shareCount, 0);
    const totalViews = Array.from(this.shareRecords.values()).reduce((sum, r) => sum + r.viewCount, 0);

    // 统计标签
    const tagCounts = new Map<string, number>();
    this.cards.forEach(card => {
      card.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const popularTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalCards: this.cards.length,
      totalShares,
      totalViews,
      popularTags,
      recentCards: this.cards.slice(0, 5)
    };
  }

  // 获取所有标签
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.cards.forEach(card => {
      card.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }
}

// 创建数据库实例
const knowledgeDB = new KnowledgeCardDatabase();

// 导出API
export const KnowledgeAPI = {
  // 卡片管理
  cards: {
    getAll: () => knowledgeDB.getAllCards(),
    get: (id: string) => knowledgeDB.getCard(id),
    create: (card: Omit<KnowledgeCard, 'id' | 'createdAt'>) => knowledgeDB.createCard(card),
    update: (id: string, updates: Partial<KnowledgeCard>) => knowledgeDB.updateCard(id, updates),
    delete: (id: string) => knowledgeDB.deleteCard(id),
    search: (query: string) => knowledgeDB.searchCards(query),
    filterByTag: (tag: string) => knowledgeDB.filterByTag(tag)
  },

  // 收藏管理
  favorites: {
    toggle: (id: string) => knowledgeDB.toggleFavorite(id),
    getAll: () => knowledgeDB.getFavoriteCards(),
    check: (id: string) => knowledgeDB.isFavorite(id)
  },

  // 分享功能
  share: {
    generateLink: (cardId: string, themeId?: string) => knowledgeDB.generateShareLink(cardId, themeId),
    generatePoster: (options: SharePosterOptions) => knowledgeDB.generateSharePoster(options),
    downloadPoster: (cardId: string, themeId: string, format?: 'png' | 'jpg' | 'webp') => 
      knowledgeDB.downloadPoster(cardId, themeId, format),
    copyLink: (cardId: string) => knowledgeDB.copyShareLink(cardId),
    toSocial: (cardId: string, platform: 'wechat' | 'weibo' | 'twitter' | 'facebook') => 
      knowledgeDB.shareToSocial(cardId, platform)
  },

  // 主题管理
  themes: {
    getAll: () => knowledgeDB.getAllThemes(),
    get: (id: string) => knowledgeDB.getTheme(id),
    recommend: (cardId: string) => knowledgeDB.recommendTheme(cardId)
  },

  // 统计信息
  statistics: () => knowledgeDB.getStatistics(),
  
  // 标签管理
  tags: {
    getAll: () => knowledgeDB.getAllTags()
  }
};
