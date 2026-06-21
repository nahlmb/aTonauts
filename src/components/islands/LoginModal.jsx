import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { identity } from '../../stores/user.js';
import { postToSheets } from '../../utils/sheets.js';
import { SHEET_IDENTITY } from '../../config.js';

export default function LoginModal({ onClose }) {
  const $identity = useStore(identity);
  const [nama, setNama] = useState($identity.nama || '');
  const [kelas, setKelas] = useState($identity.kelas || '');
  const [absen, setAbsen] = useState($identity.absen || '');
  const [loading, setLoading] = useState(false);

  const isValid = nama.trim() && kelas.trim() && absen.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    const data = { nama: nama.trim(), kelas: kelas.trim(), absen: absen.trim() };

    identity.set(data);
    await postToSheets(SHEET_IDENTITY, { ...data, timestamp: new Date().toISOString() });

    window.location.href = '/operasi';
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title" className="modal-title">IDENTITAS PHILAERNERS</h2>
        <p className="modal-subtitle">Lengkapi identitasmu untuk berkontribusi dalam misi ini!</p>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="input-wrapper">
            <img src="/assets/icons/avatar_icon.svg" alt="" className="input-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="input-wrapper">
            <img src="/assets/icons/class_icon.svg" alt="" className="input-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="Kelas (contoh: X-3)"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="input-wrapper">
            <img src="/assets/icons/archive_icon.svg" alt="" className="input-icon" />
            <input
              className="input-field"
              type="number"
              placeholder="Nomor Absen"
              value={absen}
              onChange={(e) => setAbsen(e.target.value)}
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-orange modal-submit${isValid ? '' : ' disabled'}`}
            disabled={!isValid || loading}
          >
            {loading ? 'MENYIMPAN...' : 'SIMPAN DAN LANJUTKAN'}
          </button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 24px;
        }
        .modal-box {
          background: #1A1F26;
          border: 1px solid rgba(245, 247, 250, 0.2);
          border-radius: 10px;
          padding: 28px 24px;
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fade-in 0.25s ease;
        }
        .modal-title {
          font-family: 'FiraSansCondensed', sans-serif;
          font-size: 22px;
          color: #F5F7FA;
          letter-spacing: 0.04em;
        }
        .modal-subtitle {
          font-size: 13px;
          color: rgba(245, 247, 250, 0.65);
          margin-top: -12px;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .modal-submit {
          margin-top: 8px;
          width: 100%;
          font-size: 12px;
          letter-spacing: 0.1em;
          padding: 14px;
        }
        .modal-submit.disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        /* Reuse global styles via CSS vars, but scoped */
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          width: 18px;
          height: 18px;
          opacity: 0.45;
          filter: invert(1);
        }
        .input-field {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(245, 247, 250, 0.25);
          border-radius: 6px;
          padding: 12px 12px 12px 40px;
          color: #F5F7FA;
          font-family: 'GoogleSans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }
        .input-field:focus { border-color: #3CE2FF; }
        .input-field::placeholder { color: rgba(245, 247, 250, 0.35); font-style: italic; }
        .input-field[type=number]::-webkit-inner-spin-button,
        .input-field[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        .btn-orange {
          background: transparent;
          color: #FF6B35;
          border: 1px solid #FF6B35;
          border-radius: 6px;
          font-family: 'FiraCode', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 12px;
          transition: background 0.2s, color 0.2s;
        }
        .btn-orange:hover:not(:disabled),
        .btn-orange:active:not(:disabled) {
          background: #FF6B35;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
