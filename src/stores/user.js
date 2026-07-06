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
