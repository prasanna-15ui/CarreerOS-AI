# 3. Task Management Module

## Overview
Allows users to create, organize, and track their daily tasks and study plans.

## Core Features
- **CRUD Operations:** Create, Read, Update, and Delete tasks.
- **Task Attributes:**
  - Title & Description
  - Status (Pending, In Progress, Completed)
  - Priority Level (High, Medium, Low)
  - Due Date
- **Views:** List view and Kanban board view.
- **Filtering & Search:** Filter by status, priority, or search by title.

## UI/UX Requirements
- **Board View:** Kanban-style columns. Glassmorphic cards for each task.
- **Interactions:** Drag-and-drop functionality between status columns.
- **Visual Cues:** Color-coded priority badges (e.g., Red for High, Yellow for Medium, Green for Low). Confetti animation on task completion.

## Database Schema
**Table:** `Tasks`
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> Users.id)
- `title`: String
- `description`: Text
- `status`: String (Enum: Pending, In Progress, Completed)
- `priority`: String (Enum: Low, Medium, High)
- `due_date`: Timestamp

## Tech Stack & Integration
- **Frontend:** `dnd-kit` or Framer Motion for drag-and-drop interactions.

## Acceptance Criteria
- [ ] User can create a new task with all attributes.
- [ ] User can move a task from "Pending" to "Completed" via drag-and-drop or status dropdown.
- [ ] Tasks can be filtered by priority and status.
- [ ] User can delete a task.
