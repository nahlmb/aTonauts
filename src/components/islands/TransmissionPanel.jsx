import { useState } from 'react';
import { answers, progress } from '../../stores/user.js';

const reflectionKeys = [
  ['Analisis manfaat nanoteknologi', 'misi_06_manfaat_opini'],
  ['Bukti manfaat nanoteknologi', 'misi_06_manfaat_bukti'],
  ['Potensi risiko nanoteknologi', 'misi_06_risiko_opini'],
  ['Bukti risiko nanoteknologi', 'misi_06_risiko_bukti'],
  ['Masa depan nanoteknologi baterai', 'misi_06_masa_depan'],
];

export default function TransmissionPanel() {
  const [copied, setCopied] = useState(false);
  const [confirmedCopy, setConfirmedCopy] = useState(false);
  const [confirmedSchedule, setConfirmedSchedule] = useState(false);
  const [error, setError] = useState('');

  function buildLetter(snapshot) {
    const body = reflectionKeys.map(([label, key]) => `${label}:\n${snapshot[key] || '—'}`).join('\n\n');
    return `LOG REFLEKSI MISI ATONAUTS 1.0\n\n${body}\n\nJangan Percaya. Selidiki. Dan Buktikan.`;
  }

  async function copyLetter() {
    const latestAnswers = answers.get();
    const missing = reflectionKeys.filter(([, key]) => !String(latestAnswers[key] || '').trim());
    if (missing.length > 0) {
      setError(`Lengkapi ${missing.length} bagian refleksi sebelum menyalin.`);
      return;
    }
    const letter = buildLetter(latestAnswers);
    setError('');
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setConfirmedCopy(true);
    } catch {
      window.prompt('Salin refleksi berikut:', letter);
    }
  }

  function finish() {
    const missing = reflectionKeys.filter(([, key]) => !String(answers.get()[key] || '').trim());
    if (missing.length > 0) {
      setError(`Lengkapi ${missing.length} bagian refleksi sebelum menyelesaikan misi.`);
      return;
    }
    progress.set('6');
    window.location.href = '/epilog';
  }

  return (
    <div className="transmission-panel">
      <button type="button" className="copy-button" onClick={copyLetter}>
        {copied ? 'REFLEKSI SUDAH DISALIN' : 'SALIN SELURUH REFLEKSI'}
      </button>
      <div className="protocol">
        <h3>PROTOKOL TRANSMISI PRIBADI</h3>
        <ol>
          <li>Salin refleksimu, lalu buka Gmail dan pilih <em>Tulis</em>.</li>
          <li>Tulis alamat Gmail-mu sendiri dan tempel refleksi ke badan email.</li>
          <li>Pilih <em>Jadwalkan pengiriman</em>, lalu atur tanggal satu tahun dari sekarang.</li>
        </ol>
      </div>
      <label className="confirm"><input type="checkbox" checked={confirmedCopy} onChange={(e) => setConfirmedCopy(e.target.checked)} /> Saya sudah menyalin teks refleksi.</label>
      <label className="confirm"><input type="checkbox" checked={confirmedSchedule} onChange={(e) => setConfirmedSchedule(e.target.checked)} /> Saya sudah menjadwalkan pengiriman.</label>
      {error && <p className="transmission-error" role="alert">{error}</p>}
      <button type="button" className="finish-button" disabled={!confirmedCopy || !confirmedSchedule} onClick={finish}>SELESAIKAN MISI</button>
      <style>{`
        .transmission-panel { display: grid; gap: 12px; }
        .copy-button, .finish-button {
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #FF6B35;
          background: transparent;
          color: #FF6B35;
          font: 10px 'FiraCode', monospace;
          letter-spacing: .08em;
          cursor: pointer;
        }
        .protocol { border: 1px solid rgba(245,247,250,.16); border-radius: 7px; padding: 14px; }
        .protocol h3 { color: #3CE2FF; font-size: 16px; margin-bottom: 8px; }
        .protocol ol { padding-left: 18px; color: rgba(245,247,250,.72); font-size: 12px; display: grid; gap: 6px; }
        .confirm { display: flex; gap: 8px; align-items: flex-start; color: rgba(245,247,250,.78); font-size: 12px; }
        .confirm input { accent-color: #3CE2FF; margin-top: 3px; }
        .transmission-error { color: #FF6B35; font: 10px/1.5 'FiraCode', monospace; }
        .finish-button:disabled { opacity: .3; cursor: not-allowed; }
        .finish-button:not(:disabled) { background: #FF6B35; color: white; }
      `}</style>
    </div>
  );
}
