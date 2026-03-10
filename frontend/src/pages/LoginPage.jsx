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
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    setErrors({});
    try {
      const response = await login(username, password);
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0d1b2a',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Left panel */}
      <div style={{
        width: '45%', background: 'linear-gradient(160deg, #0d1b2a 0%, #102340 50%, #0a1e3d 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-90px', right: '-90px',
          width: '380px', height: '380px', borderRadius: '50%',
          border: '2px solid rgba(30,111,197,0.55)', pointerEvents: 'none',
          boxShadow: 'inset 0 0 60px rgba(30,111,197,0.12)'
        }} />
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '260px', height: '260px', borderRadius: '50%',
          border: '2px solid rgba(96,165,250,0.45)', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(30,111,197,0.1) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', top: '-10px', right: '-10px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,111,197,0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '40px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          border: '2px solid rgba(30,111,197,0.4)',
          background: 'radial-gradient(circle, rgba(30,111,197,0.15) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '80px', left: '-30px',
          width: '160px', height: '160px', borderRadius: '50%',
          border: '1.5px solid rgba(96,165,250,0.35)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '68px', height: '68px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #1e6fc5, #0d4fa8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', marginBottom: '28px',
            boxShadow: '0 10px 28px rgba(30,111,197,0.55), 0 0 0 6px rgba(30,111,197,0.18)'
          }}>🎓</div>

          <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#ffffff',
            lineHeight: 1.15, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            CPC Polytechnic
          </h1>
          <h1 style={{ fontSize: '42px', fontWeight: '900', lineHeight: 1.15,
            margin: '0 0 16px', letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #60a5fa, #93c5fd)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text' }}>
            Mysuru
          </h1>
          <div style={{
            width: '48px', height: '3px', borderRadius: '2px',
            background: 'linear-gradient(90deg, #1e6fc5, #60a5fa)',
            marginBottom: '20px'
          }} />
          <p style={{ color: '#8aa3be', fontSize: '15px', lineHeight: 1.7, margin: '0 0 44px', maxWidth: '300px', fontWeight: '400' }}>
            Integrated Academic Management System for staff, faculty and administration.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '📊', text: 'Real-time attendance tracking' },
              { icon: '📝', text: 'CIE marks management' },
              { icon: '🔒', text: 'Role-based secure access' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'rgba(30,111,197,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0
                }}>{item.icon}</div>
                <span style={{ color: '#94b3cc', fontSize: '13px', fontWeight: '500' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, background: '#f0f4f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{
          width: '100%', maxWidth: '400px',
          background: '#ffffff', borderRadius: '16px', padding: '40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          animation: 'slideUp 0.4s ease-out'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0d1b2a', margin: '0 0 6px' }}>
              Welcome back
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              Sign in to your account to continue
            </p>
          </div>

          {authError && <Alert type="error" message={authError} />}
          {errors.form && <Alert type="error" message={errors.form} />}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700',
                color: '#374151', marginBottom: '6px', textTransform: 'uppercase',
                letterSpacing: '0.05em' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); if (errors.username) setErrors({ ...errors, username: '' }); }}
                placeholder="Enter your username"
                disabled={loading}
                style={{
                  width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                  border: `1.5px solid ${errors.username ? '#fca5a5' : '#d1dae6'}`,
                  borderRadius: '9px', fontSize: '14px', outline: 'none',
                  background: errors.username ? '#fff7f7' : '#f8fafc', color: '#0d1b2a',
                  transition: 'all 0.15s'
                }}
                onFocus={e => { e.target.style.borderColor = '#1e6fc5'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(30,111,197,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = errors.username ? '#fca5a5' : '#d1dae6'; e.target.style.background = errors.username ? '#fff7f7' : '#f8fafc'; e.target.style.boxShadow = 'none'; }}
              />
              {errors.username && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.username}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700',
                color: '#374151', marginBottom: '6px', textTransform: 'uppercase',
                letterSpacing: '0.05em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
                  placeholder="Enter your password"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '11px 44px 11px 14px', boxSizing: 'border-box',
                    border: `1.5px solid ${errors.password ? '#fca5a5' : '#d1dae6'}`,
                    borderRadius: '9px', fontSize: '14px', outline: 'none',
                    background: errors.password ? '#fff7f7' : '#f8fafc', color: '#0d1b2a',
                    transition: 'all 0.15s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#1e6fc5'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(30,111,197,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.password ? '#fca5a5' : '#d1dae6'; e.target.style.background = errors.password ? '#fff7f7' : '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94a3b8', fontSize: '16px', padding: '4px', lineHeight: 1
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', border: 'none', borderRadius: '9px',
                background: loading ? '#93b8e0' : 'linear-gradient(135deg, #1e6fc5, #1557a0)',
                color: '#ffffff', fontSize: '14px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(30,111,197,0.35)',
                transition: 'all 0.15s',
                fontFamily: 'inherit'
              }}
            >
              {loading && (
                <div style={{
                  width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: 'white', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite'
                }} />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', marginTop: '24px' }}>
            🔒 Authorized personnel only
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}