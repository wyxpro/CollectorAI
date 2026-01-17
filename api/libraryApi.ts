// 内容矩阵/收录夹后端API
import { MOCK_ARTICLES } from '../data/mockData';

interface LibraryArticle {
  id: string;
  title: string;
  author: string;
  source: string;
  url?: string;
  coverImage: string;
  wordCount: number;
  estimatedTime: number;
  progress: number;
  status: 'pending' | 'parsed' | 'quiz_generated' | 'completed';
  addedAt: string;
  lastReadAt?: string;
  tags: string[];
  category: string;
  isFavorite: boolean;
  notes?: string;
}

interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  articleReferences?: string[];
}

class LibraryDatabase {
  private articles: LibraryArticle[];
  private conversations: Map<string, AssistantMessage[]>;
  private favorites: Set<string>;

  constructor() {
    // 初始化文章数据
    this.articles = MOCK_ARTICLES.map(article => ({
      ...article,
      url: `https://example.com/article/${article.id}`,
      addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastReadAt: article.progress > 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      tags: this.generateTags(article.title),
      category: this.categorizeSource(article.source),
      isFavorite: Math.random() > 0.7,
      notes: ''
    }));

    this.conversations = new Map();
    this.favorites = new Set(this.articles.filter(a => a.isFavorite).map(a => a.id));
  }

  private generateTags(title: string): string[] {
    const tagPool = ['AI', '心理学', '效率', '设计', '技术', '思维', '学习', '创新'];
    const keywords = title.toLowerCase();
    const matchedTags = tagPool.filter(tag => 
      keywords.includes(tag.toLowerCase()) || Math.random() > 0.7
    );
    return matchedTags.slice(0, 3);
  }

  private categorizeSource(source: string): string {
    const categoryMap: Record<string, string> = {
      'Medium': '公众号',
      'UX Collective': '小红书',
      'TechCrunch': '哔哩哔哩'
    };
    return categoryMap[source] || '全部';
  }

  // 获取所有文章
  getAllArticles() {
    return this.articles.map(a => ({
      ...a,
      isFavorite: this.favorites.has(a.id)
    }));
  }

