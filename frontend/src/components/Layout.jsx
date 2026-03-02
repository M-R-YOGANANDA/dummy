import React from 'react';

export function Header({ userName, userRole, onLogout }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-primary-900 text-white shadow-lg z-40">
      <div className="h-full px-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">CPC Polytechnic Mysuru</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-slate-300">
            Logged in as <span className="font-medium">{userName}</span>
            {userRole && <span className="ml-1 text-xs text-slate-400">({userRole})</span>}
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
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
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-primary-900 text-white overflow-y-auto shadow-lg z-30">
      <nav className="flex flex-col h-full">
        <div className="flex-1">
          <div className="p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Navigation</h3>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full text-left px-5 py-3 rounded-lg transition-all flex items-center gap-3 text-sm font-medium ${
                    activeSection === item.id
                      ? 'bg-success/20 text-success border-l-4 border-success'
                      : 'text-slate-300 hover:bg-white/10'
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
          <div className="border-t border-white/10 p-4">
            {extraContent}
          </div>
        )}
      </nav>
    </aside>
  );
}

export function MainContent({ children }) {
  return (
    <main className="ml-64 mt-16 p-8 min-h-screen bg-slate-50">
      {children}
    </main>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-primary-900 mb-2">{title}</h1>
      {subtitle && <p className="text-slate-600 text-sm">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border border-slate-200 ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseClass = 'font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-success text-white hover:bg-emerald-600 shadow-md hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    danger: 'bg-error text-white hover:bg-red-700',
    outline: 'border-2 border-slate-300 text-slate-900 hover:bg-slate-50',
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
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-2 border-2 rounded-lg transition-colors focus:outline-none ${
          error
            ? 'border-error bg-red-50 focus:border-error'
            : 'border-slate-200 bg-white focus:border-success'
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
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      <select
        className={`w-full px-4 py-2 border-2 rounded-lg transition-colors focus:outline-none ${
          error
            ? 'border-error bg-red-50 focus:border-error'
            : 'border-slate-200 bg-white focus:border-success'
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
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{label}</p>
          <p className="text-4xl font-bold text-primary-900">{value}</p>
          {subtext && <p className="text-sm text-slate-600 mt-2">{subtext}</p>}
        </div>
        {icon && <span className="text-4xl opacity-60">{icon}</span>}
      </div>
    </Card>
  );
}

export function ToggleSwitch({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-200 last:border-0">
      <div className="flex-1">
        {label && <p className="font-medium text-slate-900">{label}</p>}
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
          enabled ? 'bg-success' : 'bg-slate-300'
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-slate-200 bg-slate-50">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-slate-900">
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
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`p-4 rounded-lg border ${bgColor[type]} mb-4 flex justify-between items-start`}>
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {message && <p className="text-sm mt-1">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl hover:opacity-60">
          ✕
        </button>
      )}
    </div>
  );
}
