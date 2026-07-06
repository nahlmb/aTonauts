import { useEffect, useState } from 'react';
import { answers, createSessionId, identity, resetUserData, sessionId } from '../../stores/user.js';
import { SHEET_RESPONSES } from '../../config.js';
import { postToSheets } from '../../utils/sheets.js';

export default function SubmitFinalResponses() {
  const [status, setStatus] = useState('sending');

  useEffect(() => {
    let cancelled = false;

    async function submit() {
      const student = identity.get();
      const savedAnswers = answers.get();
      const activeSessionId = sessionId.get() || createSessionId();
      sessionId.set(activeSessionId);

      const payload = {
        'Waktu Kirim': new Date().toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        'Nama': student.nama || '',
        'Kelas': student.kelas || '',
        'Absen': student.absen || '',
        'Anomali': savedAnswers.misi_01_anomali || '',
        'Pertanyaan 1': savedAnswers.misi_02_pertanyaan_1 || '',
        'Pertanyaan 2': savedAnswers.misi_02_pertanyaan_2 || '',
        'Dugaan 1': savedAnswers.misi_03_dugaan_1 || '',
        'Dugaan 2': savedAnswers.misi_03_dugaan_2 || '',
        'response_id': activeSessionId,
      };

      const result = await postToSheets(SHEET_RESPONSES, payload);
      if (cancelled) return;
      setStatus(result.ok ? 'sent' : 'failed');
      if (result.ok) {
        resetUserData();
      }
    }

    submit();

    return () => {
      cancelled = true;
    };
  }, []);

  const message = {
    sending: 'Mengirim rekap jawaban...',
    sent: 'Rekap jawaban sudah terkirim.',
    failed: 'Rekap tersimpan di perangkat ini. Coba muat ulang halaman saat koneksi stabil.',
  }[status];

  return <p className={`submit-status submit-status-${status}`}>{message}</p>;
}
