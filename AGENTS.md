# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

AI面试复盘网站 (AI Interview Review Website) - A web application for interview preparation through AI-assisted review, daily challenges, skill management, and performance analysis. Currently in **Phase 1** (frontend with mock data), Phase 2 will add FastAPI backend.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **UI Library**: Element Plus with @element-plus/icons-vue
- **State Management**: Pinia (Composition API style with `defineStore`)
- **Styling**: SCSS (sass-embedded)
- **Backend (Phase 2)**: FastAPI + SQLAlchemy + SQLite

## Commands

```bash
# Frontend (run from frontend/ directory)
cd frontend
npm run dev        # Start dev server on port 5173
npm run build      # Type-check with vue-tsc then build
npm run lint       # ESLint with auto-fix
npm run format     # Prettier format src/
npm run preview    # Preview production build
```

No test runner is configured yet (Vitest planned for Phase 2).

## Architecture

### Service Layer Abstraction

Services are abstracted in `frontend/src/services/index.ts` with a `USE_MOCK` constant (currently `false`) that switches between:
- `services/mock/*.ts` - Local mock implementations returning static JSON data
- `services/api/*.ts` - Real API calls via axios to `/api/*` endpoints

The Vite dev server proxies `/api` requests to `http://localhost:8000`.

### Store Pattern

All Pinia stores use Composition API style (`defineStore` with setup function). Stores in `frontend/src/stores/` import services from `@/services` and handle snake_case→camelCase conversion for API responses (see `toCamelCase` helper in review store).

### Key Directories

```
frontend/src/
├── views/          # Page components, one per route
├── components/     # Reusable components (layout/, common/)
├── stores/         # Pinia stores (one per domain)
├── services/       # API layer (mock/ and api/ subdirs)
├── types/          # TypeScript interfaces per domain + index.ts barrel
├── mock/           # Static JSON mock data files
└── utils/          # date.ts, storage.ts, export.ts helpers
```

### Routing

Routes defined in `frontend/src/router/index.ts`. Most routes have `meta: { requiresAuth: true }` - the navigation guard redirects unauthenticated users to `/login`. Auth state is checked via `localStorage.getItem('token')`.

## Spec-Driven Development

This project uses **speckit** for specification management. Feature specs live in `specs/<feature>/`:
- `spec.md` - Requirements and user stories
- `plan.md` - Implementation plan
- `data-model.md` - Entity definitions
- `contracts/api-contract.md` - API endpoint specifications

Codex skills for speckit are in `.Codex/skills/speckit-*`.

## Domain Model

Core entities (TypeScript types in `frontend/src/types/`):
- **ReviewPoint** - Interview Q&A pairs with answer source (AI/Manual) and review status
- **PracticeQuestion** - Daily practice questions with user answers
- **DailyChallenge** - Daily review challenges from existing review points
- **WeeklyReport** - Weekly analysis with skill-categorized stats
- **SkillItem** - Skill inventory with priority levels

## Conventions

- All UI text is in Chinese (中文)
- Component files use PascalCase (e.g., `ReviewListView.vue`)
- API responses use snake_case, converted to camelCase in stores
- Routes use kebab-case paths (`/review/create`)
- Type definitions grouped by domain in separate files, re-exported from `types/index.ts`

## Design Principles

### Visual Style Reference

Design must match the quality level of: **Linear.app**, **Vercel Dashboard**, **Stripe**, **Apple Human Interface**.

### Design Requirements

**Core Aesthetic**:
- 极简 (Minimalism) - Clean, uncluttered interfaces
- 高级感 (Premium feel) - High-end, sophisticated appearance
- 大留白 (Generous whitespace) - Breathing room between elements
- 现代 SaaS (Modern SaaS) - Contemporary web application style
- 毛玻璃 (Glassmorphism) - Frosted glass effects with backdrop-blur
- 柔和阴影 (Soft shadows) - Subtle, diffused shadows for depth
- 渐变 (Gradients) - Smooth color transitions for accents
- 统一圆角 16px (Unified border-radius) - Consistent 16px rounded corners

