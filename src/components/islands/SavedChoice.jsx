import { useEffect, useState } from 'react';
import { answers } from '../../stores/user.js';

export default function SavedChoice({ storeKey, label, options, layout = 'stack' }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(answers.get()[storeKey] || '');
  }, [storeKey]);

  function choose(nextValue) {
    setValue(nextValue);
    answers.setKey(storeKey, nextValue);
  }

  return (
    <fieldset className={`saved-choice saved-choice-${layout}`}>
      {label && <legend>{label}</legend>}
      <div className="choice-list">
        {options.map((option) => {
          const item = typeof option === 'string' ? { value: option, label: option } : option;
          return (
            <label className={`choice-card${value === item.value ? ' selected' : ''}`} key={item.value}>
              <input
                type="radio"
                name={storeKey}
                value={item.value}
                checked={value === item.value}
                onChange={() => choose(item.value)}
              />
              <span className="choice-dot" aria-hidden="true" />
              <span className="choice-copy">
                <span className="choice-label">{item.label}</span>
                {item.description && <span className="choice-description">{item.description}</span>}
              </span>
              {item.badge && <span className="choice-badge">{item.badge}</span>}
            </label>
          );
        })}
      </div>

      <style>{`
        .saved-choice { border: 0; min-width: 0; }
        .saved-choice legend {
          font-family: 'FiraCode', monospace;
          font-size: 10px;
          color: #3CE2FF;
          letter-spacing: .06em;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .choice-list { display: grid; gap: 8px; }
        .saved-choice-grid .choice-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .choice-card {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 11px;
          border: 1px solid rgba(245,247,250,.16);
          border-radius: 7px;
          background: rgba(255,255,255,.025);
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .choice-card.selected {
          border-color: rgba(60,226,255,.7);
          background: rgba(60,226,255,.08);
        }
        .choice-card input { position: absolute; opacity: 0; pointer-events: none; }
        .choice-dot {
          width: 14px;
          height: 14px;
          border: 1.5px solid rgba(245,247,250,.4);
          border-radius: 50%;
          flex: 0 0 auto;
          margin-top: 2px;
        }
        .selected .choice-dot { border: 4px solid #3CE2FF; }
        .choice-copy { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }
        .choice-label { color: rgba(245,247,250,.9); font-size: 12px; line-height: 1.45; }
        .choice-description { color: rgba(245,247,250,.5); font-size: 10px; line-height: 1.45; }
        .choice-badge {
          font-family: 'FiraCode', monospace;
          color: #FF6B35;
          font-size: 9px;
          white-space: nowrap;
        }
        @media (max-width: 360px) {
          .saved-choice-grid .choice-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </fieldset>
  );
}
