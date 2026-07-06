import { useState, useRef, useEffect } from 'react';
import { answers } from '../../stores/user.js';

export default function KapsulWaktu({ misiId, fieldId, label, hint, charLimit = 300 }) {
  const storeKey = `${misiId}_${fieldId}`;
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const storedAnswers = answers.get();
    const storedText = storedAnswers[storeKey] || '';

    setText(storedText);
  }, [storeKey]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }, [text]);

  // Keyboard-aware: scroll into view when focused on mobile
  function handleFocus() {
    setTimeout(() => {
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  function handleChange(e) {
    if (e.target.value.length <= charLimit) {
      const nextText = e.target.value;
      setText(nextText);
      answers.setKey(storeKey, nextText);
    }
  }

  function handleBlur() {
    const cleanText = text.trim();
    setText(cleanText);
    answers.setKey(storeKey, cleanText);
  }

  const remaining = charLimit - text.length;
  const isNearLimit = remaining < 50;

  return (
    <div className={`kw-wrapper${text.trim() ? ' kw-filled' : ''}`}>
      {label && <p className="kw-label">{label}</p>}

      <div className="kw-textarea-wrap">
        <textarea
          ref={textareaRef}
          className="kw-textarea"
          placeholder={hint}
          value={text}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={3}
          maxLength={charLimit}
        />

        <div className="kw-footer-row">
          <span className={`kw-counter${isNearLimit ? ' near-limit' : ''}`}>
            {text.length}/{charLimit}
          </span>
        </div>
      </div>

      <style>{`
        .kw-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .kw-label {
          font-family: 'FiraCode', monospace;
          font-size: 10px;
          color: #3CE2FF;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .kw-textarea-wrap {
          border: 1px solid rgba(245,247,250,0.2);
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .kw-wrapper.kw-filled .kw-textarea-wrap {
          border-color: rgba(60, 226, 255, 0.4);
        }
        .kw-textarea-wrap:focus-within {
          border-color: rgba(245,247,250,0.5);
        }
        .kw-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 12px 14px 8px;
          color: #F5F7FA;
          font-family: 'GoogleSans', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          resize: none;
          min-height: 72px;
          display: block;
        }
        .kw-textarea::placeholder {
          color: rgba(245,247,250,0.3);
          font-style: italic;
        }
        .kw-footer-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 4px 10px 8px 14px;
        }
        .kw-counter {
          font-family: 'FiraCode', monospace;
          font-size: 10px;
          color: rgba(245,247,250,0.3);
          transition: color 0.2s;
        }
        .kw-counter.near-limit { color: #FF6B35; }
      `}</style>
    </div>
  );
}
