import { useMemo, useState } from 'react';

const FEMALE_VOICE_HINTS = [
  'samantha',
  'victoria',
  'karen',
  'veena',
  'fiona',
  'moira',
  'zira',
  'aria',
  'female',
  'woman',
  'google uk english female',
  'google us english',
  'google',
  'alloy',
  'wave',
  'wavenet',
  'hindi',
  'google हिन्दी',
  'lekha'
];

const pickPreferredVoice = (voices, language) => {
  if (!Array.isArray(voices) || !voices.length) return null;

  const langPrefix = (language || 'en').split('-')[0].toLowerCase();
  const languageMatches = voices.filter((voice) =>
    (voice.lang || '').toLowerCase().startsWith(langPrefix)
  );

  const candidates = languageMatches.length ? languageMatches : voices;

  const femalePreferred = candidates.find((voice) => {
    const haystack = `${voice.name || ''} ${voice.voiceURI || ''}`.toLowerCase();
    return FEMALE_VOICE_HINTS.some((hint) => haystack.includes(hint));
  });

  if (femalePreferred) return femalePreferred;

  const localDefault = candidates.find((voice) => voice.localService || voice.default);
  if (localDefault) return localDefault;

  return candidates[0] || null;
};

export const useVoiceOutput = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = (text, language = 'en-US') => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();

    // Some browsers load voices lazily; first call nudges the list to populate.
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = pickPreferredVoice(voices, language);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

  // Assistant-like female tone: clear, slightly paced, mild pitch for friendliness.
  // These values try to approximate an assistant voice across browsers.
  utterance.rate = 0.95; // near-normal speed
  utterance.pitch = 1.15; // slightly higher for a friendly female tone
  utterance.volume = 1;

  // small optional tweak: if a Google WaveNet style voice is selected, slightly slower can sound clearer
  if (selectedVoice && /wavenet|wave|google/i.test((selectedVoice.name || '') + (selectedVoice.voiceURI || ''))) {
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
  }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Promise-based speak that resolves when speech ends (useful for awaiting a confirmation prompt)
  const speakAsync = (text, language = 'en-US') =>
    new Promise((resolve) => {
      if (!supported || !text) return resolve();
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = pickPreferredVoice(voices, language);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1.15;
      utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    });

  return useMemo(() => ({ supported, isSpeaking, speak, speakAsync, stop }), [supported, isSpeaking]);
};
