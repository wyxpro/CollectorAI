/**
 * User Client - 用户API客户端封装
 * 提供更高级的API调用接口和错误处理
 */

import {
  UserProfile,
  UpdateProfileRequest,
  UserSettings,
  UpdateSettingsRequest,
  SecurityInfo,
  ChangePasswordRequest,
  UpdatePhoneRequest,
  UpdateEmailRequest,
  ThemeMode
} from '../types';
import * as userApi from './userApi';

export class UserClient {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * 获取用户资料
   */
  async getProfile(): Promise<UserProfile> {
    try {
      return await userApi.getUserProfile(this.userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      return await userApi.updateUserProfile(this.userId, data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<string> {
    try {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        throw new Error('只支持图片格式');
      }

      // 验证文件大小（最大5MB）
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('图片大小不能超过5MB');
      }

      const result = await userApi.uploadAvatar(this.userId, file);
      return result.avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * 获取用户设置
   */
  async getSettings(): Promise<UserSettings> {
    try {
      return await userApi.getUserSettings(this.userId);
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  /**
   * 更新用户设置
   */
  async updateSettings(data: UpdateSettingsRequest): Promise<UserSettings> {
    try {
      return await userApi.updateUserSettings(this.userId, data);
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  /**
   * 更新主题设置
   */
  async updateTheme(theme: ThemeMode): Promise<UserSettings> {
    try {
      const settings = await this.updateSettings({ theme });
      
      // 应用主题到DOM
      this.applyTheme(theme);
      
      return settings;
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  }

  /**
   * 应用主题到DOM
   */
  private applyTheme(theme: ThemeMode): void {
    const root = document.documentElement;
    
    if (theme === 'system') {
      // 检测系统主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 保存到localStorage
    localStorage.setItem('theme', theme);
  }

  /**
   * 更新通知设置
   */
  async updateNotifications(notifications: Partial<UserSettings['notifications']>): Promise<UserSettings> {
    try {
      return await this.updateSettings({ notifications });
    } catch (error) {
      console.error('Error updating notifications:', error);
      throw error;
    }
  }

  /**
   * 获取安全信息
   */
  async getSecurityInfo(): Promise<SecurityInfo> {
    try {
      return await userApi.getSecurityInfo(this.userId);
    } catch (error) {
      console.error('Error fetching security info:', error);
      throw error;
    }
  }

  /**
   * 修改密码
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // 验证新密码强度
      if (newPassword.length < 8) {
        throw new Error('密码长度至少为8位');
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        throw new Error('密码必须包含大小写字母和数字');
      }

      const result = await userApi.changePassword(this.userId, {
        currentPassword,
        newPassword
      });

      return result.success;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * 更新手机号
   */
  async updatePhone(phoneNumber: string, verificationCode: string): Promise<boolean> {
    try {
      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
        throw new Error('手机号格式不正确');
      }

      const result = await userApi.updatePhone(this.userId, {
        phoneNumber,
        verificationCode
      });

      return result.success;
    } catch (error) {
      console.error('Error updating phone:', error);
      throw error;
    }
  }

  /**
   * 更新邮箱
   */
  async updateEmail(email: string, verificationCode: string): Promise<boolean> {
    try {
      // 验证邮箱格式
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('邮箱格式不正确');
      }

      const result = await userApi.updateEmail(this.userId, {
        email,
        verificationCode
      });

      return result.success;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  }

  /**
   * 发送验证码
   */
  async sendVerificationCode(type: 'phone' | 'email', target: string): Promise<boolean> {
    try {
      const result = await userApi.sendVerificationCode(type, target);
      return result.success;
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  }

  /**
   * 登出设备
   */
  async logoutDevice(deviceId: string): Promise<boolean> {
    try {
      const result = await userApi.logoutDevice(this.userId, deviceId);
      return result.success;
    } catch (error) {
      console.error('Error logging out device:', error);
      throw error;
    }
  }
}

/**
 * 创建用户客户端实例
 */
export function createUserClient(userId: string): UserClient {
  return new UserClient(userId);
}
