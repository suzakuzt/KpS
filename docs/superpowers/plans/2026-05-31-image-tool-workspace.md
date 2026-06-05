# Image Tool Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local, full-stack AI image workspace modeled after the authorized reference site, without storing any reference credentials or private data.

**Architecture:** Use a Next.js single repo with App Router UI and route handlers for mock API endpoints. Keep image generation/editing behind a local task store so the UI can exercise realistic auth, task polling, templates, gallery, and usage flows before a real provider is connected.

**Tech Stack:** Next.js, React, TypeScript, Tailwind-free CSS modules/global CSS, Vitest, Testing Library, lucide-react.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] Create a Next.js TypeScript app skeleton with scripts for `dev`, `build`, `test`, and `test:run`.
- [ ] Install dependencies with npm.
- [ ] Keep all source files in `src/`.

### Task 2: Mock Domain Layer

**Files:**
- Test: `src/lib/server/mock-service.test.ts`
- Create: `src/lib/server/mock-service.ts`
- Create: `src/lib/shared/types.ts`

- [ ] Write failing Vitest coverage for access-key login, auth status, template pagination, gallery pagination, and image task lifecycle.
- [ ] Implement minimal in-memory service functions for those behaviors.
- [ ] Re-run tests until green.

### Task 3: API Routes

**Files:**
- Test: `src/lib/server/api-handlers.test.ts`
- Create: `src/lib/server/api-handlers.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/status/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/config/route.ts`
- Create: `src/app/api/templates/route.ts`
- Create: `src/app/api/gallery/route.ts`
- Create: `src/app/api/gallery/inspiration/route.ts`
- Create: `src/app/api/generate/job/route.ts`
- Create: `src/app/api/edit/job/route.ts`
- Create: `src/app/api/jobs/[id]/route.ts`
- Create: `src/app/api/optimize-prompt/route.ts`
- Create: `src/app/api/summarize-title/route.ts`

- [ ] Write failing tests for handler payload shapes.
- [ ] Implement route handlers matching the observed endpoint structure.
- [ ] Re-run tests until green.

### Task 4: Workspace UI

**Files:**
- Test: `src/lib/client/workspace-state.test.ts`
- Create: `src/lib/client/workspace-state.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] Write failing tests for client-side state transitions: prompt validation, task polling labels, local history insertion, template apply.
- [ ] Implement the single-page workspace UI: access key gate, top bar, left history rail, central chat/result canvas, right control panel, templates, gallery, usage.
- [ ] Use mock API calls; do not connect to the authorized reference site from the app.
- [ ] Re-run tests until green.

### Task 5: Verification

**Files:**
- Modify only if verification finds issues.

- [ ] Run `npm run test:run`.
- [ ] Run `npm run build`.
- [ ] Start local dev server.
- [ ] Open the app in the browser and verify login, generate, edit, template, gallery, and responsive layout.
