import React from 'react';

/* ─── THEME TOKENS ──────────────────────────────────────────────────────────
   Navy sidebar: #0d1b2a  /  Active item: #1e6fc5  /  Content bg: #f0f4f9
   Card bg: #ffffff       /  Text primary: #0d1b2a  /  Accent: #1e6fc5
   ──────────────────────────────────────────────────────────────────────── */

export function Header({ userName, userRole, onLogout }) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
      background: '#ffffff', borderBottom: '1px solid #e2e8f0',
      zIndex: 40, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #1e6fc5, #0d4fa8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px'
        }}>🎓</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0d1b2a', lineHeight: 1.2 }}>
            CPC Polytechnic Mysuru
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Academic Portal
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 14px', background: '#f8fafc', borderRadius: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e6fc5, #0d4fa8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: 'white', fontWeight: '700'
          }}>
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#0d1b2a', lineHeight: 1.2 }}>
              {userName}
            </div>
            {userRole && (
              <div style={{ fontSize: '10px', color: '#1e6fc5', fontWeight: '600', textTransform: 'uppercase' }}>
                {userRole}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '7px 16px', background: 'transparent', color: '#64748b',
            border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer',
            fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center',
            gap: '6px', transition: 'all 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}

export function Sidebar({ items, activeSection, onSectionChange, extraContent }) {
  return (
    <aside style={{
      position: 'fixed', left: 0, top: '60px', width: '220px',
      height: 'calc(100vh - 60px)',
      background: 'linear-gradient(180deg, #0d1b2a 0%, #0a1520 100%)',
      zIndex: 30, display: 'flex', flexDirection: 'column',
      overflowY: 'auto'
    }}>
      <nav style={{ flex: 1, padding: '20px 12px' }}>
        <div style={{ fontSize: '10px', color: '#4a6080', fontWeight: '700',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px',
          paddingLeft: '12px' }}>
          Menu
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {items.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px',
                  borderRadius: '8px', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontSize: '13px', fontWeight: isActive ? '600' : '500',
                  background: isActive
                    ? 'linear-gradient(135deg, #1e6fc5, #1557a0)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : '#8aa3be',
                  transition: 'all 0.15s',
                  position: 'relative',
                  boxShadow: isActive ? '0 2px 8px rgba(30,111,197,0.35)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8aa3be';
                  }
                }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <div style={{
                    position: 'absolute', right: '10px', width: '6px', height: '6px',
                    borderRadius: '50%', background: '#60c3ff'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>
      {extraContent && (
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {extraContent}
        </div>
      )}
    </aside>
  );
}

export function MainContent({ children }) {
  return (
    <main style={{
      marginLeft: '220px', marginTop: '60px', padding: '28px 32px',
      minHeight: '100vh', background: '#f0f4f9'
    }}>
      {children}
    </main>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0d1b2a', margin: 0, lineHeight: 1.3 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0', fontWeight: '500' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Card({ children, className = '', style: extraStyle = {} }) {
  return (
    <div style={{
      background: '#ffffff', borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 8px rgba(0,0,0,0.04)',
      padding: '24px', border: '1px solid #e8edf4',
      ...extraStyle
    }} className={className}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', style: extraStyle = {}, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    border: 'none', cursor: 'pointer', fontWeight: '600',
    borderRadius: '8px', transition: 'all 0.15s', fontFamily: 'inherit',
  };
  const variants = {
    primary: { background: 'linear-gradient(135deg, #1e6fc5, #1557a0)', color: '#ffffff', boxShadow: '0 2px 6px rgba(30,111,197,0.3)' },
    secondary: { background: '#f1f5f9', color: '#0d1b2a', border: '1px solid #e2e8f0' },
    danger: { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#ffffff', boxShadow: '0 2px 6px rgba(239,68,68,0.3)' },
    outline: { background: 'transparent', color: '#1e6fc5', border: '2px solid #1e6fc5' },
  };
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '9px 18px', fontSize: '13px' },
    lg: { padding: '12px 24px', fontSize: '14px' },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size], ...extraStyle }}
      className={className}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, style: extraStyle = {}, ...props }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600',
          color: '#374151', marginBottom: '6px', textTransform: 'uppercase',
          letterSpacing: '0.04em' }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%', padding: '9px 12px', border: `1px solid ${error ? '#fca5a5' : '#d1dae6'}`,
          borderRadius: '8px', fontSize: '13px', outline: 'none',
          background: error ? '#fff7f7' : '#f8fafc', color: '#0d1b2a',
          transition: 'border-color 0.15s', boxSizing: 'border-box',
          ...extraStyle
        }}
        onFocus={e => { e.target.style.borderColor = '#1e6fc5'; e.target.style.background = '#fff'; }}
        onBlur={e => { e.target.style.borderColor = error ? '#fca5a5' : '#d1dae6'; e.target.style.background = error ? '#fff7f7' : '#f8fafc'; }}
        {...props}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

