export default function Composer({
  draft,
  onDraftChange,
  onSend,
  onMicToggle,
  onStopSpeaking,
  isListening,
  voiceSupported,
  isSpeaking,
  continuousMode,
  onContinuousModeChange,
  isSubmitting,
  placeholder
}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isSubmitting && draft.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-lg border border-slate-400 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-white transition dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-white/10"
      />
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMicToggle}
            disabled={!voiceSupported}
            title={isListening ? 'Stop listening' : 'Start listening'}
            className={`rounded-lg p-2.5 transition ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 107.753-1 4.5 4.5 0 11-8.384 7.98z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onStopSpeaking}
            disabled={!isSpeaking}
            className="text-xs px-3 py-1 rounded-lg border border-slate-400 bg-white text-slate-800 hover:bg-slate-100 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            Stop speaking
          </button>
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={isSubmitting || !draft.trim()}
          className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? '...' : '↑'}
        </button>
      </div>
    </div>
  );
}
