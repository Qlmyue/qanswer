# Data Model: AI面试复盘网站

**Date**: 2026-07-05
**Feature**: 001-interview-review

## Phase 1: 前端数据模型（Mock数据结构）

### 实体定义

#### 1. 用户 (User)

**用途**: 存储用户认证信息

**字段**:
- `id`: string (UUID) - 用户唯一标识
- `username`: string - 用户名
- `email`: string - 邮箱地址
- `password_hash`: string - 密码哈希（Phase 2）
- `created_at`: datetime - 创建时间
- `updated_at`: datetime - 更新时间

**验证规则**:
- 用户名：3-20字符，字母数字下划线
- 邮箱：有效邮箱格式
- 密码：8位以上，包含大小写字母和数字

**状态转换**:
- 未激活 → 已激活（邮箱验证后）
- 已激活 → 已禁用（管理员操作）

---

#### 2. 复盘点 (ReviewPoint)

**用途**: 存储面试问答对

**字段**:
- `id`: string (UUID) - 复盘点唯一标识
- `user_id`: string (FK → User.id) - 所属用户
- `question`: string - 面试问题
- `answer`: string - 答案内容
- `answer_source`: enum - 答案来源（"ai_generated" | "manual_input"）
- `reference_links`: array<string> - 参考资料链接列表
- `is_reviewed`: boolean - 是否已复盘
- `reviewed_at`: datetime | null - 复盘时间
- `skill_tags`: array<string> - 技能标签
- `created_at`: datetime - 创建时间
- `updated_at`: datetime - 更新时间

**验证规则**:
- 问题：必填，1-2000字符
- 答案：必填，1-10000字符
- 参考链接：有效URL格式

**状态转换**:
- 未复盘 → 已复盘（用户标记后）

---

#### 3. 练习题 (PracticeQuestion)

**用途**: 存储每日面试练习题

**字段**:
- `id`: string (UUID) - 练习题唯一标识
- `user_id`: string (FK → User.id) - 所属用户
- `question`: string - 面试问题
- `user_answer`: string | null - 用户答案
- `ai_feedback`: string | null - AI反馈（Phase 2）
- `practice_date`: date - 练习日期
- `is_answered`: boolean - 是否已回答
- `created_at`: datetime - 创建时间

**验证规则**:
- 问题：必填，1-2000字符
- 用户答案：可选，1-5000字符

**状态转换**:
- 未回答 → 已回答（用户提交答案后）

---

#### 4. 考核点 (DailyChallenge)

**用途**: 存储每日考核记录

**字段**:
- `id`: string (UUID) - 考核点唯一标识
- `user_id`: string (FK → User.id) - 所属用户
- `review_point_id`: string (FK → ReviewPoint.id) - 关联的复盘点
- `challenge_date`: date - 考核日期
- `is_completed`: boolean - 是否完成
- `completed_at`: datetime | null - 完成时间
- `user_answer`: string | null - 用户回答
- `created_at`: datetime - 创建时间

**验证规则**:
- 每个用户每天只能有一个考核点
- 关联的复盘点必须属于同一用户

**状态转换**:
- 未完成 → 已完成（用户回答后）

---

#### 5. 周报 (WeeklyReport)

**用途**: 存储每周分析报告

**字段**:
- `id`: string (UUID) - 周报唯一标识
- `user_id`: string (FK → User.id) - 所属用户
- `week_start`: date - 周开始日期
- `week_end`: date - 周结束日期
- `total_review_points`: number - 本周新增复盘点数
- `total_practice_questions`: number - 本周练习题数
- `category_stats`: object - 按技能分类的统计数据
  ```json
  {
    "langchain": { "total": 10, "reviewed": 7 },
    "fastapi": { "total": 5, "reviewed": 3 }
  }
  ```
- `weak_points`: array<string> - 薄弱点列表
- `improvement_suggestions`: array<string> - 改进建议
- `trend_comparison`: object - 与上周对比
  ```json
  {
    "review_points_change": 3,
    "practice_questions_change": 2,
    "review_rate_change": 0.15
  }
  ```
