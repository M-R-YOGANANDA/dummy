# Backend API Documentation

## Overview
This document describes all JSON API endpoints created for the React frontend. The backend uses Flask with SQLAlchemy ORM and Flask-Login for session management.

**Base URL**: `http://localhost:5000`
**Frontend URL**: `http://localhost:5173` (Vite dev server)

---

## Authentication Endpoints

### 1. Login
- **Route**: `POST /api/login`
- **Description**: Authenticate user with username and password
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Success Response (200)**:
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
- **Error Response (401/503)**:
  ```json
  {
    "success": false,
    "message": "Invalid credentials" 
  }
  ```
- **Notes**:
  - If maintenance mode is enabled for non-admin users, returns 503 status
  - Sets Flask-Login session cookie

### 2. Logout
- **Route**: `GET /api/logout` or `POST /api/logout`
- **Description**: Clear user session
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### 3. Current User
- **Route**: `GET /api/current-user`
- **Description**: Get currently authenticated user info
- **Success Response (200)**:
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
- **Error Response (401)**: Returns 401 if not authenticated

---

## Admin Routes (`/admin/api/`)

**Authorization**: `@role_required("admin")` decorator

### 1. Dashboard Statistics
- **Route**: `GET /admin/api/dashboard-stats`
- **Description**: Get admin dashboard statistics
- **Response (200)**:
  ```json
  {
    "hodCount": 5,
    "studentsCount": 250,
    "staffCount": 45,
    "branchCount": 3
  }
  ```

### 2. Get Maintenance Mode Status
- **Route**: `GET /admin/api/get-maintenance`
- **Description**: Check if system is in maintenance mode
- **Response (200)**:
  ```json
  {
    "enabled": false
  }
  ```

### 3. Set Maintenance Mode
- **Route**: `POST /admin/api/set-maintenance`
- **Description**: Enable/disable maintenance mode
- **Request Body**:
  ```json
  {
    "enabled": true
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "enabled": true
  }
  ```

### 4. Get Report Options
- **Route**: `GET /admin/api/get-report-options`
- **Description**: Get available filters for report generation
- **Response (200)**:
  ```json
  {
    "years": [2024, 2023, 2022],
    "branches": [
      {"id": 1, "name": "Computer Science"},
      {"id": 2, "name": "Electronics"}
    ],
    "semesters": [1, 2, 3, 4, 5, 6, 7, 8]
  }
  ```

### 5. Download Report
- **Route**: `GET /admin/api/download-report`
- **Query Parameters**:
  - `type`: "attendance" or "cie"
  - `year`: Academic year (e.g., "2024")
  - `branch`: Branch ID
  - `semester`: Semester number (1-8)
- **Description**: Generate and download PDF report
- **Response**: PDF file attachment
- **Example**: `/admin/api/download-report?type=attendance&year=2024&branch=1&semester=3`

### 6. Backup Data
- **Route**: `POST /admin/api/backup-data`
- **Description**: Create Excel backup of entire database
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Backup created: Backup_2024-01-15_10-30-45.xlsx"
  }
  ```
- **Notes**: Saves to `C:\Users\yogan\Desktop\projectbackup\`

### 7. Upload Backup
- **Route**: `POST /admin/api/upload-backup`
- **Description**: Restore from backup file
- **Request**: Multipart form data with 'file' field
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Backup restored from Backup_2024-01-15.xlsx"
  }
  ```

---

## HOD Routes (`/hod/api/`)

**Authorization**: `@login_required` decorator with HOD role verification

### 1. Dashboard
- **Route**: `GET /hod/api/dashboard`
- **Description**: Get HOD dashboard statistics
- **Response (200)**:
  ```json
  {
    "totalSubjects": 12,
    "totalStudents": 150,
    "closedAllocationWindows": false,
    "closedCIEWindows": false
  }
  ```

