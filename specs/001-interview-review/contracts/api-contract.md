# API Contract: AI面试复盘网站

**Date**: 2026-07-05
**Feature**: 001-interview-review

## 概述

本文档定义前端与后端之间的API接口规范。Phase 1使用Mock数据模拟这些接口，Phase 2实现真实的后端服务。

## 基础规范

### 请求格式
- Content-Type: application/json
- Authorization: Bearer {jwt_token}（需要认证的接口）

### 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误描述",
  "errors": []
}
```

### 状态码
- 200: 成功
- 201: 创建成功
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器内部错误

---

## 认证模块

### POST /api/auth/register
**描述**: 用户注册

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    },
    "token": "string"
  }
}
```

**验证规则**:
- 用户名：3-20字符，字母数字下划线
- 邮箱：有效邮箱格式
- 密码：8位以上，包含大小写字母和数字

---

### POST /api/auth/login
**描述**: 用户登录

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    },
    "token": "string"
  }
}
```

---

### POST /api/auth/logout
**描述**: 用户登出

**Headers**: Authorization: Bearer {token}

**Response**:
```json
{
  "code": 200,
  "message": "登出成功"
}
```

---

### GET /api/auth/me
**描述**: 获取当前用户信息

**Headers**: Authorization: Bearer {token}

**Response**:
```json
{
  "code": 200,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "created_at": "datetime"
    }
  }
}
```

---

## 复盘点模块

### GET /api/review-points
**描述**: 获取复盘点列表

**Headers**: Authorization: Bearer {token}

**Query Parameters**:
- `status`: string (optional) - 筛选状态（"reviewed" | "unreviewed"）
- `skill_tag`: string (optional) - 技能标签筛选
- `page`: number (optional, default: 1) - 页码
- `page_size`: number (optional, default: 20) - 每页数量

**Response**:
```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "string",
        "question": "string",
        "answer": "string",
        "answer_source": "ai_generated" | "manual_input",
        "reference_links": ["string"],
        "is_reviewed": boolean,
        "reviewed_at": "datetime | null",
        "skill_tags": ["string"],
        "created_at": "datetime"
      }
    ],
    "total": number,
    "page": number,
    "page_size": number
  }
}
```

---

### POST /api/review-points
**描述**: 创建复盘点

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "question": "string",
  "answer": "string",
  "answer_source": "manual_input",
  "reference_links": ["string"],
  "skill_tags": ["string"]
}
```

**Response**:
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "review_point": {
      "id": "string",
      "question": "string",
      "answer": "string",
      "answer_source": "manual_input",
      "reference_links": [],
      "is_reviewed": false,
      "skill_tags": [],
      "created_at": "datetime"
    }
  }
}
```

---

### POST /api/review-points/ai-generate
**描述**: AI生成复盘点答案

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "question": "string"
}
```

**Response (SSE Stream)**:
```
data: {"type": "start", "message": "正在生成答案..."}
data: {"type": "content", "content": "答案内容片段..."}
data: {"type": "content", "content": "更多内容..."}
data: {"type": "links", "links": ["https://example.com"]}
data: {"type": "end", "review_point_id": "string"}
```

---

### GET /api/review-points/:id
**描述**: 获取单个复盘点详情

**Headers**: Authorization: Bearer {token}

**Response**:
```json
{
  "code": 200,
  "data": {
    "review_point": {
      "id": "string",
      "question": "string",
      "answer": "string",
      "answer_source": "ai_generated",
      "reference_links": ["string"],
      "is_reviewed": boolean,
      "reviewed_at": "datetime | null",
      "skill_tags": ["string"],
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  }
}
```

---

### PUT /api/review-points/:id
**描述**: 更新复盘点

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "question": "string",
  "answer": "string",
  "reference_links": ["string"],
  "skill_tags": ["string"]
}
```

**Response**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "review_point": {}
  }
}
```

---

### PATCH /api/review-points/:id/review-status
**描述**: 切换复盘状态

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "is_reviewed": boolean
}
```

**Response**:
```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": {
    "review_point": {
      "id": "string",
      "is_reviewed": boolean,
      "reviewed_at": "datetime | null"
    }
  }
}
```

---

### DELETE /api/review-points/:id
**描述**: 删除复盘点

**Headers**: Authorization: Bearer {token}

**Response**:
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

### POST /api/review-points/export
**描述**: 批量导出复盘点为Markdown

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "review_point_ids": ["string"]
}
```

**Response**:
```
Content-Type: application/zip
Content-Disposition: attachment; filename="review-points-export.zip"

[ZIP文件包含多个MD文件]
```

---

### GET /api/review-points/:id/export
**描述**: 导出单个复盘点为Markdown

**Headers**: Authorization: Bearer {token}

**Response**:
```
Content-Type: text/markdown
Content-Disposition: attachment; filename="review-point-{id}.md"

[Markdown内容]
```

---

## 每日考核模块

### GET /api/challenges/today
**描述**: 获取今日考核点

**Headers**: Authorization: Bearer {token}

**Response**:
```json
{
  "code": 200,
  "data": {
    "challenge": {
      "id": "string",
      "review_point": {
        "id": "string",
        "question": "string",
        "skill_tags": ["string"]
      },
      "challenge_date": "date",
      "is_completed": boolean,
      "completed_at": "datetime | null"
    },
    "has_review_points": boolean
  }
}
```

**逻辑**:
- 如果用户没有复盘点，返回`has_review_points: false`
- 如果今日已完成，返回已完成的考核点
- 如果今日未完成，从未复盘的复盘点中随机选择一个

