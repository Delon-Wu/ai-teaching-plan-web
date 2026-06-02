# 课研智造 (AI Teaching Plan Web)

AI 驱动的教培平台，帮助教师快速创建高质量课件 PPT。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS 4 + shadcn/ui (base-ui)
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **动画**: Framer Motion
- **拖拽布局**: react-grid-layout v2
- **预览**: reveal.js
- **公式**: KaTeX
- **图表**: ECharts
- **设备指纹**: FingerprintJS
- **主题**: next-themes (深色/浅色)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm start
```

## 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 落地页 - 邀请码、统计数字动画、吐槽入口 |
| `/coursewares` | 课件列表页 - 查看/管理已创建课件 |
| `/create` | PPT 创建页 - 步骤式向导（结构化表单/上传教案） |
| `/editor/[id]` | 课件编辑器 - 拖拽布局、AI 工具、在线预览 |
| `/share/[id]` | 课件分享页 - SEO 优化、只读预览 |

## 项目结构

```
src/
├── app/              # Next.js 页面路由
├── components/
│   ├── ui/           # shadcn/ui 基础组件
│   ├── layout/       # Header, Footer, Logo, ThemeToggle
│   ├── landing/      # 落地页组件
│   ├── courseware/   # 课件列表组件
│   ├── create/       # PPT 创建向导组件
│   ├── editor/       # 编辑器组件
│   └── common/       # 通用组件
├── stores/           # Zustand 状态管理
├── hooks/            # 自定义 Hooks
├── lib/              # 工具函数、API 客户端、设备指纹
└── types/            # TypeScript 类型定义
```
