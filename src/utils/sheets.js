import { APPS_SCRIPT_URL } from '../config.js';

export async function postToSheets(sheetName, payload) {
  if (!APPS_SCRIPT_URL) return; // skip if not configured yet

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheet: sheetName, payload }),
    });
  } catch {
    // fire-and-forget — don't block user on network failure
  }
}
