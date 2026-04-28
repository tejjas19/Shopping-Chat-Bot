export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-glow dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:300ms]" />
      <span className="pl-2">AI is thinking...</span>
    </div>
  );
}
