// Quiz Custom React Hooks

import { useState, useEffect, useCallback } from 'react';
import { quizApiClient } from './quizClient';
import { QuizQuestion, QuizResult, QuizSession, QuizReport, GenerateQuizRequest } from './quizApi';

// Hook: 获取每日挑战题目
export function useDailyChallenge(request?: GenerateQuizRequest) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChallenge = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApiClient.challenge.generate(request);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  return { questions, loading, error, reload: loadChallenge };
}

// Hook: 题目管理
export function useQuestions() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApiClient.questions.getAll();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApiClient.questions.search(query);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const getByDifficulty = useCallback(async (difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApiClient.questions.getByDifficulty(difficulty);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const getByTopic = useCallback(async (topic: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApiClient.questions.getByTopic(topic);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    questions,
    loading,
    error,
    loadAll,
    search,
    getByDifficulty,
    getByTopic
  };
}

// Hook: 答题会话管理
export function useQuizSession() {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = useCallback(async (questions: QuizQuestion[]) => {
    try {
      setLoading(true);
      setError(null);
      const newSession = await quizApiClient.session.create(questions);
      setSession(newSession);
      setCurrentIndex(0);
      setResults([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建会话失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (
    questionId: string,
    userAnswer: number | number[],
    timeSpent?: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await quizApiClient.answer.submit(questionId, userAnswer, timeSpent);
      setResults(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const nextQuestion = useCallback(() => {
    if (session && currentIndex < session.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [session, currentIndex]);

  const previousQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const completeSession = useCallback(async () => {
    if (!session) return null;
    
    try {
      setLoading(true);
      setError(null);
      const completedSession = await quizApiClient.session.complete(session.id, results);
      setSession(completedSession);
      return completedSession;
    } catch (err) {
      setError(err instanceof Error ? err.message : '完成会话失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session, results]);

  const currentQuestion = session?.questions[currentIndex] || null;
  const progress = session ? ((currentIndex + 1) / session.questions.length) * 100 : 0;
  const isLastQuestion = session ? currentIndex === session.questions.length - 1 : false;

  return {
    session,
    currentQuestion,
    currentIndex,
    results,
    loading,
    error,
    progress,
    isLastQuestion,
    startSession,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeSession
  };
}

// Hook: 错题本
export function useMistakes() {
  const [mistakes, setMistakes] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMistakes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApiClient.mistakes.getAll();
      setMistakes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMistake = useCallback(async (questionId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await quizApiClient.mistakes.clear(questionId);
      if (result.success) {
        setMistakes(prev => prev.filter(q => q.id !== questionId));
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMistakes();
  }, [loadMistakes]);

  return {
    mistakes,
    loading,
    error,
    reload: loadMistakes,
    clearMistake
  };
}

// Hook: 学习报告
export function useQuizReport() {
  const [report, setReport] = useState<QuizReport | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApiClient.report.generate();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApiClient.report.getStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const resetProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await quizApiClient.progress.reset();
      if (result.success) {
        setReport(null);
        setStatistics(null);
        await loadReport();
        await loadStatistics();
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadReport, loadStatistics]);

  useEffect(() => {
    loadReport();
    loadStatistics();
  }, [loadReport, loadStatistics]);

  return {
    report,
    statistics,
    loading,
    error,
    reload: () => {
      loadReport();
      loadStatistics();
    },
    resetProgress
  };
}
