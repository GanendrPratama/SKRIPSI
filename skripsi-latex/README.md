# Template LaTeX Skripsi UI 2025

Format monograf sesuai *Pedoman Penyelenggaraan Tugas Akhir dan Publikasi Karya Ilmiah UI 2025* (bab 10) dan *Template Tugas Akhir UI 2025*.

## Cara pakai

**Overleaf (paling mudah):** zip folder ini, *New Project → Upload Project*, lalu pastikan *Menu → Compiler = pdfLaTeX*. Biber dijalankan otomatis.

**Lokal (Arch Linux):**

```sh
sudo pacman -S texlive-basic texlive-latex texlive-latexrecommended texlive-latexextra \
  texlive-fontsrecommended texlive-langother texlive-bibtexextra \
  texlive-binextra biber
latexmk main.tex          # hasil: main.pdf
```

## Yang perlu diisi

1. Data di bagian atas `main.tex`: judul, nama, NPM, fakultas, prodi, pembimbing, penguji, bulan/tahun. Baris bertanda `% cek` adalah tebakan; sesuaikan.
2. Logo UI hitam berdiameter 2,5 cm di `gambar/logo-ui.png` atau `gambar/logo-ui.pdf`. Tanpa file ini, sampul menampilkan kotak placeholder.
3. Pilih satu pernyataan di `awal/pernyataan-ai.tex`.
4. Isi bab di `bab/`. Tulis judul bab dengan huruf kapital, misalnya `\chapter{PENDAHULUAN}`.
5. Referensi: Zotero (Better BibTeX, *Keep updated*) mengekspor otomatis ke `referensi.bib`. Entri tulisan tangan masuk ke `manual.bib`, yang tidak pernah ditimpa. Kutip dengan `\cite{kunci}`.

## Perintah tambahan

| Perintah | Fungsi |
| --- | --- |
| `\asing{...}` | Istilah asing dicetak miring |
| `\sumber{...}` | Baris "Sumber: ..." di bawah tabel atau gambar |
| `\uilampiran` | Mulai lampiran (judul "LAMPIRAN 1", ...) |

## Aturan yang sudah diterapkan

| Aturan | Nilai |
| --- | --- |
| Kertas dan margin | A4, 3 cm di semua sisi |
| Huruf | Times (mathptmx) 12 pt, rata kiri-kanan |
| Spasi | 1,5 (stretch 1,43, setara "1.5 lines" Word) |
| Judul bab | "BAB n" + judul, kapital, tebal, tengah, satu spasi, halaman baru |
| Subbab | Maksimal 3 derajat (1.1.1.1) |
| Nomor halaman awal | Romawi kecil, tengah bawah 2,5 cm; halaman judul = i tanpa nomor |
| Nomor halaman isi | Arab, kanan atas 1,5 cm dari tepi atas |
| Footer | "Universitas Indonesia" Helvetica (pengganti Arial) 10 pt tebal, rata kanan, mulai Abstrak |
| Tabel/gambar | Keterangan tabel di atas, gambar di bawah, bernomor per bab |
| Referensi | IEEE bernomor (biblatex-ieee); ganti `style=` di `ui-thesis.sty` jika gaya lain ditetapkan |

## Catatan

- Dokumen dicetak satu sisi (`oneside`), jadi nomor halaman selalu di kanan atas. Jika dicetak bolak-balik, pedoman meminta nomor di kiri atas untuk halaman kiri.
- Halaman Orisinalitas, Pengesahan, dan Persetujuan Publikasi diunggah sebagai berkas kelengkapan, tetapi tidak masuk repositori UI (pedoman 10.10, 10.12, 10.14).
- Sudah dikompilasi bersih (0 error, 0 warning) dengan TeX Live 2026 + Biber pada 2026-11-11; hasilnya 24 halaman.
- biblatex belum mendukung bahasa Indonesia, jadi istilah di daftar referensi (et al., pp., in) memakai bahasa Inggris, seperti umumnya gaya IEEE.
