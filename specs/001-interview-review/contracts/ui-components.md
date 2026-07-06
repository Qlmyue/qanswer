# UI Components Contract: AI面试复盘网站

**Date**: 2026-07-05
**Feature**: 001-interview-review

## 概述

本文档定义前端页面和组件的规范，包括路由结构、页面布局、组件接口等。

## 路由结构

```typescript
// src/router/index.ts
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/review',
    name: 'ReviewList',
    component: () => import('@/views/review/ReviewListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/review/create',
    name: 'ReviewCreate',
    component: () => import('@/views/review/ReviewCreateView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/review/:id',
    name: 'ReviewDetail',
    component: () => import('@/views/review/ReviewDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/review/:id/edit',
    name: 'ReviewEdit',
    component: () => import('@/views/review/ReviewEditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/challenge',
    name: 'Challenge',
    component: () => import('@/views/challenge/ChallengeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/practice',
    name: 'Practice',
    component: () => import('@/views/practice/PracticeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('@/views/analysis/AnalysisView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('@/views/skill/SkillView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/export',
    name: 'Export',
    component: () => import('@/views/export/ExportView.vue'),
    meta: { requiresAuth: true }
  }
]
```

---

## 页面组件规范

### 1. 登录页面 (LoginView.vue)

**路径**: `/login`

**布局**:
- 居中卡片布局
- Logo + 标题
- 用户名输入框
- 密码输入框
- 登录按钮
- 注册链接

**Props**: 无

**Events**:
- `@login-success`: 登录成功后触发，跳转到仪表盘

**状态管理**:
- 使用 `authStore`
- 调用 `login(credentials)` 方法

**验证规则**:
- 用户名：必填
- 密码：必填

---

### 2. 注册页面 (RegisterView.vue)

**路径**: `/register`

**布局**:
- 居中卡片布局
- Logo + 标题
- 用户名输入框
- 邮箱输入框
- 密码输入框
- 确认密码输入框
- 注册按钮
- 登录链接

**Props**: 无

**Events**:
- `@register-success`: 注册成功后触发，跳转到仪表盘

**状态管理**:
- 使用 `authStore`
- 调用 `register(userData)` 方法

**验证规则**:
- 用户名：3-20字符，字母数字下划线
- 邮箱：有效邮箱格式
- 密码：8位以上，包含大小写字母和数字
- 确认密码：必须与密码一致

---

### 3. 仪表盘页面 (DashboardView.vue)

**路径**: `/dashboard`

**布局**:
- 顶部导航栏
- 左侧边栏（可选）
- 主内容区：
  - 统计卡片（总复盘点数、已复盘数、复盘率、练习题数）
  - 今日考核入口卡片
  - 今日练习入口卡片
  - 最近复盘点列表

**Props**: 无

**子组件**:
- `StatsCard.vue`: 统计数据卡片
- `TodayChallengeCard.vue`: 今日考核入口
- `TodayPracticeCard.vue`: 今日练习入口
- `RecentReviewPoints.vue`: 最近复盘点列表

**状态管理**:
- 使用 `dashboardStore` 或组合多个Store

---

### 4. 复盘点列表页面 (ReviewListView.vue)

**路径**: `/review`

**布局**:
- 顶部搜索和筛选栏
  - 状态筛选（全部/已复盘/未复盘）
  - 技能标签筛选
  - 搜索框
- 操作按钮
  - 新建复盘点
  - 批量导出
  - 批量标记已复盘
- 复盘点列表（表格或卡片形式）
  - 问题摘要
  - 答案来源标记
  - 技能标签
  - 复盘状态
  - 创建时间
  - 操作按钮（查看/编辑/删除/导出）
- 分页组件

**Props**: 无

**子组件**:
- `ReviewPointCard.vue`: 单个复盘点卡片
- `FilterBar.vue`: 筛选栏
- `BatchActions.vue`: 批量操作

**状态管理**:
- 使用 `reviewStore`

---