**Quality Bar**:
- **不要生成普通 CRUD 页面** - Do NOT generate basic CRUD interfaces
- **页面需要达到产品上线级视觉效果** - Pages must achieve production-ready visual quality

### Technical Implementation

**Design System Stack**:
- React + TypeScript
- TailwindCSS for utility-first styling
- shadcn/ui for accessible, composable components
- Framer Motion for fluid animations and transitions
- lucide-react for consistent iconography

### Implementation Guidelines

1. **Every component** must use TailwindCSS utility classes
2. **Glassmorphism** effects: `bg-white/10 backdrop-blur-xl border border-white/20`
3. **Shadows**: Use `shadow-lg shadow-black/5` or similar soft shadow combinations
4. **Border radius**: Apply `rounded-2xl` (16px) consistently
5. **Animations**: Add Framer Motion for page transitions, hover effects, and loading states
6. **Spacing**: Use generous padding/margins - `p-6`, `p-8`, `gap-6` as baseline
7. **Typography**: Clean hierarchy with proper font weights and sizes
8. **Color palette**: Modern, muted tones with strategic accent colors

## Backend Coding Principles

### Core Philosophy

**面向对象思想 (Object-Oriented Thinking)**:
- Design classes with clear responsibilities and single purposes
- Use inheritance and composition appropriately
- Encapsulate data and behavior together
- Apply SOLID principles throughout

**高内聚低耦合 (High Cohesion, Low Coupling)**:
- Each module/class should have a single, well-defined responsibility
- Minimize dependencies between modules
- Use dependency injection and interfaces for loose coupling
- Keep related functionality together, unrelated functionality separate

### Code Quality Standards

**编码优雅简洁高效 (Elegant, Concise, Efficient Code)**:
- Write clean, readable code with meaningful names
- Avoid unnecessary complexity and over-engineering
- Use Pythonic idioms and patterns
- Optimize for clarity first, performance second (unless critical)

### Return Value Guidelines

**❌ 不要直接写tuple (Don't return tuples directly)**:
```python
# Bad
def get_user():
    return user, status_code, message

# Good
def get_user() -> UserResponse:
    return UserResponse(user=user, status=200, message="Success")
```

**❌ 不要写dict (Don't use dict for structured data)**:
```python
# Bad
def get_user():
    return {"id": 1, "name": "John", "email": "john@example.com"}

# Good
def get_user() -> User:
    return User(id=1, name="John", email="john@example.com")
```

**✅ 尽量用对象 (Use objects instead)**:
- Define Pydantic models for request/response schemas
- Use dataclasses for internal data structures
- Create proper return types with type hints
- Use enums for constant values instead of magic strings

### Implementation Examples

```python
# Good: Object-oriented with proper return types
class ReviewPointService:
    def __init__(self, db: Session):
        self.db = db

    def create_review_point(self, data: CreateReviewPointRequest) -> ReviewPointResponse:
        review_point = ReviewPoint(**data.dict())
        self.db.add(review_point)
        self.db.commit()
        return ReviewPointResponse.from_orm(review_point)

# Good: High cohesion, single responsibility
class AIService:
    def generate_answer(self, question: str) -> AIAnswerResponse:
        # Focused on AI generation only
        pass

# Good: Low coupling via interfaces
class NotificationService:
    def __init__(self, sender: MessageSender):
        self.sender = sender  # Depends on abstraction, not concrete class
```

### Architecture Patterns

1. **Repository Pattern** - Separate data access logic from business logic
2. **Service Layer** - Encapsulate business rules in service classes
3. **DTO Pattern** - Use Data Transfer Objects for API boundaries
4. **Dependency Injection** - Pass dependencies through constructors
5. **Factory Pattern** - Create complex objects through factory methods
