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
      const hasIdentity = Boolean(student.nama || student.kelas || student.absen);
      const hasAnswers = Object.values(savedAnswers).some((value) => String(value || '').trim());

      if (!hasIdentity && !hasAnswers) {
        if (!cancelled) setStatus('nothing');
        return;
      }

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
        'M4 Posisi Debrizz 1': savedAnswers.misi_04_debrizz_1_posisi || '',
        'M4 Alasan Debrizz 1': savedAnswers.misi_04_debrizz_1_alasan || '',
        'M4 Temuan 4.1': savedAnswers.misi_04_temuan_41 || '',
        'M4 Posisi Debrizz 2': savedAnswers.misi_04_debrizz_2_posisi || '',
        'M4 Alasan Debrizz 2': savedAnswers.misi_04_debrizz_2_alasan || '',
        'M4 Posisi Debrizz 3': savedAnswers.misi_04_debrizz_3_posisi || '',
        'M4 Alasan Debrizz 3': savedAnswers.misi_04_debrizz_3_alasan || '',
        'M4 Waktu Gula A': savedAnswers.misi_04_gula_a || '',
        'M4 Waktu Gula B': savedAnswers.misi_04_gula_b || '',
        'M4 Gula Lebih Cepat': savedAnswers.misi_04_gula_lebih_cepat || '',
        'M4 Analisis Variabel': savedAnswers.misi_04_analisis_variabel || '',
        'M4 Aplikasi Baterai': savedAnswers.misi_04_aplikasi_baterai || '',
        'M4 Temuan 4.2': savedAnswers.misi_04_temuan_42 || '',
        'M4 Posisi Debrizz 4': savedAnswers.misi_04_debrizz_4_posisi || '',
        'M4 Alasan Debrizz 4': savedAnswers.misi_04_debrizz_4_alasan || '',
        'M5 Temuan 1': savedAnswers.misi_05_temuan_1 || '',
        'M5 Pemahaman 1': savedAnswers.misi_05_pemahaman_1 || '',
        'M5 Bukti 1': savedAnswers.misi_05_bukti_1 || '',
        'M5 Keraguan 1': savedAnswers.misi_05_ragu_1 || '',
        'M5 Temuan 2': savedAnswers.misi_05_temuan_2 || '',
        'M5 Pemahaman 2': savedAnswers.misi_05_pemahaman_2 || '',
        'M5 Bukti 2': savedAnswers.misi_05_bukti_2 || '',
        'M5 Keraguan 2': savedAnswers.misi_05_ragu_2 || '',
        'M5 Posisi Rosetta': savedAnswers.misi_05_rosetta_posisi || '',
        'M5 Alasan Rosetta': savedAnswers.misi_05_rosetta_alasan || '',
        'M5 Keraguan Rosetta': savedAnswers.misi_05_rosetta_ragu || '',
        'M5 Evaluasi Rosetta': savedAnswers.misi_05_rosetta_evaluasi || '',
        'M5 Bukti Rosetta': savedAnswers.misi_05_rosetta_bukti || '',
        'M6 Opini Manfaat': savedAnswers.misi_06_manfaat_opini || '',
        'M6 Bukti Manfaat': savedAnswers.misi_06_manfaat_bukti || '',
        'M6 Opini Risiko': savedAnswers.misi_06_risiko_opini || '',
        'M6 Bukti Risiko': savedAnswers.misi_06_risiko_bukti || '',
        'M6 Masa Depan': savedAnswers.misi_06_masa_depan || '',
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
    nothing: 'Tidak ada rekap baru yang perlu dikirim.',
  }[status];

  return <p className={`submit-status submit-status-${status}`}>{message}</p>;
}