### 2. Allocation Data
- **Route**: `GET /hod/api/allocation-data`
- **Query Parameters**:
  - `semester`: Semester number (1-8, default: "1")
- **Description**: Get staff allocations for the department
- **Response (200)**:
  ```json
  {
    "allocations": [
      {
        "class": "1st Semester CSE",
        "subject": "Java Programming",
        "staff": "Prof. John Doe",
        "allocationId": 1
      },
      ...
    ]
  }
  ```

### 3. Attendance Data
- **Route**: `GET /hod/api/attendance-data`
- **Query Parameters**:
  - `semester`: Semester number (default: "1")
- **Description**: Get attendance records for the department
- **Response (200)**:
  ```json
  {
    "attendance": [
      {
        "id": 1,
        "studentName": "John Smith",
        "usn": "1CR19CS001",
        "subject": "Java Programming",
        "percentage": 85.5,
        "class": "1st Semester CSE"
      },
      ...
    ]
  }
  ```

### 4. CIE Data
- **Route**: `GET /hod/api/cie-data`
- **Query Parameters**:
  - `semester`: Semester number (default: "1")
- **Description**: Get CIE (Continuous Internal Evaluation) marks for the department
- **Response (200)**:
  ```json
  {
    "cieData": [
      {
        "id": 1,
        "studentName": "John Smith",
        "usn": "1CR19CS001",
        "subject": "Java Programming",
        "marks": 28,
        "class": "1st Semester CSE"
      },
      ...
    ]
  }
  ```

---

## Staff Routes (`/staff/api/`)

**Authorization**: `@login_required` decorator with staff role verification

### 1. Dashboard
- **Route**: `GET /staff/api/dashboard`
- **Description**: Get staff dashboard overview
- **Response (200)**:
  ```json
  {
    "totalAllocations": 4,
    "totalStudents": 85,
    "attendanceWindowOpen": true,
    "cieWindowOpen": false
  }
  ```

### 2. Allocation Students
- **Route**: `GET /staff/api/allocation-students`
- **Query Parameters**:
  - `allocationId`: ID of the staff allocation (required)
- **Description**: Get list of students for a specific allocation
- **Response (200)**:
  ```json
  {
    "allocationId": 5,
    "subjectName": "Database Management Systems",
    "students": [
      {
        "studentId": 1,
        "name": "John Smith",
        "usn": "1CR19CS001",
        "registerNo": "001"
      },
      ...
    ]
  }
  ```

### 3. Submit Attendance
- **Route**: `POST /staff/api/submit-attendance`
- **Description**: Submit attendance marks for a class
- **Request Body**:
  ```json
  {
    "allocationId": 5,
    "records": [
      {
        "studentId": 1,
        "percentage": 92.5
      },
      {
        "studentId": 2,
        "percentage": 85.0
      }
    ]
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Attendance submitted"
  }
  ```

### 4. Submit CIE Marks
- **Route**: `POST /staff/api/submit-cie-marks`
- **Description**: Submit CIE marks for a class
- **Request Body**:
  ```json
  {
    "allocationId": 5,
    "cieNumber": 1,
    "records": [
      {
        "studentId": 1,
        "marks": 28
      },
      {
        "studentId": 2,
        "marks": 25
      }
    ]
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "CIE marks submitted"
  }
  ```

### 5. Upload Bulk Marks
- **Route**: `POST /staff/api/upload-bulk-marks`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: Excel or CSV file
  - `allocationId`: ID of the allocation
  - `type`: "attendance" or "cie"
  - `cieNumber`: CIE number (if type is "cie")
- **Description**: Upload marks from Excel/CSV file
- **Expected File Format (Attendance)**:
  ```
  student_id | attendance_percentage
  1          | 92.5
  2          | 85.0
  ```
- **Expected File Format (CIE)**:
  ```
  student_id | cie_marks
  1          | 28
  2          | 25
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Uploaded 45 records successfully"
  }
  ```

