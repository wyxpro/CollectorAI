// AI播客API客户端 - 模拟网络请求

import { PodcastAPI, GeneratePodcastRequest, PodcastSettings } from './podcastApi';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 播客API客户端
export const podcastApiClient = {
  // 播客列表
  list: {
    getAll: async () => {
      await delay(300);
      return PodcastAPI.list.getAll();
    },
    
    getFavorites: async () => {
      await delay(300);
      return PodcastAPI.list.getFavorites();
    },
    
    search: async (query: string) => {
      await delay(400);
      return PodcastAPI.list.search(query);
    }
  },

  // 单个播客操作
  podcast: {
    get: async (id: string) => {
      await delay(200);
      return PodcastAPI.podcast.get(id);
    },
    
    delete: async (id: string) => {
      await delay(500);
      return PodcastAPI.podcast.delete(id);
    },
    
    toggleFavorite: async (id: string) => {
      await delay(300);
      return PodcastAPI.podcast.toggleFavorite(id);
    },
    
    incrementPlayCount: async (id: string) => {
      await delay(200);
      return PodcastAPI.podcast.incrementPlayCount(id);
    },
    
    download: async (id: string, quality: 'standard' | 'high' = 'high') => {
      await delay(800);
      return PodcastAPI.podcast.download(id, quality);
    }
  },

  // 生成播客
  generate: async (request: GeneratePodcastRequest) => {
    await delay(1000);
    return PodcastAPI.generate(request);
  },

  // 设置
  settings: {
    get: async () => {
      await delay(200);
      return PodcastAPI.settings.get();
    },
    
    update: async (updates: Partial<PodcastSettings>) => {
      await delay(300);
      return PodcastAPI.settings.update(updates);
    }
  },

  // 统计
  statistics: async () => {
    await delay(400);
    return PodcastAPI.statistics();
  }
};
