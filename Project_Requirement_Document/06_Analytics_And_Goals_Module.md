# 6. Analytics & Goals Module

## Overview
Provides insights into user productivity, goal tracking, and placement success rates.

## Core Features
- **Goal Tracking:** Set weekly or monthly goals and track progress (percentage completion).
- **Productivity Analytics:** Charts showing task completion rates over time.
- **Application Funnel:** Visual representation of application drop-off rates (e.g., 50 Applied -> 10 Interviews -> 2 Offers).

## UI/UX Requirements
- **Charts:** Use `recharts` for beautiful, animated charts with gradient fills and interactive tooltips.
- **Goal Rings:** Circular progress rings (similar to fitness apps) filling up with a smooth stroke animation for goals.
- **Cards:** Render charts inside glassmorphic panels.

## Database Schema
**Table:** `Goals`
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> Users.id)
- `title`: String
- `progress`: Integer (0-100)
- `deadline`: Date

## Acceptance Criteria
- [ ] User can create a goal and update its progress.
- [ ] Analytics page renders task productivity charts correctly.
- [ ] Application funnel accurately represents the user's `Companies` table data.
