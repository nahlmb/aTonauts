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
  try {
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
    'response_id'
  ];
  const payloadKeys = Object.keys(payload);
  const orderedKeys = preferredOrder
    .filter(key => payloadKeys.includes(key))
    .concat(payloadKeys.filter(key => !preferredOrder.includes(key)));

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(orderedKeys);
    styleHeader(sheet, orderedKeys.length);
    return orderedKeys;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].filter(Boolean);
  const missingHeaders = orderedKeys.filter(key => !headers.includes(key));

  if (missingHeaders.length > 0) {
    sheet.getRange(1, headers.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
    headers.push(...missingHeaders);
    styleHeader(sheet, headers.length);
  }

  return headers;
}

function upsertRow(sheet, headers, values, payload) {
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

function serializeValue(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
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