---

### POST /api/challenges/today/complete
**描述**: 完成今日考核

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "user_answer": "string"
}
```

**Response**:
```json
{
  "code": 200,
  "message": "考核完成",
  "data": {
    "challenge": {
      "id": "string",
      "is_completed": true,
      "completed_at": "datetime",
      "user_answer": "string"
    }
  }
}
```

---

## 每日练习模块

### GET /api/practice/today
**描述**: 获取今日练习题

**Headers**: Authorization: Bearer {token}

**Response**:
```json
{
  "code": 200,
  "data": {
    "practice": {
      "id": "string",
      "question": "string",
      "user_answer": "string | null",
      "is_answered": boolean,
      "practice_date": "date"
    }
  }
}
```

**逻辑**:
- 如果今日已生成练习题，返回已有的题目
- 如果今日未生成，AI生成一个新的面试问题

---

### POST /api/practice/today/answer
**描述**: 提交今日练习答案

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "answer": "string"
}
```

**Response**:
```json
{
  "code": 200,
  "message": "答案提交成功",
  "data": {
    "practice": {
      "id": "string",
      "question": "string",
      "user_answer": "string",
      "is_answered": true
    }
  }
}
```

---

## 周度分析模块

### GET /api/analysis/weekly
**描述**: 获取本周分析报告

**Headers**: Authorization: Bearer {token}

**Query Parameters**:
- `week_offset`: number (optional, default: 0) - 周偏移量（0=本周，1=上周）

**Response**:
```json
{
  "code": 200,
  "data": {
    "report": {
      "id": "string",
      "week_start": "date",
      "week_end": "date",
      "total_review_points": number,
      "total_practice_questions": number,
      "category_stats": {
        "langchain": {
          "total": 10,
          "reviewed": 7
        }
      },
      "weak_points": ["string"],
      "improvement_suggestions": ["string"],
      "trend_comparison": {
        "review_points_change": 3,
        "practice_questions_change": 2,
        "review_rate_change": 0.15
      }
    }
  }
}
```

---

## 技能管理模块

### GET /api/skills
**描述**: 获取技能清单

**Headers**: Authorization: Bearer {token}

**Query Parameters**:
- `category`: string (optional) - 分类筛选
- `priority`: string (optional) - 优先级筛选

**Response**:
```json
{
  "code": 200,
  "data": {
    "skills": [
      {
        "id": "string",
        "name": "string",
        "description": "string | null",
        "category": "string",
        "priority": "high" | "medium" | "low",
        "boundary": "string | null",
        "created_at": "datetime",
        "updated_at": "datetime"
      }
    ],
    "categories": ["string"]
  }
}
```

---

### POST /api/skills
**描述**: 创建技能项

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "category": "string",
  "priority": "high" | "medium" | "low",
  "boundary": "string"
}
```

**Response**:
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "skill": {}
  }
}
```

---

### PUT /api/skills/:id
**描述**: 更新技能项

**Headers**: Authorization: Bearer {token}

**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "category": "string",
  "priority": "high" | "medium" | "low",
  "boundary": "string"
}
```

**Response**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "skill": {}
  }
}
```

---

### DELETE /api/skills/:id
**描述**: 删除技能项

**Headers**: Authorization: Bearer {token}

**Response**:
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 仪表盘模块

### GET /api/dashboard
**描述**: 获取仪表盘数据

**Headers**: Authorization: Bearer {token}

**Response**:
```json
{
  "code": 200,
  "data": {
    "stats": {
      "total_review_points": number,
      "reviewed_points": number,
      "review_rate": number,
      "total_practice_questions": number,
      "weekly_streak": number
    },
    "today_challenge": {
      "is_completed": boolean,
      "question_preview": "string"
    },
    "today_practice": {
      "is_answered": boolean,
      "question_preview": "string"
    },
    "recent_review_points": [
      {
        "id": "string",
        "question": "string",
        "is_reviewed": boolean,
        "created_at": "datetime"
      }
    ]
  }
}
```

---

## Mock数据实现（Phase 1）

Phase 1将使用以下方式模拟API：

1. **本地JSON文件**: 在`src/mock/`目录下创建JSON文件存储Mock数据
2. **Mock服务层**: 在`src/services/`目录下实现Mock数据加载和模拟
3. **Pinia Store**: 使用Store管理Mock数据状态
4. **延迟模拟**: 添加随机延迟模拟网络请求

### Mock数据文件结构
```
src/mock/
├── users.json
├── review-points.json
├── challenges.json
├── practice.json
├── reports.json
└── skills.json
```

### Mock服务示例
```typescript
// src/services/mock/auth.ts
export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse> {
    // 模拟网络延迟
    await delay(500)
    // 返回Mock数据
    return {
      code: 200,
      data: {
        user: mockUser,
        token: 'mock-jwt-token'
      }
    }
  }
}
```

---

## Phase 2 实现要点

1. **JWT认证**: 使用python-jose实现JWT token生成和验证
2. **密码加密**: 使用bcrypt哈希存储密码
3. **数据隔离**: 所有查询添加user_id过滤条件
4. **SSE流式响应**: 使用FastAPI的StreamingResponse实现AI流式生成
5. **错误处理**: 统一异常处理中间件
6. **请求验证**: 使用Pydantic模型验证请求参数
7. **数据库操作**: 使用SQLAlchemy ORM进行数据库操作
