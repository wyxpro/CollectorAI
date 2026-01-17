/**
 * User API Test - 用户API测试示例
 * 演示如何使用用户相关的API
 */

import { createUserClient } from './userClient';
import { ThemeMode } from '../types';

// 模拟用户ID
const TEST_USER_ID = 'user_test_123';

/**
 * 测试获取用户资料
 */
export async function testGetProfile() {
  console.log('=== 测试获取用户资料 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    const profile = await client.getProfile();
    
    console.log('✅ 成功获取用户资料：');
    console.log('- 用户名:', profile.username);
    console.log('- 等级:', profile.level);
    console.log('- XP:', profile.xp);
    console.log('- 阅读时长:', profile.stats.totalReadingTime, '分钟');
    console.log('- 存储使用:', profile.stats.storageUsed, 'MB /', profile.stats.storageLimit, 'MB');
    
    return profile;
  } catch (error) {
    console.error('❌ 获取用户资料失败:', error);
    throw error;
  }
}

/**
 * 测试更新用户资料
 */
export async function testUpdateProfile() {
  console.log('\n=== 测试更新用户资料 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    
    const updateData = {
      username: 'felix_updated',
      bio: '这是更新后的个人简介',
      motto: '读万卷书，行万里路'
    };
    
    const updated = await client.updateProfile(updateData);
    
    console.log('✅ 成功更新用户资料：');
    console.log('- 新用户名:', updated.username);
    console.log('- 新简介:', updated.bio);
    console.log('- 新格言:', updated.motto);
    
    return updated;
  } catch (error) {
    console.error('❌ 更新用户资料失败:', error);
    throw error;
  }
}

/**
 * 测试上传头像
 */
export async function testUploadAvatar(file: File) {
  console.log('\n=== 测试上传头像 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    
    console.log('- 文件名:', file.name);
    console.log('- 文件大小:', (file.size / 1024).toFixed(2), 'KB');
    console.log('- 文件类型:', file.type);
    
    const avatarUrl = await client.uploadAvatar(file);
    
    console.log('✅ 成功上传头像：');
    console.log('- 新头像URL:', avatarUrl);
    
    return avatarUrl;
  } catch (error) {
    console.error('❌ 上传头像失败:', error);
    throw error;
  }
}

/**
 * 测试获取用户设置
 */
export async function testGetSettings() {
  console.log('\n=== 测试获取用户设置 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    const settings = await client.getSettings();
    
    console.log('✅ 成功获取用户设置：');
    console.log('- 主题:', settings.theme);
    console.log('- 语言:', settings.language);
    console.log('- 通知设置:', settings.notifications);
    console.log('- 阅读设置:', settings.reading);
    console.log('- 隐私设置:', settings.privacy);
    
    return settings;
  } catch (error) {
    console.error('❌ 获取用户设置失败:', error);
    throw error;
  }
}

/**
 * 测试更新主题
 */
export async function testUpdateTheme(theme: ThemeMode) {
  console.log('\n=== 测试更新主题 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    
    console.log('- 切换到主题:', theme);
    
    const settings = await client.updateTheme(theme);
    
    console.log('✅ 成功更新主题：');
    console.log('- 当前主题:', settings.theme);
    console.log('- DOM类名:', document.documentElement.className);
    
    return settings;
  } catch (error) {
    console.error('❌ 更新主题失败:', error);
    throw error;
  }
}

/**
 * 测试更新通知设置
 */
export async function testUpdateNotifications() {
  console.log('\n=== 测试更新通知设置 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    
    const notifications = {
      dailyChallenge: false,
      knowledgeReview: true,
      communityInteraction: true
    };
    
    const settings = await client.updateNotifications(notifications);
    
    console.log('✅ 成功更新通知设置：');
    console.log('- 每日挑战提醒:', settings.notifications.dailyChallenge);
    console.log('- 知识复习提醒:', settings.notifications.knowledgeReview);
    console.log('- 社区互动通知:', settings.notifications.communityInteraction);
    
    return settings;
  } catch (error) {
    console.error('❌ 更新通知设置失败:', error);
    throw error;
  }
}

/**
 * 测试获取安全信息
 */
