# React + Tailwind CSS Frontend

This is a modern React-based frontend for the Academic Data Management System, built with:
- **React 19** - UI Framework
- **Vite 6** - Fast build tool
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Header, Sidebar, Card, Button, etc.
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── AdminDashboard.jsx
│   ├── HODDashboard.jsx
│   └── StaffDashboard.jsx
├── services/           # API services
│   └── api.js          # Axios instance and API calls
├── context/            # React Context
│   └── AuthContext.jsx # Authentication state management
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Hook for using auth context
├── App.jsx            # Main app component with routing
├── main.jsx           # Entry point
└── index.css          # Global Tailwind styles
```

## Features

### Login Page
- Username and password authentication
- Input validation
- Loading states
- Error handling
- Password visibility toggle

### Admin Dashboard
- **Dashboard**: Quick statistics (HODs, Students, Staff, Branches)
- **System Controls**: Maintenance mode toggle
- **Report Downloads**: Generate and download academic reports
- **Data Backup & Recovery**: Manual backups and restore from file

### HOD Dashboard
- **Dashboard**: Department overview and statistics
- **Staff Allocations**: Manage staff-to-subject assignments per semester
- **Attendance Management**: Monitor staff attendance submissions
- **CIE Marks**: Monitor continuous internal evaluation submissions

### Staff Dashboard
- **Dashboard**: Teaching overview with allocated subjects and student count
- **Attendance Entry**: Record student attendance per class
- **CIE Marks Entry**: Record continuous internal evaluation marks
- **Bulk Upload**: Upload marks from CSV/Excel files
- **Reports**: Generate PDF reports for students and marks

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Tailwind CSS and dependencies (if not already installed):
```bash
npm install -D tailwindcss postcss autoprefixer
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend API URL:
```
VITE_API_URL=http://localhost:5000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Endpoints Used

### Authentication
- `POST /auth/login` - Login
- `GET /auth/logout` - Logout
- `GET /auth/current-user` - Get current user

### Admin
- `GET /admin/dashboard-stats` - Dashboard statistics
- `GET /admin/get-maintenance` - Get maintenance status
- `POST /admin/set-maintenance` - Set maintenance status
- `GET /admin/get-report-options` - Get report filter options
- `GET /admin/download-report` - Download report
- `POST /admin/backup-data` - Perform backup
- `POST /admin/upload-backup` - Restore from backup

### HOD
- `GET /hod/dashboard` - Dashboard data
- `GET /hod/allocation-data` - Staff allocation data
- `POST /hod/update-allocation` - Update allocation
- `GET /hod/attendance-data` - Attendance records
- `POST /hod/submit-attendance` - Submit attendance
- `GET /hod/cie-data` - CIE marks data
- `POST /hod/submit-cie` - Submit CIE marks

### Staff
- `GET /staff/dashboard` - Dashboard data
- `GET /staff/allocation-students` - Students for an allocation
- `POST /staff/submit-attendance` - Submit attendance
- `POST /staff/submit-cie-marks` - Submit CIE marks
- `POST /staff/upload-bulk-marks` - Upload marks from file
- `GET /staff/student-report` - Get student report data
- `POST /staff/generate-report` - Generate PDF report

## Tailwind CSS Configuration

The Tailwind configuration extends the default theme with custom colors:

- **Primary Color**: Dark blue (#1a3a5c)
- **Success Color**: Green (#10b981)
- **Error Color**: Red (#dc2626)
- **Warning Color**: Amber (#f59e0b)

See `tailwind.config.js` for full configuration.

## Component Usage Examples

### Button
```jsx
<Button variant="primary" size="md">Save</Button>
<Button variant="danger" disabled={loading}>Delete</Button>
```

### Card
```jsx
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

### Alert
```jsx
<Alert type="success" message="Success message" />
<Alert type="error" title="Error" message="Error details" onClose={handler} />
```

### DashboardCard
```jsx
<DashboardGrid>
  <DashboardCard label="Total" value={100} icon="📊" />
</DashboardGrid>
```

## Error Handling

- API errors are caught and displayed using Alert components
- Form validation errors are shown inline
- Network errors trigger error alerts
- 401 Unauthorized redirects to login

## Authentication Flow

1. User logs in on LoginPage
2. AuthContext stores user and token
3. Protected routes check if user exists and has correct role
4. If not authenticated, redirect to login
5. On logout, clear user state and redirect to login

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript support required
- CSS Grid and Flexbox required

## Development Notes

- All components use Tailwind CSS for styling
- No external CSS files needed (except index.css for directives)
- Responsive design using Tailwind breakpoints
- Dark mode support can be enabled in tailwind.config.js

## Troubleshooting

### Port conflicts
If port 5173 is already in use, Vite will automatically use the next available port.

### CORS issues
Ensure the backend is running and accepts requests from the frontend URL. Update `VITE_API_URL` if needed.

### API calls not working
- Verify the backend API URL in `.env.local`
- Check browser console for error messages
- Ensure API endpoints match backend implementation

## License

Part of the Academic Data Management System
