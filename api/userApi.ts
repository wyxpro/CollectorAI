/**
 * User API - 用户相关的后端API端点定义
 * 包括个人资料、设置、安全等功能
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
  LoginDevice
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * 获取用户个人资料
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 更新用户个人资料
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateProfileRequest
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update user profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 上传用户头像
 */
export async function uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Failed to upload avatar: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 获取用户设置
 */
export async function getUserSettings(userId: string): Promise<UserSettings> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user settings: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 更新用户设置
 */
export async function updateUserSettings(
  userId: string,
  data: UpdateSettingsRequest
): Promise<UserSettings> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/settings`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update user settings: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 获取安全信息
 */
export async function getSecurityInfo(userId: string): Promise<SecurityInfo> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/security`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch security info: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 修改密码
 */
export async function changePassword(
  userId: string,
  data: ChangePasswordRequest
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to change password: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 更新手机号
 */
export async function updatePhone(
  userId: string,
  data: UpdatePhoneRequest
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/phone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update phone: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 更新邮箱
 */
export async function updateEmail(
  userId: string,
  data: UpdateEmailRequest
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update email: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 发送验证码
 */
export async function sendVerificationCode(
  type: 'phone' | 'email',
  target: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/users/verification-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ type, target })
  });

  if (!response.ok) {
    throw new Error(`Failed to send verification code: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 登出设备
 */
export async function logoutDevice(
  userId: string,
  deviceId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/devices/${deviceId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to logout device: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 获取认证令牌（从localStorage或其他存储中获取）
 */
function getAuthToken(): string {
  // 实际项目中应该从安全的存储中获取token
  return localStorage.getItem('authToken') || '';
}
