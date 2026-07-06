# Research: AI面试复盘网站

**Date**: 2026-07-05
**Feature**: 001-interview-review

## Phase 0: 技术研究与决策

### 1. 前端框架选择

**Decision**: Vue 3 + TypeScript + Vite

**Rationale**:
- 用户明确要求Vue3
- TypeScript提供类型安全，减少运行时错误
- Vite提供快速的开发体验和构建速度
- Vue 3 Composition API更适合复杂组件逻辑

**Alternatives considered**:
- React: 生态更丰富，但用户明确要求Vue3
- Angular: 过于重量级，不适合轻量级应用
- Svelte: 学习曲线较陡，生态相对较小

### 2. UI组件库选择

**Decision**: Element Plus

**Rationale**:
- Vue 3原生支持
- 组件丰富，覆盖表单、表格、对话框等常用场景
- 中文文档完善，社区活跃
- 轻量级，按需引入

**Alternatives considered**:
- Ant Design Vue: 功能强大但体积较大
- Vuetify: Material Design风格，可能不符合用户审美
- Naive UI: 新兴库，生态相对较小

### 3. 状态管理选择

**Decision**: Pinia

**Rationale**:
- Vue 3官方推荐的状态管理方案
- TypeScript支持良好
- API简洁，学习成本低
- 支持Composition API风格

**Alternatives considered**:
- Vuex: Vue 2时代的方案，API相对繁琐
- 纯Composition API: 适合小型应用，但复杂状态管理困难

### 4. 路由方案选择

**Decision**: Vue Router 4

**Rationale**:
- Vue 3官方路由库
- 支持Composition API
- 类型安全
- 动态路由、路由守卫等特性完善

### 5. 后台框架选择（Phase 2）

**Decision**: FastAPI

**Rationale**:
- 用户明确要求
- 异步支持，性能优秀
- 自动生成OpenAPI文档
- Pydantic数据验证，类型安全
- 轻量级，适合本地部署

**Alternatives considered**:
- Flask: 更成熟但缺乏异步支持
- Django: 过于重量级
- Tornado: 学习曲线较陡

### 6. AI服务集成方案（Phase 2）

**Decision**: LangChain DeepAgents

**Rationale**:
- 用户明确要求
- 支持多种LLM提供商
- 提供Agent能力，适合复杂问答场景
- 可扩展性强

**Integration Pattern**:
- 使用LangChain的LLM接口调用AI服务
- 实现自定义Agent处理面试问答场景
- 支持流式响应提升用户体验
- 实现重试机制和错误处理

### 7. 数据库选择（Phase 2）

**Decision**: SQLite + SQLAlchemy

**Rationale**:
- 用户明确要求SQLite
- 轻量级，无需额外服务
- SQLAlchemy提供ORM支持，简化数据库操作
- 适合本地部署场景

**Schema Design Approach**:
- 用户表：存储用户认证信息
- 复盘点表：存储问答对
- 练习题表：存储每日练习
- 考核表：存储每日考核记录
- 周报表：存储分析报告
- 技能表：存储技能清单

### 8. 认证方案（Phase 2）

**Decision**: JWT + 密码哈希

**Rationale**:
- 无状态认证，适合前后端分离
- 密码使用bcrypt哈希存储
- 支持token刷新机制
- 实现数据隔离，每个用户只能访问自己的数据

### 9. Mock数据策略（Phase 1）

**Decision**: 本地JSON文件 + Vue组件内联Mock

**Rationale**:
- 前端评审阶段无需真实后台
- 使用JSON文件模拟API响应
- 组件内部使用硬编码数据快速原型
- 便于后续替换为真实API调用

**Implementation**:
- 在`src/mock/`目录下创建JSON文件
- 在services层实现mock数据加载
- 使用Pinia store管理mock数据状态
- 保持API接口设计与Phase 2一致

### 10. 导出功能实现方案

**Decision**: 前端Markdown生成 + Blob下载

**Rationale**:
- 纯前端实现，无需后台支持
- 使用markdown-it或自定义模板生成MD内容
- 通过Blob API创建下载链接
- 支持单个和批量导出

### 11. Mermaid图表集成

**Decision**: mermaid.js库

**Rationale**:
- 支持流程图、时序图等多种图表类型
- 可在Markdown中嵌入Mermaid代码
- 前端使用mermaid.js渲染图表
- 后端生成包含Mermaid代码的Markdown

## 关键技术挑战

### 1. AI流式响应

**Challenge**: AI生成答案可能需要较长时间，需要流式展示

**Solution**:
- 使用Server-Sent Events (SSE)实现流式响应
- 前端使用EventSource API接收数据
- 实现打字机效果展示AI回复
- 提供取消和重试机制

### 2. 数据隔离

**Challenge**: 多用户环境下确保数据完全隔离

**Solution**:
- 所有数据库表包含user_id字段
- API层统一添加用户过滤条件
- 前端路由守卫验证用户权限
- 实现行级数据隔离

### 3. 离线功能

**Challenge**: 除AI功能外，系统应支持离线使用

**Solution**:
- 使用localStorage缓存关键数据
- 实现离线状态检测
- 离线时禁用AI相关功能
- 在线时自动同步数据

### 4. 响应式设计

**Challenge**: 支持不同屏幕尺寸的设备

**Solution**:
- 使用Element Plus的响应式组件
- 采用Flexbox和Grid布局
- 实现移动端适配
- 测试不同分辨率下的显示效果

## 最佳实践

### 1. 组件设计原则

- 单一职责：每个组件只做一件事
- 可复用性：提取通用组件
- 类型安全：使用TypeScript定义props和events
- 组合式API：使用Composition API组织逻辑

### 2. 状态管理规范

- 全局状态：用户信息、主题配置
- 局部状态：页面级数据、表单状态
- 持久化状态：用户偏好设置
- 临时状态：UI交互状态

### 3. API设计规范

- RESTful风格
- 统一响应格式
- 错误码标准化
- 版本控制（预留）

### 4. 代码组织

- 按功能模块组织目录
- 提取公共工具函数
- 统一错误处理
- 完善的TypeScript类型定义

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| AI服务不稳定 | 用户体验差 | 实现重试机制、离线降级、手动输入备选 |
| Vue3学习曲线 | 开发效率低 | 使用Composition API最佳实践、参考官方示例 |
| 数据量增长 | 性能下降 | 实现分页加载、数据归档、索引优化 |
| 浏览器兼容性 | 功能异常 | 明确目标浏览器、使用Babel转译、特性检测 |

## 下一步

Phase 0研究完成，所有技术选型已确定。进入Phase 1设计阶段，生成数据模型、API合约和快速开始指南。
