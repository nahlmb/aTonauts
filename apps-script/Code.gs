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

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet || 'Responses';
    const payload = data.payload || {};

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);

    // Auto-create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Auto-create header row on first use
    if (sheet.getLastRow() === 0) {
      const headers = Object.keys(payload);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontBold(true)
        .setBackground('#1A1F26')
        .setFontColor('#3CE2FF');
    }

    // Append data row
    const values = Object.values(payload).map(v =>
      typeof v === 'object' ? JSON.stringify(v) : String(v)
    );
    sheet.appendRow(values);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — jalankan dari editor untuk cek koneksi
function testPost() {
  const mock = {
    postData: {
      contents: JSON.stringify({
        sheet: 'Identitas',
        payload: {
          nama: 'Test User',
          kelas: 'X-1',
          absen: '1',
          timestamp: new Date().toISOString()
        }
      })
    }
  };
  const result = doPost(mock);
  Logger.log(result.getContent());
}
