import ThemeToggle from './ThemeToggle';

export default function Header({ sessionId, theme, onThemeToggle, language, onLanguageChange, onClear }) {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDark ? 'border-white/10 bg-slate-950/90' : 'border-slate-200/50 bg-white/90'}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <div className="gradient-header inline-flex items-center px-3 py-1 text-xs uppercase tracking-[0.3em]">
            AI Voice Assistant
          </div>
          <h1 className={`text-xl font-semibold sm:text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>ChatGPT-style chatbot with voice and shopping</h1>
          <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Session: {sessionId || 'creating...'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            className={`rounded-full border px-3 py-2 text-sm outline-none ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'}`}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          <button
            type="button"
            onClick={onClear}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'}`}
          >
            Clear chat
          </button>
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
