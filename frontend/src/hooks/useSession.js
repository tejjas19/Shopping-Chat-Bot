import { useEffect, useState } from 'react';

const sessionKey = 'voice-assistant-session-id';

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useSession = () => {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(sessionKey);
    if (stored) {
      setSessionId(stored);
      return;
    }

    const generated = createSessionId();
    localStorage.setItem(sessionKey, generated);
    setSessionId(generated);
  }, []);

  return sessionId;
};
