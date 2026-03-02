# Quick Start Guide - Full Stack Application

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL Server running
- Visual Studio Code (optional)

---

## Step 1: Start the Backend (Terminal 1)

```bash
cd backend

# Activate Python virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the backend
python app.py
```

**Expected Output**:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

✅ **Backend running on port 5000**

---

## Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Run the development server
npm run dev
```

**Expected Output**:
```
VITE v5.0.0  ready in 245 ms

➜  Local:   http://localhost:5173/
```

✅ **Frontend running on port 5173**

---

## Step 3: Open in Browser

Navigate to: **http://localhost:5173**

You should see the Academic Management System login page.

---

## Test Login Credentials

### Admin User
```
Username: admin
Password: password123
```

### HOD User
```
Username: hod1
Password: password123
```

### Staff User
```
Username: staff1
Password: password123
```

---

## What Each Role Can Do

### Admin Dashboard
- ✅ View system statistics (users, students, branches)
- ✅ Enable/disable maintenance mode
- ✅ Create and restore database backups
- ✅ Generate system reports
- ✅ Manage system settings

### HOD Dashboard
- ✅ View departmental allocations
- ✅ View student attendance data
- ✅ View CIE marks data
- ✅ Monitor departmental statistics
- ✅ Filter data by semester

### Staff Dashboard
- ✅ View assigned subjects and students
- ✅ Submit attendance marks
- ✅ Submit CIE marks
- ✅ Upload bulk marks from Excel/CSV
- ✅ Generate PDF reports

---

## 🔍 Testing the API

### Quick Test with cURL

**1. Login**:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  -c cookies.txt -v
```

**2. Get Dashboard Stats**:
```bash
curl -X GET http://localhost:5000/admin/api/dashboard-stats \
  -b cookies.txt
```

**3. Get Current User**:
```bash
curl -X GET http://localhost:5000/api/current-user \
  -b cookies.txt
```

---

## 📁 Project Structure

```
dummy/
├── backend/                     # Flask backend
│   ├── app.py                  # Main app factory
│   ├── config/config.py        # Configuration
│   ├── routes/                 # API endpoints
│   │   ├── auth_routes.py      # Authentication
│   │   ├── admin_routes.py     # Admin APIs
│   │   ├── hod_routes.py       # HOD APIs
│   │   └── staff_routes.py     # Staff APIs
│   ├── models/                 # Database models
│   ├── services/               # Business logic
│   ├── static/                 # Static files
│   └── requirements.txt        # Python dependencies
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── context/            # Context API
│   │   └── App.jsx             # Main app
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite config
│
└── Documentation files...
```

---

## 🛠️ Common Tasks

### Set Up Database (First Time)

```bash
cd backend

# Activate virtual environment
python

# Run migrations
from flask_migrate import upgrade
upgrade()

# Seed test data (if available)
from utils.seed_data import seed_db
seed_db()

exit()
```

### Clear Backend Cache

```bash
# Remove Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Or in Windows PowerShell:
Get-ChildItem -Recurse -Filter __pycache__ | Remove-Item -Recurse -Force
```

### Restart Frontend Dev Server

```bash
# In frontend terminal, press Ctrl+C to stop
# Then run again:
npm run dev
```

### Check Running Ports

```bash
# macOS/Linux:
lsof -i :5000
lsof -i :5173

# Windows PowerShell:
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (port 5000)**:
```bash
# Kill process using port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows PowerShell:
$pid = (Get-NetTCPConnection -LocalPort 5000).OwningProcess
Stop-Process -Id $pid -Force
```

**Frontend (port 5173)**:
```bash
# Change port in vite.config.js:
export default {
  server: {
    port: 5174  // Use different port
  }
}
```

### Database Connection Error

**Check MySQL is running**:
```bash
# Windows - check services
services.msc

