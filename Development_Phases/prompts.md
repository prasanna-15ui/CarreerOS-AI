# 🤖 CareerOS AI — Agent Development Prompts

> **How to use this file:**
> Copy the full prompt for the current phase and paste it to your AI coding agent.
> Complete each phase fully before moving to the next one.
> The agent will tell you what it needs from you at the end of each phase.

---

## 🌐 Global Rules (Include with EVERY Phase Prompt)

> **Paste this block at the top of every phase prompt you give the agent.**

```
GLOBAL RULES FOR THIS PROJECT:
- Project: CareerOS AI (SaaS Career & Productivity Management Platform)
- Framework: Next.js (App Router), Tailwind CSS, Supabase, Framer Motion
- All UI must follow the glassmorphism design system: cards use `bg-white/10 backdrop-blur-md border border-white/20` on a deep animated gradient background.
- All buttons must have `transition-all duration-300 hover:scale-105`.
- All page content must be wrapped in Framer Motion `<motion.div>` with fade-in and slide-up animations.
- Use `lucide-react` for ALL icons.
- Use `Inter` or `Outfit` font from Google Fonts.
- Color palette: Background #0B0F19, Primary Accent #6366F1 → #A855F7, Success #10B981, Warning #F59E0B, Danger #F43F5E, Text #F8FAFC / #94A3B8.
- All database operations must use Supabase server-side clients with Row Level Security (RLS) enabled.
- STRICT RULE: You MUST use the `supabase.mcp` tool (Model Context Protocol tool) to connect to the database and perform SQL operations, table creation, and tool calling directly. Do NOT ask the user to run SQL manually.
- After completing this phase, you MUST:
  1. List every file you created or modified.
  2. Confirm if any environment variables (e.g., Supabase URL, Anon Key) are required and need to be added to `.env.local`.
  3. Tell me if any configuration, third-party API key, or manual step is needed from my side (the agent should handle SQL via supabase.mcp).
  4. List any outstanding tasks or known issues that should be addressed before moving to the next phase.
  5. Confirm: "Phase [N] is complete. You are ready to proceed to Phase [N+1]."
```

---

## 📋 Phase 1 Prompt — Project Setup & Authentication

**Copy and send this entire block to your agent:**

