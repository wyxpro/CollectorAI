// 知识卡片React Hooks

import { useState, useEffect } from 'react';
import { knowledgeApiClient } from './knowledgeClient';
import { KnowledgeCard } from '../types';
import { CardTheme, SharePosterOptions, ShareResult, CardStatistics } from './knowledgeApi';

// 卡片列表Hook
export function useKnowledgeCards() {
  const [cards, setCards] = useState<KnowledgeCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await knowledgeApiClient.cards.getAll();
      setCards(data);
    } catch (err: any) {
      setError(err.message || '加载失败');
      console.error('Failed to load cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchCards = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await knowledgeApiClient.cards.search(query);
      setCards(data);
    } catch (err: any) {
      setError(err.message || '搜索失败');
      console.error('Failed to search cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByTag = async (tag: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await knowledgeApiClient.cards.filterByTag(tag);
      setCards(data);
    } catch (err: any) {
      setError(err.message || '筛选失败');
      console.error('Failed to filter cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCard = async (card: Omit<KnowledgeCard, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await knowledgeApiClient.cards.create(card);
      if (result.success && result.card) {
        setCards([result.card, ...cards]);
      }
      return result;
    } catch (err: any) {
      setError(err.message || '创建失败');
      console.error('Failed to create card:', err);
      return { success: false, message: '创建失败' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCard = async (id: string, updates: Partial<KnowledgeCard>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await knowledgeApiClient.cards.update(id, updates);
      if (result.success && result.card) {
        setCards(cards.map(c => c.id === id ? result.card! : c));
      }
      return result;
    } catch (err: any) {
      setError(err.message || '更新失败');
      console.error('Failed to update card:', err);
      return { success: false, message: '更新失败' };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await knowledgeApiClient.cards.delete(id);
      if (result.success) {
        setCards(cards.filter(c => c.id !== id));
      }
      return result;
    } catch (err: any) {
      setError(err.message || '删除失败');
      console.error('Failed to delete card:', err);
      return { success: false, message: '删除失败' };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  return {
    cards,
    isLoading,
    error,
    loadCards,
    searchCards,
    filterByTag,
    createCard,
    updateCard,
    deleteCard
  };
}

// 单个卡片Hook
export function useKnowledgeCard(cardId: string | null) {
  const [card, setCard] = useState<KnowledgeCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCard = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await knowledgeApiClient.cards.get(id);
      setCard(data);
    } catch (err: any) {
      setError(err.message || '加载失败');
      console.error('Failed to load card:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cardId) {
      loadCard(cardId);
    }
  }, [cardId]);

  return {
    card,
    isLoading,
    error,
    reload: () => cardId && loadCard(cardId)
  };
}

// 收藏Hook
export function useFavorites() {
  const [favorites, setFavorites] = useState<KnowledgeCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await knowledgeApiClient.favorites.getAll();
      setFavorites(data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const result = await knowledgeApiClient.favorites.toggle(id);
      if (result.success) {
        await loadFavorites();
      }
      return result;
    } catch (err: any) {
      console.error('Failed to toggle favorite:', err);
      return { success: false, isFavorite: false, message: '操作失败' };
    }
  };

  const isFavorite = async (id: string): Promise<boolean> => {
    try {
      return await knowledgeApiClient.favorites.check(id);
    } catch (err) {
      console.error('Failed to check favorite:', err);
      return false;
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    reload: loadFavorites
  };
}

// 分享Hook
export function useShare() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareResult, setShareResult] = useState<ShareResult | null>(null);

  const generateShareLink = async (cardId: string, themeId?: string): Promise<ShareResult> => {
    setIsGenerating(true);
    try {
      const result = await knowledgeApiClient.share.generateLink(cardId, themeId);
      setShareResult(result);
      return result;
    } catch (err: any) {
      console.error('Failed to generate share link:', err);
      return { success: false, message: '生成失败' };
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePoster = async (options: SharePosterOptions): Promise<ShareResult> => {
    setIsGenerating(true);
    try {
      const result = await knowledgeApiClient.share.generatePoster(options);
      setShareResult(result);
      return result;
    } catch (err: any) {
      console.error('Failed to generate poster:', err);
      return { success: false, message: '生成失败' };
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPoster = async (
    cardId: string,
    themeId: string,
    format: 'png' | 'jpg' | 'webp' = 'png'
  ): Promise<{ success: boolean; downloadUrl?: string; message: string }> => {
    setIsGenerating(true);
    try {
      const result = await knowledgeApiClient.share.downloadPoster(cardId, themeId, format);
      return result;
    } catch (err: any) {
      console.error('Failed to download poster:', err);
      return { success: false, message: '下载失败' };
    } finally {
      setIsGenerating(false);
    }
  };

  const copyShareLink = async (cardId: string): Promise<ShareResult> => {
    try {
      const result = await knowledgeApiClient.share.copyLink(cardId);
      if (result.success && result.shareUrl) {
        // 复制到剪贴板
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(result.shareUrl);
        }
      }
      return result;
    } catch (err: any) {
      console.error('Failed to copy share link:', err);
      return { success: false, message: '复制失败' };
    }
  };

  const shareToSocial = async (
    cardId: string,
    platform: 'wechat' | 'weibo' | 'twitter' | 'facebook'
  ): Promise<ShareResult> => {
    try {
      const result = await knowledgeApiClient.share.toSocial(cardId, platform);
      if (result.success && result.shareUrl) {
        // 打开分享窗口
        if (platform !== 'wechat') {
          window.open(result.shareUrl, '_blank', 'width=600,height=400');
        }
      }
      return result;
    } catch (err: any) {
      console.error('Failed to share to social:', err);
      return { success: false, message: '分享失败' };
    }
  };

  return {
    isGenerating,
    shareResult,
    generateShareLink,
    generatePoster,
    downloadPoster,
    copyShareLink,
    shareToSocial
  };
}

// 主题Hook
export function useThemes() {
  const [themes, setThemes] = useState<CardTheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadThemes = async () => {
    setIsLoading(true);
    try {
      const data = await knowledgeApiClient.themes.getAll();
      setThemes(data);
    } catch (err) {
      console.error('Failed to load themes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTheme = async (id: string): Promise<CardTheme | null> => {
    try {
      return await knowledgeApiClient.themes.get(id);
    } catch (err) {
      console.error('Failed to get theme:', err);
      return null;
    }
  };

  const recommendTheme = async (cardId: string): Promise<CardTheme | null> => {
    try {
      return await knowledgeApiClient.themes.recommend(cardId);
    } catch (err) {
      console.error('Failed to recommend theme:', err);
      return null;
    }
  };

  useEffect(() => {
    loadThemes();
  }, []);

  return {
    themes,
    isLoading,
    getTheme,
    recommendTheme,
    reload: loadThemes
  };
}

// 统计Hook
export function useStatistics() {
  const [statistics, setStatistics] = useState<CardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const data = await knowledgeApiClient.statistics();
      setStatistics(data);
    } catch (err) {
      console.error('Failed to load statistics:', err);
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

// 标签Hook
export function useTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const data = await knowledgeApiClient.tags.getAll();
      setTags(data);
    } catch (err) {
      console.error('Failed to load tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  return {
    tags,
    isLoading,
    reload: loadTags
  };
}
