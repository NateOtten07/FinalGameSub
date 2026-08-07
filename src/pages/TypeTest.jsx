import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { loadSettings } from "../logic/settings";

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog while the sun sets slowly behind the hills.",
  "Typing quickly is a skill built through repetition, patience, and a willingness to make mistakes.",
  "Every keystroke tells a story of rhythm, precision, and the quiet focus of the mind at work.",
  "A good typist listens to the sound of the keys the way a musician listens to their instrument.",
  "Practice does not make perfect, but it does make permanent, so type with care and intention.",
  "Somewhere between the first word and the last lies the steady rhythm every fast typist finds.",
  "Old typewriters had weight and resistance, forcing every letter to be struck with purpose.",
  "Speed comes second. Accuracy, rhythm, and calm hands come first, always in that order.",
];

function pickPassage(exclude) {
  const options = PASSAGES.filter((p) => p !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function TypeTest() {
  const [passage, setPassage] = useState(() => pickPassage());
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [now, setNow] = useState(null);
  const [errorCount, setErrorCount] = useState(0);

  const inputRef = useRef(null);
  const tickRef = useRef(null);

  const status = endTime ? "done" : startTime ? "running" : "idle";

  useEffect(() => {
    if (status === "running") {
      tickRef.current = setInterval(() => setNow(Date.now()), 200);
      return () => clearInterval(tickRef.current);
    }
    clearInterval(tickRef.current);
  }, [status]);

  const elapsedMs = useMemo(() => {
    if (!startTime) return 0;
    return (endTime ?? now ?? startTime) - startTime;
  }, [startTime, endTime, now]);

  const correctChars = useMemo(() => {
    let count = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === passage[i]) count++;
    }
    return count;
  }, [typed, passage]);

  const wpm = useMemo(() => {
    if (elapsedMs <= 0) return 0;
    const minutes = elapsedMs / 60000;
    return Math.round(correctChars / 5 / minutes) || 0;
  }, [correctChars, elapsedMs]);

  const accuracy = useMemo(() => {
    const totalKeystrokes = correctChars + errorCount;
    if (totalKeystrokes === 0) return 100;
    return Math.round((correctChars / totalKeystrokes) * 100);
  }, [correctChars, errorCount]);

  const handleChange = useCallback(
    (e) => {
      if (status === "done") return;
      const value = e.target.value;

      if (!startTime && value.length > 0) {
        setStartTime(Date.now());
        setNow(Date.now());
      }

      if (value.length > typed.length) {
        const newIndex = value.length - 1;
        if (value[newIndex] !== passage[newIndex]) {
          setErrorCount((c) => c + 1);
        }
      }

      const clipped = value.slice(0, passage.length);
      setTyped(clipped);

      if (clipped.length === passage.length) {
        setEndTime(Date.now());
      }
    },
    [status, startTime, typed, passage],
  );

  const restart = useCallback((newPassage = true) => {
    setPassage((prev) => (newPassage ? pickPassage(prev) : prev));
    setTyped("");
    setStartTime(null);
    setEndTime(null);
    setNow(null);
    setErrorCount(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const settings = loadSettings();
  const playerName = settings?.name;

  const focusInput = () => inputRef.current?.focus();

  return (
    <section className="tt-root" style={{ maxWidth: "760px", margin: "2rem auto" }} onClick={focusInput}>
      <style>{`
        .tt-root {
          font-family: system-ui, sans-serif;
          background: var(--color-background);
          color: var(--color-text);
          min-height: 100%;
          width: 100%;
          padding: 3rem 1.25rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: text;
        }
        .tt-eyebrow {
          font-family: system-ui, sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 0.4rem;
        }
        .tt-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          letter-spacing: -0.01em;
          color: var(--color-text);
        }
        .tt-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          max-width: 640px;
          width: 100%;
          position: relative;
        }
        .tt-card::before {
          content: "";
          position: absolute;
          top: 0; left: 2rem; right: 2rem;
          height: 3px;
          background: repeating-linear-gradient(90deg, var(--color-primary) 0 10px, transparent 10px 16px);
          opacity: 0.45;
        }
        .tt-passage {
          font-size: 1.25rem;
          line-height: 1.9;
          letter-spacing: 0.01em;
          user-select: none;
          color: var(--color-text);
        }
        .tt-char {
          position: relative;
          transition: transform 0.2s ease, color 0.2s ease, background-color 0.2s ease;
        }
        .tt-char.correct {
          color: var(--color-text);
          font-weight: 700;
          transform: translateY(-1px);
        }
        .tt-char.incorrect {
          color: var(--color-error);
          font-weight: 700;
          background: rgba(176, 0, 32, 0.18);
          border-radius: 3px;
          transform: translateY(-1px);
        }
        .tt-char.pending { color: var(--color-text-secondary); }
        .tt-char.current::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -3px;
          height: 2px;
          background: var(--color-primary);
          animation: tt-blink 1s steps(1) infinite;
        }
        @keyframes tt-blink { 50% { opacity: 0; } }

        .tt-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          width: 1px;
          height: 1px;
        }

        .tt-stats {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 2.25rem;
          padding-top: 1.25rem;
          border-top: 1px dashed var(--color-border);
        }
        .tt-stat { text-align: left; }
        .tt-stat-label {
          font-family: system-ui, sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 0.2rem;
        }
        .tt-stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          color: var(--color-text);
        }
        .tt-stat-value.timer { color: var(--color-primary); }

        .tt-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }
        .tt-status {
          font-family: system-ui, sans-serif;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }
        .tt-btn {
          font-family: system-ui, sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          background: transparent;
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          padding: 0.6rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .tt-btn:hover { background: var(--color-primary); color: white; border-color: var(--color-primary); }

        .tt-result {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px dashed var(--color-border);
          font-family: system-ui, sans-serif;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
      `}</style>

      <div className="tt-eyebrow">Typing Test</div>
      <h1 className="tt-title">How fast do you type?</h1>
      {playerName ? <div role="status" style={{ marginBottom: "1rem" }}>Welcome {playerName}!</div> : null}

      <div className="tt-card">
        <div className="tt-passage" aria-hidden="true">
          {passage.split("").map((char, i) => {
            let cls = "pending";
            if (i < typed.length) {
              cls = typed[i] === char ? "correct" : "incorrect";
            } else if (i === typed.length && status !== "done") {
              cls = "pending current";
            }
            return (
              <span className={`tt-char ${cls}`} key={i}>
                {char}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          className="tt-input"
          value={typed}
          onChange={handleChange}
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          disabled={status === "done"}
        />

        <div className="tt-stats">
          <div className="tt-stat">
            <div className="tt-stat-label">WPM</div>
            <div className="tt-stat-value">{wpm}</div>
          </div>
          <div className="tt-stat">
            <div className="tt-stat-label">Accuracy</div>
            <div className="tt-stat-value">{accuracy}%</div>
          </div>
          <div className="tt-stat">
            <div className="tt-stat-label">Time</div>
            <div className="tt-stat-value timer">{formatTime(elapsedMs)}</div>
          </div>
        </div>

        <div className="tt-footer">
          <span className="tt-status">
            {status === "idle" && "Click here and start typing"}
            {status === "running" && "Keep going..."}
            {status === "done" && "Finished — nice work"}
          </span>
          <button
            className="tt-btn"
            onClick={(e) => {
              e.stopPropagation();
              restart(true);
            }}
          >
            {status === "done" ? "Try again" : "New passage"}
          </button>
        </div>

        {status === "done" && (
          <div className="tt-result">
            Typed {passage.length} characters in {formatTime(elapsedMs)} at{" "}
            {wpm} words per minute with {accuracy}% accuracy.
          </div>
        )}
      </div>
    </section>
  );
}