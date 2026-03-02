import React from 'react';

export function Header({ userName, userRole, onLogout }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-lg z-40 border-b-4 border-primary-500">
      <div className="h-full px-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">🎓 CPC Polytechnic Mysuru</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-primary-100">
            Logged in as <span className="font-semibold text-white">{userName}</span>
            {userRole && <span className="ml-1 text-xs text-primary-200">({userRole.toUpperCase()})</span>}
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function Sidebar({ items, activeSection, onSectionChange, extraContent }) {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-gradient-to-b from-primary-800 to-primary-900 text-white overflow-y-auto shadow-xl z-30 border-r-4 border-primary-500">
      <nav className="flex flex-col h-full">
        <div className="flex-1">
          <div className="p-5">
            <h3 className="text-xs font-bold text-primary-300 uppercase tracking-widest mb-4">📋 Navigation</h3>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full text-left px-5 py-3 rounded-lg transition-all flex items-center gap-3 text-sm font-medium ${
                    activeSection === item.id
                      ? 'bg-primary-500 text-white border-l-4 border-primary-300 shadow-md'
                      : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {extraContent && (
          <div className="border-t border-primary-700 p-4 bg-primary-900">
            {extraContent}
          </div>
        )}
      </nav>
    </aside>
  );
}

export function MainContent({ children }) {
  return (
    <main className="ml-64 mt-16 p-8 min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {children}
    </main>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8 border-b-2 border-primary-200 pb-6">
      <h1 className="text-4xl font-bold text-primary-900 mb-2">{title}</h1>
      {subtitle && <p className="text-primary-700 text-sm font-medium">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500 hover:shadow-lg transition-shadow ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseClass = 'font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200 border border-primary-300',
    danger: 'bg-error text-white hover:bg-red-700 shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary-400 text-primary-900 hover:bg-primary-50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold text-primary-900 mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-2 border-2 rounded-lg transition-colors focus:outline-none ${
          error
            ? 'border-error bg-red-50 focus:border-error'
            : 'border-primary-300 bg-primary-50 focus:border-primary-500 focus:bg-white'
        }`}
        {...props}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, options, error, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold text-primary-900 mb-2">{label}</label>}
      <select
        className={`w-full px-4 py-2 border-2 rounded-lg transition-colors focus:outline-none ${
          error
            ? 'border-error bg-red-50 focus:border-error'
            : 'border-primary-300 bg-primary-50 focus:border-primary-500 focus:bg-white'
        }`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}

export function DashboardGrid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{children}</div>;
}

export function DashboardCard({ label, value, icon, subtext }) {
  return (
    <Card className="bg-gradient-to-br from-white to-primary-50 border-l-0 border-t-4 border-t-primary-500">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-2">📊 {label}</p>
          <p className="text-4xl font-bold text-primary-900">{value}</p>
          {subtext && <p className="text-sm text-primary-700 mt-2">{subtext}</p>}
        </div>
        {icon && <span className="text-5xl opacity-70">{icon}</span>}
      </div>
    </Card>
  );
}

export function ToggleSwitch({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-primary-200 last:border-0 bg-primary-50 px-4 rounded-lg">
      <div className="flex-1">
        {label && <p className="font-semibold text-primary-900">{label}</p>}
        {description && <p className="text-sm text-primary-700 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-8 w-14 rounded-full transition-all shadow-md ${
          enabled ? 'bg-primary-600 shadow-lg' : 'bg-primary-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          } mt-1`}
        />
      </button>
    </div>
  );
}

export function Table({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto rounded-lg border-2 border-primary-200 shadow-md">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-primary-300 bg-gradient-to-r from-primary-700 to-primary-600 text-white">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-left text-sm font-bold">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-primary-100 hover:bg-primary-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-primary-900">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">{actions(row)}</div>
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
  const bgColor = {
    success: 'bg-primary-50 border-primary-300 text-primary-900',
    error: 'bg-red-50 border-red-300 text-red-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    info: 'bg-blue-50 border-blue-300 text-blue-900',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${bgColor[type]} mb-4 flex justify-between items-start shadow-md`}>
      <div className="flex gap-3">
        <span className="text-2xl font-bold">{icons[type]}</span>
        <div>
          {title && <p className="font-semibold">{title}</p>}
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold hover:opacity-60 transition-opacity">
          ✕
        </button>
      )}
    </div>
  );
}
