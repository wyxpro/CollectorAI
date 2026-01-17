/**
 * Library API Test - 收录夹API测试示例
 * 演示如何使用收录夹相关的所有API功能
 */

import { libraryClient } from './libraryClient';

/**
 * 测试获取所有文章
 */
export async function testGetAllArticles() {
  console.log('=== 测试获取所有文章 ===');
  
  try {
    const articles = await libraryClient.articles.getAll();
    
    console.log('✅ 成功获取文章列表：');
    console.log(`- 文章总数: ${articles.length}`);
    console.log(`- 第一篇: ${articles[0]?.title}`);
    
    return articles;
  } catch (error) {
    console.error('❌ 获取文章失败:', error);
    throw error;
  }
}

/**
 * 测试添加文章
 */
export async function testAddArticle() {
  console.log('\n=== 测试添加文章 ===');
  
  try {
    const newArticle = await libraryClient.articles.add({
      title: '测试文章：如何高效学习',
      author: '张三',
      source: 'Medium',
      url: 'https://example.com/test-article',
      wordCount: 2500,
      estimatedTime: 8
    });
    
    console.log('✅ 成功添加文章：');
    console.log(`- ID: ${newArticle.id}`);
    console.log(`- 标题: ${newArticle.title}`);
    console.log(`- 分类: ${newArticle.category}`);
    console.log(`- 标签: ${newArticle.tags.join(', ')}`);
    
    return newArticle;
  } catch (error) {
    console.error('❌ 添加文章失败:', error);
    throw error;
  }
}

/**
 * 测试搜索文章
 */
export async function testSearchArticles() {
  console.log('\n=== 测试搜索文章 ===');
  
  try {
    const query = 'AI';
    const results = await libraryClient.articles.search(query);
    
    console.log(`✅ 搜索 "${query}" 的结果：`);
    console.log(`- 找到 ${results.length} 篇文章`);
    results.slice(0, 3).forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
    });
    
    return results;
  } catch (error) {
    console.error('❌ 搜索失败:', error);
    throw error;
  }
}

/**
 * 测试收藏功能
 */
export async function testToggleFavorite() {
  console.log('\n=== 测试收藏功能 ===');
  
  try {
    const articles = await libraryClient.articles.getAll();
    const testArticle = articles[0];
    
    console.log(`- 测试文章: ${testArticle.title}`);
    console.log(`- 当前收藏状态: ${testArticle.isFavorite ? '已收藏' : '未收藏'}`);
    
    const result = await libraryClient.articles.toggleFavorite(testArticle.id);
    
    console.log('✅ 收藏状态已切换：');
    console.log(`- 新状态: ${result.isFavorite ? '已收藏' : '未收藏'}`);
    console.log(`- 消息: ${result.message}`);
    
    return result;
  } catch (error) {
    console.error('❌ 收藏操作失败:', error);
    throw error;
  }
}

/**
 * 测试更新阅读进度
 */
export async function testUpdateProgress() {
  console.log('\n=== 测试更新阅读进度 ===');
  
  try {
    const articles = await libraryClient.articles.getAll();
    const testArticle = articles[0];
    const newProgress = 75;
    
    console.log(`- 测试文章: ${testArticle.title}`);
    console.log(`- 当前进度: ${testArticle.progress}%`);
    
    const result = await libraryClient.articles.updateProgress(testArticle.id, newProgress);
    
    console.log('✅ 进度已更新：');
    console.log(`- 新进度: ${result.progress}%`);
    console.log(`- 状态: ${result.status}`);
    
    return result;
  } catch (error) {
    console.error('❌ 更新进度失败:', error);
    throw error;
  }
}

/**
 * 测试更新笔记
 */
