# Backend API Testing Guide

## Quick Start

### 1. Prerequisites
Ensure you have:
- Flask backend running on `http://localhost:5000`
- React frontend running on `http://localhost:5173`
- MySQL database initialized and populated with test data
- All Python dependencies installed

### 2. Test User Credentials

Use these credentials for testing different roles:

```
Admin User:
- Username: admin
- Password: password123
- Role: Admin

HOD User:
- Username: hod1
- Password: password123
- Role: HOD

Staff User:
- Username: staff1
- Password: password123
- Role: Staff
```

---

## Testing Methods

### Method 1: Using Frontend (React)

1. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser**: Navigate to `http://localhost:5173`

3. **Test Login**:
   - Click "Login"
   - Enter credentials (e.g., admin/password123)
   - Verify redirect to dashboard

4. **Test Role-Specific Features**:
   - Admin: View statistics, set maintenance mode, backup data
   - HOD: View allocation, attendance, CIE data
   - Staff: Submit marks, upload bulk marks, generate reports

### Method 2: Using cURL

**1. Login and Save Session**:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  -c cookies.txt -v
```

Expected Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**2. Get Current User**:
```bash
curl -X GET http://localhost:5000/api/current-user \
  -b cookies.txt
```

Expected Response:
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**3. Admin Endpoints**:

Get Dashboard Stats:
```bash
curl -X GET http://localhost:5000/admin/api/dashboard-stats \
  -b cookies.txt
```

Get Report Options:
```bash
curl -X GET http://localhost:5000/admin/api/get-report-options \
  -b cookies.txt
```

Set Maintenance Mode:
```bash
curl -X POST http://localhost:5000/admin/api/set-maintenance \
  -H "Content-Type: application/json" \
  -d '{"enabled":true}' \
  -b cookies.txt
```

Create Backup:
```bash
curl -X POST http://localhost:5000/admin/api/backup-data \
  -b cookies.txt
```

Download Report:
```bash
curl -X GET "http://localhost:5000/admin/api/download-report?type=attendance&year=2024&branch=1&semester=1" \
  -b cookies.txt \
  -o report.pdf
```

**4. HOD Endpoints**:

Get Dashboard:
```bash
curl -X GET http://localhost:5000/hod/api/dashboard \
  -b cookies.txt
```

Get Allocations:
```bash
curl -X GET "http://localhost:5000/hod/api/allocation-data?semester=1" \
  -b cookies.txt
```

Get Attendance Data:
```bash
curl -X GET "http://localhost:5000/hod/api/attendance-data?semester=1" \
  -b cookies.txt
```

Get CIE Data:
```bash
curl -X GET "http://localhost:5000/hod/api/cie-data?semester=1" \
  -b cookies.txt
```

**5. Staff Endpoints**:

Get Dashboard:
```bash
curl -X GET http://localhost:5000/staff/api/dashboard \
  -b cookies.txt
```

Get Allocation Students:
```bash
curl -X GET "http://localhost:5000/staff/api/allocation-students?allocationId=1" \
  -b cookies.txt
```

Submit Attendance:
```bash
curl -X POST http://localhost:5000/staff/api/submit-attendance \
  -H "Content-Type: application/json" \
  -d '{
    "allocationId": 1,
    "records": [
      {"studentId": 1, "percentage": 92.5},
      {"studentId": 2, "percentage": 85.0}
    ]
  }' \
  -b cookies.txt
```

Submit CIE Marks:
```bash
curl -X POST http://localhost:5000/staff/api/submit-cie-marks \
  -H "Content-Type: application/json" \
  -d '{
    "allocationId": 1,
    "cieNumber": 1,
    "records": [
      {"studentId": 1, "marks": 28},
      {"studentId": 2, "marks": 25}
    ]
  }' \
  -b cookies.txt
```

Upload Bulk Marks (Excel):
```bash
curl -X POST http://localhost:5000/staff/api/upload-bulk-marks \
  -F "file=@marks.xlsx" \
  -F "allocationId=1" \
  -F "type=attendance" \
  -b cookies.txt
```

Generate Report:
```bash
curl -X POST http://localhost:5000/staff/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{"allocationId": 1}' \
  -b cookies.txt \
  -o report.pdf
