import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { answers } from '../../stores/user.js';
import { postToSheets } from '../../utils/sheets.js';

export default function KapsulWaktu({ misiId, fieldId, label, hint, charLimit = 300, sheetName }) {
  const $answers = useStore(answers);
  const storeKey = `${misiId}_${fieldId}`;
  const [text, setText] = useState($answers[storeKey] || '');
  const [saved, setSaved] = useState(!!$answers[storeKey]);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);

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
      setText(e.target.value);
      setSaved(false);
    }
  }

  async function handleSend() {
    if (!text.trim() || sending) return;
    setSending(true);

    // Save to store (→ localStorage)
    answers.setKey(storeKey, text.trim());

    // Post to Google Sheets (non-blocking)
    if (sheetName) {
      await postToSheets(sheetName, {
        field: fieldId,
        nilai: text.trim(),
        timestamp: new Date().toISOString(),
      });
    }

    setSaved(true);
    setSending(false);
  }

  const remaining = charLimit - text.length;
  const isNearLimit = remaining < 50;

  return (
    <div className={`kw-wrapper${saved ? ' kw-saved' : ''}`}>
      {label && <p className="kw-label">{label}</p>}

      <div className="kw-textarea-wrap">
        <textarea
          ref={textareaRef}
          className="kw-textarea"
          placeholder={hint}
          value={text}
          onChange={handleChange}
          onFocus={handleFocus}
          rows={3}
          maxLength={charLimit}
        />

        <div className="kw-footer-row">
          <span className={`kw-counter${isNearLimit ? ' near-limit' : ''}`}>
            {text.length}/{charLimit}
          </span>
          <button
            className={`kw-send${!text.trim() ? ' kw-send-disabled' : ''}${saved ? ' kw-send-done' : ''}`}
            onClick={handleSend}
            disabled={!text.trim() || sending}
            aria-label="Kirim jawaban"
          >
            {saved ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd"/>
              </svg>
            ) : (
              <img src="/assets/icons/PaperPlane_Icon.svg" alt="" width="16" height="16" />
            )}
          </button>
        </div>
      </div>

      {saved && <p className="kw-saved-msg">Tersimpan!</p>}

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
        .kw-wrapper.kw-saved .kw-textarea-wrap {
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
          justify-content: space-between;
          padding: 4px 10px 8px 14px;
        }
        .kw-counter {
          font-family: 'FiraCode', monospace;
          font-size: 10px;
          color: rgba(245,247,250,0.3);
          transition: color 0.2s;
        }
        .kw-counter.near-limit { color: #FF6B35; }
        .kw-send {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #FF6B35;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s, transform 0.15s;
        }
        .kw-send img { filter: invert(50%) sepia(80%) saturate(500%) hue-rotate(355deg); }
        .kw-send:hover:not(.kw-send-disabled) { transform: scale(1.15); }
        .kw-send.kw-send-disabled { opacity: 0.25; cursor: not-allowed; }
        .kw-send.kw-send-done { color: #3CE2FF; }
        .kw-saved-msg {
          font-family: 'FiraCode', monospace;
          font-size: 10px;
          color: #3CE2FF;
          letter-spacing: 0.06em;
        }
      `}</style>
    </div>
  );
}
