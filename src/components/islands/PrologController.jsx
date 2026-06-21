import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { identity } from '../../stores/user.js';
import { postToSheets } from '../../utils/sheets.js';
import { SHEET_IDENTITY } from '../../config.js';

export default function PrologController() {
  const [modalOpen, setModalOpen] = useState(false);
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
    <>
      {/* MASUK button — fixed at bottom */}
      <div className="prolog-footer">
        <button
          className={`masuk-btn${modalOpen ? ' active' : ''}`}
          onClick={() => setModalOpen(true)}
        >
          MASUK
        </button>
      </div>

      {/* Login modal overlay */}
      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-box">
            <h2 id="modal-title" className="modal-title">IDENTITAS PHILAERNERS</h2>
            <p className="modal-subtitle">Lengkapi identitasmu untuk berkontribusi dalam misi ini!</p>

            <form onSubmit={handleSubmit} className="modal-form" noValidate>
              <div className="iw">
                <img src="/assets/icons/avatar_icon.svg" alt="" className="ii" />
                <input className="ifield" type="text" placeholder="Nama Lengkap"
                  value={nama} onChange={(e) => setNama(e.target.value)} required autoComplete="off" />
              </div>

              <div className="iw">
                <img src="/assets/icons/class_icon.svg" alt="" className="ii" />
                <input className="ifield" type="text" placeholder="Kelas (contoh: X-3)"
                  value={kelas} onChange={(e) => setKelas(e.target.value)} required autoComplete="off" />
              </div>

              <div className="iw">
                <img src="/assets/icons/archive_icon.svg" alt="" className="ii" />
                <input className="ifield" type="number" placeholder="Nomor Absen"
                  value={absen} onChange={(e) => setAbsen(e.target.value)} min="1" required />
              </div>

              <button type="submit" className={`submit-btn${!isValid ? ' disabled' : ''}`}
                disabled={!isValid || loading}>
                {loading ? 'MENYIMPAN...' : 'SIMPAN DAN LANJUTKAN'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .prolog-footer {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 430px;
          padding: 16px 20px;
          background: linear-gradient(to top, #1A1F26 70%, transparent);
          display: flex;
          justify-content: center;
          z-index: 10;
        }
        .masuk-btn {
          min-width: 160px;
          padding: 12px 32px;
          background: transparent;
          color: #FF6B35;
          border: 1px solid #FF6B35;
          border-radius: 6px;
          font-family: 'FiraCode', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          animation: glow-pulse 2s ease-in-out infinite;
          transition: background 0.2s, color 0.2s;
        }
        .masuk-btn.active,
        .masuk-btn:active {
          background: #FF6B35;
          color: #fff;
          animation: none;
        }
        @keyframes glow-pulse {
          0%,100% { box-shadow: 0 0 6px rgba(255,107,53,0.5), 0 0 0 1px #FF6B35; }
          50%      { box-shadow: 0 0 18px rgba(255,107,53,0.8), 0 0 0 1px #FF6B35; }
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 24px;
          animation: fade-in 0.2s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-box {
          background: #1A1F26;
          border: 1px solid rgba(245,247,250,0.2);
          border-radius: 10px;
          padding: 28px 24px;
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .modal-title {
          font-family: 'FiraSansCondensed', sans-serif;
          font-size: 22px;
          color: #F5F7FA;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .modal-subtitle {
          font-size: 13px;
          color: rgba(245,247,250,0.65);
          margin-top: -14px;
          line-height: 1.5;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .iw {
          position: relative;
          display: flex;
          align-items: center;
        }
        .ii {
          position: absolute;
          left: 12px;
          width: 18px;
          height: 18px;
          opacity: 0.45;
          filter: invert(1);
          pointer-events: none;
        }
        .ifield {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(245,247,250,0.25);
          border-radius: 6px;
          padding: 12px 12px 12px 42px;
          color: #F5F7FA;
          font-family: 'GoogleSans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }
        .ifield:focus { border-color: #3CE2FF; }
        .ifield::placeholder { color: rgba(245,247,250,0.35); font-style: italic; }
        .ifield[type=number]::-webkit-inner-spin-button,
        .ifield[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        .submit-btn {
          padding: 14px;
          background: transparent;
          color: #FF6B35;
          border: 1px solid #FF6B35;
          border-radius: 6px;
          font-family: 'FiraCode', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled),
        .submit-btn:active:not(:disabled) { background: #FF6B35; color: #fff; }
        .submit-btn.disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
    </>
  );
}
