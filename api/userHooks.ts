/**
 * User Hooks - React hooks for user-related operations
 * 提供便捷的React hooks来管理用户状态
 */

import { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UpdateProfileRequest,
  UserSettings,
  UpdateSettingsRequest,
  SecurityInfo,
  ThemeMode
} from '../types';
import { createUserClient } from './userClient';

/**
 * 使用用户资料
 */
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const client = createUserClient(userId);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await client.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      setError(null);
      const updated = await client.updateProfile(data);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setError(null);
      const avatarUrl = await client.uploadAvatar(file);
      
      // 更新本地状态
      if (profile) {
        setProfile({ ...profile, avatar: avatarUrl });
      }
      
      return avatarUrl;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile
  };
}

/**
 * 使用用户设置
 */
export function useUserSettings(userId: string) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const client = createUserClient(userId);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await client.getSettings();
      setSettings(data);
      
      // 应用主题
      applyTheme(data.theme);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateSettings = useCallback(async (data: UpdateSettingsRequest) => {
    try {
      setError(null);
      const updated = await client.updateSettings(data);
      setSettings(updated);
      
      // 如果更新了主题，应用它
      if (data.theme) {
        applyTheme(data.theme);
      }
      
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  const updateTheme = useCallback(async (theme: ThemeMode) => {
    try {
      setError(null);
      const updated = await client.updateTheme(theme);
      setSettings(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  const updateNotifications = useCallback(async (notifications: Partial<UserSettings['notifications']>) => {
    try {
      setError(null);
      const updated = await client.updateNotifications(notifications);
      setSettings(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateTheme,
    updateNotifications,
    refetch: fetchSettings
  };
}

/**
 * 使用安全信息
 */
export function useSecurityInfo(userId: string) {
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const client = createUserClient(userId);

  const fetchSecurityInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await client.getSecurityInfo();
      setSecurityInfo(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      const success = await client.changePassword(currentPassword, newPassword);
      
      if (success) {
        // 刷新安全信息
        await fetchSecurityInfo();
      }
      
      return success;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, fetchSecurityInfo]);

  const updatePhone = useCallback(async (phoneNumber: string, verificationCode: string) => {
    try {
      setError(null);
      const success = await client.updatePhone(phoneNumber, verificationCode);
      
      if (success) {
        await fetchSecurityInfo();
      }
      
      return success;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, fetchSecurityInfo]);

  const updateEmail = useCallback(async (email: string, verificationCode: string) => {
    try {
      setError(null);
      const success = await client.updateEmail(email, verificationCode);
      
      if (success) {
        await fetchSecurityInfo();
      }
      
      return success;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, fetchSecurityInfo]);

  const sendVerificationCode = useCallback(async (type: 'phone' | 'email', target: string) => {
    try {
      setError(null);
      return await client.sendVerificationCode(type, target);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  const logoutDevice = useCallback(async (deviceId: string) => {
    try {
      setError(null);
      const success = await client.logoutDevice(deviceId);
      
      if (success) {
        await fetchSecurityInfo();
      }
      
      return success;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, fetchSecurityInfo]);

  useEffect(() => {
    fetchSecurityInfo();
  }, [fetchSecurityInfo]);

  return {
    securityInfo,
    loading,
    error,
    changePassword,
    updatePhone,
    updateEmail,
    sendVerificationCode,
    logoutDevice,
    refetch: fetchSecurityInfo
  };
}

/**
 * 使用主题
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // 从localStorage读取保存的主题
    const saved = localStorage.getItem('theme') as ThemeMode;
    return saved || 'system';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme
  };
}

/**
 * 应用主题到DOM
 */
function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  
  let effectiveTheme = theme;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    effectiveTheme = prefersDark ? 'dark' : 'light';
  }

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  localStorage.setItem('theme', theme);
}
