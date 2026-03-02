from flask import Blueprint, request, render_template, redirect, url_for, session, jsonify
from flask_login import login_user, logout_user, current_user
from services.auth_service import authenticate_user

# --- NEW IMPORT: For Maintenance Check ---
from models.maintain import MaintenanceMode 

# Define the blueprint
auth_bp = Blueprint("auth", __name__)

# =========================================================
# LOGIN ROUTE
# =========================================================
@auth_bp.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # 1. Basic Validation
        if not username or not password:
            return render_template(
                "login.html",
                error="Username and password are required"
            )

        # 2. Authenticate User
        user = authenticate_user(username, password)

        if not user:
            return render_template(
                "login.html",
                error="Invalid username or password"
            )

        # --- MERGED: MAINTENANCE MODE CHECK START ---
        # Fetch the maintenance status (ID 1)
        maintenance = MaintenanceMode.query.get(1)
        
        # If Maintenance is ON (True) and User is NOT Admin (Role ID 1)
        if maintenance and maintenance.is_maintenance:
            if user.role_id != 1:
                return render_template(
                    "login.html", 
                    error="⚠️ System is under maintenance. Please try again later."
                )
        # --- MERGED: MAINTENANCE MODE CHECK END ---

        # 3. Log the user in with Flask-Login (Crucial Step)
        login_user(user)

        # 4. Set Session Variables (Optional, but good for your legacy logic)
        session["user_id"] = user.user_id
        session["role_id"] = user.role_id

        # 5. Role-Based Redirect
        if user.role_id == 1:
            return redirect(url_for("admin.admin_dashboard"))
        elif user.role_id == 2:
            return redirect(url_for("hod.dashboard"))
        elif user.role_id == 3:
            return redirect(url_for("staff.staff_dashboard"))
        else:
            return render_template("login.html", error="Unauthorized role")

    return render_template("login.html")

# =========================================================
# LOGOUT ROUTE
# =========================================================
@auth_bp.route("/logout")
def logout():
    logout_user()      # Tell Flask-Login to wipe the user session
    session.clear()    # Wipe any manual session data you stored
    return redirect(url_for("auth.login"))


# =========================================================
# JSON API ENDPOINTS FOR REACT FRONTEND
# =========================================================

@auth_bp.route("/api/login", methods=["POST"])
def api_login():
    """JSON endpoint for React frontend login"""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = authenticate_user(username, password)

    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    # Check maintenance mode
    maintenance = MaintenanceMode.query.get(1)
    if maintenance and maintenance.is_maintenance:
        if user.role_id != 1:  # Not admin
            return jsonify({"error": "System is under maintenance"}), 503

    # Login user
    login_user(user)
    
    # Get role name
    role_name = user.role.role_name.lower() if user.role else "staff"

    return jsonify({
        "success": True,
        "user": {
            "id": user.user_id,
            "name": user.username,
            "email": getattr(user, "email", ""),
            "role": role_name
        }
    }), 200


@auth_bp.route("/api/logout", methods=["GET", "POST"])
def api_logout():
    """JSON endpoint for React frontend logout"""
    logout_user()
    session.clear()
    return jsonify({"success": True}), 200


@auth_bp.route("/api/current-user", methods=["GET"])
def api_current_user():
    """Get current authenticated user info"""
    if not current_user.is_authenticated:
        return jsonify({"error": "Not authenticated"}), 401
    
    role_name = current_user.role.role_name.lower() if current_user.role else "staff"
    
    return jsonify({
        "user": {
            "id": current_user.user_id,
            "name": current_user.username,
            "email": getattr(current_user, "email", ""),
            "role": role_name
        }
    }), 200