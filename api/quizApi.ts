// AI问答后端API实现

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple';
  question: string;
  options: string[];
  correctAnswer: number | number[];
  explanation: string;
  relatedArticleId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: string;
}

export interface QuizResult {
  questionId: string;
  userAnswer: number | number[];
  isCorrect: boolean;
  timestamp: string;
  timeSpent?: number; // seconds
}

export interface QuizSession {
  id: string;
  questions: QuizQuestion[];
  results: QuizResult[];
  startedAt: string;
  completedAt?: string;
  score: number;
  accuracy: number;
}

export interface QuizReport {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  strongTopics: string[];
  weakTopics: string[];
  recommendedArticles: string[];
  streak: number;
  level: string;
}

export interface GenerateQuizRequest {
  articleIds?: string[];
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  count?: number;
  topics?: string[];
}

// 模拟数据库
class QuizDatabase {
  private questions: QuizQuestion[];
  private sessions: QuizSession[];
  private userResults: QuizResult[];
  private mistakeBank: Set<string>;

  constructor() {
    this.questions = this.generateInitialQuestions();
    this.sessions = [];
    this.userResults = [];
    this.mistakeBank = new Set();
  }

  private generateInitialQuestions(): QuizQuestion[] {
    return [
      {
        id: 'q_001',
        type: 'single',
        question: '根据蔡格尼克效应，人们更容易记住什么样的任务？',
        options: ['已完成的任务', '未完成的任务', '简单的任务', '复杂的任务'],
        correctAnswer: 1,
        explanation: '蔡格尼克效应指出，人们对于尚未处理完的事情，比已处理完成的事情印象更加深刻。这是因为未完成的任务会持续占用我们的认知资源。',
        relatedArticleId: 'article_001',
        difficulty: 'easy',
        tags: ['心理学', '记忆'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'q_002',
        type: 'multiple',
        question: '以下哪些因素可能增强学习的好奇心？（多选）',
        options: ['信息缺口', '适当的难度', '完全确定的答案', '认知冲突'],
        correctAnswer: [0, 1, 3],
        explanation: '好奇心通常由信息缺口（想知道不知道的）、最佳挑战难度（不太难也不太简单）以及认知冲突（已有知识与新信息矛盾）激发。完全确定的答案反而会降低好奇心。',
        relatedArticleId: 'article_002',
        difficulty: 'medium',
        tags: ['学习科学', '认知心理学'],
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'q_003',
        type: 'single',
        question: 'Scaling Law 的本质是什么？',
        options: ['工程参数的堆砌', '能源到逻辑熵的转化', '算法的优化', '数据的积累'],
        correctAnswer: 1,
        explanation: 'Scaling Law 的本质是将"能源"转化为"逻辑熵"的物理过程，而不仅仅是工程参数的堆砌。这意味着 AI 的竞争终局可能是能源成本的竞争。',
        relatedArticleId: 'article_003',
        difficulty: 'hard',
        tags: ['AI', '物理学', 'Scaling Law'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'q_004',
        type: 'single',
        question: '在 AI 时代，个人应该更关注什么？',
        options: ['计算的速度', '提问的质量', '数据的数量', '模型的参数'],
        correctAnswer: 1,
        explanation: '在 AI 时代，逻辑序的产出成本正在急剧下降，因此个人应该更关注"提问的质量"而非"计算的速度"。高质量的问题能够引导 AI 产生更有价值的输出。',
        relatedArticleId: 'article_003',
        difficulty: 'medium',
        tags: ['AI', '思维方式'],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'q_005',
        type: 'multiple',
        question: '深度工作需要哪些条件？（多选）',
        options: ['无干扰环境', '明确的时间边界', '多任务处理', '刻意练习'],
        correctAnswer: [0, 1, 3],
        explanation: '深度工作需要无干扰环境、明确的时间边界和刻意练习。多任务处理会分散注意力，不利于深度工作。',
        relatedArticleId: 'article_004',
        difficulty: 'easy',
        tags: ['生产力', '专注力'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'q_006',
        type: 'single',
        question: '未来的设计将从什么转向什么？',
        options: ['从功能转向美学', '从像素转向意图', '从简单转向复杂', '从静态转向动态'],
        correctAnswer: 1,
        explanation: '未来的设计不再是关于像素的排列，而是关于"意图"的捕获与共鸣。界面（UI）将消失，取而代之的是服务（Service）。',
        relatedArticleId: 'article_005',
        difficulty: 'medium',
        tags: ['设计', 'UX', '未来趋势'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'q_007',
        type: 'single',
        question: '神经接口技术主要面临的伦理挑战不包括：',
        options: ['隐私泄露', '身份认同危机', '技术成本过低', '增强后的不平等'],
        correctAnswer: 2,
        explanation: '技术成本高昂导致的获取不平等是挑战之一，而非"成本过低"。神经接口技术面临的主要伦理挑战包括隐私泄露、身份认同危机和技术获取的不平等。',
        relatedArticleId: 'article_006',
        difficulty: 'hard',
        tags: ['神经科学', '伦理', '技术'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'q_008',
        type: 'multiple',
        question: '有效的学习策略包括哪些？（多选）',
        options: ['间隔重复', '主动回忆', '被动阅读', '交叉练习'],
        correctAnswer: [0, 1, 3],
        explanation: '有效的学习策略包括间隔重复、主动回忆和交叉练习。被动阅读虽然常见，但效果远不如主动学习策略。',
        relatedArticleId: 'article_007',
        difficulty: 'easy',
        tags: ['学习方法', '认知科学'],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // 获取所有题目
  getAllQuestions(): QuizQuestion[] {
    return [...this.questions];
  }

  // 获取单个题目
  getQuestion(id: string): QuizQuestion | null {
    return this.questions.find(q => q.id === id) || null;
  }

  // 生成每日挑战
  generateDailyChallenge(request: GenerateQuizRequest = {}): QuizQuestion[] {
    const { difficulty = 'mixed', count = 5, topics = [] } = request;
    
    let filteredQuestions = [...this.questions];

    // 按难度筛选
    if (difficulty !== 'mixed') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }

    // 按主题筛选
    if (topics.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.tags.some(tag => topics.includes(tag))
      );
    }

    // 随机选择题目
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // 提交答案
  submitAnswer(questionId: string, userAnswer: number | number[], timeSpent: number = 0): QuizResult {
    const question = this.getQuestion(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    let isCorrect = false;
    if (question.type === 'single') {
      isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'multiple') {
      const correctAnswers = question.correctAnswer as number[];
      const userAnswers = userAnswer as number[];
      isCorrect = correctAnswers.length === userAnswers.length &&
                  correctAnswers.every(a => userAnswers.includes(a));
    }

    const result: QuizResult = {
      questionId,
      userAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
      timeSpent
    };

    this.userResults.push(result);

    // 如果答错，加入错题本
    if (!isCorrect) {
      this.mistakeBank.add(questionId);
    } else {
      // 如果答对，从错题本移除
      this.mistakeBank.delete(questionId);
    }

    return result;
  }

  // 创建测验会话
  createSession(questions: QuizQuestion[]): QuizSession {
    const session: QuizSession = {
      id: `session_${Date.now()}`,
      questions,
      results: [],
      startedAt: new Date().toISOString(),
      score: 0,
      accuracy: 0
    };

    this.sessions.push(session);
    return session;
  }

  // 完成测验会话
  completeSession(sessionId: string, results: QuizResult[]): QuizSession {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.results = results;
    session.completedAt = new Date().toISOString();
    session.score = results.filter(r => r.isCorrect).length;
    session.accuracy = (session.score / results.length) * 100;

    // 更新用户结果
    results.forEach(result => {
      this.userResults.push(result);
      if (!result.isCorrect) {
        this.mistakeBank.add(result.questionId);
      }
    });

    return session;
  }

  // 获取错题本
  getMistakes(): QuizQuestion[] {
    return this.questions.filter(q => this.mistakeBank.has(q.id));
  }

  // 清除错题
  clearMistake(questionId: string): { success: boolean; message: string } {
    if (this.mistakeBank.has(questionId)) {
      this.mistakeBank.delete(questionId);
      return { success: true, message: '已从错题本移除' };
    }
    return { success: false, message: '该题目不在错题本中' };
  }

  // 生成学习报告
  generateReport(): QuizReport {
    const totalQuestions = this.userResults.length;
    const correctAnswers = this.userResults.filter(r => r.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // 计算总用时
    const totalTimeSpent = this.userResults.reduce((sum, r) => sum + (r.timeSpent || 0), 0);
    const averageTimePerQuestion = totalQuestions > 0 ? totalTimeSpent / totalQuestions : 0;

    // 分析强弱主题
    const topicStats = new Map<string, { correct: number; total: number }>();
    
    this.userResults.forEach(result => {
      const question = this.getQuestion(result.questionId);
      if (question) {
        question.tags.forEach(tag => {
          const stats = topicStats.get(tag) || { correct: 0, total: 0 };
          stats.total++;
          if (result.isCorrect) stats.correct++;
          topicStats.set(tag, stats);
        });
      }
    });

    const topicAccuracies = Array.from(topicStats.entries())
      .map(([topic, stats]) => ({
        topic,
        accuracy: (stats.correct / stats.total) * 100,
        count: stats.total
      }))
      .filter(t => t.count >= 2); // 至少答过2题

    const strongTopics = topicAccuracies
      .filter(t => t.accuracy >= 80)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3)
      .map(t => t.topic);

    const weakTopics = topicAccuracies
      .filter(t => t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
      .map(t => t.topic);

    // 计算连胜
    let streak = 0;
    for (let i = this.userResults.length - 1; i >= 0; i--) {
      if (this.userResults[i].isCorrect) {
        streak++;
      } else {
        break;
      }
    }

    // 推荐文章（基于弱项主题）
    const recommendedArticles = weakTopics.slice(0, 3).map(topic => `article_${topic}`);

    // 计算等级
    let level = '新手';
    if (accuracy >= 90) level = '大师';
    else if (accuracy >= 80) level = '专家';
    else if (accuracy >= 70) level = '熟练';
    else if (accuracy >= 60) level = '进阶';

    return {
      totalQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy * 10) / 10,
      totalTimeSpent,
      averageTimePerQuestion: Math.round(averageTimePerQuestion),
      strongTopics,
      weakTopics,
      recommendedArticles,
      streak,
      level
    };
  }

  // 获取统计信息
  getStatistics() {
    const report = this.generateReport();
    return {
      totalAttempts: this.userResults.length,
      correctCount: this.userResults.filter(r => r.isCorrect).length,
      accuracy: report.accuracy,
      mistakesCount: this.mistakeBank.size,
      streak: report.streak,
      level: report.level,
      sessionsCompleted: this.sessions.filter(s => s.completedAt).length,
      averageSessionScore: this.sessions.length > 0
        ? this.sessions.reduce((sum, s) => sum + s.score, 0) / this.sessions.length
        : 0
    };
  }

  // 搜索题目
  searchQuestions(query: string): QuizQuestion[] {
    const lowerQuery = query.toLowerCase();
    return this.questions.filter(q =>
      q.question.toLowerCase().includes(lowerQuery) ||
      q.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      q.explanation.toLowerCase().includes(lowerQuery)
    );
  }

  // 按难度获取题目
  getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] {
    return this.questions.filter(q => q.difficulty === difficulty);
  }

  // 按主题获取题目
  getQuestionsByTopic(topic: string): QuizQuestion[] {
    return this.questions.filter(q => q.tags.includes(topic));
  }

  // 重置进度
  resetProgress(): { success: boolean; message: string } {
    this.userResults = [];
    this.mistakeBank.clear();
    this.sessions = [];
    return { success: true, message: '学习进度已重置' };
  }
}

// 创建数据库实例
const quizDB = new QuizDatabase();

// 导出API
export const QuizAPI = {
  // 题目管理
  questions: {
    getAll: () => quizDB.getAllQuestions(),
    get: (id: string) => quizDB.getQuestion(id),
    search: (query: string) => quizDB.searchQuestions(query),
    getByDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => quizDB.getQuestionsByDifficulty(difficulty),
    getByTopic: (topic: string) => quizDB.getQuestionsByTopic(topic)
  },

  // 每日挑战
  challenge: {
    generate: (request?: GenerateQuizRequest) => quizDB.generateDailyChallenge(request)
  },

  // 答题
  answer: {
    submit: (questionId: string, userAnswer: number | number[], timeSpent?: number) => 
      quizDB.submitAnswer(questionId, userAnswer, timeSpent)
  },

  // 会话管理
  session: {
    create: (questions: QuizQuestion[]) => quizDB.createSession(questions),
    complete: (sessionId: string, results: QuizResult[]) => quizDB.completeSession(sessionId, results)
  },

  // 错题本
  mistakes: {
    getAll: () => quizDB.getMistakes(),
    clear: (questionId: string) => quizDB.clearMistake(questionId)
  },

  // 报告和统计
  report: {
    generate: () => quizDB.generateReport(),
    getStatistics: () => quizDB.getStatistics()
  },

  // 进度管理
  progress: {
    reset: () => quizDB.resetProgress()
  }
};
