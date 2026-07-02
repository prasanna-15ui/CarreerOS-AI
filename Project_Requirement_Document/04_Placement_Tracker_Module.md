# 4. Placement Tracker Module

## Overview
A specialized CRM for job seekers to track their job applications and interview processes.

## Core Features
- **Add Applications:** Log new companies and roles applied to.
- **Track Stages:** Update the status of an application (Applied -> Shortlisted -> Interview -> Offer/Rejected).
- **Notes & Details:** Store interview dates, job descriptions, and custom notes.
- **Search & Filter:** Find specific applications easily.

## UI/UX Requirements
- **Pipeline View:** Visual pipeline stages showing cards for each application.
- **Interactions:** Clicking a company card opens a sliding glass side-panel (drawer) to view and edit detailed notes.
- **Colors:** Use Semantic colors (Emerald for Offer, Rose for Rejected, Amber for Interview).

## Database Schema
**Table:** `Companies`
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> Users.id)
- `company_name`: String
- `role`: String
- `status`: String (Enum: Applied, Shortlisted, Interview, Offer, Rejected)
- `applied_date`: Date
- `notes`: Text

## Acceptance Criteria
- [ ] User can add a new job application.
- [ ] User can update the status of an existing application.
- [ ] Detailed notes can be saved and retrieved for each application.