```

**6. Logout**:
```bash
curl -X POST http://localhost:5000/api/logout \
  -b cookies.txt
```

### Method 3: Using Postman

#### Step 1: Import Collection

Create a new Postman collection with these requests:

**Authentication**
- `POST /api/login` - Login
- `GET /api/current-user` - Check current user
- `POST /api/logout` - Logout

**Admin APIs**
- `GET /admin/api/dashboard-stats` - Dashboard stats
- `GET /admin/api/get-maintenance` - Get maintenance status
- `POST /admin/api/set-maintenance` - Set maintenance mode
- `GET /admin/api/get-report-options` - Report options
- `GET /admin/api/download-report` - Download report
- `POST /admin/api/backup-data` - Create backup
- `POST /admin/api/upload-backup` - Restore backup

**HOD APIs**
- `GET /hod/api/dashboard` - Dashboard
- `GET /hod/api/allocation-data` - Allocations
- `GET /hod/api/attendance-data` - Attendance
- `GET /hod/api/cie-data` - CIE marks

**Staff APIs**
- `GET /staff/api/dashboard` - Dashboard
- `GET /staff/api/allocation-students` - Students
- `POST /staff/api/submit-attendance` - Submit attendance
- `POST /staff/api/submit-cie-marks` - Submit CIE
- `POST /staff/api/upload-bulk-marks` - Upload bulk
- `POST /staff/api/generate-report` - Generate report

#### Step 2: Setup Environment

Create a Postman environment with:
```json
{
  "base_url": "http://localhost:5000",
  "username": "admin",
  "password": "password123",
  "allocation_id": "1",
  "semester": "1"
}
```

#### Step 3: Setup Pre-request Script

Add this to collection pre-request script:
```javascript
// Login first if not already logged in
if (!pm.environment.get("authToken")) {
  pm.sendRequest({
    url: pm.environment.get("base_url") + "/api/login",
    method: "POST",
    header: {
      "Content-Type": "application/json"
    },
    body: {
      mode: "raw",
      raw: JSON.stringify({
        username: pm.environment.get("username"),
        password: pm.environment.get("password")
      })
    }
  }, (err, response) => {
    if (response.code === 200) {
      const data = response.json();
      pm.environment.set("userId", data.user.id);
    }
  });
}
```

---

## Test Scenarios

### Scenario 1: Admin User Testing

```
1. Login as admin
   ✓ Dashboard loads with statistics
   ✓ Can view maintenance status
   ✓ Can enable/disable maintenance
   ✓ Can see report options
   ✓ Can create backups
   ✓ Can see all users and roles
```

### Scenario 2: HOD User Testing

```
1. Login as HOD
   ✓ Dashboard shows department stats
   ✓ Can view staff allocations by semester
   ✓ Can see attendance data
   ✓ Can see CIE marks
   ✓ Data filtered by department only
```

### Scenario 3: Staff User Testing

```
1. Login as staff
   ✓ Dashboard shows allocated subjects
   ✓ Can view students for each allocation
   ✓ Can submit attendance marks
   ✓ Can submit CIE marks
   ✓ Can upload bulk marks from file
   ✓ Can generate PDF report
```

### Scenario 4: Maintenance Mode Testing

```
1. Admin enables maintenance
2. Non-admin tries to access endpoints
   ✓ Returns 503 Service Unavailable
3. Admin can still access all features
4. Log in new sessions should be blocked for non-admin
```

### Scenario 5: Authorization Testing

```
1. Staff user tries to access /hod/api/dashboard
   ✓ Gets 403 Forbidden
2. HOD tries to access /admin/api/dashboard-stats
   ✓ Gets 403 Forbidden
3. Non-authenticated user tries API
   ✓ Gets 401 Unauthorized
