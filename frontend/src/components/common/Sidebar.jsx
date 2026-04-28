import { useState } from 'react';

export default function Sidebar({ theme, onCollapsedChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const isDark = theme === 'dark';
  const handleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen flex flex-col border-r transition-all z-50 ${isDark ? 'border-white/10 bg-slate-950' : 'border-slate-200/50 bg-white'} ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className={`flex items-center justify-between border-b p-4 ${isDark ? 'border-white/10' : 'border-slate-200/70'}`}>
  {!collapsed && <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Shopping Bot</span>}
        <button
          onClick={handleCollapse}
          className={`rounded-lg p-2 transition ${isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <NavItem icon="+" label="New chat" collapsed={collapsed} />
        <NavItem icon="💬" label="History" collapsed={collapsed} />
        <NavItem icon="⭐" label="Favorites" collapsed={collapsed} />
        <NavItem icon="🛍️" label="Shopping" collapsed={collapsed} />
      </nav>

      <div className={`border-t space-y-2 p-4 ${isDark ? 'border-white/10' : 'border-slate-200/70'}`}>
        <NavItem icon="⚙️" label="Settings" collapsed={collapsed} isDark={isDark} />
        <NavItem icon="❓" label="Help" collapsed={collapsed} isDark={isDark} />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, collapsed, isDark }) {
  return (
    <button className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isDark ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
      <span className="text-base shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
