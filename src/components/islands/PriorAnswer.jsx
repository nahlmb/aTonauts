import { useEffect, useState } from 'react';
import { answers } from '../../stores/user.js';

export default function PriorAnswer({ answerKey, emptyText = 'Belum ada jawaban tersimpan.' }) {
  const [value, setValue] = useState('');
  useEffect(() => setValue(answers.get()[answerKey] || ''), [answerKey]);
  return <p className={`prior-answer${value ? '' : ' empty'}`}>{value || emptyText}<style>{`
    .prior-answer { padding: 11px; border-left: 2px solid #3CE2FF; background: rgba(60,226,255,.04); color: rgba(245,247,250,.78); font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
    .prior-answer.empty { color: rgba(245,247,250,.35); font-style: italic; }
  `}</style></p>;
}
