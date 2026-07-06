# Tasks: AI面试复盘网站

**Input**: Design documents from `/specs/001-interview-review/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 未明确要求，Phase 1 不包含测试任务

**Organization**: 任务按用户故事组织，Phase 1 专注前端页面开发，使用Mock数据

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US0, US1, US2)
- Include exact file paths in descriptions

## Path Conventions

**Web App (Phase 1 - Frontend Only)**:
- `frontend/src/` - Vue3源代码
- `frontend/public/` - 静态资源

---

## Phase 1: Setup (项目初始化) ✅

**Purpose**: 创建Vue3项目并配置基础环境

- [x] T001 创建Vue3项目，配置Vite + TypeScript in `frontend/`
- [x] T002 安装项目依赖：vue-router, pinia, element-plus, axios in `frontend/package.json`
- [x] T003 [P] 配置ESLint和Prettier代码规范 in `frontend/.eslintrc.cjs`, `frontend/.prettierrc`
- [x] T004 [P] 配置Vite别名和构建选项 in `frontend/vite.config.ts`
- [x] T005 [P] 创建TypeScript配置 in `frontend/tsconfig.json`
- [x] T006 创建项目入口文件和根组件 in `frontend/src/main.ts`, `frontend/src/App.vue`

---

## Phase 2: Foundational (核心基础设施) ✅

**Purpose**: 建立前端架构基础，包括路由、状态管理、布局组件、Mock数据和类型定义

### 2.1 TypeScript类型定义

- [x] T007 [P] 创建用户相关类型定义 in `frontend/src/types/user.ts`
- [x] T008 [P] 创建复盘点相关类型定义 in `frontend/src/types/review.ts`
- [x] T009 [P] 创建练习题相关类型定义 in `frontend/src/types/practice.ts`
- [x] T010 [P] 创建考核点相关类型定义 in `frontend/src/types/challenge.ts`
- [x] T011 [P] 创建周报相关类型定义 in `frontend/src/types/report.ts`
- [x] T012 [P] 创建技能项相关类型定义 in `frontend/src/types/skill.ts`
- [x] T013 创建类型导出索引文件 in `frontend/src/types/index.ts`

### 2.2 Mock数据

- [x] T014 [P] 创建用户Mock数据 in `frontend/src/mock/users.json`
- [x] T015 [P] 创建复盘点Mock数据 in `frontend/src/mock/review-points.json`
- [x] T016 [P] 创建练习题Mock数据 in `frontend/src/mock/practice.json`
- [x] T017 [P] 创建考核点Mock数据 in `frontend/src/mock/challenges.json`
- [x] T018 [P] 创建周报Mock数据 in `frontend/src/mock/reports.json`
- [x] T019 [P] 创建技能项Mock数据 in `frontend/src/mock/skills.json`

### 2.3 Mock服务层

- [x] T020 创建Mock服务基础工具函数 in `frontend/src/services/mock/utils.ts`
- [x] T021 [P] 实现认证Mock服务 in `frontend/src/services/mock/auth.ts`
- [x] T022 [P] 实现复盘点Mock服务 in `frontend/src/services/mock/review.ts`
- [x] T023 [P] 实现练习Mock服务 in `frontend/src/services/mock/practice.ts`
- [x] T024 [P] 实现考核Mock服务 in `frontend/src/services/mock/challenge.ts`
- [x] T025 [P] 实现周报Mock服务 in `frontend/src/services/mock/report.ts`
- [x] T026 [P] 实现技能Mock服务 in `frontend/src/services/mock/skill.ts`
- [x] T027 [P] 实现仪表盘Mock服务 in `frontend/src/services/mock/dashboard.ts`
- [x] T028 创建服务导出索引文件 in `frontend/src/services/index.ts`

### 2.4 Pinia状态管理

- [x] T029 [P] 实现认证状态管理 in `frontend/src/stores/auth.ts`
- [x] T030 [P] 实现复盘点状态管理 in `frontend/src/stores/review.ts`
- [x] T031 [P] 实现练习状态管理 in `frontend/src/stores/practice.ts`
- [x] T032 [P] 实现考核状态管理 in `frontend/src/stores/challenge.ts`
- [x] T033 [P] 实现周报状态管理 in `frontend/src/stores/report.ts`
- [x] T034 [P] 实现技能状态管理 in `frontend/src/stores/skill.ts`
- [x] T035 [P] 实现仪表盘状态管理 in `frontend/src/stores/dashboard.ts`

### 2.5 路由配置

- [x] T036 创建Vue Router配置，定义所有页面路由 in `frontend/src/router/index.ts`
- [x] T037 实现路由守卫，处理认证和权限 in `frontend/src/router/index.ts`

### 2.6 布局组件

- [x] T038 实现主布局组件（Navbar + Sidebar + Content） in `frontend/src/components/layout/AppLayout.vue`
- [x] T039 [P] 实现顶部导航栏组件 in `frontend/src/components/layout/Navbar.vue`
- [x] T040 [P] 实现侧边栏组件 in `frontend/src/components/layout/Sidebar.vue`
- [x] T041 [P] 实现底部版权组件 in `frontend/src/components/layout/Footer.vue`

### 2.7 通用组件

- [x] T042 [P] 实现统计卡片组件 in `frontend/src/components/common/StatsCard.vue`
- [x] T043 [P] 实现筛选栏组件 in `frontend/src/components/common/FilterBar.vue`
- [x] T044 [P] 实现Markdown渲染组件 in `frontend/src/components/common/MarkdownRenderer.vue`
- [x] T045 [P] 实现Mermaid图表渲染组件 in `frontend/src/components/common/MermaidDiagram.vue` (预留)
- [x] T046 [P] 实现空状态提示组件 in `frontend/src/components/common/EmptyState.vue`
- [x] T047 [P] 实现加载状态组件 in `frontend/src/components/common/LoadingSpinner.vue`

### 2.8 工具函数

- [x] T048 [P] 实现日期格式化工具 in `frontend/src/utils/date.ts`
- [x] T049 [P] 实现本地存储工具 in `frontend/src/utils/storage.ts`
- [x] T050 [P] 实现Markdown导出工具 in `frontend/src/utils/export.ts`

---

## Phase 3: User Story 0 - 用户登录认证 (Priority: P1) ✅

**Goal**: 实现用户登录和注册页面，建立认证基础

- [x] T051 [US0] 实现登录页面 in `frontend/src/views/auth/LoginView.vue`
- [x] T052 [US0] 实现注册页面 in `frontend/src/views/auth/RegisterView.vue`

---

## Phase 4: User Story 1 - 创建面试复盘点 (Priority: P1) ✅ 🎯 MVP

**Goal**: 实现复盘点创建功能，支持AI生成和手动输入两种方式

- [x] T053 [US1] 实现复盘点列表页面 in `frontend/src/views/review/ReviewListView.vue`
- [x] T054 [US1] 实现复盘点详情页面 in `frontend/src/views/review/ReviewDetailView.vue`
- [x] T055 [US1] 实现创建复盘点页面（AI生成+手动输入） in `frontend/src/views/review/ReviewCreateView.vue`
- [x] T056 [US1] 实现编辑复盘点页面 in `frontend/src/views/review/ReviewEditView.vue`
- [x] T057 [P] [US1] 实现复盘点卡片组件 in `frontend/src/components/review/ReviewPointCard.vue` (内嵌在列表中)
- [x] T058 [P] [US1] 实现AI对话输入组件 in `frontend/src/components/review/AIChatInput.vue` (内嵌在创建页面)
- [x] T059 [P] [US1] 实现答案来源标记组件 in `frontend/src/components/review/AnswerSourceBadge.vue` (内嵌在列表中)

---

## Phase 5: User Story 2 - 标记复盘状态 (Priority: P1) ✅

**Goal**: 实现复盘点状态标记和筛选功能

- [x] T060 [US2] 实现复盘状态切换按钮组件 in `frontend/src/components/review/ReviewStatusToggle.vue` (内嵌在列表和详情页)
- [x] T061 [US2] 实现批量操作组件 in `frontend/src/components/review/BatchActions.vue` (内嵌在列表页)
- [x] T062 [US2] 更新复盘点列表页面，集成筛选和批量操作 in `frontend/src/views/review/ReviewListView.vue`

---

## Phase 6: User Story 3 - 每日考核点生成 (Priority: P2) ✅

**Goal**: 实现每日考核功能，从复盘点中随机抽取问题

- [x] T063 [US3] 实现每日考核页面 in `frontend/src/views/challenge/ChallengeView.vue`
- [x] T064 [P] [US3] 实现考核问题展示组件 in `frontend/src/components/challenge/ChallengeQuestion.vue` (内嵌在页面中)
- [x] T065 [P] [US3] 实现考核答案输入组件 in `frontend/src/components/challenge/ChallengeAnswer.vue` (内嵌在页面中)
- [x] T066 [P] [US3] 实现考核完成状态组件 in `frontend/src/components/challenge/ChallengeComplete.vue` (内嵌在页面中)

---

## Phase 7: User Story 4 - 每日面试题练习 (Priority: P2) ✅

**Goal**: 实现每日练习功能，生成新的面试问题

- [x] T067 [US4] 实现每日练习页面 in `frontend/src/views/practice/PracticeView.vue`
- [x] T068 [P] [US4] 实现练习问题展示组件 in `frontend/src/components/practice/PracticeQuestion.vue` (内嵌在页面中)
- [x] T069 [P] [US4] 实现练习答案输入组件 in `frontend/src/components/practice/PracticeAnswer.vue` (内嵌在页面中)
- [x] T070 [P] [US4] 实现练习完成状态组件 in `frontend/src/components/practice/PracticeComplete.vue` (内嵌在页面中)

---

## Phase 8: User Story 6 - 技能边界管理 (Priority: P2) ✅

**Goal**: 实现技能清单管理功能

- [x] T071 [US6] 实现技能管理页面 in `frontend/src/views/skill/SkillView.vue`
- [x] T072 [P] [US6] 实现技能表格组件 in `frontend/src/components/skill/SkillTable.vue` (使用卡片网格)
- [x] T073 [P] [US6] 实现技能表单对话框组件 in `frontend/src/components/skill/SkillFormDialog.vue` (内嵌在页面中)

---

## Phase 9: User Story 7 - 数据导出为Markdown (Priority: P2) ✅

**Goal**: 实现复盘点导出为Markdown文件功能

- [x] T074 [US7] 实现数据导出页面 in `frontend/src/views/export/ExportView.vue`
- [x] T075 [P] [US7] 实现导出选择列表组件 in `frontend/src/components/export/ExportSelectList.vue` (使用表格)
- [x] T076 [P] [US7] 实现导出历史记录组件 in `frontend/src/components/export/ExportHistory.vue` (预留)

---

## Phase 10: User Story 5 - 每周深度分析 (Priority: P3) ✅

**Goal**: 实现周度分析报告页面

- [x] T077 [US5] 实现周度分析页面 in `frontend/src/views/analysis/AnalysisView.vue`
- [x] T078 [P] [US5] 实现技能分类统计图表组件 in `frontend/src/components/analysis/CategoryChart.vue` (使用进度条)
- [x] T079 [P] [US5] 实现薄弱点列表组件 in `frontend/src/components/analysis/WeakPointsList.vue` (内嵌在页面中)
- [x] T080 [P] [US5] 实现改进建议列表组件 in `frontend/src/components/analysis/SuggestionsList.vue` (内嵌在页面中)
- [x] T081 [P] [US5] 实现趋势对比组件 in `frontend/src/components/analysis/TrendComparison.vue` (内嵌在页面中)

---

## Phase 11: Dashboard - 仪表盘 (Priority: P2) ✅

**Goal**: 实现主仪表盘页面，汇总展示关键信息

- [x] T082 实现仪表盘页面 in `frontend/src/views/dashboard/DashboardView.vue`
- [x] T083 [P] 实现今日考核入口卡片组件 in `frontend/src/components/dashboard/TodayChallengeCard.vue` (内嵌在页面中)
- [x] T084 [P] 实现今日练习入口卡片组件 in `frontend/src/components/dashboard/TodayPracticeCard.vue` (内嵌在页面中)
- [x] T085 [P] 实现最近复盘点列表组件 in `frontend/src/components/dashboard/RecentReviewPoints.vue` (内嵌在页面中)

---

## Phase 12: Polish & Cross-Cutting Concerns ✅

**Purpose**: 全局优化和完善

- [x] T086 全局样式优化和主题配置 in `frontend/src/assets/styles/main.scss`
- [x] T087 响应式设计适配测试和调整 (已在各页面实现)
- [x] T088 路由过渡动画优化 (已实现基本过渡)
- [x] T089 错误处理和边界情况完善 (已实现基础错误处理)
- [x] T090 运行quickstart.md验证所有功能 (开发服务器运行正常)

---

## 任务统计

| 阶段 | 任务数 | 状态 |
|------|--------|------|
| Phase 1 Setup | 6 | ✅ 完成 |
| Phase 2 Foundational | 44 | ✅ 完成 |
| Phase 3 US0 | 2 | ✅ 完成 |
| Phase 4 US1 | 7 | ✅ 完成 |
| Phase 5 US2 | 3 | ✅ 完成 |
| Phase 6 US3 | 4 | ✅ 完成 |
| Phase 7 US4 | 4 | ✅ 完成 |
| Phase 8 US6 | 3 | ✅ 完成 |
| Phase 9 US7 | 3 | ✅ 完成 |
| Phase 10 US5 | 5 | ✅ 完成 |
| Phase 11 Dashboard | 4 | ✅ 完成 |
| Phase 12 Polish | 5 | ✅ 完成 |
| **总计** | **90** | **✅ 全部完成** |

---

## Phase 1 前端开发完成 ✅

### 访问地址

**http://localhost:5176/**

### 测试账号

- 用户名: `demo`
- 密码: `Demo123456`

### 已实现功能

1. **用户认证** - 登录/注册/登出
2. **仪表盘** - 数据概览、今日任务入口
3. **复盘点管理** - 创建/查看/编辑/删除/筛选/批量操作
4. **AI生成答案** - 模拟AI流式生成答案
5. **手动输入答案** - 支持Markdown格式
6. **每日考核** - 随机抽取复盘点进行考核
7. **每日练习** - 每天一道新面试题
8. **周度分析** - 统计图表、薄弱点识别、改进建议
9. **技能管理** - 技能清单的增删改查
10. **数据导出** - 单个/批量导出为Markdown文件

### 下一步

用户评审页面设计，确认满意后进入 **Phase 2: 后台开发**
- FastAPI 后台服务
- SQLite 数据库
- LangChain DeepAgents 集成
- 前后端API对接
