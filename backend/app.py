from flask import Flask
from config.config import Config
from flask_migrate import Migrate
from flask_cors import CORS
# 1. NEW IMPORT: Get login_manager from extensions
from extensions import db, login_manager 

# Route Imports
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.hod_routes import hod_bp
from routes.staff_routes import staff_bp

# Model Imports (kept as you had them)
from models.user import User
from models.class_model import Class
from models.batch import Batch
from models.student import Student
from models.staff_allocation import StaffAllocation
from models.attendance import Attendance
from models.cie_config import CIEConfig
from models.cie_marks import CIEMarks
from models.cie_papers import CIEPapers
from models.backup_log import BackupLog
from models.role import Role
from models.branch import Branch
from models.control import Control
from models.subjects import Subject   # Importing the subjects model to ensure it's registered with SQLAlchemy

migrate = Migrate()

def seed_test_data():
    """Initialize database with test data"""
    # Check if data already exists
    if User.query.first():
        return  # Data already seeded
    
    # Create roles
    admin_role = Role(role_id=1, role_name="admin")
    hod_role = Role(role_id=2, role_name="hod")
    staff_role = Role(role_id=3, role_name="staff")
    
    db.session.add_all([admin_role, hod_role, staff_role])
    db.session.commit()
    
    # Create test users
    from werkzeug.security import generate_password_hash
    
    admin = User(
        user_id=1,
        username="admin",
        password_hash=generate_password_hash("password123"),
        role_id=1,
        name="Admin User",
        email="admin@example.com",
        is_active=True
    )
    
    hod = User(
        user_id=2,
        username="hod1",
        password_hash=generate_password_hash("password123"),
        role_id=2,
        branch_id=1,
        name="HOD User",
        email="hod@example.com",
        is_active=True
    )
    
    staff = User(
        user_id=3,
        username="staff1",
        password_hash=generate_password_hash("password123"),
        role_id=3,
        branch_id=1,
        name="Staff User",
        email="staff@example.com",
        is_active=True
    )
    
    db.session.add_all([admin, hod, staff])
    db.session.commit()
    
    # Create branch
    branch = Branch(branch_id=1, branch_code="CSE", branch_name="Computer Science")
    db.session.add(branch)
    db.session.commit()
    
    # Create maintenance mode record
    from models.maintain import MaintenanceMode
    maintenance = MaintenanceMode(id=1, is_maintenance=False)
    db.session.add(maintenance)
    db.session.commit()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend with proper credentials support
    CORS(app, 
         supports_credentials=True, 
         origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
         allow_headers=["Content-Type", "Authorization"],
         expose_headers=["Content-Type"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # 2. NEW CODE: Initialize Login Manager
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login' # Where to go if not logged in

    # 3. NEW CODE: User Loader Function
    @login_manager.user_loader
    def load_user(user_id):
        # Use db.session.get() instead of User.query.get() to fix the warning
        return db.session.get(User, int(user_id))

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(hod_bp)
    app.register_blueprint(staff_bp)

    # Create database tables and seed data
    with app.app_context():
        db.create_all()
        seed_test_data()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