export async function testUpdateNotes() {
  console.log('\n=== 测试更新笔记 ===');
  
  try {
    const articles = await libraryClient.articles.getAll();
    const testArticle = articles[0];
    const notes = '这篇文章讲解了AI的核心概念，特别是关于机器学习的部分很有启发。';
    
    console.log(`- 测试文章: ${testArticle.title}`);
    
    const result = await libraryClient.articles.updateNotes(testArticle.id, notes);
    
    console.log('✅ 笔记已保存：');
    console.log(`- 消息: ${result.message}`);
    
    return result;
  } catch (error) {
    console.error('❌ 保存笔记失败:', error);
    throw error;
  }
}

/**
 * 测试获取收藏列表
 */
export async function testGetFavorites() {
  console.log('\n=== 测试获取收藏列表 ===');
  
  try {
    const favorites = await libraryClient.articles.getFavorites();
    
    console.log('✅ 成功获取收藏列表：');
    console.log(`- 收藏总数: ${favorites.length}`);
    favorites.slice(0, 3).forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title}`);
    });
    
    return favorites;
  } catch (error) {
    console.error('❌ 获取收藏列表失败:', error);
    throw error;
  }
}

/**
 * 测试获取最近阅读
 */
export async function testGetRecentlyRead() {
  console.log('\n=== 测试获取最近阅读 ===');
  
  try {
    const recent = await libraryClient.articles.getRecentlyRead(5);
    
    console.log('✅ 成功获取最近阅读：');
    console.log(`- 文章数: ${recent.length}`);
    recent.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.progress}%)`);
    });
    
    return recent;
  } catch (error) {
    console.error('❌ 获取最近阅读失败:', error);
    throw error;
  }
}

/**
 * 测试获取推荐文章
 */
