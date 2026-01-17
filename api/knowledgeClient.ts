// 知识卡片API客户端 - 模拟网络请求

import { KnowledgeAPI, SharePosterOptions } from './knowledgeApi';
import { KnowledgeCard } from '../types';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 知识卡片API客户端
export const knowledgeApiClient = {
  // 卡片管理
  cards: {
    getAll: async () => {
      await delay(300);
      return KnowledgeAPI.cards.getAll();
    },

    get: async (id: string) => {
      await delay(200);
      return KnowledgeAPI.cards.get(id);
    },

    create: async (card: Omit<KnowledgeCard, 'id' | 'createdAt'>) => {
      await delay(500);
      return KnowledgeAPI.cards.create(card);
    },

    update: async (id: string, updates: Partial<KnowledgeCard>) => {
      await delay(400);
      return KnowledgeAPI.cards.update(id, updates);
    },

    delete: async (id: string) => {
      await delay(500);
      return KnowledgeAPI.cards.delete(id);
    },

    search: async (query: string) => {
      await delay(300);
      return KnowledgeAPI.cards.search(query);
    },

    filterByTag: async (tag: string) => {
      await delay(300);
      return KnowledgeAPI.cards.filterByTag(tag);
    }
  },

  // 收藏管理
  favorites: {
    toggle: async (id: string) => {
      await delay(300);
      return KnowledgeAPI.favorites.toggle(id);
    },

    getAll: async () => {
      await delay(300);
      return KnowledgeAPI.favorites.getAll();
    },

    check: async (id: string) => {
      await delay(100);
      return KnowledgeAPI.favorites.check(id);
    }
  },

  // 分享功能
  share: {
    generateLink: async (cardId: string, themeId?: string) => {
      await delay(400);
      return KnowledgeAPI.share.generateLink(cardId, themeId);
    },

    generatePoster: async (options: SharePosterOptions) => {
      await delay(1500); // 海报生成需要更长时间
      return KnowledgeAPI.share.generatePoster(options);
    },

    downloadPoster: async (cardId: string, themeId: string, format?: 'png' | 'jpg' | 'webp') => {
      await delay(800);
      return KnowledgeAPI.share.downloadPoster(cardId, themeId, format);
    },

    copyLink: async (cardId: string) => {
      await delay(200);
      return KnowledgeAPI.share.copyLink(cardId);
    },

    toSocial: async (cardId: string, platform: 'wechat' | 'weibo' | 'twitter' | 'facebook') => {
      await delay(300);
      return KnowledgeAPI.share.toSocial(cardId, platform);
    }
  },

  // 主题管理
  themes: {
    getAll: async () => {
      await delay(200);
      return KnowledgeAPI.themes.getAll();
    },

    get: async (id: string) => {
      await delay(100);
      return KnowledgeAPI.themes.get(id);
    },

    recommend: async (cardId: string) => {
      await delay(300);
      return KnowledgeAPI.themes.recommend(cardId);
    }
  },

  // 统计信息
  statistics: async () => {
    await delay(400);
    return KnowledgeAPI.statistics();
  },

  // 标签管理
  tags: {
    getAll: async () => {
      await delay(200);
      return KnowledgeAPI.tags.getAll();
    }
  }
};