### 5. 创建复盘点页面 (ReviewCreateView.vue)

**路径**: `/review/create`

**布局**:
- 页面标题
- 问题输入区域（文本框）
- 答案获取方式选择
  - AI生成按钮
  - 手动输入按钮
- AI生成区域（选择AI生成时显示）
  - 流式显示区域
  - 生成状态指示
- 手动输入区域（选择手动输入时显示）
  - 富文本编辑器或Markdown编辑器
- 参考链接输入区域
- 技能标签选择
- 保存按钮

**Props**: 无

**Events**:
- `@save-success`: 保存成功后触发，跳转到列表或详情页

**状态管理**:
- 使用 `reviewStore`

---

### 6. 复盘点详情页面 (ReviewDetailView.vue)

**路径**: `/review/:id`

**布局**:
- 返回按钮
- 问题显示区域
- 答案显示区域（支持Markdown渲染）
- 参考链接列表
- 技能标签
- 元信息（创建时间、答案来源、复盘状态）
- 操作按钮
  - 编辑
  - 标记已复盘/取消复盘
  - 导出为Markdown
  - 删除

**Props**:
- `id`: string - 复盘点ID（从路由获取）

**状态管理**:
- 使用 `reviewStore`

---

### 7. 编辑复盘点页面 (ReviewEditView.vue)

**路径**: `/review/:id/edit`

**布局**:
- 与创建页面类似
- 预填充现有数据
- 更新按钮

**Props**:
- `id`: string - 复盘点ID（从路由获取）

**Events**:
- `@update-success`: 更新成功后触发

**状态管理**:
- 使用 `reviewStore`

---

### 8. 每日考核页面 (ChallengeView.vue)

**路径**: `/challenge`

**布局**:
- 页面标题：每日考核
- 未完成状态：
  - 问题显示区域
  - 答案输入区域
  - 提交按钮
- 已完成状态：
  - 问题显示区域
  - 用户答案显示
  - 标准答案显示（来自复盘点）
  - 完成标记
- 无复盘点状态：
  - 提示信息
  - 创建复盘点按钮

**Props**: 无

**状态管理**:
- 使用 `challengeStore`

---

### 9. 每日练习页面 (PracticeView.vue)

**路径**: `/practice`

**布局**:
- 页面标题：每日练习
- 练习日期显示
- 未完成状态：
  - 问题显示区域
  - 答案输入区域
  - 提交按钮
- 已完成状态：
  - 问题显示区域
  - 用户答案显示
  - 完成标记

**Props**: 无

**状态管理**:
- 使用 `practiceStore`

---

### 10. 周度分析页面 (AnalysisView.vue)

**路径**: `/analysis`

**布局**:
- 页面标题：周度分析
- 周选择器（本周/上周）
- 统计概览卡片
  - 新增复盘点数
  - 练习题数
  - 复盘率
- 技能分类统计图表（饼图/柱状图）
- 薄弱点列表
- 改进建议列表
- 趋势对比（与上周对比）

**Props**: 无

**子组件**:
- `CategoryChart.vue`: 技能分类图表
- `WeakPointsList.vue`: 薄弱点列表
- `SuggestionsList.vue`: 改进建议列表
- `TrendComparison.vue`: 趋势对比

**状态管理**:
- 使用 `analysisStore`

**图表库**:
- 使用 ECharts 或 Chart.js

---

### 11. 技能管理页面 (SkillView.vue)

**路径**: `/skills`

**布局**:
- 页面标题：技能管理
- 添加技能按钮
- 筛选栏（按分类、优先级）
- 技能列表（表格形式）
  - 技能名称
  - 分类
  - 优先级（高/中/低标签）
  - 描述
  - 边界说明
  - 操作按钮（编辑/删除）
- 添加/编辑技能对话框
  - 名称输入
  - 分类选择/输入
  - 优先级选择
  - 描述输入
  - 边界说明输入

**Props**: 无

