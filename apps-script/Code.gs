/**
 * ATonauts Misi 1.0 — Google Apps Script
 *
 * CARA DEPLOY:
 * 1. Buka Google Sheets yang ingin digunakan untuk menyimpan data
 * 2. Klik menu: Extensions → Apps Script
 * 3. Hapus isi editor, paste seluruh kode ini
 * 4. Klik "Deploy" → "New deployment"
 * 5. Pilih tipe: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone" (agar siswa bisa submit tanpa login)
 * 8. Klik Deploy → salin URL yang diberikan
 * 9. Paste URL tersebut ke file src/config.js di project ATonauts
 */

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      app: 'ATonauts Sheets Receiver',
      spreadsheet: SpreadsheetApp.getActiveSpreadsheet().getName(),
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // A classroom can submit many responses at once. Serialize writes so rows
    // and headers cannot collide with each other.
    lock.waitLock(30000);
    const data = JSON.parse(e.postData.contents || '{}');
    const sheetName = data.sheet || 'Jawaban';
    const payload = data.payload || {};

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);

    // Auto-create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    const headers = ensureHeaders(sheet, payload);
    const values = headers.map(header => serializeValue(payload[header]));
    upsertRow(sheet, headers, values, payload);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function ensureHeaders(sheet, payload) {
  const preferredOrder = [
    'Waktu Kirim',
    'Nama',
    'Kelas',
    'Absen',
    'Anomali',
    'Pertanyaan 1',
    'Pertanyaan 2',
    'Dugaan 1',
    'Dugaan 2',
    'M4 Posisi Debrizz 1',
    'M4 Alasan Debrizz 1',
    'M4 Temuan 4.1',
    'M4 Posisi Debrizz 2',
    'M4 Alasan Debrizz 2',
    'M4 Posisi Debrizz 3',
    'M4 Alasan Debrizz 3',
    'M4 Waktu Gula A',
    'M4 Waktu Gula B',
    'M4 Gula Lebih Cepat',
    'M4 Analisis Variabel',
    'M4 Aplikasi Baterai',
    'M4 Temuan 4.2',
    'M4 Posisi Debrizz 4',
    'M4 Alasan Debrizz 4',
    'M5 Temuan 1',
    'M5 Pemahaman 1',
    'M5 Bukti 1',
    'M5 Keraguan 1',
    'M5 Temuan 2',
    'M5 Pemahaman 2',
    'M5 Bukti 2',
    'M5 Keraguan 2',
    'M5 Posisi Rosetta',
    'M5 Alasan Rosetta',
    'M5 Keraguan Rosetta',
    'M5 Evaluasi Rosetta',
    'M5 Bukti Rosetta',
    'M6 Opini Manfaat',
    'M6 Bukti Manfaat',
    'M6 Opini Risiko',
    'M6 Bukti Risiko',
    'M6 Masa Depan',
    'response_id'
  ];
  const payloadKeys = Object.keys(payload);
  const orderedKeys = preferredOrder
    .filter(key => payloadKeys.includes(key))
    .concat(payloadKeys.filter(key => !preferredOrder.includes(key)));

  if (sheet.getLastRow() === 0) {
    ensureColumnCapacity(sheet, orderedKeys.length);
    sheet.appendRow(orderedKeys);
    styleHeader(sheet, orderedKeys.length);
    return orderedKeys;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].filter(Boolean);
  const missingHeaders = orderedKeys.filter(key => !headers.includes(key));

  if (missingHeaders.length > 0) {
    ensureColumnCapacity(sheet, headers.length + missingHeaders.length);
    sheet.getRange(1, headers.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
    headers.push(...missingHeaders);
    styleHeader(sheet, headers.length);
  }

  return headers;
}

function upsertRow(sheet, headers, values, payload) {
  ensureColumnCapacity(sheet, headers.length);
  const responseId = payload.response_id;
  const responseIdColumn = headers.indexOf('response_id') + 1;

  if (!responseId || responseIdColumn === 0 || sheet.getLastRow() <= 1) {
    sheet.appendRow(values);
    return;
  }

  const rowCount = sheet.getLastRow() - 1;
  const existingValues = sheet.getRange(2, responseIdColumn, rowCount, 1).getValues();
  const existingIndex = existingValues.findIndex(row => row[0] === responseId);

  if (existingIndex === -1) {
    sheet.appendRow(values);
    return;
  }

  sheet.getRange(existingIndex + 2, 1, 1, headers.length).setValues([values]);
}

function ensureColumnCapacity(sheet, requiredColumns) {
  const currentColumns = sheet.getMaxColumns();
  if (currentColumns < requiredColumns) {
    sheet.insertColumnsAfter(currentColumns, requiredColumns - currentColumns);
  }
}

function serializeValue(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  const text = String(value);
  // Prevent learner input from being interpreted as a spreadsheet formula.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function styleHeader(sheet, width) {
  sheet.getRange(1, 1, 1, width)
    .setFontBold(true)
    .setBackground('#1A1F26')
    .setFontColor('#3CE2FF');
}

// Test function — jalankan dari editor untuk cek koneksi
function testPost() {
  const mock = {
    postData: {
      contents: JSON.stringify({
        sheet: 'Jawaban',
        payload: {
          'Waktu Kirim': new Date().toLocaleString('id-ID'),
          'Nama': 'Test User',
          'Kelas': 'X-1',
          'Absen': '1',
          'Anomali': 'Baterai makin tipis tetapi kapasitasnya meningkat.',
          'Pertanyaan 1': 'Mengapa baterai modern bisa lebih kecil tetapi lebih tahan lama?',
          'Pertanyaan 2': 'Bagaimana bahan baterai memengaruhi kapasitas penyimpanan energi?',
          'Dugaan 1': 'Menurutku bahan baterainya berubah sehingga energi tersimpan lebih banyak.',
          'Dugaan 2': 'Menurutku desain atom dan reaksi redoksnya lebih efisien.',
          'response_id': 'test-user__x-1__1'
        }
      })
    }
  };
  const result = doPost(mock);
  Logger.log(result.getContent());
}
