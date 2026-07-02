# CareerOS AI - Authentication API Documentation

This document outlines the REST API endpoints provided for authentication within CareerOS AI. These endpoints wrap Supabase Authentication utilizing Next.js App Router API Routes.

All endpoints are hosted under `/api/auth/*` and return JSON responses.

---

## 1. User Signup
**Endpoint:** `POST /api/auth/signup`
**Description:** Creates a new user account and initiates a session.

### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Successful Response (201 Created)
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    // ... Supabase user object details
  }
}
```

### Error Responses
- **400 Bad Request** (Validation Error):
```json
{
  "success": false,
  "error": "Validation failed",
  "issues": [
    { "message": "Invalid email address" }
  ]
}
```
- **500 Internal Server Error** (Supabase/Creation Error):
```json
{
  "success": false,
  "error": "User already registered"
}
```

---

## 2. User Login
**Endpoint:** `POST /api/auth/login`
**Description:** Authenticates a user and sets an HTTP-only JWT session cookie.

### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Successful Response (200 OK)
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Error Responses
- **401 Unauthorized** (Invalid credentials):
```json
{
  "success": false,
  "error": "Invalid login credentials"
}
```

---

## 3. User Logout
**Endpoint:** `POST /api/auth/logout`
**Description:** Ends the current session and clears HTTP-only cookies.

### Request Body
*None*

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 4. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`
**Description:** Initiates a password reset flow, sending an email to the user.

### Request Body
```json
{
  "email": "user@example.com"
}
```

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Password reset instructions sent"
}
```

---

## 5. Get Current User (Session Check)
**Endpoint:** `GET /api/auth/me`
**Description:** Retrieves the current authenticated user's details using the secure session cookie.

### Request Body
*None*

### Successful Response (200 OK)
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Error Responses
- **401 Unauthorized** (No valid session cookie):
```json
{
  "success": false,
  "error": "Unauthorized"
}
```
