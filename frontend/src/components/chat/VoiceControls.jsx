export default function VoiceControls({ isListening, voiceSupported, onToggle, onStopSpeaking, isSpeaking, continuousMode, onContinuousModeChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={!voiceSupported}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          isListening
            ? 'bg-rose-500 text-white hover:bg-rose-400'
            : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
        } disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {isListening ? 'Stop listening' : 'Mic'}
      </button>
      <button
        type="button"
        onClick={onStopSpeaking}
        disabled={!isSpeaking}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
      >
        Stop speaking
      </button>
      <label className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white">
        <input
          type="checkbox"
          checked={continuousMode}
          onChange={(event) => onContinuousModeChange(event.target.checked)}
          className="accent-cyan-400"
        />
        Continuous voice
      </label>
    </div>
  );
}
