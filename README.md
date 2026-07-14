# ATonauts Misi 1.0

Buku interaktif berbasis Astro untuk misi investigasi teknologi baterai.

## Menyimpan Input Siswa

Penyimpanan data memakai Google Sheets + Google Apps Script. Admin melihat input dari file Google Sheet yang sama.

### 1. Siapkan Google Sheet

1. Buat Google Sheet baru, misalnya `ATonauts Responses`.
2. Buka menu `Extensions` -> `Apps Script`.
3. Hapus isi editor Apps Script.
4. Salin seluruh isi [apps-script/Code.gs](apps-script/Code.gs) ke editor.
5. Klik `Deploy` -> `New deployment`.
6. Pilih type `Web app`.
7. Set `Execute as` ke `Me`.
8. Set `Who has access` ke `Anyone`.
9. Klik `Deploy`, lalu salin `Web app URL`.

### 2. Sambungkan ke aplikasi

Paste URL dari deployment ke [src/config.js](src/config.js):

```js
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';
```

Selama `APPS_SCRIPT_URL` masih kosong, data hanya tersimpan di browser siswa lewat `localStorage`, belum masuk ke admin.

### 3. Cara admin melihat input

Buka Google Sheet tadi. Script akan otomatis membuat satu tab bernama `Jawaban`.

Setiap siswa menjadi satu baris dengan kolom sederhana:

- `Waktu Kirim`
- `Nama`
- `Kelas`
- `Absen`
- `Anomali`
- `Pertanyaan 1`
- `Pertanyaan 2`
- `Dugaan 1`
- `Dugaan 2`
- Seluruh posisi dan alasan dialog `Debrizz` pada Misi 04
- Temuan ATolabs 4.1 dan 4.2 serta hasil eksperimen gula
- Perbandingan hipotesis, temuan, dan refleksi `Rosetta` pada Misi 05
- Lima log refleksi akhir pada Misi 06

Kolom `response_id` dibuat unik untuk setiap sesi pengerjaan. Setelah rekap berhasil dikirim dari halaman selesai, data lokal siswa akan direset sehingga saat kembali ke awal mereka mengisi dari kosong lagi.

### Troubleshooting

Kalau data belum masuk:

1. Pastikan kode [apps-script/Code.gs](apps-script/Code.gs) sudah dipaste ke Apps Script yang terhubung ke Google Sheet.
2. Klik `Deploy` -> `Manage deployments` -> icon edit -> pilih `New version` -> `Deploy`.
3. Pastikan setting deployment:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
4. Buka `APPS_SCRIPT_URL` langsung di browser. Jika benar, akan muncul JSON dengan `status: "ok"`.
5. Kalau yang muncul halaman Google Drive error / 401, berarti deployment belum publik atau URL yang dipakai bukan URL Web App `/exec` terbaru.

## Menjalankan Project

Project ini memakai Astro v6 dan butuh Node versi baru. Di mesin lokal saat ini gunakan path Node berikut:

```sh
/usr/local/Cellar/node/25.2.1/bin/node ./node_modules/.bin/astro dev
```

Build:

```sh
/usr/local/Cellar/node/25.2.1/bin/node ./node_modules/.bin/astro build
```

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Struktur Penting

- [src/components/islands/PrologController.jsx](src/components/islands/PrologController.jsx) menyimpan identitas awal di browser.
- [src/components/islands/KapsulWaktu.jsx](src/components/islands/KapsulWaktu.jsx) menyimpan jawaban misi di browser.
- [src/components/islands/DebrizzPanel.jsx](src/components/islands/DebrizzPanel.jsx) menangani dialog posisi dan alasan pada Misi 04.
- [src/components/islands/SavedChoice.jsx](src/components/islands/SavedChoice.jsx) menyimpan pilihan tunggal lintas halaman.
- [src/components/islands/RosettaTools.jsx](src/components/islands/RosettaTools.jsx) menyediakan salin prompt dan timer konsultasi 30 menit.
- [src/components/islands/TransmissionPanel.jsx](src/components/islands/TransmissionPanel.jsx) menyiapkan surat refleksi dan konfirmasi transmisi pribadi.
- [src/components/islands/SubmitFinalResponses.jsx](src/components/islands/SubmitFinalResponses.jsx) mengirim semua respons sekaligus saat halaman selesai dibuka.
- [src/utils/sheets.js](src/utils/sheets.js) mengirim rekap data ke Apps Script.
- [apps-script/Code.gs](apps-script/Code.gs) menerima data dan menulisnya ke Google Sheets.

## Alur Lengkap

```text
/ → /prolog → /operasi
  → /misi/misi-01 → /misi/misi-02 → /misi/misi-03
  → /misi/misi-04 → /misi/misi-05 → /misi/misi-06
  → /epilog → /kamus → /daftar-bacaan → /selesai
```

Video prolog `/assets/video/prolog_intro.mp4` sengaja dibiarkan sebagai aset eksternal yang dapat ditambahkan kemudian.
