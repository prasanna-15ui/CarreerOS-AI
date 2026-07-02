# Development Phase 4: Placement Tracker & Resumes

## Objective
Build out the career-focused modules, enabling users to track job applications and manage their resume files.

## Tasks
1. **Database Setup (Companies & Resumes):**
   - Create `Companies` and `Resumes` tables in Supabase.
   - Create a Supabase Storage bucket for PDF resumes.
   - Configure RLS policies for tables and storage.
2. **Placement Tracker Feature:**
   - Build the Companies pipeline view (Applied -> Shortlisted -> Interview -> Offer/Rejected).
   - Create the "Add Application" form.
   - Implement the slide-out detail panel for viewing/editing application notes and changing statuses.
3. **Resume Management Feature:**
   - Build a drag-and-drop file upload zone.
   - Implement Supabase Storage upload logic.
   - Build the Resume grid view showing uploaded files and their assigned tags.
   - Implement download and delete functionality.

## Deliverables
- Working Placement Tracker with stage progression.
- Working Resume Manager with actual file uploading to Supabase Storage.