### 6. Generate Report
- **Route**: `POST /staff/api/generate-report`
- **Description**: Generate PDF report for an allocation
- **Request Body**:
  ```json
  {
    "allocationId": 5
  }
  ```
- **Response**: PDF file attachment
- **Notes**: Includes attendance percentages and CIE marks

---

## Error Handling

All endpoints follow standard HTTP status codes:

- **200**: Success
- **400**: Bad Request (missing/invalid parameters)
- **401**: Unauthorized (not authenticated)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error
- **503**: Service Unavailable (maintenance mode for non-admin users)

Error Response Format:
```json
{
  "error": "Description of the error",
  "status": 400
}
```

---

## CORS Configuration

The Flask app is configured with CORS to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:5174` (Alternative port)

All responses include proper CORS headers for credential-based requests.

---

## Testing Guide

### Using cURL

**Login**:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  -c cookies.txt
```

**Get Current User**:
```bash
curl -X GET http://localhost:5000/api/current-user \
  -b cookies.txt
```

**Admin Dashboard Stats**:
```bash
curl -X GET http://localhost:5000/admin/api/dashboard-stats \
  -b cookies.txt
```

### Using Postman

1. **Create a new Collection**: "Academic Management API"
2. **Add requests** with pre-request scripts to handle login
3. **Use environment variables** for base URL and user credentials
4. **Test with different roles**: admin, hod, staff

### Using Frontend (React)

The frontend automatically handles:
- Calling `/api/current-user` on app initialization
- Redirecting to login if not authenticated
- Error handling and user feedback
- Automatic cookie transmission with requests

---

## Database Models Used

### Core Models:
- **User**: User accounts with role-based access (id, username, email, role_id)
- **Role**: User roles (admin, hod, staff)
- **Student**: Student records (student_id, usn, name, class_id)
- **Class**: Classes/sections (class_id, class_name, semester, branch_id)
- **Subject**: Subjects (subject_id, subject_name, branch_id)
- **StaffAllocation**: Staff-subject-class mappings
- **Attendance**: Student attendance records (percentage)
- **CIEMarks**: Continuous evaluation marks
- **CIEConfig**: CIE configuration (max_marks per CIE)
- **Branch**: Departments/branches
- **Control**: Window controls (allocation, attendance, CIE enabled/disabled)
- **MaintenanceMode**: System maintenance flag

---

## Important Notes

1. **Session Management**: Uses Flask-Login with browser cookies. Ensure cookies are enabled.
2. **Timestamps**: All datetime fields use ISO 8601 format.
3. **Decimal Values**: Marks and percentages are returned as float values.
4. **File Paths**: Backup files stored at `C:\Users\yogan\Desktop\projectbackup\`
5. **Role IDs**: Admin=1, HOD=2, Staff=3
6. **Pagination**: Not implemented; consider adding for large datasets.

---

## Recent Changes (Phase 2)

1. **Added CORS Support**: Enabled cross-origin requests from React frontend
2. **Created JSON API Endpoints**: All authentication and role-based endpoints now return JSON instead of HTML
3. **Maintained Backward Compatibility**: Existing HTML routes still work for legacy support
4. **Integrated Session Management**: Flask-Login properly initialized with load_user callback
5. **Added Role-Based Authorization**: Decorators ensure proper access control

---

## Next Steps (Optional Enhancements)

- [ ] Add pagination to list endpoints
- [ ] Implement request validation with marshmallow
- [ ] Add comprehensive error logging
- [ ] Implement rate limiting
- [ ] Add API versioning (v1, v2)
- [ ] Create API token authentication (JWT) as alternative to sessions
- [ ] Add request/response caching
- [ ] Implement batch operations for bulk updates

---

## Support

For issues or questions:
1. Check the error message in the response
2. Verify authentication status with `/api/current-user`
3. Check Flask server logs for detailed error traces
4. Ensure database is properly initialized with migrations