# Or start MySQL from XAMPP/WAMP control panel
```

**Verify database exists**:
```bash
mysql -u root -p
> SHOW DATABASES;
> USE academic_data_management;
```

### CORS Error in Browser

1. Ensure backend is running on port 5000
2. Check frontend URL in CORS origins (app.py)
3. Clear browser cache (Cmd+Shift+Delete or Ctrl+Shift+Delete)
4. Check browser console for exact error

### Login Not Working

1. Verify backend is running
2. Check credentials in test users (above)
3. Verify database has test users
4. Check browser console for 401/403 errors
5. Clear browser cookies and try again

---

## 📊 Verify Everything is Working

### Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Can access login page
- [ ] Can login with admin credentials
- [ ] See admin dashboard with statistics
- [ ] Can see admin menu options
- [ ] Can switch between different roles
- [ ] No red errors in browser console
- [ ] No red errors in backend terminal

---

## 📚 Documentation Files

Read these files for complete information:

1. **BACKEND_API_DOCUMENTATION.md** - All API endpoints explained
2. **BACKEND_API_TESTING_GUIDE.md** - How to test each endpoint
3. **BACKEND_API_IMPLEMENTATION_SUMMARY.md** - Implementation details
4. **frontend/README.md** - Frontend specific information

---

## 🔐 Security Notes

### Development
- Credentials in code are for testing only
- Change SECRET_KEY before production
- Don't expose database URL in code

### Production (When Ready)
- Use environment variables for secrets
- Set HTTPS for all endpoints
- Use strong passwords for all accounts
- Enable CSRF protection
- Set secure cookie flags
- Use production WSGI server (Gunicorn)

---

## 🆘 Need Help?

### Check Logs

**Backend Logs**:
```bash
# Flask shows logs in terminal
# Look for SQL queries if database issue
```

**Frontend Logs**:
```bash
# Open browser DevTools (F12)
# Check Console tab for JavaScript errors
# Check Network tab for API calls
```

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Connection refused` | Backend not running | Start backend with `python app.py` |
| `CORS error` | Frontend/backend mismatch | Check ports 5000/5173 |
| `Database error` | MySQL not running | Start MySQL server |
| `401 Unauthorized` | Not logged in | Clear cookies, login again |
| `403 Forbidden` | Wrong role | Use correct demo credentials |

---

## 📞 Quick Commands Reference

```bash
# Backend
python app.py                 # Start backend
pip install -r requirements.txt  # Install deps
flask db upgrade              # Run migrations

# Frontend
npm run dev                   # Start frontend
npm install                   # Install deps
npm run build                 # Build for production

# Database
mysql -u root -p              # Connect to MySQL
# Then: SHOW DATABASES; USE academic_data_management;
```

---

## 🎯 Next Steps

1. **Explore Admin Features**
   - Login as admin
   - View dashboard statistics
   - Try maintenance mode toggle
   - Create a backup

2. **Explore HOD Features**
   - Login as HOD user
   - View departmental data
   - Filter by semester

3. **Explore Staff Features**
   - Login as staff user
   - View allocated subjects
   - Submit marks (don't save without confirmation)

4. **Test API Directly**
   - Use cURL or Postman
   - Follow endpoints in API documentation
   - Test different roles

5. **Deploy (When Ready)**
   - Set up production database
   - Configure environment variables
   - Use production WSGI server
   - Enable HTTPS

---

## ✨ Features at a Glance

| Feature | Admin | HOD | Staff |
|---------|-------|-----|-------|
| Dashboard | ✅ | ✅ | ✅ |
| View Statistics | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| Allocations | ✅ | ✅ | ✅ |
| Attendance | ✅ | ✅ | ✅ |
| CIE Marks | ✅ | ✅ | ✅ |
| Reports | ✅ | ✅ | ✅ |
| Backup/Restore | ✅ | ❌ | ❌ |
| Maintenance Mode | ✅ | ❌ | ❌ |

---

## 🎉 You're All Set!

Everything is now set up and ready to use. The application includes:

✅ Complete React frontend with 4 dashboards
✅ Full Flask backend with 20 JSON APIs
✅ Role-based access control (admin, hod, staff)
✅ Database integration with MySQL
✅ File upload/download functionality
✅ PDF report generation
✅ Session-based authentication
✅ CORS enabled for frontend

**Happy exploring! 🚀**

For detailed information, check the documentation files or reach out for support.