```

---

## Common Issues & Solutions

### Issue: CORS Error
**Problem**: `Access to XMLHttpRequest blocked by CORS policy`
**Solution**:
1. Ensure Flask app has CORS enabled
2. Check origins in `app.py`: `CORS(app, supports_credentials=True, origins=[...])`
3. Verify frontend URL matches allowed origins

### Issue: 401 Unauthorized
**Problem**: Endpoints return 401 even with valid credentials
**Solution**:
1. Verify login was successful
2. Check if session cookie is being sent
3. In cURL, use `-c` and `-b` flags for cookie handling
4. In Postman, ensure "Cookie" header is sent with requests

### Issue: 403 Forbidden
**Problem**: User authenticated but cannot access endpoint
**Solution**:
1. Verify user has the correct role
2. Check role decorators in route files
3. Confirm user's role_id matches expected role (admin=1, hod=2, staff=3)

### Issue: Database Errors
**Problem**: Error messages about missing tables
**Solution**:
1. Run migrations: `flask db upgrade`
2. Seed test data: `python -c "from utils.seed_data import seed_db; seed_db()"`
3. Verify database connection in `config/config.py`

### Issue: File Upload Failures
**Problem**: File upload returns error
**Solution**:
1. Check file format (Excel or CSV)
2. Verify backup directory exists: `C:\Users\yogan\Desktop\projectbackup\`
3. Check file size (no limit set, but reasonable is recommended)
4. Use correct form field name: "file"

---

## Performance Testing

### Simple Load Test with Apache Bench

```bash
# Test dashboard endpoint 100 times with 5 concurrent users
ab -n 100 -c 5 -b cookies.txt http://localhost:5000/admin/api/dashboard-stats
```

### Using Apache JMeter

1. Create thread group with:
   - Number of threads: 10
   - Ramp-up: 5 seconds
   - Loop count: 10

2. Add HTTP Request:
   - URL: http://localhost:5000/admin/api/dashboard-stats
   - Method: GET

3. Add Cookie Manager and Assertions

---

## Integration Testing

### Test Login Flow

```bash
#!/bin/bash

# 1. Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  -c cookies.txt

# 2. Verify current user
curl -X GET http://localhost:5000/api/current-user \
  -b cookies.txt

# 3. Access protected resource
curl -X GET http://localhost:5000/admin/api/dashboard-stats \
  -b cookies.txt

# 4. Logout
curl -X POST http://localhost:5000/api/logout \
  -b cookies.txt

# 5. Verify no access without session
curl -X GET http://localhost:5000/admin/api/dashboard-stats \
  -b cookies.txt
```

### Test Role-Based Access

```bash
#!/bin/bash

# Test with staff user
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"staff1","password":"password123"}' \
  -c staff_cookies.txt

# Try to access admin endpoint (should get 403)
curl -X GET http://localhost:5000/admin/api/dashboard-stats \
  -b staff_cookies.txt
```

---

## Frontend Integration Checklist

- [ ] Auth context properly receives login response
- [ ] Current user API called on app initialization
- [ ] Auth context properly handles logout
- [ ] Admin dashboard receives and displays stats
- [ ] HOD dashboard filters data by department
- [ ] Staff can submit attendance without errors
- [ ] Staff can submit CIE marks without errors
- [ ] Bulk upload processes files correctly
- [ ] PDF reports generate and download
- [ ] Maintenance mode warning shows for non-admin
- [ ] Proper error messages display on failures
- [ ] Unauthorized access redirects to login
- [ ] Session expires properly

---

## Debugging Tips

### Enable Flask Debug Mode
```python
# In app.py
app.run(debug=True)
```

### Enable SQL Query Logging
```python
# In config.py
app.config['SQLALCHEMY_ECHO'] = True
```

### Check Database State
```bash
# Connect to MySQL
mysql -u username -p academic_data_management

# Verify tables
SHOW TABLES;

# Check User table
SELECT * FROM user;

# Check Role table
SELECT * FROM role;
```

### Monitor Request/Response
Use browser DevTools:
1. Open Console tab
2. Go to Network tab
3. Make API requests
4. Check request headers and response body

---

## Next Steps After Testing

1. **All basic tests pass**: ✓ Ready for frontend integration
2. **Role-based tests pass**: ✓ Authorization working correctly
3. **File upload tests pass**: ✓ Bulk operations functional
4. **PDF generation works**: ✓ Export features ready
5. **Performance acceptable**: ✓ Ready for production

---

## Support Files

- **Backend API Documentation**: `BACKEND_API_DOCUMENTATION.md`
- **Frontend API Service**: `frontend/src/services/api.js`
- **Frontend Auth Context**: `frontend/src/context/AuthContext.jsx`
- **Backend Routes**: `backend/routes/` (auth, admin, hod, staff routes)

