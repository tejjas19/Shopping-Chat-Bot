import { useEffect, useMemo, useRef, useState } from 'react';

export const useVoiceInput = ({ onTranscript, language = 'en-US', continuous = false } = {}) => {
  const [supported, setSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(Boolean(SpeechRecognition));

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim();
      if (transcript) {
        onTranscript?.(transcript, event.results[event.results.length - 1]?.isFinal ?? true);
      }
    };

    recognition.onerror = (event) => {
      setError(event.error || 'Speech recognition failed');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [continuous, language, onTranscript]);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    setError('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      setError('Unable to start microphone');
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return useMemo(
    () => ({ supported, isListening, error, startListening, stopListening, setError }),
    [supported, isListening, error]
  );
};
