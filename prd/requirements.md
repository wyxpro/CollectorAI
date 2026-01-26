# Requirements Document

## Introduction

Collector + 是一款游戏化阅读工具，通过 AI 生成的趣味 Quiz 卡片驱动用户解锁长文核心片段，结合 Keep/Throw Away 二元选择机制沉淀知识卡片，并提供反常规解读、AI 播客与高颜值二维码分享功能，破解"知识数字坟墓"痛点，实现快乐阅读、高效沉淀与趣味传播的闭环体验。

## Glossary

- **Quiz_Generator**: AI 系统组件，负责根据文章内容生成交互式问答卡片
- **Content_Unlocker**: 系统组件，负责在用户回答 Quiz 后解锁对应的文章片段
- **Card_Manager**: 系统组件，负责管理用户保存的知识卡片
- **Share_Engine**: 系统组件，负责生成带二维码的分享卡片
- **Podcast_Generator**: AI 系统组件，负责将文章转换为播客内容
- **Article**: 用户收藏的长文内容
- **Quiz_Card**: 基于文章核心观点生成的交互式问答卡片
- **Knowledge_Card**: 用户选择 Keep 后沉淀的知识卡片，包含文章片段和个人思考
- **Content_Fragment**: 文章中被解锁的精读片段
- **Personal_Reflection**: 用户在知识卡片上添加的个人思考

## Requirements

### Requirement 1: Quiz 生成与交互

**User Story:** 作为用户，我想要在打开长文时看到趣味性的 Quiz 卡片而非正文，这样我可以通过游戏化方式开始阅读。

#### Acceptance Criteria

1. WHEN 用户打开一篇收藏的文章，THE Quiz_Generator SHALL 分析文章核心观点并生成 3-5 个交互式 Quiz 卡片
2. WHEN 生成 Quiz 卡片时，THE Quiz_Generator SHALL 确保问题具有挑衅性或趣味性以吸引用户参与
3. WHEN 用户首次打开文章时，THE System SHALL 隐藏原文正文并仅显示 Quiz 卡片
4. WHEN Quiz 卡片显示时，THE System SHALL 提供清晰的选项供用户选择
5. WHEN 用户选择答案后，THE Content_Unlocker SHALL 立即解锁对应的文章精读片段作为奖励

### Requirement 2: 内容解锁机制

**User Story:** 作为用户，我想要通过回答 Quiz 逐步解锁文章内容，这样我可以保持阅读的新鲜感和参与度。

#### Acceptance Criteria

1. WHEN 用户回答 Quiz 问题时，THE Content_Unlocker SHALL 解锁与该问题相关的文章核心片段
2. WHEN 内容被解锁时，THE System SHALL 显示该片段并标记其在原文中的位置
3. WHEN 用户完成所有 Quiz 时，THE System SHALL 提供访问完整文章的选项
4. WHEN 解锁内容片段时，THE System SHALL 确保片段包含足够的上下文以便理解
5. THE System SHALL 记录用户的解锁进度以支持断点续读

### Requirement 3: Keep/Throw Away 决策

**User Story:** 作为用户，我想要对阅读的内容做出 Keep 或 Throw Away 的选择，这样我可以筛选和沉淀真正有价值的知识。

#### Acceptance Criteria

1. WHEN 用户完成一个 Quiz 或阅读一个内容片段后，THE System SHALL 提供 Keep 和 Throw Away 两个选项
2. WHEN 用户选择 Keep 时，THE Card_Manager SHALL 创建一个知识卡片并保存该内容片段
3. WHEN 用户选择 Throw Away 时，THE System SHALL 标记该内容为已丢弃且不再显示
4. WHEN 用户选择 Keep 时，THE System SHALL 提供输入框让用户添加个人思考
5. THE System SHALL 允许用户在不添加思考的情况下直接 Keep 内容

### Requirement 4: 知识卡片沉淀

**User Story:** 作为用户，我想要将 Keep 的内容沉淀为知识卡片并添加个人思考，这样我可以构建个人知识库。

#### Acceptance Criteria

1. WHEN 用户选择 Keep 内容时，THE Card_Manager SHALL 创建包含原文片段和元数据的知识卡片
2. WHEN 创建知识卡片时，THE System SHALL 支持用户添加个人思考和标注
3. WHEN 用户添加思考时，THE Card_Manager SHALL 将思考内容与原文片段关联存储
4. THE Card_Manager SHALL 支持用户随时编辑已保存卡片的个人思考
5. THE System SHALL 提供类似 Flomo 的卡片浏览和管理界面
6. THE Card_Manager SHALL 按时间顺序组织知识卡片

