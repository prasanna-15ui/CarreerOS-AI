# Development Phase 2: Design System & Dashboard Shell

## Objective
Establish the core visual language from `design.md` across the app and build the main layout shell, including navigation and the empty dashboard view.

## Tasks
1. **Design Tokens Implementation:**
   - Update `tailwind.config.ts` with custom colors, gradients, and extended properties for glassmorphism.
   - Set up global CSS for animated background gradients.
2. **Global Layout & Navigation:**
   - Build the `Sidebar` component with animated active states and icons.
   - Build the `TopBar` component featuring a global search bar mock and user profile dropdown.
   - Wrap the main application area to account for the sidebar layout.
3. **Framer Motion Integration:**
   - Implement page-level transition animations (e.g., fade in and slide up when navigating between routes).
4. **Dashboard Skeleton:**
   - Build the structural layout of the Dashboard page.
   - Create reusable glassmorphic Card components (`bg-white/10 backdrop-blur-md`).
   - Implement the "Welcome Header" with dynamic greetings.
   - Add placeholder "Quick Stats" widgets.

## Deliverables
- Fully styled global layout (Sidebar + TopBar).
- Reusable UI components (Glass Cards, Buttons, Inputs).
- A static Dashboard page reflecting the modern, animated aesthetic.
