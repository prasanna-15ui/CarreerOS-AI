# 🎨 Design Document: CareerOS AI

## 1. Design Vision & Aesthetics
The UI for CareerOS AI must be **modern, highly interactive, and visually stunning**. It will heavily utilize **Glassmorphism**, vibrant gradients, and fluid animations to create a premium user experience that feels alive and responsive.

### 1.1 Core Aesthetic Principles
- **Glassmorphism:** Use semi-transparent backgrounds with background blur (`backdrop-filter: blur`) on cards, sidebars, and modals to create a frosted glass effect against colorful animated backgrounds.
- **Vibrant & Colorful:** Ditch generic corporate colors. Use rich, saturated gradients (e.g., Deep Purple to Neon Blue, Sunset Orange to Magenta) for backgrounds and accents.
- **Fluid Animations:** Every interaction should have a micro-animation. Use page transitions, hover effects (scaling, glowing), and smooth entering/exiting of elements.
- **Data Visualization (Graphs):** Analytics must be represented with beautiful, animated charts using libraries like Recharts or Chart.js, featuring gradient fills and tooltip animations.

---

## 2. Design System & Tokens

### 2.1 Color Palette
*   **Background (Global):** A subtle, slow-moving animated mesh gradient (dark mode preferred for glassmorphism to pop). Example: Deep Midnight Blue `#0B0F19` with glowing orbs of Violet `#7C3AED` and Cyan `#06B6D4`.
*   **Glass Panels (Cards/Sidebar):** `rgba(255, 255, 255, 0.05)` with `backdrop-blur-xl` and a 1px solid border of `rgba(255, 255, 255, 0.1)`.
*   **Primary Accent:** Vibrant Indigo `#6366F1` to Purple `#A855F7` gradient for primary buttons and active states.
*   **Success:** Emerald `#10B981` (for completed tasks, offers).
*   **Warning:** Amber `#F59E0B` (for pending items, deadlines).
*   **Danger:** Rose `#F43F5E` (for rejected applications).
*   **Text:** 
    *   Primary: Pure White `#FFFFFF` or Light Slate `#F8FAFC`.
    *   Secondary: Muted Gray `#94A3B8`.

### 2.2 Typography
*   **Font Family:** `Inter` or `Outfit` (Google Fonts) for a sleek, modern geometric look.
*   **Headings:** Bold, slightly tighter letter spacing. Use text gradients for main page titles.
*   **Body:** Regular weight, high legibility.

### 2.3 Animations (Framer Motion / Tailwind)
*   **Hover States:** Buttons and cards should scale up slightly (`scale: 1.02`), increase brightness, and cast a soft colored shadow.
*   **Page Loading:** Staggered fade-in and slide-up animations for lists and dashboard widgets.
*   **Transitions:** Smooth layout animations when tasks change status or items are filtered.

---

## 3. UI Implementation by Feature

### 3.1 Layout & Navigation
*   **Sidebar:** Glassmorphic vertical sidebar on the left. Icons (Lucide React) with glowing hover effects. Active state highlighted with a neon left border and subtle background gradient.
*   **Top Bar:** Floating, pill-shaped glassmorphic header containing global search, user profile avatar, and notification bell.

### 3.2 Authentication Pages (Login/Signup)
*   **Visuals:** Full-screen animated abstract gradient background.
*   **Form:** Centered glassmorphic card with floating input labels. 
*   **Action:** Primary button with a sweeping shine animation on hover.

### 3.3 The Dashboard (The Hub)
*   **Welcome Header:** "Good Morning, [Name]" with a dynamic, time-based emoji and text gradient.
*   **Quick Stats:** Row of 4 glass cards showing Task Completion %, Active Applications, Upcoming Deadlines, and Productivity Score.
*   **Activity Graph:** A large, curved line chart (Recharts) showing productivity over the week with a gradient fill below the line. Tooltips should smoothly follow the cursor.
*   **Recent Tasks/Applications:** Mini lists within glass cards, featuring staggered entrance animations.

### 3.4 Task Management
*   **View:** Kanban board style (To Do, In Progress, Done) or interactive list.
*   **Card Design:** Glassmorphic cards with priority badges (colorful pills).
*   **Interaction:** Drag-and-drop support (using `dnd-kit` or Framer Motion). Dropping a task into "Done" triggers a subtle confetti or glowing success animation.

### 3.5 Placement Tracker
*   **Pipeline View:** Visual pipeline stages (Applied ➔ Shortlisted ➔ Interview ➔ Offer).
*   **Company Cards:** Display company logo, role, and a progress bar indicating the stage.
*   **Interactions:** Clicking a card opens a sliding glass side-panel with detailed notes and interview dates.

### 3.6 Resume Management
*   **Grid View:** Masonry or grid layout of resume thumbnails.
*   **Upload Area:** A dashed-border glassmorphic dropzone that pulses when dragging files over it.
*   **Tags:** Colorful, rounded tag pills to indicate which resume is for which company/role.

### 3.7 Analytics & Goals (Graphs Focus)
*   **Productivity Chart:** Bar chart showing hours studied/worked per day, with bars growing from the bottom on load.
*   **Application Funnel:** A funnel chart showing the drop-off rate from Application to Offer.
*   **Goal Rings:** Circular progress rings (like Apple Watch activity rings) for weekly goals, filling up with a smooth stroke animation.

---

## 4. Recommended Tech Stack for UI Agent
To the AI agent developing this, please utilize the following libraries to achieve this design:
*   **Framework:** Next.js (App Router) + React
*   **Styling:** Tailwind CSS (crucial for rapid glassmorphism and utility animations)
*   **Animations:** `framer-motion` (for page transitions, staggering, and complex layout animations)
*   **Icons:** `lucide-react`
*   **Charts/Graphs:** `recharts` or `chart.js` (customize with Tailwind colors and gradient fills)
*   **Components:** Consider headless UI like `radix-ui` or a Tailwind-based library like `shadcn/ui` customized heavily for the glassmorphic theme.

## 5. Development Prompts for Next Agent
*   *Make sure every card uses `bg-white/10 backdrop-blur-md border border-white/20` (or dark equivalent).*
*   *Ensure buttons have `transition-all duration-300 hover:scale-105`.*
*   *Wrap page contents in Framer Motion `<motion.div>` for entry animations.*