### Requirement 5: 反常规解读

**User Story:** 作为用户，我想要看到文章的反常规或抽象解读，这样我可以从不同角度理解内容。

#### Acceptance Criteria

1. WHEN 用户完成文章阅读时，THE Quiz_Generator SHALL 生成一个反常规或抽象角度的文章解读
2. WHEN 生成解读时，THE System SHALL 确保解读角度新颖且具有启发性
3. THE System SHALL 在文章详情页面显示反常规解读
4. WHEN 用户查看解读时，THE System SHALL 提供将解读添加到知识卡片的选项
5. THE Quiz_Generator SHALL 使用创意性思维模式生成难以想象的解读角度

### Requirement 6: AI 播客生成

**User Story:** 作为用户，我想要将文章转换为 AI 播客，这样我可以在不方便阅读时通过听的方式获取内容。

#### Acceptance Criteria

1. WHEN 用户请求播客功能时，THE Podcast_Generator SHALL 将文章内容转换为音频播客格式
2. THE Podcast_Generator SHALL 生成自然流畅的对话式播客内容
3. WHEN 播客生成完成时，THE System SHALL 提供播放控制界面（播放、暂停、进度条）
4. THE System SHALL 支持后台播放播客内容
5. WHEN 生成播客时，THE Podcast_Generator SHALL 保留文章的核心观点和关键信息

### Requirement 7: 高颜值卡片分享

**User Story:** 作为用户，我想要生成带二维码的高颜值分享卡片，这样我可以轻松将有价值的内容分享给朋友。

#### Acceptance Criteria

1. WHEN 用户选择分享知识卡片时，THE Share_Engine SHALL 生成视觉吸引力强的卡片图片
2. WHEN 生成分享卡片时，THE Share_Engine SHALL 在卡片上嵌入文章访问二维码
3. THE Share_Engine SHALL 提供多种卡片设计模板供用户选择
4. WHEN 生成卡片时，THE System SHALL 确保文字排版清晰且视觉层次分明
5. THE Share_Engine SHALL 支持用户自定义卡片背景色、字体样式等视觉元素
6. WHEN 他人扫描二维码时，THE System SHALL 引导其访问原文或 Collector +应用

### Requirement 8: 每日阅读习惯培养

**User Story:** 作为用户，我想要通过每日 Quiz 和游戏化机制培养阅读习惯，这样我可以持续进行知识积累。

#### Acceptance Criteria

1. THE System SHALL 每日推荐适合用户的文章和 Quiz
2. WHEN 用户完成每日阅读任务时，THE System SHALL 提供正向反馈和成就激励
3. THE System SHALL 记录用户的阅读连续天数和完成的 Quiz 数量
4. WHEN 用户连续多日完成阅读时，THE System SHALL 提供特殊奖励或徽章
5. THE System SHALL 提供阅读统计数据（已读文章数、保存卡片数、连续天数等）

### Requirement 9: 用户收藏管理

**User Story:** 作为用户，我想要管理我的稍后阅读列表，这样我可以组织和访问收藏的文章。

#### Acceptance Criteria

1. THE System SHALL 支持用户添加文章到稍后阅读列表
2. THE System SHALL 支持从浏览器扩展、分享链接等多种方式收藏文章
3. WHEN 用户查看收藏列表时，THE System SHALL 显示文章标题、来源和收藏时间
4. THE System SHALL 支持用户删除或归档已读文章
5. THE System SHALL 标记哪些文章已生成 Quiz、哪些已完成阅读

### Requirement 10: 内容解析与处理

**User Story:** 作为系统，我需要准确解析各种来源的文章内容，这样才能生成高质量的 Quiz 和播客。

#### Acceptance Criteria

1. WHEN 用户添加文章链接时，THE System SHALL 提取文章正文并过滤广告和无关内容
2. THE System SHALL 支持解析主流内容平台（微信公众号、知乎、Medium 等）的文章
3. WHEN 解析失败时，THE System SHALL 提示用户并提供手动输入选项
4. THE System SHALL 保留文章的基本格式（标题、段落、列表等）
5. THE System SHALL 提取文章元数据（作者、发布时间、来源等）
