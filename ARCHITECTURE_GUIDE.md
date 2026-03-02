# Architecture & File Structure Guide

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    WEB BROWSER                          │
│         (React SPA running on localhost:5173)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests (Axios)
                     │ API Calls & File Transfer
                     │
┌────────────────────▼────────────────────────────────────┐
│                   REACT FRONTEND                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ App.jsx (Routing & Provider Setup)              │   │
│  │  └─ BrowserRouter                               │   │
│  │     └─ AuthProvider (from AuthContext.jsx)      │   │
│  │        ├─ /login → LoginPage                    │   │
│  │        ├─ /admin/* → AdminDashboard (protected) │   │
│  │        ├─ /hod/* → HODDashboard (protected)     │   │
│  │        └─ /staff/* → StaffDashboard (protected) │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Components/Layout.jsx (Reusable UI Components)   │   │
│  │  - Header, Sidebar, MainContent                 │   │
│  │  - Card, Button, Input, Select                  │   │
│  │  - Table, Alert, DashboardCard, etc.            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Services/api.js (HTTP Client Layer)             │   │
│  │  - authService (login, logout)                  │   │
│  │  - adminService (8 endpoints)                   │   │
│  │  - hodService (7 endpoints)                     │   │
│  │  - staffService (8 endpoints)                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Context & Hooks                                 │   │
│  │  - AuthContext.jsx (Auth state management)      │   │
│  │  - useAuth.js (Custom hook)                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Styling                                         │   │
│  │  - Tailwind CSS (tailwind.config.js)            │   │
│  │  - index.css (Global styles)                    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests/Responses
                     │
┌────────────────────▼────────────────────────────────────┐
│              FLASK BACKEND API                          │
│  (http://localhost:5000)                               │
│                                                         │
│  ├─ /auth (Authentication Routes)                      │
│  │  ├─ POST /login                                    │
│  │  ├─ GET /logout                                    │
│  │  └─ GET /current-user                              │
│  │                                                     │
│  ├─ /admin (Admin Routes)                             │
│  │  ├─ GET /dashboard-stats                           │
│  │  ├─ GET/POST /maintenance                          │
│  │  ├─ GET /get-report-options                        │
│  │  ├─ GET /download-report                           │
│  │  ├─ POST /backup-data                              │
│  │  └─ POST /upload-backup                            │
│  │                                                     │
│  ├─ /hod (HOD Routes)                                 │
│  │  ├─ GET /dashboard                                │
│  │  ├─ GET /allocation-data                          │
│  │  ├─ GET /attendance-data                          │
│  │  └─ GET /cie-data                                 │
│  │                                                     │
│  └─ /staff (Staff Routes)                             │
│     ├─ GET /dashboard                                │
│     ├─ GET /allocation-students                      │
│     ├─ POST /submit-attendance                       │
│     ├─ POST /submit-cie-marks                        │
│     ├─ POST /upload-bulk-marks                       │
│     └─ POST /generate-report                         │
└─────────────────────────────────────────────────────────┘
```

## 📂 Complete File Structure

```
dummy/
│
├── backend/                          (Existing Flask Backend)
│   ├── app.py
│   ├── templates/                    (Old HTML - CONVERTED TO REACT)
│   │   ├── login.html               → pages/LoginPage.jsx
│   │   ├── admin.html               → pages/AdminDashboard.jsx
│   │   ├── hod.html                 → pages/HODDashboard.jsx
│   │   └── staff.html               → pages/StaffDashboard.jsx
│   ├── api/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── frontend/                         ⭐ NEW REACT FRONTEND
│   │
│   ├── src/
│   │   │
│   │   ├── components/               📦 Reusable Components
│   │   │   ├── Layout.jsx           (12 components)
│   │   │   │   ├── Header
│   │   │   │   ├── Sidebar
│   │   │   │   ├── MainContent
│   │   │   │   ├── Card
│   │   │   │   ├── Button
│   │   │   │   ├── Input
│   │   │   │   ├── Select
│   │   │   │   ├── Table
│   │   │   │   ├── Alert
│   │   │   │   ├── DashboardCard
│   │   │   │   ├── DashboardGrid
│   │   │   │   ├── PageHeader
│   │   │   │   └── ToggleSwitch
│   │   │   └── ProtectedRoute.jsx   (Route Guard)
│   │   │
│   │   ├── pages/                    🔐 Page Components
│   │   │   ├── LoginPage.jsx        (Login Screen)
│   │   │   ├── AdminDashboard.jsx   (Admin Panel)
│   │   │   ├── HODDashboard.jsx     (HOD Panel)
│   │   │   └── StaffDashboard.jsx   (Staff Panel)
│   │   │
│   │   ├── services/                 🔌 API & Services
│   │   │   └── api.js               (Axios + 25+ endpoints)
│   │   │       ├── authService
│   │   │       ├── adminService
│   │   │       ├── hodService
│   │   │       └── staffService
│   │   │
│   │   ├── context/                  🔄 State Management
│   │   │   └── AuthContext.jsx      (Auth State Provider)
│   │   │
│   │   ├── hooks/                    🪝 Custom Hooks
│   │   │   └── useAuth.js           (Auth Hook)
│   │   │
│   │   ├── assets/                   📸 Assets
│   │   │   └── (images, fonts, etc.)
│   │   │
│   │   ├── App.jsx                  🎯 Main App (UPDATED)
│   │   │   └── Routing & Provider Setup
│   │   │
│   │   ├── App.css                  (Minimal - uses Tailwind)
│   │   │
│   │   ├── main.jsx                 🚀 Entry Point
│   │   │   └── React Root Mounting
│   │   │
│   │   └── index.css                🎨 Global Styles (UPDATED)
│   │       └── Tailwind Directives
│   │
│   ├── public/                       📁 Public Assets
│   │   └── (static files)
│   │
│   ├── tailwind.config.js            ⚙️ Tailwind Config (NEW)
│   │   ├── Colors (primary, success, error)
│   │   ├── Themes
│   │   └── Extensions
│   │
│   ├── postcss.config.js             ⚙️ PostCSS Config (NEW)
│   │   ├── Tailwind Plugin
│   │   └── Autoprefixer
│   │
│   ├── .env.example                  ⚙️ Environment Template (NEW)
│   ├── package.json                  📦 Dependencies (UPDATED)
│   ├── package-lock.json             🔒 Lock File
│   ├── vite.config.js                ⚙️ Vite Config
│   ├── eslint.config.js              ✅ ESLint Config
│   ├── index.html                    🌐 HTML Entry Point
│   ├── README.md                     📖 Original README
│   └── README-FRONTEND.md            📖 NEW - Frontend Docs
│
├── QUICK_START.md                    📖 5-Min Setup Guide (NEW)
├── FRONTEND_CONVERSION_GUIDE.md       📖 Detailed Guide (NEW)
├── IMPLEMENTATION_SUMMARY.md          📖 Summary (NEW)
└── FILE_MANIFEST.md                  📖 File Listing (NEW)
```

## 🔄 Data Flow Diagram

```
┌─────────────┐
│   User      │
│   Browser   │
└──────┬──────┘
       │ Visits http://localhost:5173
       ▼
┌──────────────────┐
│  Router          │  Check URL
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  AuthContext     │  Check if user logged in
└────┬─────────────┘
     │
     ├─ [Not logged in] ──→ /login
     │
     ├─ [Admin] ──────────→ /admin/dashboard
     │
     ├─ [HOD] ───────────→ /hod/dashboard
     │
     └─ [Staff] ─────────→ /staff/dashboard
            │
            ▼
    ┌───────────────────┐
    │ Dashboard Page    │
    │ (e.g., Admin)     │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ useEffect Hook    │  On mount, load data
    └────┬──────────────┘
         │
    ┌────▼──────────────────────────┐
    │ API Service Call              │
    │ adminService.getDashboard()   │  → Axios GET request
    └────┬───────────────────────────┘
         │
    ┌────▼──────────────────┐
    │ Flask Backend         │
    │ GET /admin/dashboard  │ → Process request
    └────┬───────────────────┘
         │
    ┌────▼──────────────────┐
    │ Return JSON Response  │  ← Return data
    └────┬───────────────────┘
         │
    ┌────▼──────────────────┐
    │ Component State       │  Update state with data
    │ setStats(data)        │
    └────┬───────────────────┘
         │
    ┌────▼──────────────────┐
    │ Re-render UI          │  Display dashboard
    │ with new data         │
    └──────────────────────┘
```

## 📡 Component Communication

```
┌─────────────────────────────────────────┐
│          AuthProvider (Context)         │
│  ├─ user: {name, role, id}             │
│  ├─ login(username, password)          │
│  ├─ logout()                           │
│  └─ loading/error state                │
└──────────┬──────────────────────────────┘
           │ Provides auth to all children
           │
    ┌──────▼──────────┐
    │ useAuth() Hook  │
    │ (Used by pages) │
    └──────┬──────────┘
           │
    ┌──────▼──────────────────────┐
    │ Page Components             │
    │ ├─ LoginPage               │ ─→ Calls login()
    │ ├─ AdminDashboard          │ ─→ Gets user info
    │ ├─ HODDashboard            │ ─→ Checks role
    │ └─ StaffDashboard          │ ─→ Calls logout()
    └──────┬──────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │ Layout Components           │
    │ ├─ Header                   │ ─→ Shows user name
    │ ├─ Sidebar                  │ ─→ Navigation
    │ ├─ Card, Button, Input...   │
    │ ├─ Table, Alert             │
    │ └─ DashboardCard            │
    └──────────────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │ API Service (api.js)        │
    │ ├─ authService             │ ─→ Auth endpoints
    │ ├─ adminService            │ ─→ Admin endpoints
    │ ├─ hodService              │ ─→ HOD endpoints
    │ └─ staffService            │ ─→ Staff endpoints
    └──────┬───────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │ Axios Instance              │
    │ (HTTP Client)               │
    └──────┬───────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │ Flask Backend API           │
    │ (http://localhost:5000)     │
    └──────────────────────────────┘
```

## 🔐 Authentication & Route Protection

```
User Visits App
       │
       ▼
┌─────────────────┐
│ AuthProvider    │
│ (AuthContext)   │
└────┬────────────┘
     │
     ├─ On Load:
     │  └─ Check /auth/current-user
     │     ├─ [Success] → user in state
     │     └─ [Fail] → user = null
     │
     ▼
┌──────────────────┐
│ Router (App.jsx) │
└────┬─────────────┘
     │
     ├─ /login
     │  └─ No auth needed
     │
     ├─ /admin/*
     │  └─ ProtectedRoute (requiredRole="admin")
     │     ├─ [Not logged in] → Redirect /login
     │     ├─ [Wrong role] → Redirect /
     │     └─ [Correct role] → Show AdminDashboard
     │
     ├─ /hod/*
     │  └─ ProtectedRoute (requiredRole="hod")
     │     ├─ [Not logged in] → Redirect /login
     │     ├─ [Wrong role] → Redirect /
     │     └─ [Correct role] → Show HODDashboard
     │
     └─ /staff/*
        └─ ProtectedRoute (requiredRole="staff")
           ├─ [Not logged in] → Redirect /login
           ├─ [Wrong role] → Redirect /
           └─ [Correct role] → Show StaffDashboard
```

## 🎯 Component Nesting Structure

```
App (Main Component)
│
└─ Router (React Router)
   │
   ├─ Route path="/login"
   │  └─ LoginPage
   │     └─ Form with validation
   │
   ├─ Route path="/admin/*"
   │  └─ ProtectedRoute (admin)
   │     └─ AdminDashboard
   │        ├─ Header
   │        ├─ Sidebar (nav items)
   │        └─ MainContent
   │           ├─ Dashboard Section
   │           │  └─ DashboardGrid
   │           │     ├─ DashboardCard
   │           │     ├─ DashboardCard
   │           │     ├─ DashboardCard
   │           │     └─ DashboardCard
   │           ├─ System Controls Section
   │           │  └─ Card
   │           │     └─ ToggleSwitch
   │           ├─ Report Downloads Section
   │           │  └─ Card
   │           │     ├─ Select
   │           │     ├─ Select
   │           │     ├─ Select
   │           │     └─ Button
   │           └─ Backup Section
   │              └─ Card
   │                 ├─ Button
   │                 └─ Input (file)
   │
   ├─ Route path="/hod/*"
   │  └─ ProtectedRoute (hod)
   │     └─ HODDashboard
   │        ├─ Header
   │        ├─ Sidebar
   │        └─ MainContent
   │           ├─ Dashboard Section
   │           │  └─ DashboardGrid [4 cards]
   │           ├─ Allocations Section
   │           │  └─ Card
   │           │     ├─ Select
   │           │     └─ Table
   │           ├─ Attendance Section
   │           │  └─ Card
   │           │     ├─ Select
   │           │     └─ Table
   │           └─ CIE Section
   │              └─ Card
   │                 ├─ Select
   │                 └─ Table
   │
   └─ Route path="/staff/*"
      └─ ProtectedRoute (staff)
         └─ StaffDashboard
            ├─ Header
            ├─ Sidebar (5 items)
            └─ MainContent
               ├─ Dashboard Section
               │  └─ DashboardGrid [4 cards]
               ├─ Attendance Section
               │  └─ Card
               │     ├─ 2x Select
               │     └─ Table (students)
               ├─ CIE Section
               │  └─ Card
               │     ├─ 3x Select
               │     └─ Table (students)
               ├─ Bulk Upload Section
               │  └─ Card
               │     ├─ 3x Select
               │     └─ File Input
               └─ Reports Section
                  └─ Card
                     ├─ 2x Select
                     └─ Button
```

## 🎨 Styling Architecture

```
Tailwind CSS Pipeline
│
├─ tailwind.config.js
│  ├─ Define custom colors
│  │  ├─ primary: #1a3a5c (dark blue)
│  │  ├─ success: #10b981 (green)
│  │  ├─ error: #dc2626 (red)
│  │  └─ warning: #f59e0b (amber)
│  ├─ Custom fonts
│  ├─ Shadows
│  └─ Breakpoints (responsive)
│
├─ postcss.config.js
│  ├─ Tailwind plugin
│  └─ Autoprefixer
│
├─ src/index.css
│  ├─ @tailwind base
│  ├─ @tailwind components
│  ├─ @tailwind utilities
│  └─ Custom layer components
│
└─ All JSX files
   └─ Use Tailwind class names
      ├─ Layout: ml-64, mt-16, p-8
      ├─ Colors: bg-primary-900, text-success
      ├─ Responsive: md:grid-cols-2, lg:grid-cols-4
      ├─ States: hover:bg-opacity-90, focus:border-success
      └─ Animations: animate-spin, transition-all
```

---

## Key Relationships

### 1. **Authentication Flow**
LoginPage → useAuth() → AuthContext.login() → api.js → Backend → User stored in state

### 2. **Page Navigation**
Router → ProtectedRoute → Dashboard → useAuth() → Check user role → Allow/Block

### 3. **Data Fetching**
Dashboard.useEffect() → API service → api.js → Axios → Backend → setState → Re-render

### 4. **Component Reuse**
Dashboard → Layout components (Card, Button, Table, etc.) → Styled with Tailwind

---

**This architecture provides:**
- ✅ Clean separation of concerns
- ✅ Reusable components
- ✅ Centralized state management
- ✅ Single API service layer
- ✅ Protected routes with role checking
- ✅ Responsive design with Tailwind
- ✅ Easy to maintain and extend
