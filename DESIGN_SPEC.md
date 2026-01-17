# Collector + · 智阅计划 设计规范文档

## 1. 视觉识别系统 (Visual Identity)

### 1.1 色彩规范 (Color Palette)
- **品牌主色 (Primary)**: 
  - Indigo-600 (`#4f46e5`) - 代表科技与智慧
  - Violet-600 (`#7c3aed`) - 代表创意与深度
- **辅助色 (Accent)**:
  - Amber-400 (`#fbbf24`) - 用于关键点缀 (如星星、勋章)
  - Emerald-500 (`#10b981`) - 用于增长数据展示
- **背景色 (Background)**:
  - 纯白 (`#ffffff`) 作为底色
  - Slate-50 (`#f8fafc`) 用于区域分割
  - Slate-900 (`#0f172a`) 用于深色模式组件和页脚

### 1.2 字体系统 (Typography)
- **字体族**: Inter, sans-serif (主要用于正文和功能性文本)
- **层级结构**:
  - **H1 (Hero)**: 8xl (或 6xl 移动端), Black (900), 紧凑字间距
  - **H2 (Section)**: 5xl, Black (900), 1.1 行高
  - **Body**: 1.125rem (lg), Medium (500), Slate-500, 1.625 行高

## 2. 设计风格 (Design Style)

### 2.1 玻璃拟态 (Glassmorphism)
- **核心属性**: 
  - `backdrop-blur-xl` (24px 模糊)
  - `bg-white/40` (半透明白色背景)
  - `border-white/20` (极细浅色边框)
  - `shadow-lg` (柔和的长阴影，减少生硬感)

### 2.2 3D 水晶风格 (Crystal 3D)
- **表现形式**: 
  - 渐变层叠模拟体积感
  - 内发光与外发光结合
  - 动态旋转与浮动动画

## 3. 组件规范 (Component Standards)

### 3.1 按钮 (Buttons)
- **主要按钮**: 渐变色 (Indigo to Violet), 2xl 圆角, 深度阴影, 悬停放大 1.05x
- **次要按钮**: 玻璃材质, 悬停提亮, 点击反馈

### 3.2 卡片 (Cards)
- **圆角**: 32px (大圆角营造现代友好感)
- **交互**: 鼠标悬停时 y 轴微调 (-8px) 并增强阴影

## 4. 动画逻辑 (Animation Logic)

- **全局**: 使用 `framer-motion` 控制，确保 60fps 帧率。
- **触发**: 
  - 视口进入触发 (Scroll Reveal)
  - 鼠标悬停微交互 (Micro-interactions)
  - 视差滚动 (Parallax) 调整 y 轴偏移量
