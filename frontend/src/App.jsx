import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "./hooks/useChat.js";
import { useSession } from "./hooks/useSession.js";
import { useVoiceOutput } from "./hooks/useVoiceOutput.js";

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function CursorBall() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(0);
  const stateRef = useRef({ x: -100, y: -100, rx: -100, ry: -100 });

  useEffect(() => {
    const onMove = (e) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
      const dot = dotRef.current;
      if (dot) {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
      }
    };

    const hoverOn = () => {
      dotRef.current?.classList.add("hovering");
      ringRef.current?.classList.add("hovering");
    };
    const hoverOff = () => {
      dotRef.current?.classList.remove("hovering");
      ringRef.current?.classList.remove("hovering");
    };

    const onDown = () => dotRef.current?.classList.add("clicking");
    const onUp = () => dotRef.current?.classList.remove("clicking");

    const tick = () => {
      const p = stateRef.current;
      p.rx += (p.x - p.rx) * 0.12;
      p.ry += (p.y - p.ry) * 0.12;
      const ring = ringRef.current;
      if (ring) {
        ring.style.left = `${p.rx}px`;
        ring.style.top = `${p.ry}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const hoverTargets = Array.from(document.querySelectorAll("button, a, .sidebar-item, [data-hover]"));

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", hoverOn);
      el.addEventListener("mouseleave", hoverOff);
    });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", hoverOn);
        el.removeEventListener("mouseleave", hoverOff);
      });
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-bubble" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

function PageFlipOverlay({ flipping, color }) {
  return (
    <div className={`page-flip-overlay${flipping ? " flipping" : ""}`}>
      {flipping && (
        <div className="page-flip-leaf" style={{ background: color }}>
          <div className="page-flip-sheen" />
          <div className="page-flip-shadow" />
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      className={`theme-toggle-btn pro-anim${dark ? "" : " light"}`}
      onClick={onToggle}
      aria-label="Toggle theme"
      data-hover
      style={{
        position: 'relative',
        width: 56,
        height: 28,
        borderRadius: 20,
        background: dark ? '#23272f' : '#f3f4f6',
        border: '1.5px solid ' + (dark ? '#444' : '#ddd'),
        boxShadow: dark
          ? '0 2px 8px 0 rgba(0,0,0,0.18)'
          : '0 2px 8px 0 rgba(180,180,180,0.10)',
        transition: 'background 0.35s cubic-bezier(.4,2,.6,1), border 0.25s, box-shadow 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <span
        className="toggle-icon"
        style={{
          fontSize: 18,
          opacity: dark ? 1 : 0.45,
          transition: 'opacity 0.3s',
          filter: dark ? 'drop-shadow(0 1px 2px #0002)' : 'none',
        }}
      >🌙</span>
      <span
        className="toggle-icon"
        style={{
          fontSize: 18,
          opacity: dark ? 0.45 : 1,
          transition: 'opacity 0.3s',
          filter: !dark ? 'drop-shadow(0 1px 2px #fff2)' : 'none',
        }}
      >☀️</span>
      <div
        className="theme-toggle-knob"
        style={{
          position: 'absolute',
          left: dark ? 4 : 28,
          top: 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: dark
            ? 'linear-gradient(135deg, #23272f 70%, #444 100%)'
            : 'linear-gradient(135deg, #fff 70%, #e2e8f0 100%)',
          boxShadow: dark
            ? '0 2px 8px 0 #0003'
            : '0 2px 8px 0 #bbb2',
          transition: 'left 0.35s cubic-bezier(.4,2,.6,1), background 0.35s, box-shadow 0.3s',
          zIndex: 2,
          border: dark ? '1.5px solid #333' : '1.5px solid #e2e8f0',
        }}
      />
    </button>
  );
}

function MessageBubble({ message }) {
  const mine = message.role === "user";

  const marketplaceLabels = {
    amazon: "Amazon",
    flipkart: "Flipkart",
    ola: "Ola",
    blinkit: "Blinkit",
    zepto: "Zepto",
    westside: "Westside",
    myntra: "Myntra",
    nykaafashion: "Nykaa Fashion",
    nykaa: "Nykaa",
    purplle: "Purplle",
    ajio: "Ajio"
  };

  const linkOrder = [
    "ajio",
    "nykaafashion",
    "nykaa",
    "myntra",
    "amazon",
    "flipkart",
    "ola",
    "blinkit",
    "zepto",
    "westside",
    "purplle"
  ];

  const renderProductCards = !mine && Array.isArray(message.products) && message.products.length > 0;

  const cleanText = !mine
    ? (message.text || "")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : message.text;

  return (
    <div className={`message-row ${mine ? "user" : "bot"}`}>
      <div className={`msg-avatar ${mine ? "user" : "bot"}`}>{mine ? "U" : "AI"}</div>
      <div className="msg-col">
        <div className={`msg-bubble ${mine ? "user" : "bot"}`}>
          {message.typing ? <span className="typing">● ● ●</span> : <span className="msg-content">{cleanText}</span>}

          {renderProductCards && (
            <div className="product-results">
              {message.products.slice(0, 6).map((product) => {
                const links = product.purchaseLinks || {};
                const orderedLinks = linkOrder.filter((key) => links[key]);

                return (
                  <article key={product.id} className="product-card">
                    <img src={product.imageUrl} alt={product.name} className="product-card__image" loading="lazy" />
                    <div className="product-card__body">
                      <h4>{product.name}</h4>
                      <div className="product-card__meta">
                        <span>{product.price}</span>
                        <span>★ {product.rating || "N/A"}</span>
                      </div>
                      <div className="product-card__links">
                        {orderedLinks.map((key) => (
                          <a key={key} href={links[key]} target="_blank" rel="noreferrer" data-hover>
                            {marketplaceLabels[key] || key}
                          </a>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        <small className={`msg-timestamp ${mine ? "right" : ""}`}>{message.time}</small>
      </div>
    </div>
  );
}


export default function App() {
  const sessionId = useSession();
  const { messages, loading, historyLoading, error, sendMessage, setMessages } = useChat(sessionId, "en");
  const [isDark, setIsDark] = useState(true);
  const [flipping, setFlipping] = useState(false);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [userName, setUserName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [typedHeroText, setTypedHeroText] = useState("");
  const [attachments, setAttachments] = useState([]);
  // Custom speak function to always use the same sweet female robot voice
  const { supported: ttsSupported, isSpeaking, stop } = useVoiceOutput();
  // Find and cache the preferred voice
  const preferredVoiceRef = useRef(null);
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find Google US English female or similar
      let voice = voices.find(v =>
        v.name.toLowerCase().includes('google us english') && v.lang === 'en-US' && v.gender !== 'male'
      );
      if (!voice) {
        // Fallback: any en-US female
        voice = voices.find(v => v.lang === 'en-US' && (!v.gender || v.gender === 'female'));
      }
      if (!voice) {
        // Fallback: any en female
        voice = voices.find(v => v.lang.startsWith('en') && (!v.gender || v.gender === 'female'));
      }
      if (!voice && voices.length) voice = voices[0];
      preferredVoiceRef.current = voice;
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Always use the preferred voice for TTS
  const speak = useCallback((text, lang = 'en-US') => {
    if (!window.speechSynthesis) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    if (preferredVoiceRef.current) utter.voice = preferredVoiceRef.current;
    utter.rate = 1;
    utter.pitch = 1.1;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  }, []);
  const lastSpokenRef = useRef(null);

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const endRef = useRef(null);
  const textRef = useRef(null);
  const speechBaseInputRef = useRef("");
  const speechFinalRef = useRef("");
  const pendingCallRef = useRef(false);
  const suppressRecognitionUpdatesRef = useRef(false);

  const flipColor = useMemo(() => (isDark ? "#f8fafc" : "#0b0d12"), [isDark]);
  const heroWelcomeText = useMemo(
    () => `Hello ${userName?.trim() || "there"}, How may I help you?`,
    [userName]
  );

  const historyItems = useMemo(() => {
    if (!sessionId) return [];
    return recentChats.filter((r) => r.sessionId === sessionId).slice(0, 20);
  }, [recentChats, sessionId]);

  const isShoppingText = useCallback((text) => {
    if (!text) return false;
    const s = text.toLowerCase();
    const triggers = [
      'buy', 'purchase', 'price', 'cost', 'where to buy', 'where can i buy',
      'shop', 'store', 'retailer', 'amazon', 'flipkart', 'myntra', 'nykaa', 'ajio',
      'product', 'products', 'find', 'search', 'recommend', 'recommendation',
      'review', 'reviews', 'deliver', 'delivery', 'shipping', 'order', 'size', 'color', 'brand',
      // common product types & categories
      'macbook', 'laptop', 'notebook', 'iphone', 'phone', 'mobile', 'headphones', 'earbuds',
      'tv', 'television', 'camera', 'dslr', 'shoes', 'dress', 'jeans', 'watch', 'smartwatch',
      // beauty, makeup, personal care
      'makeup', 'cosmetic', 'cosmetics', 'skincare', 'beauty', 'lipstick', 'foundation', 'nykaa', 'nykaafashion',
      'perfume', 'fragrance', 'deodorant', 'shampoo', 'conditioner', 'soap', 'moisturizer',
      // groceries & food
      'grocery', 'groceries', 'ingredient', 'ingredients', 'vegetables', 'fruits', 'dairy', 'snacks',
      // home & living
      'home decor', 'homedecor', 'furniture', 'sofa', 'table', 'chair', 'bed', 'mattress', 'curtain', 'pillow',
      // clothing & accessories
      'clothes', 'clothing', 'shirt', 'tshirt', 'blouse', 'saree', 'kurta', 'bag', 'handbag', 'wallet', 'accessories'
    ];
    return triggers.some((t) => s.includes(t));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // speak assistant replies (first 2 sentences/lines)
  useEffect(() => {
    if (!ttsSupported) return;
    if (!messages || !messages.length) return;

    // find the last assistant message
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;
    if (lastSpokenRef.current === lastAssistant.id) return; // already spoken

    const raw = (lastAssistant.content || "").trim();
    if (!raw) return;

    // Speak when assistant returned product results or when the content contains marketplace/category cues
    const hasProducts = Array.isArray(lastAssistant.products) && lastAssistant.products.length > 0;
    const speakWhen = hasProducts || isShoppingText(raw);
    if (!speakWhen) return;

    // Use first two sentences (fallback to first two lines)
    const sentences = raw.split(/(?<=[.!?])\s+/).filter(Boolean);
    let snippet = sentences.slice(0, 2).join(" ");
    if (!snippet) {
      snippet = raw.split(/\n+/).slice(0, 2).join(" ");
    }

    if (snippet) {
      try {
        speak(snippet, "en-US");
        lastSpokenRef.current = lastAssistant.id;
      } catch (e) {
        // ignore
      }
    }
  }, [messages, speak, ttsSupported]);

  // delete a recent chat
  const deleteRecent = useCallback((id) => {
    setRecentChats((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem('voice-assistant-recent-chats', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentChats([]);
    localStorage.removeItem('voice-assistant-recent-chats');
  }, []);

  useEffect(() => {
    if (historyLoading || messages.length > 0) return;

    setTypedHeroText("");
    let idx = 0;
    const timer = window.setInterval(() => {
      idx += 1;
      setTypedHeroText(heroWelcomeText.slice(0, idx));
      if (idx >= heroWelcomeText.length) {
        window.clearInterval(timer);
      }
    }, 28);

    return () => window.clearInterval(timer);
  }, [historyLoading, messages.length, heroWelcomeText]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme === "light") setIsDark(false);
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("voice-assistant-user-name") || "";
    if (savedName) {
      setUserName(savedName);
      setNameDraft(savedName);
      return;
    }
    setShowNamePrompt(true);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("voice-assistant-recent-chats");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // only load entries for the current session
        const filtered = sessionId ? parsed.filter((p) => p.sessionId === sessionId) : [];
        setRecentChats(filtered);
      }
    } catch {
      setRecentChats([]);
    }
  }, [sessionId]);

  const pushRecentChat = useCallback((title) => {
    const cleanTitle = (title || "").trim();
    if (!cleanTitle) return;

    setRecentChats((prev) => {
      const item = {
        id: `${sessionId || "session"}-${cleanTitle}`,
        title: cleanTitle.slice(0, 55),
        sessionId: sessionId || "",
        updatedAt: Date.now()
      };

      const next = [item, ...prev.filter((p) => p.title !== item.title)].slice(0, 40);
      localStorage.setItem("voice-assistant-recent-chats", JSON.stringify(next));
      return next;
    });
  }, [sessionId]);

  useEffect(() => {
    if (!messages.length) return;
    const userSnippets = messages
      .filter((m) => m.role === "user")
      .map((m) => (m.content || "").trim())
      .filter(Boolean)
      .slice(-3);

    if (!userSnippets.length) return;
    userSnippets.forEach((snippet) => pushRecentChat(snippet));
  }, [messages, pushRecentChat]);

  useEffect(() => {
    localStorage.setItem("chat-theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    // prefer Indian English to better handle local pronunciations; falls back in browsers
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      if (suppressRecognitionUpdatesRef.current) return; // ignore interim/final while suppressed
      let finalChunk = "";
      let interimChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0]?.transcript?.trim();
        if (!chunk) continue;
        if (event.results[i].isFinal) {
          finalChunk = `${finalChunk} ${chunk}`.trim();
        } else {
          interimChunk = `${interimChunk} ${chunk}`.trim();
        }
      }

      if (finalChunk) {
        speechFinalRef.current = `${speechFinalRef.current} ${finalChunk}`.replace(/\s+/g, " ").trim();
      }

      // merge base input + final chunks + interim
      const mergedRaw = [speechBaseInputRef.current, speechFinalRef.current, interimChunk]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      // strip activation phrase variants immediately (also from interim)
      // be tolerant of small misspellings and punctuation; remove activation if it appears at the start
      const stripActivation = (txt) => txt.replace(/^\s*(?:hey|hi|hello)\s*(?:zara|zaara|zira|sara)[:\s,\-]*/i, "").trim();
      const merged = stripActivation(mergedRaw);

      setInput(merged);
    };

    recognition.onend = () => {
      setIsListening(false);
      const finalText = [speechBaseInputRef.current, speechFinalRef.current]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (finalText) {
        // strip activation phrase variants like 'hey zara', 'hi zara', 'hello zara', and small misspellings
        const cleaned = finalText.replace(/^\s*(?:hey|hi|hello)\s*(?:zara|zaara|zira|sara)[:\s,\-]*/i, "").trim();
        // if this recognition was started via Call Zara, auto-send directly using the cleaned text
        if (pendingCallRef.current) {
          // suppress recognition updates so subsequent interim/final don't overwrite
          suppressRecognitionUpdatesRef.current = true;
          // send directly with the cleaned text; avoid setting the composer value so the wake-word never shows
          setTimeout(() => {
            try { send(cleaned); } catch (e) { /* ignore */ }
            // allow recognition updates again after a short grace period
            setTimeout(() => { suppressRecognitionUpdatesRef.current = false; }, 700);
          }, 120);
          pendingCallRef.current = false;
        } else {
          // not auto-send: just show cleaned transcript in composer
          setInput(cleaned);
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => setIsDark((v) => !v), 280);
    setTimeout(() => setFlipping(false), 700);
  }, [flipping]);

  const send = useCallback(async (forcedText) => {
    try { console.debug('send() invoked', { forcedText, input }); } catch (e) { /* ignore */ }
    const rawInput = typeof forcedText !== 'undefined' ? forcedText : input;
    const text = (rawInput || "").trim();
    if (!text) return;

    // Accept all input as queries — convert everything into a chat/search for shopping
    // sanitize input by removing activation phrases anywhere at the start
    const sanitized = text.replace(/^\s*(?:hey|hi|hello)\s*(?:zara|zaara|zira|sara)[:\s,\-]*/i, "").trim();

    // if attachments present, append filenames to the message so server sees them
    let payloadText = sanitized;
    // if the user's text contains strong product keywords, add an explicit shopping hint so the backend returns product listings
    const productHints = ['macbook','laptop','iphone','phone','mobile','tv','television','camera','dslr','shoes','dress','jeans','watch','smartwatch','bedsheet','soap','makeup','skincare','grocery','sofa','mattress','furniture'];
    const low = text.toLowerCase();
    const hasProductHint = productHints.some((k) => low.includes(k));
    if (hasProductHint) {
      payloadText = `Search for product listings only: ${text}`;
    }
    if (attachments && attachments.length) {
      const names = attachments.map((a) => a.name).join(', ');
      payloadText = `${text} \n\n[Attachments: ${names}]`;
    }

    // final debug: log what we send (helps debugging transcription vs backend results)
    try { console.debug('Sending payload to backend:', payloadText); } catch (e) { /* ignore */ }

    pushRecentChat(sanitized);
    // If we sent a forcedText (from recognition), avoid flashing it into the composer — clear input
    setInput("");
    if (textRef.current) textRef.current.style.height = "auto";
    await sendMessage(payloadText);
    // clear attachments after send
    setAttachments([]);
    // clear speech buffers
    speechBaseInputRef.current = "";
    speechFinalRef.current = "";
    // ensure recognition updates allowed again
    suppressRecognitionUpdatesRef.current = false;
  }, [input, sendMessage, pushRecentChat, attachments]);

  const handleSendClick = useCallback((e) => {
    try { console.debug('Send button clicked', { input }); } catch (e) { /* ignore */ }
    try { send(); } catch (err) { console.error('send() error', err); }
  }, [input, send]);

  const onKeyDown = (e) => {
    const isEnter = e.key === "Enter" || e.code === "Enter" || e.keyCode === 13;
    if (isEnter && !e.shiftKey) {
      e.preventDefault();
      // call send() safely
      try { send(); } catch (err) { /* ignore */ }
    }
  };

  const onInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const toggleMic = () => {
    const recog = recognitionRef.current;
    if (!recog) return;

    if (isListening) {
      recog.stop();
      setIsListening(false);
    } else {
      // start fresh and mark as auto-send so when user finishes speaking we send the cleaned query
      // Do NOT auto-send from the bottom mic; let the user review the transcript and press Send
      pendingCallRef.current = false;
      speechBaseInputRef.current = "";
      speechFinalRef.current = "";
      suppressRecognitionUpdatesRef.current = false;
      try { recog.start(); setIsListening(true); } catch (err) { setIsListening(false); }
    }
  };

  const saveName = useCallback(() => {
    const clean = nameDraft.trim();
    if (!clean) return;
    localStorage.setItem("voice-assistant-user-name", clean);
    setUserName(clean);
    setShowNamePrompt(false);
  }, [nameDraft]);

  const startNewChat = () => {
    const nextSessionId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("voice-assistant-session-id", nextSessionId);
    setMessages([]);
    window.location.reload();
  };

  const signOut = useCallback(() => {
    localStorage.removeItem("voice-assistant-user-name");
    localStorage.removeItem("voice-assistant-session-id");
    setUserName("");
    setNameDraft("");
    setShowNamePrompt(true);
    setMessages([]);
    setInput("");
    setAttachments([]);
    if (textRef.current) textRef.current.style.height = "auto";
    setIsListening(false);
    // hide history after sign out (history is session-scoped)
    setRecentChats([]);
  }, [setMessages, setRecentChats]);

  return (
    <div className={`app-root ${isDark ? "theme-dark" : "theme-light"}`}>
      <CursorBall />
      <PageFlipOverlay flipping={flipping} color={flipColor} />

      <div className="chat-app-layout">
        <aside className="chat-sidebar">
          <div className="chat-sidebar__top">
            <div className="chat-sidebar__brand">Voice Assistant Shopbot</div>
            <button className="sidebar-item" onClick={startNewChat} data-hover>
              + New chat
            </button>
          </div>

          <div className="chat-sidebar__history">
            <p className="chat-sidebar__label">Recent chats</p>
            {historyItems.length === 0 ? (
              <p className="chat-sidebar__empty">Your chats will appear here</p>
            ) : (
              <div className="sidebar-list">
                {historyItems.map((item) => (
                  <div key={item.id} className="sidebar-item-row">
                    <button
                      className="sidebar-item"
                      onClick={() => {
                        setInput(item.title);
                        setTimeout(() => {
                          // auto-send and clear input after sending
                          if (textRef.current) textRef.current.focus();
                          handleSendClick();
                        }, 0);
                      }}
                      data-hover
                    >
                      {item.title}
                    </button>
                    <button className="sidebar-item-delete" onClick={() => deleteRecent(item.id)} title="Delete" data-hover>✕</button>
                  </div>
                ))}
                <div className="sidebar-actions">
                  <button className="sidebar-clear" onClick={clearRecent} data-hover>Clear all</button>
                </div>
              </div>
            )}
          </div>

          <div className="chat-sidebar__footer">
            <div className="user-pill">{(userName || "Guest").slice(0, 1).toUpperCase()}</div>
            <div className="sidebar-user-info">
              <span >{userName || "Sign in"}</span>
              {userName && (
                <button className="sidebar-item sidebar-signout" onClick={signOut} data-hover>
                  Sign out
                </button>
              )}
            </div>
          </div>
        </aside>

        <div className="chatbot-wrapper">
          <header className="chat-header">
            <div className="chat-header__brand">Voice Assistant <span className="header-badge">AI</span></div>
            <div className="chat-header__controls">
              <span className="welcome-name">Hi, {userName || "there"}</span>
              <ThemeToggle dark={isDark} onToggle={toggleTheme} />
            </div>
          </header>

          <main className="chat-messages">
            {historyLoading && (
              <div className="message-row bot">
                <div className="msg-avatar bot">AI</div>
                <div className="msg-col">
                  <div className="msg-bubble bot">Loading your previous chat...</div>
                </div>
              </div>
            )}

            {!historyLoading && messages.length === 0 && (
              <section className="chat-hero">
                <h1 className="chat-hero__typing">
                  {typedHeroText}
                  <span className={`chat-hero__caret ${typedHeroText.length >= heroWelcomeText.length ? "done" : ""}`} aria-hidden="true" />
                </h1>
              </section>
            )}

            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={{
                  role: message.role === "assistant" ? "bot" : "user",
                  text: message.content || "",
                  products: message.products || [],
                  time: "",
                }}
              />
            ))}

            {loading && <MessageBubble message={{ role: "bot", typing: true, text: "", time: "" }} />}

            {!!error && (
              <div className="message-row bot">
                <div className="msg-avatar bot">AI</div>
                <div className="msg-col">
                  <div className="msg-bubble bot">{error}</div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </main>

          <footer className="chat-input-area">
            <div className="chat-input-row">
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  setAttachments((prev) => [
                    ...prev,
                    ...files.map((f) => ({ name: f.name, size: f.size }))
                  ]);
                  // clear file input for future picks
                  e.target.value = null;
                }}
                multiple
              />

              <button className="chat-icon-btn bubble-btn" title="Attach" data-hover onClick={() => fileInputRef.current?.click()}>
                +
              </button>

              <textarea
                ref={textRef}
                value={input}
                className="chat-input-field"
                onChange={onInput}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask anything"
              />

              {attachments.length > 0 && (
                <div className="attachment-chips">
                  {attachments.map((a, idx) => (
                    <div key={`${a.name}-${idx}`} className="attachment-chip">
                      <span className="attachment-name">{a.name}</span>
                      <button className="attachment-remove" onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))} title="Remove">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <button className={`chat-icon-btn bubble-btn mic ${isListening ? "listening" : ""}`} onClick={toggleMic} data-hover>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </button>

              <button className="chat-send-btn bubble-btn send" onClick={handleSendClick} disabled={!input.trim()} data-hover title="Send">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 18, height: 18 }}>
                  <path d="M12 19V6" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </button>

              {ttsSupported && (
                <button className={`chat-icon-btn bubble-btn stop-tts ${isSpeaking ? 'active' : ''}`} onClick={() => stop()} title="Stop speaking" data-hover>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                    <line x1="9" y1="9" x2="9" y2="15" />
                    <line x1="15" y1="9" x2="15" y2="15" />
                  </svg>
                </button>
              )}
            </div>
            <p className="input-hint">Enter to send • Shift+Enter for newline • Voice + Text enabled</p>
          </footer>
        </div>
      </div>

      {showNamePrompt && (
        <div className="name-modal">
          <div className="name-modal__card">
            <h2>Welcome 👋</h2>
            <p>Enter your name to continue.</p>
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Your name"
              maxLength={40}
              autoFocus
            />
            <button onClick={saveName} data-hover disabled={!nameDraft.trim()}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}