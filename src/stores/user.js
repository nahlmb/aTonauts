import { persistentMap, persistentAtom } from '@nanostores/persistent';

export const identity = persistentMap('atonauts_identity:', {
  nama: '',
  kelas: '',
  absen: '',
});

export const answers = persistentMap('atonauts_answers:', {
  misi_01_anomali: '',
  misi_02_pertanyaan_1: '',
  misi_02_pertanyaan_2: '',
  misi_03_dugaan_1: '',
  misi_03_dugaan_2: '',
});

export const progress = persistentAtom('atonauts_progress', '0');
