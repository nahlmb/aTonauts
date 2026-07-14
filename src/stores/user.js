import { persistentMap, persistentAtom } from '@nanostores/persistent';

export const initialIdentity = {
  nama: '',
  kelas: '',
  absen: '',
};

export const initialAnswers = {
  misi_01_anomali: '',
  misi_02_pertanyaan_1: '',
  misi_02_pertanyaan_2: '',
  misi_03_dugaan_1: '',
  misi_03_dugaan_2: '',
  misi_04_debrizz_1_posisi: '',
  misi_04_debrizz_1_alasan: '',
  misi_04_debrizz_2_posisi: '',
  misi_04_debrizz_2_alasan: '',
  misi_04_debrizz_3_posisi: '',
  misi_04_debrizz_3_alasan: '',
  misi_04_debrizz_4_posisi: '',
  misi_04_debrizz_4_alasan: '',
  misi_04_temuan_41: '',
  misi_04_gula_a: '',
  misi_04_gula_b: '',
  misi_04_gula_lebih_cepat: '',
  misi_04_analisis_variabel: '',
  misi_04_aplikasi_baterai: '',
  misi_04_temuan_42: '',
  misi_05_temuan_1: '',
  misi_05_pemahaman_1: '',
  misi_05_bukti_1: '',
  misi_05_ragu_1: '',
  misi_05_temuan_2: '',
  misi_05_pemahaman_2: '',
  misi_05_bukti_2: '',
  misi_05_ragu_2: '',
  misi_05_rosetta_posisi: '',
  misi_05_rosetta_alasan: '',
  misi_05_rosetta_ragu: '',
  misi_05_rosetta_evaluasi: '',
  misi_05_rosetta_bukti: '',
  misi_06_manfaat_opini: '',
  misi_06_manfaat_bukti: '',
  misi_06_risiko_opini: '',
  misi_06_risiko_bukti: '',
  misi_06_masa_depan: '',
};

export const identity = persistentMap('atonauts_identity:', {
  ...initialIdentity,
});

export const answers = persistentMap('atonauts_answers:', {
  ...initialAnswers,
});

export const progress = persistentAtom('atonauts_progress', '0');
export const sessionId = persistentAtom('atonauts_session_id', '');

export function createSessionId() {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);

  return `atonauts_${Date.now()}_${randomPart}`;
}

export function resetUserData() {
  identity.set({ ...initialIdentity });
  answers.set({ ...initialAnswers });
  progress.set('0');
  sessionId.set('');
}
