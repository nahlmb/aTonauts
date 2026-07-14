import { useEffect, useMemo, useState } from 'react';

export default function RosettaTools({ prompt }) {
  const totalSeconds = 30 * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) setRunning(false);
  }, [secondsLeft]);

  const clock = useMemo(() => {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Salin prompt berikut:', prompt);
    }
  }

  return (
    <div className="rosetta-tools">
      <button type="button" className="tool-button" onClick={copyPrompt}>
        {copied ? 'PROMPT TERSALIN' : 'SALIN PROMPT'}
      </button>
      <div className={`timer${secondsLeft === 0 ? ' expired' : ''}`}>
        <span className="timer-label">BATAS KONSULTASI</span>
        <strong>{clock}</strong>
        <button type="button" onClick={() => setRunning((value) => !value)} disabled={secondsLeft === 0}>
          {running ? 'JEDA' : secondsLeft === totalSeconds ? 'MULAI' : 'LANJUT'}
        </button>
        <button type="button" onClick={() => { setRunning(false); setSecondsLeft(totalSeconds); }}>ULANG</button>
      </div>
      <style>{`
        .rosetta-tools { display: grid; gap: 10px; }
        .tool-button, .timer button {
          border: 1px solid #FF6B35;
          background: transparent;
          color: #FF6B35;
          border-radius: 6px;
          padding: 10px 12px;
          font: 10px 'FiraCode', monospace;
          letter-spacing: .07em;
          cursor: pointer;
        }
        .tool-button { width: 100%; }
        .timer {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid rgba(60,226,255,.25);
          border-radius: 7px;
          background: rgba(60,226,255,.04);
        }
        .timer-label { grid-column: 1 / -1; color: rgba(245,247,250,.5); font: 9px 'FiraCode', monospace; }
        .timer strong { color: #3CE2FF; font: 22px 'FiraCode', monospace; }
        .timer.expired strong { color: #FF6B35; }
        .timer button:disabled { opacity: .35; }
      `}</style>
    </div>
  );
}