export async function testGetRecommendations() {
  console.log('\n=== 测试获取推荐文章 ===');
  
  try {
    const articles = await libraryClient.articles.getAll();
    const testArticle = articles[0];
    
    console.log(`- 基于文章: ${testArticle.title}`);
    console.log(`- 文章标签: ${testArticle.tags.join(', ')}`);
    
    const recommendations = await libraryClient.articles.getRecommendations(testArticle.id, 5);
    
    console.log('✅ 成功获取推荐：');
    console.log(`- 推荐数: ${recommendations.length}`);
    recommendations.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (相似度: ${article.similarity})`);
    });
    
    return recommendations;
  } catch (error) {
    console.error('❌ 获取推荐失败:', error);
    throw error;
  }
}

/**
 * 测试批量收藏
 */
export async function testBatchFavorite() {
  console.log('\n=== 测试批量收藏 ===');
  
  try {
    const articles = await libraryClient.articles.getAll();
    const ids = articles.slice(0, 3).map(a => a.id);
    
    console.log(`- 批量收藏 ${ids.length} 篇文章`);
    
    const result = await libraryClient.articles.batchFavorite(ids, true);
    
    console.log('✅ 批量收藏成功：');
    console.log(`- 消息: ${result.message}`);
    
    return result;
  } catch (error) {
    console.error('❌ 批量收藏失败:', error);
    throw error;
  }
}

/**
 * 测试批量删除
 */
export async function testBatchDelete() {
  console.log('\n=== 测试批量删除 ===');
  
  try {
    // 先添加几篇测试文章
    const testArticles = [];
    for (let i = 0; i < 3; i++) {
      const article = await libraryClient.articles.add({
        title: `测试文章 ${i + 1}`,
        author: '测试作者',
        source: 'Medium'
      });
      testArticles.push(article);
    }
    
    const ids = testArticles.map(a => a.id);
    console.log(`- 批量删除 ${ids.length} 篇文章`);
    
    const result = await libraryClient.articles.batchDelete(ids);
    
    console.log('✅ 批量删除成功：');
    console.log(`- 消息: ${result.message}`);
    
    return result;
  } catch (error) {
    console.error('❌ 批量删除失败:', error);
    throw error;
  }
}

/**
 * 测试导出数据（JSON格式）
 */
export async function testExportJSON() {
  console.log('\n=== 测试导出JSON ===');
  
  try {
    const result = await libraryClient.articles.exportData('json');
    
    console.log('✅ 成功导出JSON：');
    console.log(`- 文件名: ${result.filename}`);
    console.log(`- 数据大小: ${(result.data.length / 1024).toFixed(2)} KB`);
    
    return result;
  } catch (error) {
    console.error('❌ 导出JSON失败:', error);
    throw error;
  }
}

/**
 * 测试导出数据（CSV格式）
 */
export async function testExportCSV() {
  console.log('\n=== 测试导出CSV ===');
  
  try {
    const result = await libraryClient.articles.exportData('csv');
    
    console.log('✅ 成功导出CSV：');
    console.log(`- 文件名: ${result.filename}`);
    console.log(`- 数据大小: ${(result.data.length / 1024).toFixed(2)} KB`);
    
    return result;
  } catch (error) {
    console.error('❌ 导出CSV失败:', error);
    throw error;
  }
}

/**
 * 测试统计信息
 */
export async function testGetStatistics() {
  console.log('\n=== 测试获取统计信息 ===');
  
  try {
    const stats = await libraryClient.statistics();
    
    console.log('✅ 成功获取统计信息：');
    console.log(`- 文章总数: ${stats.totalArticles}`);
    console.log(`- 已完成: ${stats.completedArticles}`);
    console.log(`- 总阅读时间: ${stats.totalReadingTime} 分钟`);
    console.log(`- 平均进度: ${stats.averageProgress.toFixed(2)}%`);
    console.log(`- 收藏数: ${stats.favoritesCount}`);
    console.log('- 分类统计:', stats.categoryCounts);
    console.log('- 状态统计:', stats.statusCounts);
    
    return stats;
  } catch (error) {
    console.error('❌ 获取统计信息失败:', error);
    throw error;
  }
}

/**
 * 测试AI助理对话
 */
export async function testAssistantConversation() {
  console.log('\n=== 测试AI助理对话 ===');
  
  try {
    // 添加用户消息
    const userMessage = await libraryClient.assistant.addMessage({
      role: 'user',
      content: '帮我总结一下收藏的文章'
    });
    
    console.log('✅ 用户消息已发送：');
    console.log(`- 内容: ${userMessage.content}`);
    
    // 添加助理回复
    const assistantMessage = await libraryClient.assistant.addMessage({
      role: 'assistant',
      content: '根据您收藏的文章，主要涉及AI、心理学和效率提升等主题...'
    });
    
    console.log('✅ 助理回复已添加：');
    console.log(`- 内容: ${assistantMessage.content}`);
    
    // 获取对话历史
    const conversation = await libraryClient.assistant.getConversation();
    
    console.log(`✅ 对话历史: ${conversation.length} 条消息`);
    
    return conversation;
  } catch (error) {
    console.error('❌ 对话测试失败:', error);
    throw error;
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('🚀 开始运行收录夹API测试...\n');
  
  try {
    // 1. 基础功能测试
    await testGetAllArticles();
    await testAddArticle();
    await testSearchArticles();
    
    // 2. 文章操作测试
    await testToggleFavorite();
    await testUpdateProgress();
    await testUpdateNotes();
    
    // 3. 列表功能测试
    await testGetFavorites();
    await testGetRecentlyRead();
    await testGetRecommendations();
    
    // 4. 批量操作测试
    await testBatchFavorite();
    await testBatchDelete();
    
    // 5. 导出功能测试
    await testExportJSON();
    await testExportCSV();
    
    // 6. 统计信息测试
    await testGetStatistics();
    
    // 7. AI助理测试
    await testAssistantConversation();
    
    console.log('\n✅ 所有测试完成！');
  } catch (error) {
    console.error('\n❌ 测试过程中出现错误:', error);
  }
}

// 导出测试函数供外部调用
export default {
  testGetAllArticles,
  testAddArticle,
  testSearchArticles,
  testToggleFavorite,
  testUpdateProgress,
  testUpdateNotes,
  testGetFavorites,
  testGetRecentlyRead,
  testGetRecommendations,
  testBatchFavorite,
  testBatchDelete,
  testExportJSON,
  testExportCSV,
  testGetStatistics,
  testAssistantConversation,
  runAllTests
};
