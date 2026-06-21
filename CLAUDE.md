# ATonauts Misi 1.0 — Project Context

## Deskripsi Proyek
Interactive ebook berbasis web untuk siswa SMA (Kurikulum Merdeka). Topik: investigasi teknologi baterai ponsel modern / energi hijau. Tema visual: dark mode, sci-fi/misi, mirip tampilan buku di layar.

## Tech Stack
- **Astro v6** — file-based routing, Content Collections, ClientRouter (View Transitions)
- **React** — hanya untuk islands interaktif (PrologController, KapsulWaktu, VideoPlayer)
- **Nano Stores + @nanostores/persistent** — state lintas halaman, auto-sync ke localStorage
- **Vanilla CSS** — no Tailwind, semua custom properties

## Menjalankan Project
```bash
# Gunakan Node 25 (sistem pakai Node 20 yang tidak kompatibel)
/usr/local/Cellar/node/25.2.1/bin/node ./node_modules/.bin/astro dev

# Build
/usr/local/Cellar/node/25.2.1/bin/node ./node_modules/.bin/astro build
```

## Alur Halaman
```
/ (Cover)
  → /prolog (Prolog + video + tim)
    → [modal Login] (nama/kelas/absen → localStorage + Sheets)
      → /operasi (info statis: timeline misi + stakeholder)
        → /misi/misi-01 (Temukan Anomali)
          → /misi/misi-02 (Kemukakan Pertanyaan)
            → /misi/misi-03 (Duga Dulu, Uji Nanti!)
              → /selesai
```

## Arsitektur Penting

### Content Collections — Kunci Sustainability
Setiap misi = satu file JSON di `src/content/missions/`. Menambah misi baru cukup tambah file JSON, tidak perlu ubah kode apapun. Dynamic route `src/pages/misi/[slug].astro` otomatis menangani semua misi.

### Islands Architecture
| Komponen | Type | Alasan |
|---|---|---|
| `PrologController.jsx` | React island | MASUK button + LoginModal state |
| `VideoPlayer.jsx` | React island | Video play/pause state |
| `KapsulWaktu.jsx` | React island | Textarea state, auto-resize, Sheets POST |
| Semua komponen lain | Astro static | Tidak butuh JS |

### State (Nano Stores)
```js
// src/stores/user.js
identity  → { nama, kelas, absen }         — localStorage key: atonauts_identity:
answers   → { misi_01_anomali, ... }       — localStorage key: atonauts_answers:
progress  → number                          — localStorage key: atonauts_progress
```

### Google Sheets Integration
- File: `apps-script/Code.gs` — di-deploy client sebagai Google Apps Script Web App
- Config: `src/config.js` — isi `APPS_SCRIPT_URL` setelah client deploy
- Utility: `src/utils/sheets.js` — `postToSheets(sheetName, payload)`, fire-and-forget, `mode: 'no-cors'`

## Design System
```css
--bg:       #1A1F26   /* dark background */
--cyan:     #3CE2FF   /* accent utama */
--orange:   #FF6B35   /* tombol navigasi, CTA */
--light:    #F5F7FA   /* teks utama */
--teal:     #0D9488   /* tombol primer */

--font-heading:  FiraSansCondensed
--font-body:     GoogleSans
--font-tag:      FiraCode
--font-caption:  GoogleSansCode
```

## File Aset
### Tersedia di `public/assets/`
- `images/` — 00_Cover.png, Header_Today_sNano.png, foto_tim_1/2/3
- `icons/` — semua SVG (Capsule, Chain, Different, End, Play, Question, Arrow, dll.)
- `fonts/` — FiraCode, FiraSansCondensed, GoogleSans, GoogleSansCode

### BELUM ADA (placeholder SVG sudah dipasang, ganti saat asset datang)
- `public/assets/video/prolog_intro.mp4`
- `public/assets/images/Phonecell_Today'sNano.png`
- `public/assets/images/HighLightBox_1_Today'sNano.png`
- `public/assets/images/HighLightBox_2_Today'sNano.png`
- Icon form login asli: avatar_icons.png, class_icons.png, archive_icons.png

## Cara Tambah Misi Baru
1. Buat `src/content/missions/misi-04.json` (ikuti schema misi-01/02/03)
2. Update `navigation.next` di misi sebelumnya
3. Jika misi punya konten custom (bukan artikel berita), tambahkan case di `[slug].astro`
4. Done — route `/misi/misi-04` otomatis aktif

## Deployment
Output statis di `dist/`. Drag & drop ke Netlify atau Vercel. Tidak butuh server.

## Catatan Node.js
Sistem menggunakan Node 20.11.0 (tidak kompatibel dengan Astro v6). Selalu gunakan path penuh: `/usr/local/Cellar/node/25.2.1/bin/node` untuk semua perintah npm/astro.