export function Select({ label, options, error, style: extraStyle = {}, ...props }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600',
          color: '#374151', marginBottom: '6px', textTransform: 'uppercase',
          letterSpacing: '0.04em' }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%', padding: '9px 12px', border: `1px solid ${error ? '#fca5a5' : '#d1dae6'}`,
          borderRadius: '8px', fontSize: '13px', outline: 'none',
          background: '#f8fafc', color: '#0d1b2a',
          transition: 'border-color 0.15s', boxSizing: 'border-box',
          cursor: 'pointer', ...extraStyle
        }}
        onFocus={e => { e.target.style.borderColor = '#1e6fc5'; e.target.style.background = '#fff'; }}
        onBlur={e => { e.target.style.borderColor = error ? '#fca5a5' : '#d1dae6'; e.target.style.background = '#f8fafc'; }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

export function DashboardGrid({ children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px', marginBottom: '28px'
    }}>
      {children}
    </div>
  );
}

const CARD_ACCENTS = ['#1e6fc5', '#0ea5e9', '#8b5cf6', '#10b981'];

export function DashboardCard({ label, value, icon, subtext, _index = 0 }) {
  const accent = CARD_ACCENTS[_index % CARD_ACCENTS.length];
  return (
    <div style={{
      background: '#ffffff', borderRadius: '12px', padding: '20px',
      border: '1px solid #e8edf4', position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: accent
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
            {label}
          </p>
          <p style={{ fontSize: '28px', fontWeight: '800', color: '#0d1b2a', margin: 0, lineHeight: 1 }}>
            {value}
          </p>
          {subtext && (
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', fontWeight: '500' }}>
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px',
            background: `${accent}18`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '20px'
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function ToggleSwitch({ enabled, onChange, label, description }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px', background: '#f8fafc', borderRadius: '10px',
      border: '1px solid #e2e8f0', marginBottom: '12px'
    }}>
      <div style={{ flex: 1 }}>
        {label && <p style={{ fontWeight: '600', color: '#0d1b2a', margin: 0, fontSize: '14px' }}>{label}</p>}
        {description && <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0', lineHeight: 1.4 }}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        style={{
          position: 'relative', width: '48px', height: '26px',
          borderRadius: '13px', border: 'none', cursor: 'pointer',
          background: enabled ? '#1e6fc5' : '#cbd5e1',
          transition: 'background 0.2s', flexShrink: 0, marginLeft: '16px',
          boxShadow: enabled ? '0 2px 6px rgba(30,111,197,0.35)' : 'none'
        }}
      >
        <span style={{
          position: 'absolute', top: '3px',
          left: enabled ? '25px' : '3px',
          width: '20px', height: '20px',
          borderRadius: '50%', background: '#ffffff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }} />
      </button>
    </div>
  );
}

export function Table({ columns, data, actions }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            {columns.map((col) => (
              <th key={col.key} style={{
                padding: '12px 16px', textAlign: 'left',
                fontSize: '11px', fontWeight: '700', color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap'
              }}>
                {col.label}
              </th>
            ))}
            {actions && (
              <th style={{
                padding: '12px 16px', textAlign: 'left',
                fontSize: '11px', fontWeight: '700', color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.06em'
              }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={{
              borderBottom: idx < data.length - 1 ? '1px solid #f1f5f9' : 'none',
              transition: 'background 0.1s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '12px 16px', fontSize: '13px', color: '#1e293b' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Alert({ type = 'info', title, message, onClose }) {
  const config = {
    success: { bg: '#f0fdf4', border: '#86efac', color: '#166534', icon: '✓', iconBg: '#dcfce7' },
    error:   { bg: '#fff7f7', border: '#fca5a5', color: '#991b1b', icon: '✕', iconBg: '#fee2e2' },
    warning: { bg: '#fffbeb', border: '#fcd34d', color: '#92400e', icon: '⚠', iconBg: '#fef3c7' },
    info:    { bg: '#eff6ff', border: '#93c5fd', color: '#1e40af', icon: 'i', iconBg: '#dbeafe' },
  };
  const c = config[type];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '14px 16px', borderRadius: '10px', marginBottom: '16px',
      background: c.bg, border: `1px solid ${c.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%', background: c.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: '700', color: c.color, flexShrink: 0
      }}>
        {c.icon}
      </div>
      <div style={{ flex: 1 }}>
        {title && <p style={{ fontWeight: '700', color: c.color, margin: '0 0 2px', fontSize: '13px' }}>{title}</p>}
        {message && <p style={{ fontSize: '13px', color: c.color, margin: 0, opacity: 0.85 }}>{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: c.color, opacity: 0.6, fontSize: '16px', lineHeight: 1,
          padding: '0', flexShrink: 0
        }}>✕</button>
      )}
    </div>
  );
}