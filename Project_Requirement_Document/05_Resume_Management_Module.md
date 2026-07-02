# 5. Resume Management Module

## Overview
Allows users to upload, store, and manage different versions of their resumes for various job roles.

## Core Features
- **Upload Resumes:** Support for PDF uploads.
- **Tagging:** Add custom tags (e.g., "Frontend", "Backend", "Company X") to easily identify resumes.
- **Preview & Download:** Ability to view or download stored resumes.
- **Version Control:** Simple list of uploaded files.

## UI/UX Requirements
- **Upload Area:** A dashed-border glassmorphic dropzone that pulses when dragging files over it.
- **Grid Layout:** Masonry or grid layout of resume cards showing a thumbnail or file icon, file name, and colorful tag pills.

## Database Schema & Storage
**Table:** `Resumes`
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> Users.id)
- `file_url`: String (URL from Supabase Storage)
- `file_name`: String
- `tags`: Array of Strings
- `uploaded_at`: Timestamp

**Storage:** Supabase Storage Bucket (`resumes`).

## Acceptance Criteria
- [ ] User can upload a PDF resume.
- [ ] User can assign tags to the uploaded resume.
- [ ] Resume is securely stored in Supabase and the URL is saved in the database.
- [ ] User can download or delete a resume.
