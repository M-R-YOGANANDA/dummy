import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/Layout';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await login(username, password);
      // Redirect based on user role
      const role = response.user?.role?.toLowerCase();
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'hod') navigate('/hod/dashboard');
      else if (role === 'staff') navigate('/staff/dashboard');
      else navigate('/');
    } catch (err) {
      setErrors({ form: 'Invalid username or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-12 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-900 rounded-lg text-white text-4xl mb-4">
            🏛️
          </div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Academic Data Management</h1>
          <p className="text-slate-600 text-sm">Secure Role-Based Access</p>
        </div>

        {/* Alerts */}
        {authError && <Alert type="error" message={authError} />}
        {errors.form && <Alert type="error" message={errors.form} />}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: '' });
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none ${
                errors.username
                  ? 'border-error bg-red-50 focus:border-error'
                  : 'border-slate-300 bg-slate-50 focus:border-success focus:bg-white'
              }`}
              placeholder="Enter your username"
              disabled={loading}
            />
            {errors.username && <p className="text-error text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none ${
                  errors.password
                    ? 'border-error bg-red-50 focus:border-error'
                    : 'border-slate-300 bg-slate-50 focus:border-success focus:bg-white'
                }`}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl hover:opacity-60 transition-opacity"
                disabled={loading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-900 text-white font-semibold rounded-lg hover:bg-primary-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{loading ? 'Logging in...' : 'Login'}</span>
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">Authorized users only</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}
