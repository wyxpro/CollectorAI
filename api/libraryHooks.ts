// 内容矩阵React Hooks
import { useState, useEffect, useCallback } from 'react';
import { libraryClient } from './libraryClient';

// 文章列表Hook
export function useLibraryArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await libraryClient.articles.getAll();
      setArticles(data);
    } catch (err: any) {
      setError(err.message || '加载失败');
      console.error('Failed to load articles:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addArticle = async (articleData: any) => {
    setIsLoading(true);
    try {
      const newArticle = await libraryClient.articles.add(articleData);
      setArticles([newArticle, ...articles]);
      return { success: true, article: newArticle };
    } catch (err: any) {
      setError(err.message || '添加失败');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const updateArticle = async (id: string, updates: any) => {
    setIsLoading(true);
    try {
      const updated = await libraryClient.articles.update(id, updates);
      if (updated) {
        setArticles(articles.map(a => a.id === id ? updated : a));
        return { success: true, article: updated };
      }
      return { success: false, error: '文章不存在' };
    } catch (err: any) {
      setError(err.message || '更新失败');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await libraryClient.articles.delete(id);
      if (result.success) {
        setArticles(articles.filter(a => a.id !== id));
      }
      return result;
    } catch (err: any) {
      setError(err.message || '删除失败');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const result = await libraryClient.articles.toggleFavorite(id);
      if (result.success) {
        setArticles(articles.map(a =>
          a.id === id ? { ...a, isFavorite: result.isFavorite } : a
        ));
      }
      return result;
    } catch (err: any) {
      setError(err.message || '操作失败');
      return { success: false, error: err };
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      const result = await libraryClient.articles.updateProgress(id, progress);
      if (result.success) {
        setArticles(articles.map(a =>
          a.id === id ? { ...a, progress: result.progress, status: result.status } : a
        ));
      }
      return result;
    } catch (err: any) {
      setError(err.message || '更新失败');
      return { success: false, error: err };
    }
  };

  const searchArticles = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await libraryClient.articles.search(query);
      setArticles(data);
    } catch (err: any) {
      setError(err.message || '搜索失败');
    } finally {
      setIsLoading(false);
    }
  };

  const filterByCategory = async (category: string) => {
    setIsLoading(true);
    try {
      const data = await libraryClient.articles.filterByCategory(category);
      setArticles(data);
    } catch (err: any) {
      setError(err.message || '筛选失败');
    } finally {
      setIsLoading(false);
    }
  };

  const filterByStatus = async (status: string) => {
    setIsLoading(true);
    try {
      const data = await libraryClient.articles.filterByStatus(status);
      setArticles(data);
    } catch (err: any) {
      setError(err.message || '筛选失败');
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    try {
      const result = await libraryClient.articles.updateNotes(id, notes);
      if (result.success) {
        setArticles(articles.map(a =>
          a.id === id ? { ...a, notes } : a
        ));
      }
      return result;
    } catch (err: any) {
      setError(err.message || '保存失败');
      return { success: false, error: err };
    }
  };

  const getFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await libraryClient.articles.getFavorites();
      setArticles(data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const getRecentlyRead = async (limit?: number) => {
    setIsLoading(true);
    try {
      const data = await libraryClient.articles.getRecentlyRead(limit);
      setArticles(data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const batchFavorite = async (ids: string[], isFavorite: boolean) => {
    setIsLoading(true);
    try {
      const result = await libraryClient.articles.batchFavorite(ids, isFavorite);
      if (result.success) {
        setArticles(articles.map(a =>
          ids.includes(a.id) ? { ...a, isFavorite } : a
        ));
      }
      return result;
    } catch (err: any) {
      setError(err.message || '操作失败');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: 'json' | 'csv' = 'json') => {
    try {
      const result = await libraryClient.articles.exportData(format);
      if (result.success) {
        // 创建下载链接
        const blob = new Blob([result.data], { 
          type: format === 'json' ? 'application/json' : 'text/csv' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      return result;
    } catch (err: any) {
      setError(err.message || '导出失败');
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return {
    articles,
    isLoading,
    error,
    loadArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    toggleFavorite,
    updateProgress,
    updateNotes,
    searchArticles,
    filterByCategory,
    filterByStatus,
    getFavorites,
    getRecentlyRead,
    batchFavorite,
    exportData
  };
}

// 单个文章Hook
export function useLibraryArticle(articleId: string | null) {
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadArticle = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await libraryClient.articles.get(id);
      setArticle(data);
    } catch (err) {
      console.error('Failed to load article:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (articleId) {
      loadArticle(articleId);
    }
  }, [articleId, loadArticle]);

  return { article, isLoading, reload: () => articleId && loadArticle(articleId) };
}

// 统计信息Hook
export function useLibraryStatistics() {
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStatistics = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await libraryClient.statistics();
      setStatistics(data);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return { statistics, isLoading, reload: loadStatistics };
}

// 助理对话Hook
export function useAssistantConversation(conversationId: string = 'default') {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await libraryClient.assistant.getConversation(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const addMessage = async (message: any) => {
    setIsLoading(true);
    try {
      const newMessage = await libraryClient.assistant.addMessage(message, conversationId);
      setMessages([...messages, newMessage]);
      return { success: true, message: newMessage };
    } catch (err: any) {
      console.error('Failed to add message:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async () => {
    setIsLoading(true);
    try {
      await libraryClient.assistant.clearConversation(conversationId);
      setMessages([]);
      return { success: true };
    } catch (err: any) {
      console.error('Failed to clear conversation:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  return {
    messages,
    isLoading,
    addMessage,
    clearConversation,
    reload: loadConversation
  };
}

// 推荐文章Hook
export function useRecommendations(articleId: string | null, limit: number = 5) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRecommendations = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await libraryClient.articles.getRecommendations(id, limit);
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (articleId) {
      loadRecommendations(articleId);
    }
  }, [articleId, loadRecommendations]);

  return { recommendations, isLoading, reload: () => articleId && loadRecommendations(articleId) };
}