  // 获取单个文章
  getArticle(id: string) {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      return {
        ...article,
        isFavorite: this.favorites.has(id)
      };
    }
    return null;
  }

  // 添加新文章
  addArticle(articleData: Partial<LibraryArticle>) {
    const newArticle: LibraryArticle = {
      id: `article_${Date.now()}`,
      title: articleData.title || '新文章',
      author: articleData.author || '未知作者',
      source: articleData.source || 'Medium',
      url: articleData.url || '',
      coverImage: articleData.coverImage || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400`,
      wordCount: articleData.wordCount || Math.floor(Math.random() * 3000) + 1000,
      estimatedTime: articleData.estimatedTime || Math.ceil((articleData.wordCount || 1500) / 300),
      progress: 0,
      status: 'pending',
      addedAt: new Date().toISOString(),
      tags: articleData.tags || this.generateTags(articleData.title || ''),
      category: this.categorizeSource(articleData.source || 'Medium'),
      isFavorite: false,
      notes: articleData.notes || ''
    };

    this.articles.unshift(newArticle);
    return newArticle;
  }

  // 更新文章
  updateArticle(id: string, updates: Partial<LibraryArticle>) {
    const index = this.articles.findIndex(a => a.id === id);
    if (index !== -1) {
      this.articles[index] = { ...this.articles[index], ...updates };
      return this.articles[index];
    }
    return null;
  }

  // 删除文章
  deleteArticle(id: string) {
    const index = this.articles.findIndex(a => a.id === id);
    if (index !== -1) {
      this.articles.splice(index, 1);
      this.favorites.delete(id);
      return { success: true, message: '文章已删除' };
    }
    return { success: false, message: '文章不存在' };
  }

  // 切换收藏
  toggleFavorite(id: string) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      return { success: true, isFavorite: false, message: '已取消收藏' };
    } else {
      this.favorites.add(id);
      return { success: true, isFavorite: true, message: '已添加到收藏' };
    }
  }

  // 更新阅读进度
  updateProgress(id: string, progress: number) {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      article.progress = Math.min(100, Math.max(0, progress));
      article.lastReadAt = new Date().toISOString();
      
      // 自动更新状态
      if (article.progress === 100) {
        article.status = 'completed';
      } else if (article.progress > 0 && article.status === 'pending') {
        article.status = 'parsed';
      }
      
      return { success: true, progress: article.progress, status: article.status };
    }
    return { success: false, message: '文章不存在' };
  }

  // 搜索文章
  searchArticles(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.articles.filter(a =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.author.toLowerCase().includes(lowerQuery) ||
      a.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ).map(a => ({
      ...a,
      isFavorite: this.favorites.has(a.id)
    }));
  }

  // 按分类筛选
  filterByCategory(category: string) {
    if (category === '全部') {
      return this.getAllArticles();
    }
    return this.articles.filter(a => a.category === category).map(a => ({
      ...a,
      isFavorite: this.favorites.has(a.id)
    }));
  }

  // 按状态筛选
  filterByStatus(status: string) {
    const statusMap: Record<string, string> = {
      '等待处理': 'pending',
      '已解析': 'parsed',
      '挑战已生成': 'quiz_generated',
      '已读完': 'completed'
    };
    
    const statusKey = statusMap[status];
    if (!statusKey) {
      return this.getAllArticles();
    }
    
    return this.articles.filter(a => a.status === statusKey).map(a => ({
      ...a,
      isFavorite: this.favorites.has(a.id)
    }));
  }

  // 获取统计信息
  getStatistics() {
    const categoryCounts: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    
    this.articles.forEach(a => {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    return {
      totalArticles: this.articles.length,
      completedArticles: this.articles.filter(a => a.status === 'completed').length,
      totalReadingTime: this.articles.reduce((sum, a) => sum + a.estimatedTime, 0),
      averageProgress: this.articles.reduce((sum, a) => sum + a.progress, 0) / this.articles.length,
      categoryCounts,
      statusCounts,
      favoritesCount: this.favorites.size
    };
  }

  // 助理对话相关
  getConversation(conversationId: string = 'default') {
    return this.conversations.get(conversationId) || [];
  }

  addMessage(message: Omit<AssistantMessage, 'id' | 'timestamp'>, conversationId: string = 'default') {
    const newMessage: AssistantMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    const conversation = this.conversations.get(conversationId) || [];
    conversation.push(newMessage);
    this.conversations.set(conversationId, conversation);

    return newMessage;
  }

  clearConversation(conversationId: string = 'default') {
    this.conversations.delete(conversationId);
    return { success: true, message: '对话已清空' };
  }

  // 批量操作
  batchUpdateStatus(ids: string[], status: LibraryArticle['status']) {
    let updated = 0;
    ids.forEach(id => {
      const article = this.articles.find(a => a.id === id);
      if (article) {
        article.status = status;
        updated++;
      }
    });
    return { success: true, updated, message: `已更新 ${updated} 篇文章` };
  }

  batchDelete(ids: string[]) {
    let deleted = 0;
    ids.forEach(id => {
      const index = this.articles.findIndex(a => a.id === id);
      if (index !== -1) {
        this.articles.splice(index, 1);
        this.favorites.delete(id);
        deleted++;
      }
    });
    return { success: true, deleted, message: `已删除 ${deleted} 篇文章` };
  }

  // 批量收藏
  batchFavorite(ids: string[], isFavorite: boolean) {
    let updated = 0;
    ids.forEach(id => {
      if (isFavorite) {
        this.favorites.add(id);
      } else {
        this.favorites.delete(id);
      }
      updated++;
    });
    return { success: true, updated, message: `已${isFavorite ? '收藏' : '取消收藏'} ${updated} 篇文章` };
  }

  // 更新笔记
  updateNotes(id: string, notes: string) {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      article.notes = notes;
      return { success: true, message: '笔记已保存' };
    }
    return { success: false, message: '文章不存在' };
  }

  // 获取收藏列表
  getFavorites() {
    return this.articles.filter(a => this.favorites.has(a.id)).map(a => ({
      ...a,
      isFavorite: true
    }));
  }

  // 获取最近阅读
  getRecentlyRead(limit: number = 10) {
    return this.articles
      .filter(a => a.lastReadAt)
      .sort((a, b) => new Date(b.lastReadAt!).getTime() - new Date(a.lastReadAt!).getTime())
      .slice(0, limit)
      .map(a => ({
        ...a,
        isFavorite: this.favorites.has(a.id)
      }));
  }

  // 获取推荐文章（基于标签）
  getRecommendations(articleId: string, limit: number = 5) {
    const article = this.articles.find(a => a.id === articleId);
    if (!article) return [];

    return this.articles
      .filter(a => a.id !== articleId)
      .map(a => ({
        ...a,
        isFavorite: this.favorites.has(a.id),
        similarity: a.tags.filter(tag => article.tags.includes(tag)).length
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  // 导出数据
  exportData(format: 'json' | 'csv' = 'json') {
    const data = this.articles.map(a => ({
      ...a,
      isFavorite: this.favorites.has(a.id)
    }));

    if (format === 'json') {
      return {
        success: true,
        data: JSON.stringify(data, null, 2),
        filename: `library_export_${Date.now()}.json`
      };
    } else {
      // CSV格式
      const headers = ['标题', '作者', '来源', '状态', '进度', '收藏', '添加时间'];
      const rows = data.map(a => [
        a.title,
        a.author,
        a.source,
        a.status,
        `${a.progress}%`,
        a.isFavorite ? '是' : '否',
        new Date(a.addedAt).toLocaleDateString('zh-CN')
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      return {
        success: true,
        data: csv,
        filename: `library_export_${Date.now()}.csv`
      };
    }
  }
}

// 创建数据库实例
const libraryDB = new LibraryDatabase();

// 导出API
export const LibraryAPI = {
  // 文章管理
  articles: {
    getAll: () => libraryDB.getAllArticles(),
    get: (id: string) => libraryDB.getArticle(id),
    add: (articleData: Partial<LibraryArticle>) => libraryDB.addArticle(articleData),
    update: (id: string, updates: Partial<LibraryArticle>) => libraryDB.updateArticle(id, updates),
    delete: (id: string) => libraryDB.deleteArticle(id),
    toggleFavorite: (id: string) => libraryDB.toggleFavorite(id),
    updateProgress: (id: string, progress: number) => libraryDB.updateProgress(id, progress),
    updateNotes: (id: string, notes: string) => libraryDB.updateNotes(id, notes),
    search: (query: string) => libraryDB.searchArticles(query),
    filterByCategory: (category: string) => libraryDB.filterByCategory(category),
    filterByStatus: (status: string) => libraryDB.filterByStatus(status),
    getFavorites: () => libraryDB.getFavorites(),
    getRecentlyRead: (limit?: number) => libraryDB.getRecentlyRead(limit),
    getRecommendations: (articleId: string, limit?: number) => libraryDB.getRecommendations(articleId, limit),
    batchUpdateStatus: (ids: string[], status: any) => libraryDB.batchUpdateStatus(ids, status),
    batchDelete: (ids: string[]) => libraryDB.batchDelete(ids),
    batchFavorite: (ids: string[], isFavorite: boolean) => libraryDB.batchFavorite(ids, isFavorite),
    exportData: (format?: 'json' | 'csv') => libraryDB.exportData(format)
  },

  // 统计信息
  statistics: () => libraryDB.getStatistics(),

  // 助理对话
  assistant: {
    getConversation: (conversationId?: string) => libraryDB.getConversation(conversationId),
    addMessage: (message: Omit<AssistantMessage, 'id' | 'timestamp'>, conversationId?: string) => 
      libraryDB.addMessage(message, conversationId),
    clearConversation: (conversationId?: string) => libraryDB.clearConversation(conversationId)
  }
};
