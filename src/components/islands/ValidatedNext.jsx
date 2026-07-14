import { useState } from 'react';

export default function ValidatedNext({ href, requiredKeys = [], label = 'LANJUTKAN MISI' }) {
  const [message, setMessage] = useState('');

  function handleClick(event) {
    const missing = requiredKeys.filter((key) => !(localStorage.getItem(`atonauts_answers:${key}`) || '').trim());
    if (missing.length > 0) {
      event.preventDefault();
      setMessage(`Lengkapi ${missing.length} respons wajib sebelum melanjutkan.`);
      window.setTimeout(() => setMessage(''), 3200);
    }
  }

  return (
    <div className="validated-next">
      {message && <p role="alert">{message}</p>}
      <a href={href} className="validated-link" onClick={handleClick}>
        {label}
        <img src="/assets/icons/RightArrow_Icons.svg" alt="" />
      </a>
      <style>{`
        .validated-next { position: relative; }
        .validated-next p {
          position: absolute; right: 0; bottom: calc(100% + 13px); width: 230px;
          padding: 8px 10px; border: 1px solid #FF6B35; border-radius: 6px;
          background: #111318; color: #FF6B35; font: 10px/1.4 'FiraCode', monospace;
        }
        .validated-link {
          display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
          border: 1px solid #FF6B35; border-radius: 6px; color: #FF6B35;
          text-decoration: none; font: 10px 'FiraCode', monospace; letter-spacing: .1em;
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .validated-link img { width: 14px; height: 14px; filter: invert(60%) sepia(80%) saturate(600%) hue-rotate(355deg) brightness(110%); }
      `}</style>
    </div>
  );
}
