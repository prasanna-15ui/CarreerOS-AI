---
title: CareerOS AI
emoji: 🚀
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---
# 🚀 CareerOS AI — Development Phases Index

> **AI-Powered Career & Productivity Management Platform**
> A full-stack SaaS web application built with Next.js, Tailwind CSS, Supabase, and Framer Motion.

---

## 📌 Project Roadmap Overview

CareerOS AI is organized into **5 sequential development phases**, each building upon the last. The roadmap progresses from project infrastructure and authentication all the way to rich analytics and final deployment.

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
  Setup    Design Sys   Task Mgmt  Placement   Analytics
  & Auth   & Dashboard             & Resumes   & Deploy
```

---

## 🏁 MVP Scope (Must Have for v1.0)

The following features constitute the **Minimum Viable Product** and must be completed before Phases 4 and 5 can begin:

| Feature | Phase | Status |
|---|---|---|
| User Signup & Login | Phase 1 | — |
| Protected Routes & Sessions | Phase 1 | — |
| Global Layout (Sidebar + TopBar) | Phase 2 | — |
| Glassmorphic Design System | Phase 2 | — |
| Dashboard Overview Page | Phase 2 | — |
| Task CRUD (Create/Edit/Delete) | Phase 3 | — |
| Kanban Board (Drag & Drop) | Phase 3 | — |
| Placement Application Tracker | Phase 4 | — |
| Resume Upload & Management | Phase 4 | — |

> **Nice to Have (Phase 5+):** Analytics charts, goal tracking, search & filters, notifications.
> **Future Scope:** AI recommendations, mobile app, email reminders.

---

## 📂 Phase Index

### ⚡ [Phase 1 — Project Setup & Authentication](./Phase_1_Setup_Auth.md)
**Goal:** Get the project infrastructure in place and allow users to securely register and log in.

| | |
|---|---|
| 🎯 **Objective** | Initialize Next.js, configure Supabase Auth, build Login & Signup pages |
| 🛠️ **Key Tasks** | Next.js init, Supabase setup, Auth UI (glassmorphic), session management, route protection |
| 📦 **Deliverables** | Running app, functional Login/Signup, persistent auth sessions |
| 📚 **PRD Reference** | `Project_Requirement_Document/01_User_Role_Module.md` |

---

### ⚡ [Phase 2 — Design System & Dashboard Shell](./Phase_2_Design_System_Dashboard.md)
**Goal:** Establish the premium visual language and build the global layout shell with a static Dashboard.

| | |
|---|---|
| 🎯 **Objective** | Implement glassmorphism design tokens, build Sidebar/TopBar, and static Dashboard |
| 🛠️ **Key Tasks** | Tailwind config, animated background, layout components, Framer Motion page transitions, glass card components |
| 📦 **Deliverables** | Styled global layout, reusable UI components, static Dashboard matching `design.md` |
| 📚 **PRD Reference** | `Project_Requirement_Document/02_Dashboard_Module.md` |

---

### ⚡ [Phase 3 — Task Management System](./Phase_3_Task_Management.md)
**Goal:** Build the core productivity tool with a fully interactive, database-connected task board.

| | |
|---|---|
| 🎯 **Objective** | Full CRUD task management with drag-and-drop Kanban board |
| 🛠️ **Key Tasks** | Supabase `Tasks` table + RLS, CRUD API, Kanban board, `@dnd-kit` drag-and-drop, filters & search |
| 📦 **Deliverables** | Functional Task page, interactive Kanban board, real-time DB updates |
| 📚 **PRD Reference** | `Project_Requirement_Document/03_Task_Management_Module.md` |

---

### ⚡ [Phase 4 — Placement Tracker & Resume Management](./Phase_4_Placement_Tracker_Resumes.md)
**Goal:** Build the career-focused modules for tracking job applications and managing resume files.

| | |
|---|---|
| 🎯 **Objective** | Application pipeline tracker + resume file upload and management |
| 🛠️ **Key Tasks** | Supabase `Companies` + `Resumes` tables, Supabase Storage bucket, pipeline UI, slide-out detail panel, drag-and-drop file upload |
| 📦 **Deliverables** | Working Placement Tracker with stage progression, Resume Manager with Supabase Storage |
| 📚 **PRD Reference** | `Project_Requirement_Document/04_Placement_Tracker_Module.md`, `Project_Requirement_Document/05_Resume_Management_Module.md` |

---

### ⚡ [Phase 5 — Analytics, Goals & Final Polish](./Phase_5_Analytics_Goals_Polish.md)
**Goal:** Bring data to life with animated charts, implement goal tracking, polish the entire UI, and deploy.

| | |
|---|---|
| 🎯 **Objective** | Data visualization, goal rings, UI polish, and Vercel deployment |
| 🛠️ **Key Tasks** | Supabase `Goals` table, Recharts integration (bar chart, funnel chart), circular progress rings, connect real data to Dashboard widgets, mobile responsiveness review, Vercel deploy |
| 📦 **Deliverables** | Live deployed app, Analytics page with rich charts, connected real-time Dashboard |
| 📚 **PRD Reference** | `Project_Requirement_Document/06_Analytics_And_Goals_Module.md` |

---

## 🔗 Related Documents

| Document | Purpose |
|---|---|
| [`../PRD.md`](../PRD.md) | Original Product Requirements Document |
| [`../design.md`](../design.md) | UI/UX Design System & Aesthetics Guide |
| [`../Project_Requirement_Document/`](../Project_Requirement_Document/) | Detailed per-module PRD breakdowns |

---

## 🛠️ Tech Stack Quick Reference

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Backend / Auth** | Supabase (PostgreSQL + Auth + Storage) |
| **Charts** | Recharts |
| **Drag & Drop** | @dnd-kit/core |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel |

---

*Start with [Phase 1](./Phase_1_Setup_Auth.md) and work sequentially. Each phase has clear deliverables that serve as the entry criteria for the next phase.*