export async function testGetSecurityInfo() {
  console.log('\n=== 测试获取安全信息 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    const securityInfo = await client.getSecurityInfo();
    
    console.log('✅ 成功获取安全信息：');
    console.log('- 上次修改密码:', securityInfo.lastPasswordChange);
    console.log('- 手机号:', securityInfo.phoneNumber);
    console.log('- 邮箱已验证:', securityInfo.emailVerified);
    console.log('- 双因素认证:', securityInfo.twoFactorEnabled);
    console.log('- 登录设备数:', securityInfo.loginDevices.length);
    
    securityInfo.loginDevices.forEach((device, index) => {
      console.log(`  设备${index + 1}:`, device.deviceName, '-', device.status);
    });
    
    return securityInfo;
  } catch (error) {
    console.error('❌ 获取安全信息失败:', error);
    throw error;
  }
}

/**
 * 测试修改密码
 */
export async function testChangePassword() {
  console.log('\n=== 测试修改密码 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    
    const currentPassword = 'OldPassword123';
    const newPassword = 'NewPassword456';
    
    console.log('- 验证密码强度...');
    
    const success = await client.changePassword(currentPassword, newPassword);
    
    if (success) {
      console.log('✅ 成功修改密码');
    }
    
    return success;
  } catch (error) {
    console.error('❌ 修改密码失败:', error);
    throw error;
  }
}

/**
 * 测试发送验证码
 */
export async function testSendVerificationCode() {
  console.log('\n=== 测试发送验证码 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    
    const phoneNumber = '13800138000';
    
    console.log('- 发送验证码到:', phoneNumber);
    
    const success = await client.sendVerificationCode('phone', phoneNumber);
    
    if (success) {
      console.log('✅ 验证码已发送');
    }
    
    return success;
  } catch (error) {
    console.error('❌ 发送验证码失败:', error);
    throw error;
  }
}

/**
 * 测试更新手机号
 */
export async function testUpdatePhone() {
  console.log('\n=== 测试更新手机号 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    
    const phoneNumber = '13900139000';
    const verificationCode = '123456';
    
    console.log('- 新手机号:', phoneNumber);
    console.log('- 验证码:', verificationCode);
    
    const success = await client.updatePhone(phoneNumber, verificationCode);
    
    if (success) {
      console.log('✅ 成功更新手机号');
    }
    
    return success;
  } catch (error) {
    console.error('❌ 更新手机号失败:', error);
    throw error;
  }
}

/**
 * 测试登出设备
 */
export async function testLogoutDevice(deviceId: string) {
  console.log('\n=== 测试登出设备 ===');
  
  try {
    const client = createUserClient(TEST_USER_ID);
    
    console.log('- 登出设备ID:', deviceId);
    
    const success = await client.logoutDevice(deviceId);
    
    if (success) {
      console.log('✅ 成功登出设备');
    }
    
    return success;
  } catch (error) {
    console.error('❌ 登出设备失败:', error);
    throw error;
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('🚀 开始运行用户API测试...\n');
  
  try {
    // 1. 测试获取用户资料
    await testGetProfile();
    
    // 2. 测试更新用户资料
    await testUpdateProfile();
    
    // 3. 测试获取用户设置
    await testGetSettings();
    
    // 4. 测试更新主题
    await testUpdateTheme('dark');
    await testUpdateTheme('light');
    await testUpdateTheme('system');
    
    // 5. 测试更新通知设置
    await testUpdateNotifications();
    
    // 6. 测试获取安全信息
    const securityInfo = await testGetSecurityInfo();
    
    // 7. 测试发送验证码
    await testSendVerificationCode();
    
    // 8. 如果有设备，测试登出设备
    if (securityInfo && securityInfo.loginDevices.length > 1) {
      const deviceToLogout = securityInfo.loginDevices.find(d => !d.isCurrentDevice);
      if (deviceToLogout) {
        await testLogoutDevice(deviceToLogout.id);
      }
    }
    
    console.log('\n✅ 所有测试完成！');
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error);
  }
}

// 导出测试函数供外部调用
export default {
  testGetProfile,
  testUpdateProfile,
  testUploadAvatar,
  testGetSettings,
  testUpdateTheme,
  testUpdateNotifications,
  testGetSecurityInfo,
  testChangePassword,
  testSendVerificationCode,
  testUpdatePhone,
  testLogoutDevice,
  runAllTests
};
