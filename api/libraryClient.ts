// 内容矩阵API客户端
import { LibraryAPI } from './libraryApi';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const libraryClient = {
  // 文章管理
  articles: {
    getAll: async () => {
      await delay(300);
      return LibraryAPI.articles.getAll();
    },
    
    get: async (id: string) => {
      await delay(300);
      return LibraryAPI.articles.get(id);
    },
    
    add: async (articleData: any) => {
      await delay(800);
      return LibraryAPI.articles.add(articleData);
    },
    
    update: async (id: string, updates: any) => {
      await delay(500);
      return LibraryAPI.articles.update(id, updates);
    },
    
    delete: async (id: string) => {
      await delay(500);
      return LibraryAPI.articles.delete(id);
    },
    
    toggleFavorite: async (id: string) => {
      await delay(400);
      return LibraryAPI.articles.toggleFavorite(id);
    },
    
    updateProgress: async (id: string, progress: number) => {
      await delay(300);
      return LibraryAPI.articles.updateProgress(id, progress);
    },

    updateNotes: async (id: string, notes: string) => {
      await delay(400);
      return LibraryAPI.articles.updateNotes(id, notes);
    },
    
    search: async (query: string) => {
      await delay(400);
      return LibraryAPI.articles.search(query);
    },
    
    filterByCategory: async (category: string) => {
      await delay(300);
      return LibraryAPI.articles.filterByCategory(category);
    },
    
    filterByStatus: async (status: string) => {
      await delay(300);
      return LibraryAPI.articles.filterByStatus(status);
    },

    getFavorites: async () => {
      await delay(300);
      return LibraryAPI.articles.getFavorites();
    },

    getRecentlyRead: async (limit?: number) => {
      await delay(300);
      return LibraryAPI.articles.getRecentlyRead(limit);
    },

    getRecommendations: async (articleId: string, limit?: number) => {
      await delay(400);
      return LibraryAPI.articles.getRecommendations(articleId, limit);
    },
    
    batchUpdateStatus: async (ids: string[], status: any) => {
      await delay(600);
      return LibraryAPI.articles.batchUpdateStatus(ids, status);
    },
    
    batchDelete: async (ids: string[]) => {
      await delay(600);
      return LibraryAPI.articles.batchDelete(ids);
    },

    batchFavorite: async (ids: string[], isFavorite: boolean) => {
      await delay(500);
      return LibraryAPI.articles.batchFavorite(ids, isFavorite);
    },

    exportData: async (format?: 'json' | 'csv') => {
      await delay(800);
      return LibraryAPI.articles.exportData(format);
    }
  },

  // 统计信息
  statistics: async () => {
    await delay(400);
    return LibraryAPI.statistics();
  },

  // 助理对话
  assistant: {
    getConversation: async (conversationId?: string) => {
      await delay(300);
      return LibraryAPI.assistant.getConversation(conversationId);
    },
    
    addMessage: async (message: any, conversationId?: string) => {
      await delay(500);
      return LibraryAPI.assistant.addMessage(message, conversationId);
    },
    
    clearConversation: async (conversationId?: string) => {
      await delay(300);
      return LibraryAPI.assistant.clearConversation(conversationId);
    }
  }
};
