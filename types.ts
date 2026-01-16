
export enum View {
  DASHBOARD = 'dashboard',
  LIBRARY = 'library',
  READER = 'reader',
  KNOWLEDGE = 'knowledge',
  LEARNING_DATA = 'learning_data',
  SETTINGS = 'settings',
  SUBSCRIPTION = 'subscription'
}

export interface Article {
  id: string;
  title: string;
  author: string;
  source: string;
  progress: number;
  coverImage: string;
  wordCount: number;
  estimatedTime: number;
  status: 'pending' | 'parsed' | 'quiz_generated' | 'completed';
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  style: 'provocative' | 'humorous' | 'philosophical' | 'counterintuitive';
}

export interface ContentFragment {
  id: string;
  content: string;
  isUnlocked: boolean;
}

export interface KnowledgeCard {
  id: string;
  originalContent: string;
  reflection: string;
  tags: string[];
  createdAt: string;
  articleTitle: string;
}

export interface UserStats {
  articlesRead: number;
  quizzesCompleted: number;
  cardsCreated: number;
  streak: number;
}