- `created_at`: datetime - 创建时间

**验证规则**:
- 周报覆盖完整一周（7天）
- 统计数据基于用户实际操作

---

#### 6. 技能项 (SkillItem)

**用途**: 存储岗位必备技能清单

**字段**:
- `id`: string (UUID) - 技能项唯一标识
- `user_id`: string (FK → User.id) - 所属用户
- `name`: string - 技能名称
- `description`: string | null - 技能描述
- `category`: string - 技能分类
- `priority`: enum - 优先级（"high" | "medium" | "low"）
- `boundary`: string | null - 边界说明（该技能的范围和深度）
- `created_at`: datetime - 创建时间
- `updated_at`: datetime - 更新时间

**验证规则**:
- 技能名称：必填，1-100字符
- 分类：必填，预定义分类或自定义
- 优先级：必填，枚举值

**预定义分类**:
- AI/ML框架（LangChain, PyTorch, TensorFlow等）
- 后端开发（FastAPI, Flask, Django等）
- 数据库（SQL, NoSQL, Vector DB等）
- 云服务（AWS, Azure, GCP等）
- DevOps（Docker, K8s, CI/CD等）
- 编程语言（Python, JavaScript, Go等）
- 软技能（沟通、团队协作、问题解决等）

---

## 关系图

```
User (1) ──→ (N) ReviewPoint
User (1) ──→ (N) PracticeQuestion
User (1) ──→ (N) DailyChallenge
User (1) ──→ (N) WeeklyReport
User (1) ──→ (N) SkillItem

DailyChallenge (N) ──→ (1) ReviewPoint
```

## Mock数据示例

### 用户数据
```json
{
  "id": "user-001",
  "username": "demo_user",
  "email": "demo@example.com",
  "created_at": "2026-07-01T10:00:00Z"
}
```

### 复盘点数据
```json
{
  "id": "rp-001",
  "user_id": "user-001",
  "question": "请解释LangChain中的Agent概念及其工作原理",
  "answer": "LangChain中的Agent是一个...",
  "answer_source": "ai_generated",
  "reference_links": [
    "https://docs.langchain.com/docs/concepts/agents"
  ],
  "is_reviewed": false,
  "skill_tags": ["langchain", "ai-agent"],
  "created_at": "2026-07-05T14:30:00Z"
}
```

### 技能项数据
```json
{
  "id": "skill-001",
  "user_id": "user-001",
  "name": "LangChain",
  "description": "AI应用开发框架",
  "category": "AI/ML框架",
  "priority": "high",
  "boundary": "掌握Agent、Chain、Prompt模板，了解RAG实现"
}
```

## 前端状态管理（Pinia Stores）

### authStore
- `currentUser`: User | null
- `isAuthenticated`: boolean
- `login(credentials)`, `logout()`, `register(userData)`

### reviewStore
- `reviewPoints`: ReviewPoint[]
- `filters`: { status, skillTag, dateRange }
- `fetchReviewPoints()`, `createReviewPoint(data)`, `toggleReviewStatus(id)`

### challengeStore
- `todayChallenge`: DailyChallenge | null
- `fetchTodayChallenge()`, `completeChallenge(answer)`

### practiceStore
- `todayPractice`: PracticeQuestion | null
- `fetchTodayPractice()`, `submitAnswer(answer)`

### analysisStore
- `currentReport`: WeeklyReport | null
- `fetchWeeklyReport()`

### skillStore
- `skills`: SkillItem[]
- `fetchSkills()`, `createSkill(data)`, `updateSkill(id, data)`, `deleteSkill(id)`

## 数据持久化（Phase 1）

Phase 1使用localStorage存储用户偏好设置和临时数据，Mock数据从JSON文件加载。

## 数据迁移策略（Phase 2）

Phase 2将实现：
1. SQLAlchemy ORM模型定义
2. 数据库迁移脚本（Alembic）
3. Mock数据导入工具
4. 数据备份与恢复功能
