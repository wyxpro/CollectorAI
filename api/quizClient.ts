// Quiz API Client - 模拟网络请求

import { QuizAPI, QuizQuestion, QuizResult, QuizSession, QuizReport, GenerateQuizRequest } from './quizApi';

// 模拟网络延迟
const delay = (ms: number = 300 + Math.random() * 700) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const quizApiClient = {
  // 题目相关
  questions: {
    getAll: async (): Promise<QuizQuestion[]> => {
      await delay();
      return QuizAPI.questions.getAll();
    },

    get: async (id: string): Promise<QuizQuestion | null> => {
      await delay();
      return QuizAPI.questions.get(id);
    },

    search: async (query: string): Promise<QuizQuestion[]> => {
      await delay(200);
      return QuizAPI.questions.search(query);
    },

    getByDifficulty: async (difficulty: 'easy' | 'medium' | 'hard'): Promise<QuizQuestion[]> => {
      await delay();
      return QuizAPI.questions.getByDifficulty(difficulty);
    },

    getByTopic: async (topic: string): Promise<QuizQuestion[]> => {
      await delay();
      return QuizAPI.questions.getByTopic(topic);
    }
  },

  // 每日挑战
  challenge: {
    generate: async (request?: GenerateQuizRequest): Promise<QuizQuestion[]> => {
      await delay(500);
      return QuizAPI.challenge.generate(request);
    }
  },

  // 答题
  answer: {
    submit: async (questionId: string, userAnswer: number | number[], timeSpent?: number): Promise<QuizResult> => {
      await delay(300);
      return QuizAPI.answer.submit(questionId, userAnswer, timeSpent);
    }
  },

  // 会话管理
  session: {
    create: async (questions: QuizQuestion[]): Promise<QuizSession> => {
      await delay(200);
      return QuizAPI.session.create(questions);
    },

    complete: async (sessionId: string, results: QuizResult[]): Promise<QuizSession> => {
      await delay(400);
      return QuizAPI.session.complete(sessionId, results);
    }
  },

  // 错题本
  mistakes: {
    getAll: async (): Promise<QuizQuestion[]> => {
      await delay();
      return QuizAPI.mistakes.getAll();
    },

    clear: async (questionId: string): Promise<{ success: boolean; message: string }> => {
      await delay(200);
      return QuizAPI.mistakes.clear(questionId);
    }
  },

  // 报告和统计
  report: {
    generate: async (): Promise<QuizReport> => {
      await delay(600);
      return QuizAPI.report.generate();
    },

    getStatistics: async () => {
      await delay(300);
      return QuizAPI.report.getStatistics();
    }
  },

  // 进度管理
  progress: {
    reset: async (): Promise<{ success: boolean; message: string }> => {
      await delay(400);
      return QuizAPI.progress.reset();
    }
  }
};
