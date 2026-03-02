# API Testing Script for Backend

$BaseURL = "http://127.0.0.1:5000"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BACKEND API TESTING SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ========================================
# TEST 1: Login as Admin
# ========================================
Write-Host "`n=== TEST 1: LOGIN AS ADMIN ===" -ForegroundColor Yellow
$body = @{
    username = "admin"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 2: Get Current User
# ========================================
Write-Host "`n=== TEST 2: GET CURRENT USER ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/current-user" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 3: Admin Dashboard Stats
# ========================================
Write-Host "`n=== TEST 3: ADMIN DASHBOARD STATS ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/admin/api/dashboard-stats" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 4: Get Maintenance Status
# ========================================
Write-Host "`n=== TEST 4: GET MAINTENANCE STATUS ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/admin/api/get-maintenance" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 5: Login as HOD
# ========================================
Write-Host "`n=== TEST 5: LOGIN AS HOD ===" -ForegroundColor Yellow
$body = @{
    username = "hod1"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 6: HOD Dashboard
# ========================================
Write-Host "`n=== TEST 6: HOD DASHBOARD ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/hod/api/dashboard" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 7: Login as Staff
# ========================================
Write-Host "`n=== TEST 7: LOGIN AS STAFF ===" -ForegroundColor Yellow
$body = @{
    username = "staff1"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 8: Staff Dashboard
# ========================================
Write-Host "`n=== TEST 8: STAFF DASHBOARD ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/staff/api/dashboard" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 9: Get Report Options
# ========================================
Write-Host "`n=== TEST 9: GET REPORT OPTIONS ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/admin/api/get-report-options" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# ========================================
# TEST 10: Logout
# ========================================
Write-Host "`n=== TEST 10: LOGOUT ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/api/logout" `
        -Method POST `
        -ContentType "application/json" `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
