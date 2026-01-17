
export enum View {
  DASHBOARD = 'dashboard',
  LIBRARY = 'library',
  READER = 'reader',
  KNOWLEDGE = 'knowledge',
  LEARNING_DATA = 'learning_data',
  SETTINGS = 'settings',
  SUBSCRIPTION = 'subscription',
  PODCAST = 'podcast',
  AI_QUIZ = 'ai_quiz'
}

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple' | 'text';
  question: string;
  options?: string[]; // For single/multiple
  correctAnswer?: number | number[]; // Index for single/multiple
  explanation: string;
  relatedArticleId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResult {
  questionId: string;
  userAnswer: number | number[] | string;
  isCorrect: boolean;
  timestamp: string;
}

export interface QuizReport {
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  weakPoints: string[]; // Related article titles
  results: QuizResult[];
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
  articleImage?: string;
}

export interface UserStats {
  articlesRead: number;
  quizzesCompleted: number;
  cardsCreated: number;
  streak: number;
}

// User Profile Types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  bio?: string;
  motto?: string;
  level: number;
  xp: number;
  joinedAt: string;
  stats: UserProfileStats;
}

export interface UserProfileStats {
  totalReadingTime: number; // in minutes
  storageUsed: number; // in MB
  storageLimit: number; // in MB
  monthlyActivity: number; // percentage
}

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  motto?: string;
  avatar?: string;
}

// User Settings Types
export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'zh-CN' | 'en-US' | 'ja-JP';

export interface UserSettings {
  userId: string;
  theme: ThemeMode;
  language: Language;
  notifications: NotificationSettings;
  reading: ReadingSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  dailyChallenge: boolean;
  knowledgeReview: boolean;
  communityInteraction: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface ReadingSettings {
  fontSize: number; // 12-24
  lineHeight: number; // 1.5-2.5
  fontFamily: 'system' | 'serif' | 'sans-serif';
  autoSave: boolean;
  readingMode: 'normal' | 'focus';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showReadingStats: boolean;
  showActivity: boolean;
}

export interface UpdateSettingsRequest {
  theme?: ThemeMode;
  language?: Language;
  notifications?: Partial<NotificationSettings>;
  reading?: Partial<ReadingSettings>;
  privacy?: Partial<PrivacySettings>;
}

// Security Types
export interface LoginDevice {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  deviceName: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrentDevice: boolean;
  status: 'online' | 'offline';
}

export interface SecurityInfo {
  lastPasswordChange: string;
  phoneNumber?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  loginDevices: LoginDevice[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePhoneRequest {
  phoneNumber: string;
  verificationCode: string;
}

export interface UpdateEmailRequest {
  email: string;
  verificationCode: string;
}
