import { useEffect, useState } from 'react';
import { answers } from '../../stores/user.js';

const positions = [
  { value: 'setuju', label: 'Saya cenderung setuju dengan Debrizz.' },
  { value: 'ragu', label: 'Saya masih belum dapat menentukan posisi.' },
  { value: 'tidak_setuju', label: 'Saya cenderung tidak setuju dengan Debrizz.' },
];

export default function DebrizzPanel({ id, statement, question, reasons, closing }) {
  const positionKey = `misi_04_${id}_posisi`;
  const reasonKey = `misi_04_${id}_alasan`;
  const [position, setPosition] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const saved = answers.get();
    setPosition(saved[positionKey] || '');
    setReason(saved[reasonKey] || '');
  }, [positionKey, reasonKey]);

  function selectPosition(value) {
    setPosition(value);
    setReason('');
    answers.setKey(positionKey, value);
    answers.setKey(reasonKey, '');
  }

  function selectReason(value) {
    setReason(value);
    answers.setKey(reasonKey, value);
  }

  return (
    <section className="debrizz-panel">
      <div className="speaker-row">
        <div className="avatar" aria-hidden="true">D</div>
        <div><h2>DEBRIZZ</h2><p>Pelaku Industri Konvensional</p></div>
      </div>
      <div className="statement">
        {statement.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <strong>{question}</strong>
      </div>

      <div className="response-block">
        <h3>RESPON PHILAERNERS</h3>
        <p className="instruction">Pilih posisi sementaramu.</p>
        <div className="position-grid">
          {positions.map((item) => (
            <label className={position === item.value ? 'selected' : ''} key={item.value}>
              <input type="radio" name={positionKey} checked={position === item.value} onChange={() => selectPosition(item.value)} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        {position && (
          <div className="reason-block">
            <p className="instruction">Pilih alasan yang paling mendekati posisi sementaramu.</p>
            <div className="reason-list">
              {(reasons[position] || []).map((text, index) => {
                const value = `${index + 1} Poin — ${text}`;
                return (
                  <label className={reason === value ? 'selected' : ''} key={value}>
                    <input type="radio" name={reasonKey} checked={reason === value} onChange={() => selectReason(value)} />
                    <span className="score">{index + 1} POIN</span>
                    <span>{text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {reason && <p className="closing"><strong>Debrizz:</strong> {closing}</p>}

      <style>{`
        .debrizz-panel { display: grid; gap: 12px; }
        .speaker-row { display: flex; align-items: center; gap: 10px; }
        .avatar {
          width: 42px; height: 42px; border: 1px solid #FF6B35; border-radius: 50%;
          display: grid; place-items: center; color: #FF6B35; font: 20px 'FiraCode', monospace;
          box-shadow: 0 0 14px rgba(255,107,53,.2);
        }
        .speaker-row h2 { color: #FF6B35; font-size: 20px; }
        .speaker-row p { color: rgba(245,247,250,.45); font-size: 10px; font-style: italic; }
        .statement { display: grid; gap: 9px; padding: 14px; border: 1px solid rgba(255,107,53,.25); border-radius: 8px; background: rgba(255,107,53,.04); }
        .statement p, .statement strong { color: rgba(245,247,250,.78); font-size: 12px; line-height: 1.65; }
        .statement strong { color: #F5F7FA; }
        .response-block { display: grid; gap: 9px; }
        .response-block h3 { color: #3CE2FF; font: 11px 'FiraCode', monospace; letter-spacing: .08em; }
        .instruction { color: rgba(245,247,250,.5); font-size: 11px; }
        .position-grid, .reason-list { display: grid; gap: 7px; }
        .position-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .position-grid label, .reason-list label {
          position: relative; display: flex; gap: 8px; align-items: flex-start; padding: 10px;
          border: 1px solid rgba(245,247,250,.15); border-radius: 7px; cursor: pointer;
          color: rgba(245,247,250,.72); font-size: 11px; line-height: 1.45;
        }
        .position-grid input, .reason-list input { position: absolute; opacity: 0; }
        .position-grid label.selected, .reason-list label.selected { border-color: #3CE2FF; background: rgba(60,226,255,.07); color: #F5F7FA; }
        .reason-block { display: grid; gap: 8px; animation: reveal .2s ease; }
        .reason-list label { flex-direction: column; }
        .score { color: #FF6B35; font: 9px 'FiraCode', monospace; }
        .closing { padding: 12px; border-left: 2px solid #FF6B35; background: rgba(255,107,53,.04); color: rgba(245,247,250,.7); font-size: 11px; line-height: 1.6; }
        @keyframes reveal { from { opacity: 0; transform: translateY(4px); } }
        @media (max-width: 380px) { .position-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
