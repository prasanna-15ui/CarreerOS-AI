# 1. User Role & Authentication Module

## Overview
This module handles user registration, authentication, session management, and profile settings for CareerOS AI.

## Core Features
- **Email/Password Signup & Login:** Secure authentication using Supabase Auth.
- **Session Management:** Persist user sessions securely with JWTs and manage protected routes in Next.js.
- **Logout Functionality:** Clear sessions and redirect to the login screen.
- **Profile Management (Future/Basic):** Display user name and email.

## UI/UX Requirements
- **Visuals:** Full-screen animated abstract gradient background.
- **Form Design:** Centered glassmorphic card with floating input labels (refer to `design.md`).
- **Feedback:** Clear error messages for invalid credentials or existing accounts, using toast notifications.

## Database Schema
**Table:** `Users`
- `id`: UUID (Primary Key, from Supabase Auth)
- `name`: String
- `email`: String (Unique)
- `created_at`: Timestamp

## Tech Stack & Integration
- **Frontend:** Next.js App Router, Tailwind CSS, Framer Motion.
- **Backend/Auth:** Supabase Auth.
- **Form Handling:** React Hook Form + Zod for validation.

## Acceptance Criteria
- [ ] User can sign up with a valid email and password.
- [ ] User can log in and is redirected to the Dashboard.
- [ ] Unauthenticated users are redirected to the login page when accessing protected routes.
- [ ] User can log out successfully.
