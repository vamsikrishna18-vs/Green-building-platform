# GreenBuild Platform — Production Cloud Deployment Guide

This guide details how to deploy **GreenBuild – Green Building Sustainability Assessment Platform** to a free cloud hosting service (such as [Render.com](https://render.com), [Railway.app](https://railway.app), or [Vercel](https://vercel.com)) to get a **live, 24/7 public HTTPS URL** accessible from any device.

---

## ⚙️ Deployment Architecture Options

### Option A: Unified Single-Service Deployment (Recommended on Render)
In this setup, a single Node.js/Express Web Service on Render builds the React SPA frontend into `client/dist` and serves both the API endpoints (`/api/...`) and the frontend web pages under **ONE SINGLE public HTTPS URL** (e.g. `https://greenbuild.onrender.com`).

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

### Option B: Dual Service Deployment (Vercel Frontend + Render Backend)
- **Frontend (Vercel / Netlify)**:
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variable: `VITE_API_URL=https://your-backend-service.onrender.com`
- **Backend (Render Web Service)**:
  - Root Directory: `server`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Environment Variable: `CORS_ORIGIN=https://your-frontend-site.vercel.app`

---

## 🔑 Required Production Environment Variables

Never commit secrets to Git. Configure these environment variables in your cloud provider's dashboard:

### 1. Backend Web Service Variables (`server/.env`)
| Variable | Production Value / Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Set to `production` | `production` |
| `PORT` | Auto-assigned by cloud provider (defaults to 5000) | `10000` |
| `MONGODB_URI` | Production MongoDB Atlas Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/greenbuild` |
| `JWT_SECRET` | 64+ char random secret key for JWT auth tokens | `e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7` |
| `CORS_ORIGIN` | Allowed frontend URL(s) or `*` | `https://greenbuild.onrender.com` |

### 2. Frontend Variables (`client/.env`)
| Variable | Production Value / Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Optional. Set ONLY if backend is hosted on a different domain. Leave blank for unified single-service deployment. | `https://greenbuild-api.onrender.com` |

---

## 🚀 Step-by-Step Instructions to Obtain Your Live Public HTTPS URL (Render)

### Step 1: Push Code to GitHub / GitLab
1. Create a new repository on GitHub (e.g. `greenbuild-platform`).
2. Push your codebase:
   ```bash
   git init
   git add .
   git commit -m "Prepare GreenBuild for production deployment"
   git remote add origin https://github.com/YOUR_USERNAME/greenbuild-platform.git
   git push -u origin main
   ```

### Step 2: Create Web Service on Render
1. Sign up / Log in to [Render.com](https://render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository `greenbuild-platform`.
4. Configure service settings:
   - **Name**: `greenbuild-platform`
   - **Region**: Choose closest to your users (e.g., Oregon / Singapore / Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: *(Leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables in Render Dashboard
Under **Environment Variables** in Render, add:
- `NODE_ENV` = `production`
- `MONGODB_URI` = *Your MongoDB Atlas Connection String* (Ensure Network Access in MongoDB Atlas allows IP `0.0.0.0/0`)
- `JWT_SECRET` = *Your Secret Key*
- `CORS_ORIGIN` = `*`

### Step 4: Deploy & Access Live Website
1. Click **Create Web Service**.
2. Render will run `npm run build` (installing client & server packages and building the Vite SPA) and launch `npm start`.
3. Once logs display `GREENBUILD SERVER READY FOR PRODUCTION`, Render will provide your **Public HTTPS URL**:
   👉 `https://greenbuild-platform.onrender.com`

---

## 🧪 Post-Deployment Verification Checklist

Once deployed, visit your public HTTPS URL and verify:
- [x] **Health Check**: Visit `https://your-url.onrender.com/api/health` ➔ Returns `{"status":"ok"}`.
- [x] **Authentication**: Register a new user, log in, view profile, and log out.
- [x] **Dashboard**: Loads executive metrics, carbon savings, and radar charts.
- [x] **New Assessment**: Submit a building assessment and view the calculated report.
- [x] **Simulator**: Adjust sliders and verify real-time score uplifts.
- [x] **ROI Calculator**: Test financial tariff sliders.
- [x] **Compare & Leaderboard**: Inspect comparison matrix and standings.
- [x] **AI Advisor Chatbot**: Open the floating lower-right chatbot widget and send a query.
