# 🚀 CollectorAI 快速开始指南

## 欢迎使用 CollectorAI！

这是一个完整的智能阅读助手，集成了AI播客、知识卡片、问答系统等多种功能。

---

## 📦 安装和启动

### 1. 克隆项目
```bash
git clone <repository-url>
cd Read-AI---Gamified-Reading-
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问应用
打开浏览器访问: `http://localhost:3000`

---

## 🎯 核心功能使用

### 1. 🎙️ AI播客

#### 播放播客
1. 点击左侧导航栏的"AI播客"图标
2. 在播客列表中选择一个播客
3. 点击底部的播放按钮
4. 首次播放会自动生成音频（2-3秒）
5. 再次播放使用缓存（瞬间加载）

#### 调节设置
1. 点击右上角"语音调节"按钮
2. 选择语速（0.75x - 1.5x）
3. 选择AI声线（知性/活力/磁性）

#### 生成新播客
1. 点击"生成新播客"按钮
2. 输入内容
3. 选择风格（教育/对话/故事）
4. 选择时长（1分钟/3分钟/5分钟）
5. 点击"开始生成"

---

### 2. 🎴 知识卡片

#### 浏览卡片
1. 点击左侧导航栏的"知识卡片"图标
2. 选择视图模式：
   - 沉浸画廊：3D卡片翻转效果
   - 全量矩阵：网格布局

#### 分享卡片
1. 点击卡片上的分享按钮
2. 在弹窗中预览海报
3. 选择操作：
   - 保存海报：下载高清图片
   - 分享：分享到社交平台
   - 复制链接：复制分享链接

#### 切换主题
1. 点击右上角"皮肤库"按钮
2. 浏览5种主题样式
3. 点击选择主题
4. 查看AI智能推荐

---

### 3. 🧠 AI问答

#### 开始挑战
1. 点击左侧导航栏的"AI问答"图标
2. 查看每日挑战题目
3. 选择答案
4. 查看AI解析
5. 查看学习报告

#### 查看错题本
1. 点击"错题本"标签
2. 复习错题
3. 重新答题

---

### 4. 📚 文章收录

#### 添加文章
1. 点击左侧导航栏的"文章收录"图标
2. 点击"添加文章"按钮
3. 输入文章URL或内容
4. AI自动解析和生成标签
5. 保存到收录夹

#### 阅读文章
1. 在列表中选择文章
2. 点击进入阅读器
3. 阅读进度自动保存
4. 完成后自动生成问答题

---

## 💡 使用技巧

### 播客系统
- ✅ 首次播放会生成音频，请耐心等待2-3秒
- ✅ 再次播放使用缓存，几乎瞬间加载
- ✅ 可以调节语速和声线，找到最适合的设置
- ✅ 支持快进/快退10秒，方便定位
- ✅ 进度条可以点击或拖动快速跳转

### 知识卡片
- ✅ 点击卡片可以翻转查看AI反思
- ✅ 分享海报会自动生成二维码
- ✅ 可以选择不同主题样式
- ✅ AI会根据内容推荐合适的主题
- ✅ 支持收藏常用主题

### AI问答
- ✅ 每日挑战题目基于你的阅读内容
- ✅ 答错的题目会自动加入错题本
- ✅ 可以查看详细的学习报告
- ✅ 连胜挑战激励持续学习

---

## 🔧 常见问题

### Q1: 播客无法播放？
**A**: 
1. 检查浏览器是否支持Web Speech API
2. 首次播放需要等待音频生成（2-3秒）
3. 如果仍然无法播放，会自动切换到备用音频
4. 刷新页面重试

### Q2: 海报生成失败？
**A**:
1. 检查网络连接
2. 确保图片URL可访问
3. 等待生成完成（1-2秒）
4. 刷新页面重试

### Q3: 移动端显示不正常？
**A**:
1. 使用最新版本的浏览器
2. 清除浏览器缓存
3. 检查viewport设置
4. 确保JavaScript已启用

### Q4: 如何清除缓存？
**A**:
```javascript
// 在浏览器控制台执行
await audioService.clearCache();
```

---

## 📚 进阶功能

### 1. 使用API

#### 播客API
```typescript
import { usePodcasts, useAudioPlayer } from './api/podcastHooks';

const { podcasts, generatePodcast } = usePodcasts();
const audioPlayer = useAudioPlayer(podcast, playbackSpeed);

// 生成播客
await generatePodcast({
  content: '内容',
  style: 'educational',
  duration: 'medium'
});

// 播放控制
await audioPlayer.togglePlayPause();
audioPlayer.skipForward(10);
```

#### 知识卡片API
```typescript
import { useKnowledgeCards, useShare } from './api/knowledgeHooks';

const { cards, createCard } = useKnowledgeCards();
const { generateShareLink, downloadPoster } = useShare();

// 创建卡片
await createCard({
  originalContent: '知识点',
  reflection: 'AI反思',
  tags: ['标签'],
  articleTitle: '标题'
});

// 分享卡片
const result = await generateShareLink(cardId, themeId);
```

### 2. 自定义主题

查看 `api/knowledgeApi.ts` 中的 `CardTheme` 接口，可以添加自定义主题。

### 3. 扩展功能

参考文档：
- [播客完整实现](./PODCAST_COMPLETE_IMPLEMENTATION.md)
- [知识卡片实现](./KNOWLEDGE_CARD_IMPLEMENTATION.md)
- [完整后端总结](./COMPLETE_BACKEND_SUMMARY.md)

---

## 🎓 学习路径

### 初级用户
1. 浏览播客列表
2. 播放播客
3. 浏览知识卡片
4. 完成每日挑战

### 中级用户
1. 生成新播客
2. 创建知识卡片
3. 分享卡片到社交平台
4. 自定义主题

### 高级用户
1. 使用API开发
2. 扩展功能
3. 自定义主题
4. 贡献代码

---

## 🤝 获取帮助

### 文档
- [README](./README.md)
- [项目总结](./PROJECT_SUMMARY.md)
- [完整后端总结](./COMPLETE_BACKEND_SUMMARY.md)

### 问题反馈
- GitHub Issues
- 邮箱: support@readai.app

### 社区
- 讨论区
- 开发者论坛

---

## 🎉 开始使用

现在你已经了解了基本功能，开始探索 CollectorAI 吧！

1. 🎙️ 播放一个播客
2. 🎴 浏览知识卡片
3. 🧠 完成每日挑战
4. 📚 添加你的第一篇文章

祝你使用愉快！ 🚀

---

*快速开始指南版本: v1.0.0*
*更新时间: 2026-01-17*