```
[PASTE GLOBAL RULES BLOCK HERE FIRST]

---

PHASE 1 TASK: Project Setup & Authentication
PHASE DEPENDENCIES: None. This is the first phase.

Your job is to set up the CareerOS AI project from scratch and implement a fully working authentication system.

STEP 1 — PROJECT INITIALIZATION:
- Initialize a new Next.js project using the App Router in the current directory.
- Install and configure Tailwind CSS.
- Install the following packages:
  - @supabase/supabase-js
  - @supabase/ssr
  - framer-motion
  - react-hook-form
  - @hookform/resolvers
  - zod
  - lucide-react

STEP 2 — SUPABASE SETUP:
- Create a Supabase client utility file for both server-side and client-side usage.
- Read environment variables from `.env.local`: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
- Note: Use `supabase.mcp` to connect to the database and execute SQL to create a `profiles` table (linked to `auth.users`) and necessary triggers if needed.

STEP 3 — AUTHENTICATION PAGES:
- Build `/app/(auth)/login/page.tsx` — Login page.
- Build `/app/(auth)/signup/page.tsx` — Signup page.
- Both pages must use the glassmorphic aesthetic: a full-screen animated gradient background with a centered frosted-glass card.
- Forms must use react-hook-form + zod for validation with inline error messages.
- Show a loading spinner on form submission.
- Show toast notifications for errors (e.g., "Invalid credentials") and success (e.g., "Account created!").

STEP 4 — SESSION & ROUTE PROTECTION:
- Implement Supabase session management using `@supabase/ssr`.
- Create a middleware (`middleware.ts`) at the root that:
  - Redirects unauthenticated users from any `/dashboard/*` route to `/login`.
  - Redirects authenticated users away from `/login` and `/signup` to `/dashboard`.

DELIVERABLE CHECK:
After completing all steps, tell me:
1. Every file you created or modified (with paths).
2. The exact content needed in `.env.local`.
3. Confirm that you have executed the necessary SQL in Supabase using supabase.mcp.
4. Any manual Supabase configuration steps (e.g., enabling Email Auth provider).
5. Known issues or pending items.
6. Confirm: "Phase 1 is complete. You are ready to proceed to Phase 2."
```



## 📋 Phase 2 Prompt — Design System & Dashboard Shell

**Copy and send this entire block to your agent:**

```
[PASTE GLOBAL RULES BLOCK HERE FIRST]

---

PHASE 2 TASK: Design System & Dashboard Shell
PHASE DEPENDENCIES: Phase 1 must be fully complete. The user must already be able to log in and be redirected to /dashboard.

Your job is to build the global visual design system and the main application shell layout.

CONTEXT FROM PHASE 1:
- Authentication is complete. After login, the user lands on `/dashboard`.
- Supabase is connected and sessions are managed via middleware.

STEP 1 — TAILWIND DESIGN TOKENS:
- Extend `tailwind.config.ts` with the project color palette and custom utilities.
- In `app/globals.css`, add:
  - The animated mesh gradient background (slow-moving, using CSS keyframes with Violet #7C3AED and Cyan #06B6D4 orbs on a #0B0F19 base).
  - Import `Inter` or `Outfit` from Google Fonts.
  - Base body styles: dark background, white text, font family.

STEP 2 — LAYOUT SHELL:
- Create `app/(dashboard)/layout.tsx` — The protected layout wrapper.
- Build the `<Sidebar>` component:
  - Glassmorphic panel on the left.
  - Navigation items: Dashboard, Tasks, Placements, Resumes, Analytics, Goals.
  - Each item uses a `lucide-react` icon.
  - Active route is highlighted with a glowing left border in the primary accent color (#6366F1).
  - Hover effects with `transition-all`.
- Build the `<TopBar>` component:
  - Floating, pill-shaped glassmorphic header at the top.
  - Contains a search input (static for now, no functionality needed yet) and a user avatar/profile dropdown showing the logged-in user's email.
  - Logout button that calls Supabase `signOut()` and redirects to `/login`.

STEP 3 — REUSABLE COMPONENTS:
Create these shared components in `components/ui/`:
- `GlassCard.tsx` — A `div` with `bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl` with `shadow-xl`.
- `PrimaryButton.tsx` — A styled button with the `#6366F1 → #A855F7` gradient and hover scale effect.
- `PageWrapper.tsx` — A Framer Motion wrapper that applies fade-in and slide-up entry animations to every page.

STEP 4 — STATIC DASHBOARD PAGE:
- Build `app/(dashboard)/dashboard/page.tsx`.
- Use `<PageWrapper>` for the entry animation.
- Add a dynamic welcome header: "Good Morning/Afternoon/Evening, [User Name]" (derive time of day from `new Date()`).
- Add 4 placeholder `<GlassCard>` Quick Stats widgets:
  - Task Completion %
  - Active Applications
  - Upcoming Deadlines
  - Productivity Score
  - (All values are static/hardcoded for now — they will be connected to real data in Phase 5.)

DELIVERABLE CHECK:
After completing all steps, tell me:
1. Every file you created or modified (with paths).
2. Any new packages you installed.
3. Any issues with Tailwind or CSS animation configuration.
4. Whether the layout is responsive on mobile.
5. Confirm: "Phase 2 is complete. You are ready to proceed to Phase 3."
```

---

## 📋 Phase 3 Prompt — Task Management System

**Copy and send this entire block to your agent:**

```
[PASTE GLOBAL RULES BLOCK HERE FIRST]

---

PHASE 3 TASK: Task Management System
PHASE DEPENDENCIES: Phase 1 and Phase 2 must be fully complete. The dashboard shell with Sidebar and TopBar must be visible and working.

Your job is to build a fully functional Task Management page with a Kanban board and database integration.

CONTEXT FROM PREVIOUS PHASES:
- Supabase is connected. User is authenticated. The protected layout (`Sidebar` + `TopBar`) is in place.
- Reusable components (`GlassCard`, `PrimaryButton`, `PageWrapper`) are available.

STEP 1 — DATABASE SETUP:
- Use `supabase.mcp` to execute the exact SQL in Supabase to create the `Tasks` table:
  - id: uuid, primary key, default gen_random_uuid()
  - user_id: uuid, references auth.users(id), not null
  - title: text, not null
  - description: text
  - status: text, default 'Pending' (Enum values: Pending, In Progress, Completed)
  - priority: text, default 'Medium' (Enum values: Low, Medium, High)
  - due_date: timestamptz
  - created_at: timestamptz, default now()
- Execute the RLS policy SQL: Users can only SELECT, INSERT, UPDATE, DELETE their own tasks (user_id = auth.uid()).

STEP 2 — API LAYER (SERVER ACTIONS):
Create `app/actions/tasks.ts` with these Server Actions:
- `getTasks()` — Fetch all tasks for the logged-in user.
- `createTask(data)` — Insert a new task.
- `updateTask(id, data)` — Update task fields (status, priority, etc).
- `deleteTask(id)` — Delete a task by ID.

STEP 3 — TASK PAGE UI:
- Build `app/(dashboard)/tasks/page.tsx`.
- Use `<PageWrapper>` for entry animation.
- Include a header with the title "Task Manager" and a "New Task" `<PrimaryButton>`.
- Implement a view toggle (Kanban / List) using state.

STEP 4 — KANBAN BOARD:
- Install `@dnd-kit/core` and `@dnd-kit/sortable`.
- Create a `<KanbanBoard>` component with 3 columns: Pending, In Progress, Completed.
- Each column is a `<GlassCard>` container.
- Each task is a draggable card showing: Title, Priority badge (color-coded pill: Red=High, Yellow=Medium, Blue=Low), Due date.
- On drop into a new column, call `updateTask(id, { status: newStatus })` and reflect the change immediately (optimistic UI).
- When a task is dropped into "Completed", trigger a subtle confetti or glowing success animation.

STEP 5 — CREATE TASK MODAL:
- Build a `<TaskModal>` component (a glassmorphic dialog/drawer) that appears when "New Task" is clicked.
- Form fields: Title, Description, Priority (dropdown), Due Date (date picker).
- On submit, call `createTask(data)` and close the modal.

STEP 6 — LIST VIEW & FILTERS:
- Implement a list view showing tasks in a table-like layout inside `<GlassCard>` rows.
- Add filter buttons at the top for: All, Pending, In Progress, Completed.
- Add a search bar to filter tasks by title.

DELIVERABLE CHECK:
After completing all steps, tell me:
1. Every file you created or modified (with paths).
2. Confirmation that the SQL statements were successfully executed in Supabase (table creation + RLS policies).
3. Any new packages you installed.
4. Any performance considerations or known issues.
5. Confirm: "Phase 3 is complete. You are ready to proceed to Phase 4."
```

---

## 📋 Phase 4 Prompt — Placement Tracker & Resume Management

**Copy and send this entire block to your agent:**

```
[PASTE GLOBAL RULES BLOCK HERE FIRST]

---

PHASE 4 TASK: Placement Tracker & Resume Management
PHASE DEPENDENCIES: Phases 1, 2, and 3 must be fully complete.

Your job is to build two major career-focused modules.

CONTEXT FROM PREVIOUS PHASES:
- Supabase, auth, layout, and task management are all complete.
- All reusable UI components are available.
- Supabase Storage may not be configured yet — flag this.

--- MODULE A: PLACEMENT TRACKER ---

STEP 1 — DATABASE SETUP (Companies):
Use `supabase.mcp` to execute SQL to create the `Companies` table:
- id: uuid, primary key, default gen_random_uuid()
- user_id: uuid, references auth.users(id), not null
- company_name: text, not null
- role: text, not null
- status: text, default 'Applied' (values: Applied, Shortlisted, Interview, Offer, Rejected)
- applied_date: date
- notes: text
- created_at: timestamptz, default now()
- RLS: Users can only access their own rows.

STEP 2 — API LAYER (Placements):
Create `app/actions/placements.ts` with Server Actions for full CRUD on the Companies table.

STEP 3 — PLACEMENT TRACKER UI:
- Build `app/(dashboard)/placements/page.tsx`.
- Show a visual pipeline view: 5 stage columns (Applied → Shortlisted → Interview → Offer → Rejected).
- Each application is a `<GlassCard>` showing company name, role, and applied date.
- Color-code statuses: Applied=Blue, Shortlisted=Amber, Interview=Purple, Offer=Emerald, Rejected=Rose.
- "Add Application" button opens a `<PlacementModal>` with form fields: Company Name, Role, Status, Applied Date, Notes.
- Clicking a company card opens a slide-out drawer panel (from the right) showing full details and an editable notes field with a save button.

--- MODULE B: RESUME MANAGEMENT ---

STEP 4 — STORAGE & DATABASE SETUP (Resumes):
Use `supabase.mcp` to execute SQL for the `Resumes` table:
- id, user_id, file_url (text), file_name (text), tags (text[]), uploaded_at (timestamptz, default now())
- RLS: Users can only access their own rows.
- Tell me the exact steps to create a Supabase Storage bucket named `resumes` and set its policy.

STEP 5 — API LAYER (Resumes):
Create `app/actions/resumes.ts` with:
- `uploadResume(file, tags)` — Upload to Supabase Storage and save the URL to the Resumes table.
- `getResumes()` — Fetch all resumes for the user.
- `deleteResume(id, filePath)` — Delete from both Storage and database.

STEP 6 — RESUME MANAGER UI:
- Build `app/(dashboard)/resumes/page.tsx`.
- Top section: A drag-and-drop file upload zone (dashed border, glassmorphic, pulses on hover/drag-over). Accepts PDF files only.
- After upload, show a tag input so user can assign tags (e.g., "Frontend", "Google").
- Below: A responsive grid of resume cards, each showing: file icon, file name, colorful tag pills, Upload date, and action buttons (Download, Delete).

DELIVERABLE CHECK:
After completing all steps, tell me:
1. Every file you created or modified (with paths).
2. Confirmation that all SQL statements were successfully executed in Supabase.
3. Steps to set up the `resumes` Storage bucket and its access policies (or confirmation that you created them).
4. Any new packages installed.
5. Any manual configuration required from my side.
6. Confirm: "Phase 4 is complete. You are ready to proceed to Phase 5."
```

---

## 📋 Phase 5 Prompt — Analytics, Goals & Final Polish + Deployment

**Copy and send this entire block to your agent:**

```
[PASTE GLOBAL RULES BLOCK HERE FIRST]

---

PHASE 5 TASK: Analytics, Goals, Final Polish & Deployment
PHASE DEPENDENCIES: All previous phases (1–4) must be fully complete with real data being stored in Supabase.

Your job is to bring the data to life with charts, implement goal tracking, polish every screen, and deploy the app.

CONTEXT FROM PREVIOUS PHASES:
- Supabase has: Tasks, Companies, Resumes tables with real user data.
- Dashboard Quick Stats are currently static placeholders.
- All pages exist but need real data connections and final polish.

--- MODULE A: GOALS TRACKING ---

STEP 1 — DATABASE SETUP (Goals):
Use `supabase.mcp` to execute SQL to create the `Goals` table:
- id, user_id, title (text), description (text), progress (integer, 0-100, default 0), deadline (date), created_at
- RLS: Users can only access their own rows.

STEP 2 — API LAYER:
Create `app/actions/goals.ts` with CRUD Server Actions.

STEP 3 — GOALS PAGE UI:
- Build `app/(dashboard)/goals/page.tsx`.
- Show a grid of goal cards, each with the goal title, deadline, and an animated circular progress ring (SVG-based stroke-dasharray animation on mount).
- "Add Goal" button opens a modal. Progress can be updated via a slider input.

--- MODULE B: ANALYTICS DASHBOARD ---

STEP 4 — INSTALL CHARTING LIBRARY:
- Install `recharts`.

STEP 5 — DATA AGGREGATION:
Create `app/actions/analytics.ts` to:
- Count tasks grouped by status for the current user.
- Count tasks created per day for the last 7 days.
- Count companies grouped by status.

STEP 6 — ANALYTICS PAGE UI:
- Build `app/(dashboard)/analytics/page.tsx`.
- Chart 1 (Bar Chart): "Weekly Productivity" — tasks completed per day for the last 7 days. Bars grow from bottom on mount. Use gradient fills.
- Chart 2 (Funnel/Bar Chart): "Application Pipeline" — count of companies at each stage (Applied, Shortlisted, Interview, Offer).
- Chart 3 (Pie/Donut Chart): "Task Breakdown" — Pending vs In Progress vs Completed.
- All charts inside `<GlassCard>` panels with animated tooltips.

--- MODULE C: DASHBOARD CONNECTION ---

STEP 7 — CONNECT REAL DATA TO DASHBOARD:
- Fetch real data server-side in `app/(dashboard)/dashboard/page.tsx`.
- Connect Quick Stats widgets to real values:
  - Task Completion % = (Completed Tasks / Total Tasks) * 100
  - Active Applications = count of Companies with status != Offer and != Rejected
  - Upcoming Deadlines = count of Tasks with due_date within the next 7 days
  - Productivity Score = a simple calculated score based on completion rates
- Add a mini line chart (small Recharts sparkline) to the Dashboard showing the last 7 days of activity.

--- MODULE D: FINAL POLISH ---

STEP 8 — UI/UX REVIEW:
- Review ALL pages and ensure every one adheres to the glassmorphism design system.
- Ensure Framer Motion page transitions are working on every route.
- Ensure all hover states, button animations, and scale effects are consistent.
- Check mobile responsiveness: Sidebar should collapse to a bottom navigation bar on small screens.
- Add an empty state design for pages with no data (e.g., "No tasks yet. Add your first task!" with an illustration icon).

--- MODULE E: DEPLOYMENT ---

STEP 9 — VERCEL DEPLOYMENT:
- Tell me what environment variables need to be added to Vercel.
- Confirm there are no hardcoded secrets in the codebase.
- Provide the Vercel deployment command or instructions.

DELIVERABLE CHECK:
After completing all steps, tell me:
1. Every file you created or modified (with paths).
2. Confirmation that all SQL statements for the Goals table were successfully executed in Supabase.
3. All environment variables required in Vercel dashboard.
4. A list of all known issues, limitations, or potential improvements.
5. Final confirmation: "All 5 phases are complete. CareerOS AI is deployed and ready."
```

---

## 📌 Quick Reference: Phase Dependencies

```
Phase 1 (Auth)
    └─► Phase 2 (Design System) depends on: Supabase client, auth middleware
        └─► Phase 3 (Tasks) depends on: Layout shell, reusable components
            └─► Phase 4 (Placements & Resumes) depends on: Tasks pattern, Supabase Storage
                └─► Phase 5 (Analytics & Deploy) depends on: Real data in ALL tables
```

## ⚠️ Things You Must Provide to Your Agent

Before starting any phase, make sure you have:
- [ ] A Supabase project created with the URL and Anon Key.
- [ ] A `.env.local` file at the project root.
- [ ] Node.js and npm/pnpm installed locally.
- [ ] A Vercel account (needed for Phase 5 deployment).
- [ ] Ensure the agent has access to `supabase.mcp` to run SQL automatically.
