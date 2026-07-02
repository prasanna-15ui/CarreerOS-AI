# 2. Dashboard Module

## Overview
The Dashboard acts as the central hub of CareerOS AI, providing users with a high-level overview of their tasks, applications, and productivity metrics.

## Core Features
- **Welcome Header:** Personalized greeting based on time of day.
- **Quick Stats Overview:** 
  - Task Completion %
  - Active Placement Applications
  - Upcoming Deadlines
  - Productivity Score
- **Recent Activity:** Quick view of pending tasks and recent application status changes.
- **Productivity Graph:** A visual representation of recent activity or task completion.

## UI/UX Requirements
- **Layout:** Glassmorphic vertical sidebar on the left and a floating top bar for global search/profile.
- **Cards:** Use `bg-white/10 backdrop-blur-md` for quick stats and recent activity widgets.
- **Animations:** Staggered fade-in and slide-up animations for dashboard widgets on load.

## Tech Stack & Integration
- **Frontend:** Next.js, Tailwind CSS, Recharts (for the productivity graph).
- **Data Fetching:** Fetch aggregated data from Supabase across Tasks, Companies, and Goals tables.

## Acceptance Criteria
- [ ] Dashboard displays correct dynamic stats based on user data.
- [ ] Productivity graph accurately reflects data over the last 7 days.
- [ ] Navigation sidebar is visible and functional.
