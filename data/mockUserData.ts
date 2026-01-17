/**
 * Mock User Data - 用户相关的模拟数据
 * 用于开发和测试
 */

import {
  UserProfile,
  UserSettings,
  SecurityInfo,
  LoginDevice
} from '../types';

/**
 * 模拟用户资料
 */
export const mockUserProfile: UserProfile = {
  id: 'user_mock_123',
  username: 'felix_reader_01',
  email: 'felix@example.com',
  phone: '138****8888',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  bio: '热爱阅读的探索者，相信知识改变命运',
  motto: '读书破万卷，下笔如有神',
  level: 4,
  xp: 2580,
  joinedAt: '2023-11-15T08:00:00Z',
  stats: {
    totalReadingTime: 7680, // 128小时
    storageUsed: 1228.8, // 1.2GB
    storageLimit: 5120, // 5GB
    monthlyActivity: 85
  }
};

/**
 * 模拟用户设置
 */
export const mockUserSettings: UserSettings = {
  userId: 'user_mock_123',
  theme: 'light',
  language: 'zh-CN',
  notifications: {
    dailyChallenge: true,
    knowledgeReview: false,
    communityInteraction: true,
    emailNotifications: true,
    pushNotifications: false
  },
  reading: {
    fontSize: 16,
    lineHeight: 1.8,
    fontFamily: 'serif',
    autoSave: true,
    readingMode: 'normal'
  },
  privacy: {
    profileVisibility: 'public',
    showReadingStats: true,
    showActivity: true
  }
};

/**
 * 模拟登录设备
 */
export const mockLoginDevices: LoginDevice[] = [
  {
    id: 'device_1',
    deviceType: 'desktop',
    deviceName: 'MacOS · Chrome 浏览器',
    browser: 'Chrome 120.0.6099.129',
    location: '北京',
    lastActive: new Date().toISOString(),
    isCurrentDevice: true,
    status: 'online'
  },
  {
    id: 'device_2',
    deviceType: 'mobile',
    deviceName: 'iPhone 15 Pro',
    browser: 'Safari 17.0',
    location: '上海',
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrentDevice: false,
    status: 'offline'
  },
  {
    id: 'device_3',
    deviceType: 'tablet',
    deviceName: 'iPad Pro',
    browser: 'Safari 17.0',
    location: '深圳',
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrentDevice: false,
    status: 'offline'
  }
];

/**
 * 模拟安全信息
 */
export const mockSecurityInfo: SecurityInfo = {
  lastPasswordChange: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  phoneNumber: '138****8888',
  emailVerified: true,
  twoFactorEnabled: false,
  loginDevices: mockLoginDevices
};

/**
 * 模拟API响应延迟
 */
export function mockDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 模拟API错误
 */
export class MockApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'MockApiError';
  }
}

/**
 * 模拟获取用户资料
 */
export async function mockGetUserProfile(userId: string): Promise<UserProfile> {
  await mockDelay();
  
  if (!userId) {
    throw new MockApiError('User ID is required', 400);
  }
  
  return { ...mockUserProfile, id: userId };
}

/**
 * 模拟更新用户资料
 */
export async function mockUpdateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  await mockDelay();
  
  return {
    ...mockUserProfile,
    ...updates,
    id: userId
  };
}

/**
 * 模拟上传头像
 */
export async function mockUploadAvatar(file: File): Promise<string> {
  await mockDelay(1000);
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    throw new MockApiError('只支持图片格式', 400);
  }
  
  // 验证文件大小
  if (file.size > 5 * 1024 * 1024) {
    throw new MockApiError('图片大小不能超过5MB', 400);
  }
  
  // 生成模拟URL
  return `https://cdn.example.com/avatars/${Date.now()}_${file.name}`;
}

/**
 * 模拟获取用户设置
 */
export async function mockGetUserSettings(userId: string): Promise<UserSettings> {
  await mockDelay();
  
  return { ...mockUserSettings, userId };
}

/**
 * 模拟更新用户设置
 */
export async function mockUpdateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<UserSettings> {
  await mockDelay();
  
  return {
    ...mockUserSettings,
    ...updates,
    userId
  };
}

/**
 * 模拟获取安全信息
 */
export async function mockGetSecurityInfo(userId: string): Promise<SecurityInfo> {
  await mockDelay();
  
  return mockSecurityInfo;
}

/**
 * 模拟修改密码
 */
export async function mockChangePassword(
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  await mockDelay();
  
  // 模拟密码验证
  if (currentPassword !== 'OldPassword123') {
    throw new MockApiError('当前密码不正确', 401);
  }
  
  if (newPassword.length < 8) {
    throw new MockApiError('密码长度至少为8位', 400);
  }
  
  return true;
}

/**
 * 模拟发送验证码
 */
export async function mockSendVerificationCode(
  type: 'phone' | 'email',
  target: string
): Promise<boolean> {
  await mockDelay();
  
  console.log(`📱 验证码已发送到 ${type}: ${target}`);
  console.log(`🔢 验证码: 123456 (模拟)`);
  
  return true;
}

/**
 * 模拟更新手机号
 */
export async function mockUpdatePhone(
  phoneNumber: string,
  verificationCode: string
): Promise<boolean> {
  await mockDelay();
  
  if (verificationCode !== '123456') {
    throw new MockApiError('验证码不正确', 400);
  }
  
  return true;
}

/**
 * 模拟更新邮箱
 */
export async function mockUpdateEmail(
  email: string,
  verificationCode: string
): Promise<boolean> {
  await mockDelay();
  
  if (verificationCode !== '123456') {
    throw new MockApiError('验证码不正确', 400);
  }
  
  return true;
}

/**
 * 模拟登出设备
 */
export async function mockLogoutDevice(deviceId: string): Promise<boolean> {
  await mockDelay();
  
  const device = mockLoginDevices.find(d => d.id === deviceId);
  
  if (!device) {
    throw new MockApiError('设备不存在', 404);
  }
  
  if (device.isCurrentDevice) {
    throw new MockApiError('不能登出当前设备', 400);
  }
  
  return true;
}

/**
 * 模拟数据生成器
 */
export const mockDataGenerator = {
  userProfile: mockGetUserProfile,
  updateProfile: mockUpdateUserProfile,
  uploadAvatar: mockUploadAvatar,
  userSettings: mockGetUserSettings,
  updateSettings: mockUpdateUserSettings,
  securityInfo: mockGetSecurityInfo,
  changePassword: mockChangePassword,
  sendVerificationCode: mockSendVerificationCode,
  updatePhone: mockUpdatePhone,
  updateEmail: mockUpdateEmail,
  logoutDevice: mockLogoutDevice
};

export default mockDataGenerator;
