# Quickstart Guide: AI面试复盘网站

**Date**: 2026-07-05
**Feature**: 001-interview-review

## 概述

本指南帮助开发者快速搭建开发环境并运行项目。分为两个阶段：
- **Phase 1**: 前端页面开发与评审（当前阶段）
- **Phase 2**: 后台服务开发与集成

---

## Phase 1: 前端开发环境

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0 或 pnpm >= 8.0.0
- Git

### 快速开始

#### 1. 克隆项目

```bash
git clone <repository-url>
cd fupan
```

#### 2. 安装依赖

```bash
cd frontend
npm install
# 或
yarn install
# 或
pnpm install
```

#### 3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

开发服务器将在 `http://localhost:5173` 启动。

#### 4. 访问应用

打开浏览器访问 `http://localhost:5173`，使用以下测试账号登录：

- 用户名: `demo`
- 密码: `Demo123456`

---

## 项目结构

```
frontend/
├── src/
│   ├── assets/          # 静态资源（图片、字体等）
│   ├── components/      # 通用组件
│   │   ├── layout/      # 布局组件（AppLayout, Navbar, Sidebar）
│   │   └── common/      # 公共组件（StatsCard, FilterBar等）
│   ├── views/           # 页面组件
│   │   ├── auth/        # 登录注册页面
│   │   ├── dashboard/   # 仪表盘
│   │   ├── review/      # 复盘点管理
│   │   ├── challenge/   # 每日考核
│   │   ├── practice/    # 每日练习
│   │   ├── analysis/    # 周度分析
│   │   ├── skill/       # 技能管理
│   │   └── export/      # 数据导出
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia状态管理
│   ├── services/        # API服务层（Phase 1使用Mock）
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript类型定义
│   ├── mock/            # Mock数据
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── public/              # 公共静态资源
├── package.json         # 项目配置
├── vite.config.ts       # Vite配置
├── tsconfig.json        # TypeScript配置
└── index.html           # HTML入口
```

---

## 开发指南

### 1. 创建新页面

```bash
# 创建页面组件
touch src/views/review/ReviewListView.vue

# 在路由中注册
# src/router/index.ts
{
  path: '/review',
  name: 'ReviewList',
  component: () => import('@/views/review/ReviewListView.vue'),
  meta: { requiresAuth: true }
}
```

### 2. 创建新组件

```bash
# 创建组件
touch src/components/common/MyComponent.vue

# 在页面中使用
<script setup lang="ts">
import MyComponent from '@/components/common/MyComponent.vue'
</script>

<template>
  <MyComponent :prop1="value1" @event="handler" />
</template>
```

### 3. 创建Pinia Store

```typescript
// src/stores/myStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('my', () => {
  // State
  const items = ref<Item[]>([])
  
  // Getters
  const itemCount = computed(() => items.value.length)
  
  // Actions
  async function fetchItems() {
    // Mock数据或API调用
    items.value = mockItems
  }
  
  return {
    items,
    itemCount,
    fetchItems
  }
})
```

### 4. 使用Mock数据

```typescript
// src/services/mock/myService.ts
import mockData from '@/mock/my-data.json'

export const myService = {
  async getItems(): Promise<Item[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockData.items
  },
  
  async createItem(item: CreateItemRequest): Promise<Item> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      id: `item-${Date.now()}`,
      ...item,
      createdAt: new Date().toISOString()
    }
  }
}
```

### 5. 添加样式

```vue
<!-- 使用Element Plus组件 -->
<template>
  <el-button type="primary">按钮</el-button>
  <el-input v-model="value" placeholder="请输入"></el-input>
</template>

<!-- 自定义样式 -->
<style scoped>
.my-component {
  padding: 16px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
}
</style>
```

---

## 测试指南

### 单元测试

```bash
# 运行所有测试
npm run test

# 运行特定测试文件
npm run test -- src/components/MyComponent.spec.ts

# 生成覆盖率报告
npm run test:coverage
```

### 组件测试示例

```typescript
// src/components/StatsCard.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsCard from './StatsCard.vue'

describe('StatsCard', () => {
  it('renders correctly', () => {
    const wrapper = mount(StatsCard, {
      props: {
        title: '总复盘点',
        value: 42,
        icon: 'Document',
        color: '#409eff'
      }
    })
    
    expect(wrapper.text()).toContain('总复盘点')
    expect(wrapper.text()).toContain('42')
  })
})
```

---

## 构建与部署

### 开发环境构建

```bash
npm run build
```

构建产物将输出到 `frontend/dist` 目录。

### 预览构建结果

```bash
npm run preview
```

### 部署到静态服务器

将 `frontend/dist` 目录部署到任意静态文件服务器（Nginx、Apache、Vercel、Netlify等）。

#### Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 常见问题

### Q1: 如何修改端口？

编辑 `vite.config.ts`：

```typescript
export default defineConfig({
  server: {
    port: 3000  // 修改为其他端口
  }
})
```

### Q2: 如何添加新的Mock数据？

1. 在 `src/mock/` 目录下创建JSON文件
2. 在 `src/services/mock/` 目录下创建服务文件
3. 在组件或Store中调用Mock服务

### Q3: 如何切换到真实API？

Phase 2实现后，修改服务层：

```typescript
// src/services/index.ts
import { authService } from './mock/auth'  // Phase 1
// import { authService } from './api/auth'  // Phase 2

export { authService }
```

### Q4: 如何添加新的路由守卫？

编辑 `src/router/index.ts`：

```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

---

## 开发工具推荐

### VS Code插件

- Vue - Official (Volar)
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Auto Close Tag
- Auto Rename Tag

### 浏览器插件

- Vue.js devtools
- React Developer Tools (用于调试)

---

## 下一步

Phase 1完成后，进行用户评审：

1. **功能评审**: 检查所有页面功能是否符合预期
2. **UI/UX评审**: 检查界面设计和交互体验
3. **响应式评审**: 检查不同设备下的显示效果
4. **性能评审**: 检查页面加载速度和交互响应

评审通过后，进入Phase 2开发后台服务。

---

## 相关文档

- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Research Document](./research.md)
- [Data Model](./data-model.md)
- [API Contract](./contracts/api-contract.md)
- [UI Components Contract](./contracts/ui-components.md)
