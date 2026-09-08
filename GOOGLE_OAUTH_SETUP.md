# Google OAuth 2.0 / OpenID Connect Setup Guide

This document provides step-by-step instructions for configuring **Google OAuth 2.0 / OpenID Connect (OIDC)** authentication for the **Green Building Platform**.

---

## 1. Google Cloud Console Configuration

To enable real Google Sign-In and Sign-Up, you must generate OAuth credentials from the Google Cloud Console.

### Step 1: Create or Select a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google account.
3. Click the project dropdown at the top navigation bar and select **New Project**.
4. Name your project (e.g., `Green-Building-Platform`) and click **Create**.

### Step 2: Configure OAuth Consent Screen
1. In the left menu, navigate to **APIs & Services** → **OAuth consent screen**.
2. Select **External** user type (or **Internal** if using Google Workspace) and click **Create**.
3. Fill in the required App details:
   - **App name**: GreenBuild Sustainability Platform
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Click **Save and Continue**.
5. In the **Scopes** tab, click **Add or Remove Scopes** and select:
   - `openid`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
6. Click **Update** and then **Save and Continue**.
7. In the **Test users** section (while in Testing status), add your Google email address so you can test logging in.
8. Click **Save and Continue**.

### Step 3: Create OAuth 2.0 Credentials
1. In the left menu, navigate to **APIs & Services** → **Credentials**.
2. Click **+ Create Credentials** at the top and choose **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. Set **Name** to `GreenBuild Web Client`.
5. Under **Authorized JavaScript origins**, add:
   - Development: `http://localhost:5173` (or `http://localhost:5000`)
   - Production: `https://green-building-platform.onrender.com` (or your domain)
6. Under **Authorized redirect URIs**, add:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://green-building-platform.onrender.com/api/auth/google/callback`
7. Click **Create**.
8. A modal will display your **Client ID** and **Client Secret**. Copy both values.

---

## 2. Environment Configuration

### Local Backend Environment Setup (`server/.env`)
Create or edit `server/.env` and add the copied Google credentials:

```env
NODE_ENV=development
PORT=5000

# Database & JWT Configuration
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=greenbuild_jwt_secret_key_2026_super_secure

# Frontend & CORS URLs
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Google OAuth Credentials (KEEP CLIENT SECRET BACKEND-ONLY!)
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

> [!WARNING]
> Never commit `server/.env` or exposure of `GOOGLE_CLIENT_SECRET` to GitHub or frontend code!

---

## 3. How Authentication Flow Operates

1. **User Clicks "Continue with Google"** on Frontend (`/login` or `/register`).
2. Browser navigates to `GET http://localhost:5000/api/auth/google/login`.
3. Backend generates a cryptographically random CSRF `oauth_state` token stored in an HttpOnly cookie, and redirects the browser to Google's OAuth 2.0 Consent Screen.
4. User selects Google account and consents.
5. Google redirects browser to `GET http://localhost:5000/api/auth/google/callback?code=...&state=...`.
6. Backend validates `state` against cookie (CSRF check), exchanges `code` for tokens, and verifies ID Token signature and claims server-side via `google-auth-library`.
7. Backend matches/links user by Google `sub` ID or verified `email`.
8. Backend generates application JWT session and sets Secure + HttpOnly cookie `token`.
9. Backend redirects browser to `http://localhost:5173/` with **NO token in the URL query string**.
10. `AuthContext` calls `GET /api/auth/me` with `credentials: 'include'`. Browser automatically passes the HttpOnly cookie, restoring session cleanly.
