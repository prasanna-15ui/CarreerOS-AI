# Development Phase 3: Task Management System

## Objective
Implement the core productivity tool by allowing users to manage their daily tasks with interactive UI features like drag-and-drop.

## Tasks
1. **Database Setup (Tasks):**
   - Create the `Tasks` table in Supabase.
   - Configure foreign keys mapping to `Users.id` and set up RLS policies.
2. **API Integration:**
   - Create server actions or API routes for CRUD operations: Fetch, Create, Update, Delete tasks.
3. **Task UI Components:**
   - Build the "Create Task" modal/drawer.
   - Build individual Task Cards showing title, priority badges, and due dates.
4. **Kanban Board Implementation:**
   - Set up the Kanban board layout (Pending, In Progress, Completed).
   - Integrate a drag-and-drop library (e.g., `@dnd-kit/core` or `framer-motion` reorder).
   - Handle state updates on drop and sync with the Supabase database.
5. **List View & Filters:**
   - Provide an alternative List View.
   - Implement filtering (by status, priority) and search functionality.

## Deliverables
- A fully functional Task Management page.
- Interactive drag-and-drop Kanban board.
- Real-time or optimistic UI updates when moving tasks.