**子组件**:
- `SkillFormDialog.vue`: 技能表单对话框
- `SkillTable.vue`: 技能列表表格

**状态管理**:
- 使用 `skillStore`

---

### 12. 数据导出页面 (ExportView.vue)

**路径**: `/export

**布局**:
- 页面标题：数据导出
- 导出选项
  - 单个复盘点导出（选择复盘点）
  - 批量导出（选择多个复盘点）
  - 全部导出
- 复盘点选择列表（用于批量导出）
- 导出按钮
- 导出历史（可选）

**Props**: 无

**状态管理**:
- 使用 `reviewStore`

---

## 通用组件规范

### 1. AppLayout.vue

**用途**: 主布局组件，包含导航栏和内容区

**Slots**:
- `default`: 主内容区

**Features**:
- 响应式布局
- 顶部导航栏
- 侧边栏（可折叠）
- 用户信息显示
- 登出按钮

---

### 2. Navbar.vue

**用途**: 顶部导航栏

**Features**:
- Logo
- 导航菜单
- 用户头像/名称
- 下拉菜单（个人设置、登出）

---

### 3. Sidebar.vue

**用途**: 侧边导航栏

**Features**:
- 导航菜单项
- 当前页面高亮
- 折叠/展开功能
- 响应式适配

---

### 4. StatsCard.vue

**Props**:
- `title`: string - 卡片标题
- `value`: number | string - 统计值
- `icon`: string - 图标名称
- `color`: string - 主题颜色
- `trend`: number - 趋势值（正数表示上升，负数表示下降）

---

### 5. ReviewPointCard.vue

**Props**:
- `reviewPoint`: ReviewPoint - 复盘点数据
- `showActions`: boolean - 是否显示操作按钮

**Events**:
- `@click`: 卡片点击
- `@review`: 标记复盘
- `@edit`: 编辑
- `@delete`: 删除
- `@export`: 导出

---

### 6. FilterBar.vue

**Props**:
- `filters`: object - 当前筛选条件

**Events**:
- `@filter-change`: 筛选条件变化

---

### 7. SkillFormDialog.vue

**Props**:
- `visible`: boolean - 对话框显示状态
- `skill`: SkillItem | null - 编辑时的技能数据

**Events**:
- `@update:visible`: 更新显示状态
- `@submit`: 表单提交

---

### 8. MarkdownRenderer.vue

**Props**:
- `content`: string - Markdown内容

**Features**:
- Markdown渲染
- 代码高亮
- Mermaid图表支持
- 链接处理

---

### 9. MermaidDiagram.vue

**Props**:
- `code`: string - Mermaid代码

**Features**:
- Mermaid图表渲染
- 响应式尺寸
- 错误处理

---

## 样式规范

### 主题色

```scss
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;

$bg-color: #f5f7fa;
$text-color: #303133;
$text-secondary: #606266;
$border-color: #dcdfe6;
```

### 字体

```scss
$font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
$font-size-base: 14px;
$font-size-small: 12px;
$font-size-large: 16px;
```

### 间距

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

### 断点

```scss
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

---

## 响应式设计

### 移动端适配

- 导航栏：折叠为汉堡菜单
- 侧边栏：隐藏或抽屉式显示
- 表格：响应式表格或卡片布局
- 表单：单列布局
- 按钮：全宽按钮

### 平板适配

- 导航栏：完整显示
- 侧边栏：可折叠
- 表格：正常显示
- 表单：两列布局

### 桌面适配

- 导航栏：完整显示
- 侧边栏：固定显示
- 表格：完整显示
- 表单：多列布局

---

## 无障碍设计

- 所有交互元素支持键盘导航
- 图片提供alt文本
- 表单元素关联label
- 颜色对比度符合WCAG标准
- 支持屏幕阅读器

---

## 国际化（预留）

Phase 1仅支持中文，预留国际化接口：

```typescript
// src/i18n/index.ts
export const i18n = {
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      login: '登录',
      register: '注册',
      // ...
    }
  }
}
```
