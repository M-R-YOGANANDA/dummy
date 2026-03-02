# Backend API Testing - Complete Curl Commands

## BASE URL
BASE_URL="http://127.0.0.1:5000"

## ========================================
## AUTHENTICATION ENDPOINTS
## ========================================

### 1. Login as Admin
curl -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

### 2. Login as HOD
curl -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"hod1","password":"password123"}'

### 3. Login as Staff
curl -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"staff1","password":"password123"}'

### 4. Get Current User (Authenticated)
curl -X GET "$BASE_URL/api/current-user" \
  -H "Content-Type: application/json"

### 5. Logout
curl -X POST "$BASE_URL/api/logout" \
  -H "Content-Type: application/json"

## ========================================
## ADMIN ENDPOINTS
## ========================================

### 6. Get Admin Dashboard Stats
curl -X GET "$BASE_URL/admin/api/dashboard-stats" \
  -H "Content-Type: application/json"

### 7. Get Maintenance Status
curl -X GET "$BASE_URL/admin/api/get-maintenance" \
  -H "Content-Type: application/json"

### 8. Set Maintenance Mode (POST)
curl -X POST "$BASE_URL/admin/api/set-maintenance" \
  -H "Content-Type: application/json" \
  -d '{"is_maintenance":true}'

### 9. Get Report Options
curl -X GET "$BASE_URL/admin/api/get-report-options" \
  -H "Content-Type: application/json"

### 10. Download Report
curl -X GET "$BASE_URL/admin/api/download-report" \
  -H "Content-Type: application/json"

### 11. Backup Data
curl -X POST "$BASE_URL/admin/api/backup-data" \
  -H "Content-Type: application/json"

### 12. Upload Backup (Form Data with file)
curl -X POST "$BASE_URL/admin/api/upload-backup" \
  -F "file=@path/to/backup/file"

## ========================================
## HOD ENDPOINTS
## ========================================

### 13. Get HOD Dashboard
curl -X GET "$BASE_URL/hod/api/dashboard" \
  -H "Content-Type: application/json"

### 14. Get HOD Allocation Data
curl -X GET "$BASE_URL/hod/api/allocation-data" \
  -H "Content-Type: application/json"

### 15. Get HOD Attendance Data
curl -X GET "$BASE_URL/hod/api/attendance-data" \
  -H "Content-Type: application/json"

### 16. Get HOD CIE Data
curl -X GET "$BASE_URL/hod/api/cie-data" \
  -H "Content-Type: application/json"

## ========================================
## STAFF ENDPOINTS
## ========================================

### 17. Get Staff Dashboard
curl -X GET "$BASE_URL/staff/api/dashboard" \
  -H "Content-Type: application/json"

### 18. Get Staff Allocation Students
curl -X GET "$BASE_URL/staff/api/allocation-students" \
  -H "Content-Type: application/json"

### 19. Submit Attendance (POST)
curl -X POST "$BASE_URL/staff/api/submit-attendance" \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": 1,
    "subject": "Mathematics",
    "attendance_data": {
      "USN001": "present",
      "USN002": "absent"
    }
  }'

### 20. Submit CIE Marks (POST)
curl -X POST "$BASE_URL/staff/api/submit-cie-marks" \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": 1,
    "subject": "Mathematics",
    "marks_data": {
      "USN001": 85,
      "USN002": 75
    }
  }'

### 21. Upload Bulk Marks (POST)
curl -X POST "$BASE_URL/staff/api/upload-bulk-marks" \
  -F "file=@path/to/marks/file.xlsx"

### 22. Generate Report (POST)
curl -X POST "$BASE_URL/staff/api/generate-report" \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": 1,
    "report_type": "attendance"
  }'

## ========================================
## QUICK TEST SUMMARY
## ========================================

Test Credentials:
- Admin: admin / password123
- HOD: hod1 / password123
- Staff: staff1 / password123

API Status:
✅ Authentication (Login/Logout) - Working
✅ Admin APIs - Working
✅ HOD APIs - Working
✅ Staff APIs - Working

All 20+ API endpoints are functional and ready for testing!
