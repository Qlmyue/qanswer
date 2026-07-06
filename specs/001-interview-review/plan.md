# Implementation Plan: AI面试复盘网站

**Branch**: `001-interview-review` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-interview-review/spec.md`

## Summary

开发一个AI面试复盘网站，支持用户通过AI对话方式记录面试问题、每日考核、技能管理和数据分析。采用前后端分离架构，**Phase 1 优先完成前端页面供用户评审**，Phase 2 再开发后台服务。

## Technical Context

**Language/Version**: 
- Frontend: Vue 3 + TypeScript
- Backend: Python 3.11+

**Primary Dependencies**: 
- Frontend: Vue 3, Vue Router, Pinia, Element Plus (UI组件库)
- Backend: FastAPI, LangChain DeepAgents, SQLAlchemy

**Storage**: SQLite (轻量级本地数据库)

**Testing**: 
- Frontend: Vitest + Vue Test Utils
- Backend: pytest

**Target Platform**: Web应用，支持现代浏览器（Chrome, Firefox, Safari, Edge）

**Project Type**: Web Application (前后端分离)

**Performance Goals**: 
- 页面加载时间 < 2秒
- AI回复生成时间 < 30秒
- 支持单用户本地部署

**Constraints**: 
- 轻量级部署，无需复杂基础设施
- 本地数据存储，保护用户隐私
- 支持离线使用（除AI功能外）

**Scale/Scope**: 
- 单用户本地部署
- 预计10个主要页面
- 支持数百条复盘点数据

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

由于constitution文件为模板状态，无特定约束需要检查。项目采用标准Web应用开发实践。

## Project Structure

### Documentation (this feature)

```text
specs/001-interview-review/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 通用组件
│   │   ├── layout/      # 布局组件
│   │   └── common/      # 公共组件
│   ├── views/           # 页面组件
│   │   ├── auth/        # 登录注册
│   │   ├── dashboard/   # 仪表盘
│   │   ├── review/      # 复盘点管理
│   │   ├── challenge/   # 每日考核
│   │   ├── practice/    # 每日练习
│   │   ├── analysis/    # 周度分析
│   │   ├── skill/       # 技能管理
│   │   └── export/      # 数据导出
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia状态管理
│   ├── services/        # API服务层
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript类型定义
│   ├── mock/            # Mock数据
│   ├── App.vue
│   └── main.ts
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json

backend/                 # Phase 2 实现
├── src/
│   ├── models/
│   ├── services/
│   ├── api/
│   └── core/
└── tests/
```

**Structure Decision**: 采用前后端分离的Web应用结构。Phase 1 仅开发frontend目录下的Vue3应用，使用Mock数据模拟后台响应。Phase 2 开发backend目录下的FastAPI服务。

## Phase 0: Research Output

详见 [research.md](./research.md)

**关键决策**:
- 前端框架：Vue 3 + TypeScript + Vite
- UI组件库：Element Plus
- 状态管理：Pinia
- 后台框架：FastAPI（Phase 2）
- AI服务：LangChain DeepAgents（Phase 2）
- 数据库：SQLite + SQLAlchemy（Phase 2）
- Mock策略：本地JSON文件 + 组件内联Mock

## Phase 1: Design & Contracts Output

### 数据模型
详见 [data-model.md](./data-model.md)

**核心实体**:
- User（用户）
- ReviewPoint（复盘点）
- PracticeQuestion（练习题）
- DailyChallenge（考核点）
- WeeklyReport（周报）
- SkillItem（技能项）

### API合约
详见 [contracts/api-contract.md](./contracts/api-contract.md)

**主要模块**:
- 认证模块（登录、注册、登出）
- 复盘点模块（CRUD、AI生成、导出）
- 每日考核模块
- 每日练习模块
- 周度分析模块
- 技能管理模块
- 仪表盘模块

### UI组件合约
详见 [contracts/ui-components.md](./contracts/ui-components.md)

**页面清单**:
1. 登录/注册页面
2. 仪表盘
3. 复盘点列表/详情/编辑/创建页面
4. 每日考核页面
5. 每日练习页面
6. 周度分析页面
7. 技能管理页面
8. 数据导出页面

### 快速开始指南
详见 [quickstart.md](./quickstart.md)

**Phase 1 开发步骤**:
1. 创建Vue3项目
2. 安装依赖
3. 实现布局组件
4. 实现页面组件
5. 实现Mock数据服务
6. 实现状态管理
7. 测试与评审
