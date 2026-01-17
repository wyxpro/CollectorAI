// AI播客React Hooks

import { useState, useEffect } from 'react';
import { podcastApiClient } from './podcastClient';
import { Podcast, PodcastSettings, GeneratePodcastRequest } from './podcastApi';

// 播客列表Hook
export function usePodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPodcasts = async () => {
    setIsLoading(true);
    try {
      const data = await podcastApiClient.list.getAll();
      setPodcasts(data);
    } catch (error) {
      console.error('Failed to load podcasts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await podcastApiClient.list.getFavorites();
      setPodcasts(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPodcasts = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await podcastApiClient.list.search(query);
      setPodcasts(data);
    } catch (error) {
      console.error('Failed to search podcasts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePodcast = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await podcastApiClient.podcast.delete(id);
      if (result.success) {
        setPodcasts(podcasts.filter(p => p.id !== id));
      }
      return result;
    } catch (error) {
      console.error('Failed to delete podcast:', error);
      return { success: false, message: '删除失败' };
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const result = await podcastApiClient.podcast.toggleFavorite(id);
      if (result.success) {
        setPodcasts(podcasts.map(p =>
          p.id === id ? { ...p, isFavorite: result.isFavorite } : p
        ));
      }
      return result;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return { success: false, isFavorite: false, message: '操作失败' };
    }
  };

  const generatePodcast = async (request: GeneratePodcastRequest) => {
    setIsLoading(true);
    try {
      const result = await podcastApiClient.generate(request);
      // 重新加载列表以包含新播客
      await loadPodcasts();
      return { success: true, ...result };
    } catch (error) {
      console.error('Failed to generate podcast:', error);
      return { success: false, podcastId: '', estimatedTime: 0, status: 'failed' };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPodcasts();
  }, []);

  return {
    podcasts,
    isLoading,
    loadPodcasts,
    loadFavorites,
    searchPodcasts,
    deletePodcast,
    toggleFavorite,
    generatePodcast
  };
}

// 单个播客Hook
export function usePodcast(podcastId: string | null) {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadPodcast = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await podcastApiClient.podcast.get(id);
      setPodcast(data);
    } catch (error) {
      console.error('Failed to load podcast:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementPlayCount = async () => {
    if (!podcast) return;
    try {
      const result = await podcastApiClient.podcast.incrementPlayCount(podcast.id);
      if (result.success) {
        setPodcast({ ...podcast, playCount: result.playCount });
      }
    } catch (error) {
      console.error('Failed to increment play count:', error);
    }
  };

  const downloadPodcast = async (quality: 'standard' | 'high' = 'high') => {
    if (!podcast) return { success: false, message: '播客不存在' };
    try {
      const result = await podcastApiClient.podcast.download(podcast.id, quality);
      return result;
    } catch (error) {
      console.error('Failed to download podcast:', error);
      return { success: false, message: '下载失败' };
    }
  };

  useEffect(() => {
    if (podcastId) {
      loadPodcast(podcastId);
    }
  }, [podcastId]);

  return {
    podcast,
    isLoading,
    loadPodcast,
    incrementPlayCount,
    downloadPodcast
  };
}

// 播客设置Hook
export function usePodcastSettings() {
  const [settings, setSettings] = useState<PodcastSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await podcastApiClient.settings.get();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<PodcastSettings>) => {
    setIsLoading(true);
    try {
      const data = await podcastApiClient.settings.update(updates);
      setSettings(data);
      return { success: true };
    } catch (error) {
      console.error('Failed to update settings:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const updateVoice = async (voice: 'calm' | 'energetic' | 'deep') => {
    return updateSettings({ voice });
  };

  const updateSpeed = async (speed: number) => {
    return updateSettings({ speed });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    updateVoice,
    updateSpeed,
    reload: loadSettings
  };
}

// 播客统计Hook
export function usePodcastStatistics() {
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const data = await podcastApiClient.statistics();
      setStatistics(data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  return {
    statistics,
    isLoading,
    reload: loadStatistics
  };
}
