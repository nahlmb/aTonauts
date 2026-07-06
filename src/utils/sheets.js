import { APPS_SCRIPT_URL } from '../config.js';

export async function postToSheets(sheetName, payload) {
  if (!APPS_SCRIPT_URL?.trim()) {
    return { ok: false, skipped: true };
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ sheet: sheetName, payload }),
      keepalive: true,
    });
    return { ok: true };
  } catch {
    // Fire-and-forget: don't block the learner on network failure.
    return { ok: false };
  }
}
