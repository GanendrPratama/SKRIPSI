# Rencana Skripsi

**Judul (lama, perlu diganti):** Pengaplikasian Priority-Based Scheduling untuk Sistem LLM Multi-Agent dalam Konteks Sistem Keamanan Siber

**Judul usulan utama (2026-11-19, belum disetujui pembimbing):** *Analisis Trade-off Akurasi dan Penggunaan Sumber Daya antara Model Tunggal dan LLM Council pada Agen Verifikasi Kerentanan dalam Sistem Multi-Agent Berbasis LLM Lokal*

*English:* Accuracy–Resource Trade-off Analysis of Single-Model and LLM Council Approaches for the Vulnerability Verification Agent in a Local LLM-Based Multi-Agent System

Alasan: resources masuk judul (arahan pembimbing 2026-11-19); "analisis trade-off" tetap valid walaupun council kalah dari single/SC; cakupan jelas hanya Agen Verifikasi. Alternatif ada di §0 "Usulan judul".

**Judul usulan sebelumnya (2026-11-10, digantikan):** *Perbandingan Single-Model dan LLM Council pada Agen Verifikasi Kerentanan dalam Sistem LLM Multi-Agent Lokal*

> **⚠️ Pivot 2026-11-10 (setelah diskusi dengan pembimbing).** Fokus skripsi berubah. Bagian §0 di bawah adalah arah yang berlaku; §1–§7 dipertahankan sebagai riwayat dan sudah ditandai di bagian yang tidak berlaku lagi.

---

## 0. Arah yang berlaku (2026-11-10)

**Problem statement (2026-11-22, draf):**

> Perkembangan AI turut mempercepat penemuan kerentanan, sehingga jumlah CVE yang dipublikasikan terus meningkat *[perlu sitasi: statistik CVE/NVD per tahun]*. Usaha kecil dan menengah umumnya tidak mampu membentuk tim keamanan siber khusus, sehingga sistem manajemen kerentanan berbasis AI dapat menjadi alternatif. Namun, sistem semacam ini umumnya bergantung pada LLM berbasis *cloud*. Akibatnya, data sensitif organisasi (layanan yang berjalan, konfigurasi sistem, dan kerentanan yang ditemukan) dikirim ke pihak ketiga dan berisiko bocor. LLM publik juga menolak membuat kode verifikasi kerentanan. Karena itu, sistem perlu dijalankan secara *self-hosted*. Akan tetapi, *self-hosting* memiliki kendala sumber daya. Pada skripsi dasar, Agen Verifikasi yang berjalan lokal memakan 57% waktu eksekusi dan tidak berhasil memverifikasi satu kerentanan pun. Penelitian ini mengusulkan pendekatan *self-hosted* dengan vLLM sebagai *serving engine* dan *LLM council* untuk Agen Verifikasi. Penelitian ini juga menganalisis apakah peningkatan akurasi dari *council* sepadan dengan tambahan penggunaan sumber daya (token, latensi, VRAM, dan energi) dibandingkan model tunggal.

Pemetaan ke skripsi dasar: risiko privasi cloud = keterbatasan #2; penolakan kode eksploit oleh LLM publik = keterbatasan #5; verifier lokal lambat dan gagal = keterbatasan #4 (hlm. 46–47).

**Keputusan:**
1. **vLLM disetujui** sebagai serving engine (menggantikan Ollama).
2. **n8n tetap dipakai** sebagai orchestrator workflow. n8n memanggil vLLM lewat endpoint OpenAI-compatible (`/v1/chat/completions`). Ini membatalkan rencana §4 yang mengganti n8n dengan Python async.
3. **Fokus utama: Agen Verifikasi.** Pertanyaan riset: apakah **LLM council** (beberapa model berbeda yang memverifikasi lalu hasilnya digabung) lebih baik daripada **single model** untuk tugas verifikasi kerentanan?
4. **Agen lain (Direktur, Pencari, Peneliti, Pengamat Teknis) harus bisa berjalan lokal**, tapi tidak dioptimasi atau dievaluasi mendalam; mereka hanya infrastruktur.
5. **Priority-based scheduling bukan lagi kontribusi utama.** Literatur §3.1 turun menjadi latar belakang (justifikasi vLLM).

**Motivasi dari skripsi dasar:** keterbatasan #4 Ivander: verifier lokal di CPU memakan 57% waktu eksekusi dan **tidak memverifikasi satu kerentanan pun**. Agen verifikasi adalah titik terlemah sistem, jadi masuk akal menjadi fokus.

**Rumusan masalah (draf):**
- RQ1: Apakah LLM council menghasilkan verifikasi yang lebih akurat (precision/recall/F1, false-positive rate) daripada single model terbaik pada perangkat keras lokal yang sama?
- RQ2: Berapa biaya tambahannya (latensi, token, VRAM) dan apakah sepadan?
- RQ3: Strategi agregasi mana yang paling baik untuk output berupa kode: **(a) seleksi kode oleh chairman** atau **(b) vote atas hasil eksekusi**? Keduanya diuji (keputusan 2026-11-22). Weighted vote menjadi varian opsional dari (b).

**Desain eksperimen (draf):**
| Konfigurasi | Isi | Fungsi |
|---|---|---|
| S1–S3: Single model | Masing-masing model kandidat sendirian | Baseline; cari single model terbaik |
| SC-vote: Self-consistency (b) | Single model terbaik, *k* = 3 kode → semua yang lolos tinjauan dijalankan → majority vote atas hasil eksekusi | **Kontrol wajib** untuk C-vote: memisahkan efek "model yang beragam" dari efek "sekadar lebih banyak sampel" |
| SC-chair: Self-consistency (a) | Single model terbaik, *k* = 3 kode → chairman memilih satu → dijalankan | **Kontrol wajib** untuk C-chair |
| C-vote: Council, agregasi (b) | 3 model berbeda masing-masing membuat kode → Pengamat Teknis meninjau tiap kode → semua yang lolos dijalankan di target → majority vote atas hasil (rentan/tidak) | Agregasi atas *bukti eksekusi* |
| C-chair: Council, agregasi (a) | 3 model berbeda masing-masing membuat kode → (opsional) saling menilai secara anonim → chairman memilih satu kode (atau menyintesis) → Pengamat Teknis meninjau → dijalankan sekali | Pola LLM council ala Karpathy; agregasi *sebelum* eksekusi |

Aturan agregasi (b): kode yang ditolak Pengamat Teknis, gagal dijalankan, atau berasal dari anggota yang menolak dihitung sebagai suara *abstain*. Jika semua abstain → hasil "tidak terverifikasi". Jika seri (mis. 1 rentan, 1 tidak, 1 abstain) → aturan konservatif "tidak terverifikasi" untuk menekan false positive. Aturan ini ditetapkan sebelum eksperimen dan dilaporkan. Model chairman pada (a) harus sama untuk SC-chair dan C-chair.

Trade-off yang diharapkan: (b) memakai lebih banyak eksekusi di target dan lebih banyak panggilan Pengamat Teknis (hingga 3×), tetapi keputusannya berbasis bukti nyata. (a) lebih hemat karena hanya satu eksekusi, tetapi bergantung pada kemampuan chairman menilai kode tanpa menjalankannya. Kedua biaya ini masuk metrik resources. Catat juga jumlah eksekusi di target per kasus.

Tanpa kontrol SC, penguji bisa berargumen bahwa council menang hanya karena memakai komputasi lebih banyak.

**Arsitektur pengujian dan kontrol skripsi Ivander (2026-11-22, draf):**

*Arsitektur skripsi dasar (Bab 3.2.3 dan 4.1.1):* jaringan lokal VMware `192.168.182.0/24` berisi server n8n (`.1`, Docker, NAT ke internet), server target (`.2`), server Ollama (`.3`, juga host VMware), dan server proksi (`.5`, reverse SSH tunnel karena SSH target terlalu tua). Direktur, Pencari, Peneliti, dan Pengamat Teknis memakai **Gemma 4 31B via Google ADK (cloud)**. Agen Verifikasi memakai **Dolphin-Phi 2.7B di CPU (Ollama)**. Data CVE berasal dari OpenCVE API dan laporan dikirim lewat Telegram. Skenario uji: target menjalankan **5, 10, 15, dan 20 layanan**. Hasil acuan (Tabel 4.2): sekitar 93–117 ribu token dan 25–30 menit per eksekusi; Agen Verifikasi memakan 57% waktu; 0 kerentanan terverifikasi.

*Alur verifikasi di skripsi dasar:* Agen Verifikasi **membuat kode verifikasi** dari spesifikasi teknis yang diberikan Agen Peneliti. Agen Pengamat Teknis **meninjau kode tersebut**, dan jika lolos, **menjalankannya di target lewat SSH**. Jadi "verifikasi" berarti membuat dan menjalankan kode, bukan sekadar menilai bukti teks. Ini menjawab salah satu keputusan terbuka di bawah.

*Konfigurasi uji:*
| Kode | Agen lain | Agen Verifikasi | Fungsi |
|---|---|---|---|
| **B0: Ivander asli** | Gemma 4 31B (Google ADK, cloud) | Dolphin-Phi 2.7B, CPU, Ollama | **Kontrol.** Mereproduksi hasil skripsi dasar di testbed yang sama |
| **B1: Ivander lokal** | Model lokal via vLLM (GPU) | Dolphin-Phi 2.7B via vLLM (GPU) | Memisahkan efek "pindah ke vLLM/GPU" dari efek council |
| S1–S3, SC, C-vote, C-chair | Sama dengan B1 | Sesuai tabel desain eksperimen di atas | Perlakuan utama |

*Testbed:* topologi VMware yang sama. Server Ollama (`.3`) diganti server vLLM dengan GPU. n8n, target, dan proksi tetap. B0 tetap memakai Ollama agar menjadi kontrol yang sebenarnya.

*Dua level pengujian:*
1. **End-to-end** (semua konfigurasi, skenario 5/10/15/20 layanan, ≥3 run). Metriknya sama dengan Ivander agar bisa dibandingkan langsung: total token, waktu eksekusi, porsi waktu Agen Verifikasi, dan jumlah kerentanan terverifikasi. Ditambah energi.
2. **Terisolasi pada Agen Verifikasi** (untuk RQ1–RQ2). Output Agen Peneliti untuk tiap kasus direkam sekali, lalu **diputar ulang (replay)** ke setiap konfigurasi verifier. Dengan begitu, perbedaan hasil hanya berasal dari verifier, bukan dari variasi agen sebelumnya. Hasilnya dicocokkan dengan ground truth berlabel.

*Hal yang harus dijaga:*
- **Pengamat Teknis harus sama** untuk semua konfigurasi S/SC/C, karena ia yang memutuskan apakah kode verifikasi diterima. Jika model peninjau berubah, hasil verifier ikut berubah.
- **Agregasi council untuk output berupa kode.** Majority vote tidak bisa langsung diterapkan pada kode. Ada dua opsi: (a) setiap anggota membuat kode, lalu chairman/Pengamat Teknis memilih satu; (b) semua kode yang lolos tinjauan dijalankan, lalu dilakukan vote atas *hasil eksekusi* (rentan/tidak). **Diputuskan 2026-11-22: keduanya diuji**, yaitu (b) sebagai C-vote dan (a) sebagai C-chair, masing-masing dengan kontrol SC-nya. Lihat tabel desain eksperimen.
- **Energi B0 tidak bisa diukur penuh**, karena bagian Gemma berjalan di cloud. Untuk B0, laporkan hanya energi lokal (verifier CPU via RAPL) dan nyatakan sebagai keterbatasan.
- **Ketersediaan Gemma 4 31B via Google ADK** harus dicek ulang sebelum B0 dijalankan. Catat versi model dan tanggal run.
- **Penolakan.** Dolphin dipilih Ivander karena *uncensored*. Model kandidat S1–S3 bisa menolak membuat kode verifikasi, jadi tingkat penolakan dicatat sebagai metrik reliabilitas.

**Metrik:**
- Efektivitas: accuracy, precision, recall, F1, false-positive rate terhadap ground truth berlabel.
- Kesepakatan antar-anggota council: Fleiss' kappa; berapa kasus yang diselamatkan atau dirusak oleh agregasi.
- Efisiensi: latensi end-to-end Agen Verifikasi (p50/p95), total token, VRAM puncak, **energi** (lihat protokol di bawah), dibandingkan dengan pilar efisiensi skripsi dasar.
- Reliabilitas: variansi antar-run (≥3 run per konfigurasi), tingkat output tidak valid (JSON rusak, penolakan).

**Protokol pengukuran energi (2026-11-19):**
- **Satuan.** Yang diukur adalah *energi* (J atau Wh), bukan *daya* (W). "Watt per token" tidak valid secara dimensi. Metrik utama: **Wh per kasus** dan **Wh per verifikasi benar**, karena council dan single menghasilkan jumlah token berbeda untuk keputusan yang sama sehingga perbandingan adil dilakukan per keputusan. Metrik sekunder: **J per token output**, atau input dan output dipisah, karena prefill jauh lebih murah daripada decode.
- **GPU (utama).** Penghitung energi kumulatif NVML, `nvmlDeviceGetTotalEnergyConsumption` (mJ, GPU Volta ke atas), dibaca sebelum dan sesudah tiap run konfigurasi. **Diimplementasikan dengan library Zeus (ml.energy)** (`ZeusMonitor`, `begin_window`/`end_window`), sesuai `notes19112026.md`. Cek silang dengan sampling `nvidia-smi --query-gpu=timestamp,power.draw.instant --format=csv -lms 100` lalu integrasi trapesium. Gunakan `power.draw.instant`, bukan `power.draw` yang merupakan rata-rata 1 detik.
- **CPU (disarankan).** RAPL `/sys/class/powercap/intel-rapl:0/energy_uj` (juga berlaku untuk AMD Zen), dengan pola sebelum–sesudah yang sama, untuk menangkap beban n8n dan proses lain. Wattmeter stopkontak opsional untuk energi seluruh sistem.
- **Atribusi.** vLLM melakukan batching, jadi energi per request tidak bisa dipisahkan. Ukur energi per run satu konfigurasi utuh (semua kasus), lalu bagi dengan jumlah kasus atau token. Untuk SC, seluruh *k* sampel harus masuk jendela pengukuran.
- **Idle.** Ukur daya idle sekitar 60 detik dengan model sudah dimuat. Laporkan **energi total** (biaya nyata; council dengan 3 model termuat punya idle lebih tinggi) dan **energi dinamis** (total − daya idle × durasi).
- **Kondisi.** Warm-up sebelum mengukur, kunci power limit (`nvidia-smi -pl`), catat model GPU, versi driver, dan suhu. ≥3 run per konfigurasi, laporkan rata-rata ± simpangan baku.

**Hal yang perlu diputuskan segera:**
- **Ground truth / dataset.** Ini penentu utama kualitas skripsi. Perlu kumpulan kasus "kerentanan X pada target Y: benar/salah" dengan label yang bisa dipertanggungjawabkan, misalnya lab VM dengan versi software rentan yang diketahui (Metasploitable, VulnHub, image Docker vulhub) dicampur kasus negatif (versi sudah di-patch, CVE tidak relevan). Target minimal ~100 kasus agar perbedaan antar-konfigurasi bisa diuji statistik (McNemar test).
- ~~**Definisi "verifikasi".**~~ **Terjawab (2026-11-22):** di skripsi dasar, verifier membuat kode verifikasi, lalu Pengamat Teknis meninjau dan menjalankannya lewat SSH. Lihat "Arsitektur pengujian" di atas. Cara agregasi council untuk output berupa kode: keduanya diuji (C-vote dan C-chair).
- **Model kandidat.** Pilih 3 model dari keluarga berbeda (mis. Qwen, Llama, Gemma/Mistral) dengan ukuran sama agar perbandingannya adil. Batasan: model terkuantisasi yang muat di GPU target.
- **Hosting multi-model di vLLM.** Satu proses vLLM melayani satu model. Pilihannya: (a) beberapa instance vLLM dengan `--gpu-memory-utilization` dibagi (paralel, VRAM ketat), atau (b) satu instance yang bergantian memuat model (lambat, tapi muat di GPU kecil). Pilihan ini memengaruhi angka latensi, jadi harus dilaporkan.
- **Judul baru** perlu disetujui pembimbing.

**Literatur yang perlu dicari (belum ada di `Lits/`):** semua kandidat di bawah dari ingatan, **venue dan kuartil harus dicek** sebelum dipakai.
- Wang et al., *Self-Consistency Improves Chain of Thought Reasoning* (ICLR 2023): dasar baseline SC.
- Du et al., *Improving Factuality and Reasoning through Multiagent Debate* (ICML 2024).
- Chen et al., *ReConcile: Round-Table Conference Improves Reasoning via Consensus among Diverse LLMs* (ACL 2024): council dengan model beragam.
- Wang et al., *Mixture-of-Agents* (ICLR 2025?): agregasi beberapa LLM oleh aggregator.
- Verga et al., *Replacing Judges with Juries (PoLL)*: panel model kecil vs satu judge besar. Kemungkinan preprint; cek.
- Li et al., *More Agents Is All You Need* (TMLR 2024?): efek jumlah sampel/agen.
- Zheng et al., *Judging LLM-as-a-Judge* (NeurIPS 2023 D&B).
- Karpathy, *llm-council* (GitHub): bukan peer-reviewed; hanya untuk menjelaskan asal istilah, bukan sebagai rujukan ilmiah.
- Celah yang dicari: council/ensemble LLM **untuk verifikasi kerentanan** pada **model lokal kecil**. Kemungkinan besar belum ada; itu posisi kontribusinya.

**Hasil pencarian remote-lib (2026-11-10, BELUM SELESAI).** Sumber: ScienceDirect via remote-lib, 2023–2026, research articles. Pencarian berhenti karena proxy macet dan koneksi Chrome terputus. IEEE Xplore belum sempat dicari. Kuartil **sudah dicek di scimagojr.com (SJR 2025, kategori terbaik) pada 2026-11-10**: semua Q1 kecuali *Informatics in Medicine Unlocked* (Q2). *The Innovation* = Q1 (Multidisciplinary). Abstrak belum dibaca.
| Paper | Jurnal | Kuartil (SJR 2025) | Relevansi |
|---|---|---|---|
| *Debapt: Ontology-driven multi-agent debate for APT adversary profile construction from CTI* | Computers & Security, Nov 2026 | Q1 | Debat multi-agen di domain keamanan siber (CTI); paling dekat dengan domain skripsi |
| *Guided and knowledgeable multi-agent debate for fact verification* | Expert Systems with Applications, Mar 2026 | Q1 | Debat multi-agen untuk **verifikasi**; analog langsung dengan Agen Verifikasi |
| *Debating to verify: A robust and explainable multi-agent LLM system for fact-checking* | ICT Express, 2026 | Q1 | Debat untuk verifikasi, dengan klaim robustness |
| *Socratic Elenchus-inspired multi-agent debate for mitigating hallucinations in LLMs* | Expert Systems with Applications, Jul 2026 | Q1 | Debat untuk menekan halusinasi (false positive verifier) |
| *Mitigating reasoning hallucination through Multi-agent Collaborative Filtering* | Expert Systems with Applications, Mar 2025 | Q1 | Kolaborasi multi-agen sebagai filter |
| *Towards higher quality and fewer hallucinations: A multi-agent collaboration framework for LLMs* | Information Processing & Management, Dec 202x | Q1 | Kolaborasi multi-LLM vs single LLM |
| *Learning to break: Knowledge-enhanced reasoning in multi-agent debate system* | Neurocomputing, Feb 2025 | Q1 | Kelemahan/perbaikan debat multi-agen |
| *Discovering ensembles of small language models out of scarcely labelled data for fake news detection* | Applied Soft Computing, Mar 2025 | Q1 | **Ensemble model kecil**; mendukung argumen council SLM lokal |
| *AVR: adaptive diagnostic verification and natural-language error feedback* | Expert Systems with Applications | Q1 | Verifikasi adaptif; terkait catatan "adaptive model" pembimbing |
| *A survey on LLM-as-a-judge* | The Innovation, Jun 2026 | Q1 | Survei LLM sebagai penilai; dasar teori untuk chairman/judge di council |
| *When does relational calibration help an LLM-as-a-judge? A human-grounded … study* | Information Sciences, 2026 | Q1 | Kapan judge LLM bisa dipercaya; relevan untuk agregasi C-chair |
| *Possibilities and limitations of using LLMs for alert classification and prioritization* | Expert Systems with Applications | Q1 | LLM untuk triase alert keamanan (SOC); dekat dengan tugas verifikasi |
| *Bridging the gap between LLMs and structured program vulnerability analysis: An agent reasoning approach* | Expert Systems with Applications | Q1 | Agen LLM untuk analisis kerentanan |
| *Leveraging LLMs for advanced static code analysis: Assessing the feasibility …* | Information and Software Technology | Q1 | LLM untuk keamanan kode, termasuk isu false positive |
| *LLMs as judges: Toward the LLM-assisted review of GSN-compliant assurance cases* | Journal of Systems and Software | Q1 | LLM sebagai penilai di konteks safety/assurance; pendukung sekunder |
| *PhysCISC: A process-credibility weighted self-consistency voting framework for physics reasoning* | Applied Soft Computing, Nov 2026 | Q1 | Self-consistency dengan **weighted voting**; dasar baseline SC dan varian weighted vote |
| *S2CR: A self-supervised self-consistency reasoning framework coupled to RAG* | Information Processing & Management | Q1 | Self-consistency + RAG (Agen Verifikasi memakai bukti hasil retrieval) |
| *Improving ASA-PS classification accuracy using private-deployment-compatible LLMs* | Informatics in Medicine Unlocked | Q2 | LLM yang bisa di-deploy privat/lokal untuk klasifikasi; analog setting lokal |

**IEEE Xplore (filter Journals, 2023–2026):**
| Paper | Jurnal | Kuartil (SJR 2025) | Relevansi |
|---|---|---|---|
| *LIVA: A Multi-Agent LLM-Assisted System for IoT Vulnerability Analysis* | IEEE Trans. Dependable and Secure Computing | Q1 | **Paling dekat dengan topik:** sistem LLM multi-agen untuk analisis kerentanan |
| *Tool-MAD: A Multi-Agent Debate Framework for Fact Verification With Diverse Tool Augmentation …* | IEEE Access | Q1 (mega) | Debat multi-agen untuk **verifikasi** dengan tool yang beragam |
| *G-DMAD: Group-Based Diverse Multi-Agent Debate for Robust Reasoning* | IEEE Access | Q1 (mega) | Keberagaman anggota debat sebagai sumber robustness; mendukung council heterogen |
| *Beware of the Woozle Effect: Exploring and Mitigating Hallucination Propagation in Multi-Agent Debate* | IEEE/ACM Trans. Audio, Speech and Language Processing | Q1 | **Argumen kontra:** halusinasi bisa menular antar-agen. Penting untuk bagian keterbatasan dan alasan memilih vote independen vs debat |
| *A Weighted Byzantine Fault Tolerance Consensus Driven Trusted Multiple LLMs Network* | IEEE Trans. Cognitive Communications and Networking | Q1 | Konsensus berbobot antar-LLM; dasar formal untuk agregasi council |
| *Ensemble Learning for Large Language Models in Text and Code Generation: A Survey* | IEEE Trans. Artificial Intelligence | Q1 | Survei ensemble LLM; jangkar related-work |
| *SIC-Autonomous Ensemble: LLM Hallucination Mitigation Framework Using Self Iterative …* | IEEE Trans. Artificial Intelligence | Q1 | Ensemble untuk menekan halusinasi |
| *Toward Edge General Intelligence With Multiple-LLM (Multi-LLM): Architecture, Trust …* | IEEE Trans. Cognitive Communications and Networking | Q1 | Multi-LLM di edge/lokal; relevan dengan batasan hardware |
| *The Power of Small LLMs: A Multi-Agent for Code Generation via Dynamic Precaution Tuning* | IEEE Trans. Software Engineering | Q1 | Multi-agen dari **LLM kecil** menyaingi model besar |
| *Adaptive Boosting LLMs for Text Classification* | IEEE Trans. Neural Networks and Learning Systems | Q1 | Ensemble adaptif; terkait catatan pembimbing soal "adaptive model" |
| *AgentChain: Blockchain-Empowered Multi-Agent Coordination for Trustworthy LLM QA* | IEEE Trans. Dependable and Secure Computing | Q1 | Koordinasi multi-agen untuk jawaban yang dapat dipercaya |
| *Toward Reliable Annotation in Low-Resource NLP: A Mixture of Agents Framework and Multi-LLM Benchmark* | IEEE Access | Q1 (mega) | Mixture-of-Agents vs single LLM, dengan benchmark |
| *How Reliable and Valid Is an LLM Technology-Evaluation Judge? A Retrospective Measurement Audit* | IEEE Access | Q1 (mega) | Reliabilitas LLM-judge (untuk konfigurasi C-chair) |
| *Beyond Reproducibility: Token Probabilities Expose LLM Nondeterminism* | IEEE Trans. Computers | Q1 | Nondeterminisme LLM; alasan menjalankan ≥3 run per konfigurasi |

Dibuang: Procedia Computer Science (prosiding, bukan jurnal Q1–Q3) dan hasil di luar topik.
Query yang sudah dijalankan. ScienceDirect: `"multi-agent debate" large language models` (83 hasil, 33 teratas dicek); `ensemble of large language models voting heterogeneous` (25 teratas); `"LLM-as-a-judge"` (326 hasil, 25 teratas); `large language models vulnerability false positive multi-agent verification` (25 teratas); `"self-consistency" large language models` (25 teratas). IEEE Xplore (Journals): `("multi-agent debate" OR "multiple LLMs" OR "ensemble of LLMs" OR "LLM ensemble")` (36 hasil, semua dicek); `(self-consistency OR majority voting OR LLM-as-a-judge OR mixture of agents) AND "large language model"` (20 hasil); `(multi-agent OR multiple LLMs OR ensemble OR debate) AND LLM AND (vulnerability OR CVE) AND (verification OR false positive OR triage)` (**hanya 2 hasil**: LIVA dan LEGEM).

**Temuan celah:** query terakhir hanya menghasilkan 2 paper jurnal IEEE, dan tidak ada yang membandingkan single model vs council untuk verifikasi kerentanan pada model lokal. Ini bukti konkret untuk menulis research gap.

**Belum dicari:** ACM Digital Library dan SpringerLink. Abstrak belum dibaca. PDF disimpan di `Lits/08-llm-council/`: **semua 32 paper sudah diunduh** (18 ScienceDirect 2026-11-10, 14 IEEE 2026-11-11). Nomor artikel IEEE (`https://remote-lib.ui.ac.id:2147/stamp/stamp.jsp?tp=&arnumber=<nomor>`): LIVA 11397462, Tool-MAD 11618496, G-DMAD 11405854, Woozle 11443228, Weighted BFT 11201899, Ensemble survey 11421084, SIC-Ensemble 11663303, Edge Multi-LLM 11175216, Power of Small LLMs 11244878, AdaBoost LLMs 11346014, AgentChain 11483294, MoA annotation 11299523, LLM judge audit 11740871, Token probabilities 11683945.

### Literatur penggunaan resources (2026-11-19)

**Arahan pembimbing (2026-11-19):** penggunaan resources harus ikut diperhitungkan **di judul**, bukan cuma sebagai metrik sampingan. RQ2 (biaya council) naik menjadi bagian dari kontribusi utama: perbandingan menjadi *akurasi vs resources* (trade-off), bukan akurasi saja.

Sumber: remote-lib → ScienceDirect dan IEEE Xplore (Journals), 2023–2026. Kuartil dicek di scimagojr.com (SJR 2025, kategori terbaik) pada 2026-11-19: **semua Q1**. Abstrak atau highlight sudah dibaca untuk yang ditandai ✓.

| Paper | Jurnal | Kuartil | Relevansi |
|---|---|---|---|
| ✓ *The Price of De-Correlation: Quantifying the Agreement–Cost Trade-Off in Heterogeneous LLM Ensembles* (Chincholikar & Chawla) | IEEE Access 2026, doi 10.1109/ACCESS.2026.3749218, arnumber 11769884 | Q1 | **Paling relevan.** Ensemble 5 agen, homogen vs heterogen lintas provider (54.000 panggilan). Heterogen menurunkan korelasi error (Δφ=0,454), tapi biaya inferensi naik **≈4,4×** dan akurasi rata-rata tidak naik signifikan. Ensemble homogen menghasilkan keputusan salah yang bulat 1,84× lebih sering. Persis pertanyaan council (heterogen) vs SC (homogen) + biaya; metriknya (kappa, korelasi error) bisa ditiru. |
| ✓ *A Cost-Efficient CWE-Grounded Multi-Agent LLM Pipeline for Web and API Vulnerability Analysis* (Zhenissov et al.) | IEEE Open J. Communications Society 2026, doi 10.1109/OJCOMS.2026.3743761, arnumber 11738793 | Q1 | **Domain sama.** Detector agent + **validator agent** + eskalasi ke manusia (reject option). Dibandingkan dengan single-agent dan CodeQL; biaya < $0,10 per scan; 10 run; variasi antar-run lebih banyak disebabkan model drift daripada temperature. Pembanding langsung untuk Agen Verifikasi dan alasan ≥3 run. |
| ✓ *Exploring Zero-Shot SLM ensembles as an alternative to LLMs for sentiment analysis* | Information Fusion, Feb 2026 | Q1 | Ensemble **model kecil lokal** menyaingi LLM proprietary, tetapi "penghematan biaya diimbangi compute lokal dan latensi yang lebih tinggi". Argumen inti trade-off council lokal. |
| ✓ *Energy use of AI inference, efficiency pathways, and test-time scaling* | Joule, Agu 2026 | Q1 | Energi per query; query reasoning (~5.000 token output) ≈13× energi query biasa. Dasar untuk menyatakan bahwa test-time compute (k sampel / k model) punya biaya energi nyata. |
| ✓ *Insights into resource utilization of code small language models serving with runtime engines and execution providers* | J. Systems and Software, Des 2025 | Q1 | Metodologi mengukur **energi, waktu eksekusi, dan utilisasi resource** SLM lokal pada berbagai konfigurasi serving (CUDA vs CPU, selisih energi 38–89%). Rujukan metodologi pengukuran resources dan alasan melaporkan konfigurasi serving (vLLM). |
| ✓ *MedicalAgentsBench: Comparing internalized reasoning models versus externalized agent-based frameworks* | Patterns (Cell Press), Okt 2026 | Q1 | Model reasoning vs framework multi-agen, dianalisis dengan **Pareto frontier** akurasi–biaya. Contoh cara menyajikan hasil (plot Pareto). |
| *Do multi-agent LLMs improve causal identification? A controlled, cost-aware study on CLadder* | Array, Sep 2026 | Q1 | Studi terkontrol multi-agen vs single **dengan memperhitungkan biaya**; desainnya analog. |
| *PEARL: Performance and energy aware routing for LLMs* | Future Generation Computer Systems, Mar 2026 | Q1 | Routing antar-LLM berdasarkan performa dan energi; alternatif hemat dari menjalankan semua anggota council. |
| *Energy-efficient large language models* | Future Generation Computer Systems, Sep 2026 | Q1 | Latar efisiensi energi LLM. |
| *A forecasting-based perception layer for energy-aware resource management in LLM serving on HPC clusters* | Sustainable Computing: Informatics and Systems, Jun 2026 | Q1 | Manajemen resource dalam serving LLM. |
| *Adaptive agentic meta-controller (AAMC): A DRL framework for intelligent SLM/LLM orchestration* | Neurocomputing, Mei 2026 | Q1 | Orkestrasi SLM/LLM adaptif berbasis biaya; terkait catatan "adaptive model" pembimbing. |
| *SwiftAPI: Confidence-guided hybrid inference for scalable API risk detection* | Computer Networks, Nov 2026 | Q1 | Domain keamanan: eskalasi model berbasis confidence untuk menghemat compute. Ide varian council adaptif (panggil council hanya jika single model ragu). |
| *DARCS: Deadline- and reliability-constrained scheduling for LLM-based agentic workflows on heterogeneous edge infrastructure* | J. Systems Architecture, Des 2026 | Q1 | Workflow agen LLM dengan batas resources di edge. |
| *Toward Energy-Aware LLM Inference for Text2SQL Workflows Through Context-Driven Model Routing* | IEEE Access 2026 | Q1 | Routing hemat energi dalam workflow LLM. |
| *DABO: Difficulty-Aware Binary Offloading for Collaborative Large-Small Model Inference* | IEEE Access 2026 | Q1 | Kolaborasi model kecil–besar berbasis tingkat kesulitan. |
| *Quality-of-Service Aware LLM Routing for Edge Computing With Multiple Experts* | IEEE Trans. Mobile Computing 2025 | Q1 | Routing multi-LLM dengan batas QoS/latensi. |
| *SLO-Aware GPU DVFS for Energy-Efficient LLM Inference Serving* | IEEE Computer Architecture Letters 2024 | (belum dicek) | Energi GPU dalam serving LLM; pendukung sekunder. |

**Implikasi untuk desain:**
1. Metrik resources wajib per konfigurasi: total token (input+output), latensi p50/p95, VRAM puncak, **energi GPU (Wh per kasus)** via `nvidia-smi`/NVML, dan throughput. Sajikan sebagai **Pareto frontier akurasi (F1) vs resources**, mengikuti MedicalAgentsBench.
2. Tambahkan metrik turunan **"biaya per kasus benar"** (Wh atau token per verifikasi benar) supaya council dan single bisa dibandingkan dalam satu angka.
3. Pertimbangkan konfigurasi tambahan **C-adaptive**: single model dulu, council hanya dipanggil jika confidence rendah (gaya SwiftAPI/DABO/eskalasi pada paper CWE). Ini sejalan dengan catatan "adaptive model" pembimbing.

**Usulan judul (memasukkan resources), perlu disetujui pembimbing:**
- **(dipilih sebagai usulan utama, lihat bagian atas dokumen)** *Analisis Trade-off Akurasi dan Penggunaan Sumber Daya antara Model Tunggal dan LLM Council pada Agen Verifikasi Kerentanan dalam Sistem Multi-Agent Berbasis LLM Lokal*
- *Perbandingan Efektivitas dan Efisiensi Sumber Daya Single-Model dan LLM Council untuk Verifikasi Kerentanan pada Sistem LLM Multi-Agent Lokal*
- (versi pendek) *Efektivitas dan Efisiensi Sumber Daya LLM Council dibandingkan Model Tunggal untuk Verifikasi Kerentanan pada Sistem Multi-Agent Lokal*
- (jika C-adaptive diambil) *LLM Council Adaptif yang Sadar Sumber Daya untuk Agen Verifikasi Kerentanan pada Sistem LLM Multi-Agent Lokal*

Query yang dijalankan. ScienceDirect (field title-abstract-keywords): energi + LLM + inference (24 hasil, semua dicek); SLM/local LLM/open-weight + latency/GPU memory/resource (25 teratas); multi-agent/ensemble/debate + LLM + token/inference/computational cost (20, semua); LLM serving/inference + throughput/KV cache/GPU memory (14, semua); keamanan + LLM + cost/latency/resource-constrained (25 teratas); quantization + LLM + memory (25 teratas). IEEE Xplore (Journals): multi-agent/ensemble/debate/self-consistency + cost (11, semua); multi-LLM/LLM ensemble/model collaboration + cost/efficiency/latency (27, semua); SLM/local/edge + latency/memory/energy (25 teratas dari 96); vulnerability/threat + LLM agent + efficiency/cost (27, semua); energy/carbon + LLM inference (25 teratas dari 44). Dibuang: Procedia Computer Science, CMC (bukan jurnal Q1 terverifikasi), dan topik hardware murni (PIM, FPGA, NPU kernel).

**Belum:** PDF bagian ini belum diunduh. ACM DL dan SpringerLink belum dicari.

---

## 1. Where this came from (recap)

This thesis follows on from **Ivander Andreas Wijaya's skripsi (2206031896, UI Teknik Komputer, 2026)**: *"Perancangan Agen Kecerdasan Buatan Berbasis Large Language Model Untuk Manajemen Kerentanan Menggunakan n8n"* (`Lits/Copy of Buku skripsi - Ivander Andreas Wijaya...pdf`).

That system:
- Is a **hierarchical multi-agent** pipeline — Director → Searcher (Pencari) → Researcher (Peneliti) → Verifier (Verifikasi) → Technical Observer (Pengamat Teknis) — automating CVE-based vulnerability detection and verification.
- Is orchestrated with **n8n** (visual workflow tool), runs agents via **Google ADK + Ollama**, on a **VMware**-isolated network.
- Was evaluated on four pillars: effectiveness, efficiency, reliability, security. It reports ~7.9%–33.9% token-usage ratios across agent roles and flags "a dedicated LLM for cybersecurity" and "better token-efficiency techniques" as future work — which is the opening this thesis steps into.

### Decisions made so far in this planning phase

1. **Goal reframed**: make the system smaller and runnable **locally** (resource-constrained deployment), instead of relying on cloud-hosted general-purpose LLMs.
2. **Quantization** adopted as the mechanism to shrink the models for local inference.
3. **Serving engine: n8n → vLLM.** Conclusion reached: this is a step *forward*, not backward. n8n is a visual workflow/trigger tool with no hooks into request-level queuing, latency measurement, or priority/deadline control over concurrent LLM calls — exactly the mechanism this thesis needs to expose and instrument. vLLM exposes an OpenAI-compatible API and an internal scheduler that can be observed/extended; n8n cannot. n8n may still be kept as an outer workflow trigger if convenient, but the scheduling core must be custom code.
4. **Scheduler framing narrowed**: scoped as **agent/request-level priority scheduling sitting in front of vLLM** — not an OS-level scheduler. Deadline-aware scheduling literature may be cited as background, but the actual artifact is a priority queue/policy layer over LLM inference requests, following the pattern of the closest published work (QMLFQ, FlowGuard, TokenCake — see §3).
5. **Literature search completed** across IEEE Xplore, arXiv, and ScienceDirect (via UI's remote-lib proxy). IGI Global's iG Library and Brill were checked and ruled out (general engineering/humanities catalogs, no hits on this topic).
6. **Second literature round**: pulled the base thesis's own most-relevant CVE/agentic-cybersecurity citations directly (rather than citing through it) and searched fresh for newer CVE-prioritization/vulnerability-management papers. `Lits/references.md` holds the original 33 papers; after the 2026-10-07 pembimbing review the working set is filtered (see §3 and `Lits/revisi-pembimbing.md`).
7. **Pembimbing review (2026-10-07)**: add more Q1 peer-reviewed papers, give pros/cons per paper, add risk management, justify n8n → vLLM, consider small LLMs and STIX 2.1, and cut anything not peer-reviewed or not Q1–Q3. Applied in §3.
8. **Industry case study found**: TM Forum Catalyst project *Telco AEGIS* (C26.0.980, DTW 2026) — a real, industry-built multi-agent MCP-based autonomous telecom security system. 13 project materials downloaded to `TELCO_AEGIS/`. See §3a below — **includes a usage-restriction caveat that affects how it can be cited.**

---

## 2. What the new title commits us to

> **Tidak berlaku lagi (2026-11-10):** scheduler bukan kontribusi utama; lihat §0.

The finalized title — *"Pengaplikasian Priority-Based Scheduling untuk Sistem LLM Multi-Agent dalam Konteks Sistem Keamanan Siber"* — fixes three things:

- **Keep the cybersecurity/vulnerability-management domain** from the base thesis (don't generalize away from it — "dalam Konteks Sistem Keamanan Siber" is explicit).
- **Keep the multi-agent structure** (adapt Director/Searcher/Researcher/Verifier/Technical Observer roles, don't collapse to a single agent).
- **The core contribution is the scheduler itself** — "Pengaplikasian Priority-Based Scheduling" is the headline verb. Quantization and vLLM are *enabling infrastructure* for the scheduler to matter (there's no scheduling problem if requests never contend for a shared, resource-constrained LLM backend), not separate contributions to defend equally.

This also implies the **research question** is something like: *does priority-based scheduling of concurrent multi-agent LLM requests improve [latency for high-severity CVE findings / SLA adherence / throughput] compared to FIFO/unscheduled dispatch, on a quantized, locally-hosted LLM serving concurrent cybersecurity agent workloads?*

---

## 3. How the literature maps onto the design

Pros/cons below were checked against the full papers; see `Lits/reading-notes.md` for details and corrections. Filtered per the pembimbing's feedback (2026-10-07): **peer-reviewed only, and journal Q1–Q3 or top-tier conference (CORE A*/A, ranks to be verified).** Full detail, quartile checks and file list are in `Lits/revisi-pembimbing.md`; PDFs are sorted by topic in `Lits/01-…` to `Lits/07-…` (layout in `Lits/references.md`). "Mega" = IEEE Access, Q1 but a fast-review mega-journal.

### 3.1 Scheduling and serving (the core of the thesis)
| Paper | Venue / quality | Pros | Cons |
|---|---|---|---|
| Kwon et al., **PagedAttention (vLLM)** | SOSP 2023, A* (verify) | Foundational vLLM paper; 2–4× throughput; states vLLM schedules **FCFS**, which justifies your FIFO baseline | Says nothing about agents or priorities |
| Lin et al., **Parrot** | OSDI 2024, A* (verify) | Shows engines see single requests and lose application structure, which is the strongest argument for a scheduler above the engine that knows the agent graph | Targets app-level optimisation, not security or priority classes |
| **Lemix** | IEEE RTSS 2025, A* (verify) | Real-time-systems venue; SLO-aware scheduling of mixed LLM workloads (2.12× SLO attainment) | Co-locates training and inference on multi-GPU nodes; no priority classes or mixed-criticality, so it is weak background for the deadline framing |
| **Co-Optimizing Request Scheduling and KV Caching for Edge LLM Serving** | IEEE IoT Journal 2026, Q1 | Edge request scheduling with block-level KV caching; TTFT down up to 54.02% | Multi-node edge, not priority-based; new, 0 citations |
| **BrownoutServe** (SLO-aware serving) | IEEE Trans. Computers 2026, SJR Q1 | SLO-aware under bursty load | MoE-focused |
| **Minimizing Response Latency in LLM-Based Agent Systems** (survey) | IEEE Access 2026, Q1 (mega) | Agent-latency framing | Survey; mega-journal |
| **Load Balancing for LLM Inference Serving** (survey) | Neurocomputing 2026, Q1 | Journal survey, good baseline/related-work anchor | Control/learning angle, not priority queues |
| Miao et al., **Efficient Generative LLM Serving** (survey) | ACM Computing Surveys 2025, Q1 | Broad survey of batching and scheduling | PDF not yet obtained (arXiv copy exists); confirm published version |

**Borderline** (closest design precedents, peer-reviewed but *not* Q1–Q3 or A*/A; recommend asking the pembimbing for an exception and citing them once as "closest related work"):
| Paper | Venue / quality | Pros | Cons |
|---|---|---|---|
| **QMLFQ** | IEEE SWC 2024 | Closest match: quantization-aware multi-level queue scheduling | Unranked venue; small evaluation; not agent-aware |
| **FlowGuard** | IEEE ICCCN 2026 (CORE B?) | Multi-agent LLM serving with slack-aware overload control | Brand new; generic workloads, not security |
| **Edge-LLM** | IEEE ICWS 2024 (rank to verify) | Edge serving framework | Edge-cloud collaboration, not a single local node |
| **HEXGEN-FLOW** | arXiv v3 2026, ICDE acceptance unconfirmed | Agentic request scheduling | Venue unverified, so drop unless confirmed; Text-to-SQL domain |

### 3.2 Risk management and priority signal
| Paper | Venue / quality | Pros | Cons |
|---|---|---|---|
| Unal & Celiktas, **Automating Cyber Risk Assessment With Public LLMs** | IEEE Access 2026, Q1 (mega) | LLM-based risk assessment; contrasts static CVSS with labour-heavy NIST SP 800-30; expert-validated | Cloud LLMs, not local; 2 citations |
| Shimizu & Hashimoto, **Vulnerability Management Chaining** | IEEE Access 2026, Q1 (mega) | Rule: KEV or EPSS ≥ 0.088, then CVSS ≥ 7.0; 28,377 CVEs, ~95% workload reduction | No LLM or agents; vendor-reported ground truth |
| **Automated Risk Management Based Software Security Vulnerabilities Management** | IEEE Access 2022, Q1 (mega) | ML threat modelling; 30 citations | Insurance-domain Agile data; weak link to LLM/CVE; candidate to drop |
| **Security Risk Taxonomy for Prompt-Based Interaction With LLMs** | IEEE Access 2024, Q1 (mega) | 45 citations; risk taxonomy for the LLM layer | Prompt-level, not vuln-management |
| **TRiSM for Agentic AI** | AI Open 2026, Q1 | Risk management for multi-agent LLM; maps to NIST AI RMF | Review, not experimental |
| **From COBIT to ISO 42001** | Computers & Security 2024, Q1 | Maps standards to LLM risk | Governance-level, not technical |
| R. Syed, **Cybersecurity vulnerability management: ontology** | Information & Management 2020, Q1 | Theory-grade vuln-management backbone | Pre-LLM |

*Thin spot:* 4 of 7 are IEEE Access.

### 3.3 Small language models, quantization, local deployment
| Paper | Venue / quality | Pros | Cons |
|---|---|---|---|
| **Edge-efficient LLMs survey** | Computer Science Review 2025, Q1 | Covers SLMs, compression, quantization, edge frameworks | Survey |
| **Tiny LLMs for IoT networks** | Computers & Electrical Eng. 2026, Q1 (2023 confirmed) | Compression/deployment taxonomy | IoT-focused |
| **ResilioMate** | IEEE Access 2025, Q1 (mega) | Multi-agent framework for SLMs | Tested on KG construction, DB ops, code correction with the authors' own models; self-reported; not security |
| **SLM Fine-Tuning for Kubernetes Management** | IEEE Access 2026, Q1 (mega) | Capacity threshold at 0.6–1B parameters; Qwen3-0.6B 87% vs 94% for a commercial LLM, on-premise | Kubernetes domain, not security |
| **Network Self-Configuration with Fine-Tuned SLMs** | IEEE OJCOMS 2026, Q1 | Fine-tuned SLM emitting structured config | Telecom domain |
| **Lightweight LM-Driven Agentic Framework for Intrusion Detection (6G IoT)** | IEEE OJCOMS 2026, Q1 | Role-based multi-agent security framework; 98.24% / 99.94% accuracy on CICIoT2023 | The SLM is used only in the prediction agent; detection is gradient boosting; 6G-IoT scope |

### 3.4 STIX 2.1 (threat-intelligence schema)
STIX 2.1 itself is an OASIS standard; cite the OASIS specification as the normative reference.
| Paper | Venue / quality | Pros | Cons |
|---|---|---|---|
| **LLM-TIKG** | Computers & Security 2024, Q1 | LLM to structured CTI knowledge graph | Does not use STIX at all (0 mentions); weak for the STIX point |
| **TI-NERmergerV2** | Computers & Security 2026, Q1 | Explicit STIX 2.1 alignment | No LLM agents; PDF still missing |
| **AttacKG+** | Computers & Security 2024, Q1 | LLM entity/relation extraction on STIX | Uses STIX 2.0 (per snippet); PDF still missing |
| **LLMs for cyber threat detection (survey)** | Computers & Security 2024, Q1 | Broad peer-reviewed survey | Detection focus |
| **Multi-Strategy RAG with ATT&CK STIX Metadata** | IEEE Access 2026, Q1 (mega) | 92.46% micro-F1 on CTI-ATE; runs open/QAT models; uses 14,998 ATT&CK STIX entries | Consumes STIX data, does not emit STIX bundles |

### 3.5 Agentic-cybersecurity landscape and risk context
| Paper | Venue / quality | Pros | Cons |
|---|---|---|---|
| **LLM-Based Intelligent Agents for Cybersecurity** (tutorial and survey) | IEEE Access 2026, Q1 (mega) | 34-page landscape survey | Vulnerability-discovery bias |
| **CVE-Bench** | ICML 2025, A* | Peer-reviewed agent benchmark; shows agent capability and risk | Offensive focus |
| **Automated CVE Triage** (borderline) | IEEE ISCTurkiye 2025 | Closest prior art to the title (CVE triage by agents) | Evaluated on 12 reports; uses the GPT-4 API, not a local/small model; small national conference |

### 3.6 Removed from the literature set
Not peer-reviewed (arXiv-only): Can LLMs Classify CVEs (CVSS vectors), TokenCake, Kairos, HeraSys, AI-RAN Agentic Resource Sharing, SLO-Aware Scheduling for LLM, Hybrid Real-time/Best-effort, Deadline-Aware Mixed-Criticality (AV), Agentic-V2X, Malatji agent selection, Streamlining Vuln Triage with LLMs, Teams of LLM Agents (zero-day), Cybersecurity AI CTF, Agentic AI Frameworks, Red-MIRROR, PrAIoritize.
Low-tier conference: Adaptive Task Scheduling for Edge LLMs, CVSS Scoring ML, SBOM-AI, Lightweight Skill-Based LLM Workflows, RAPID.
Prompt-wise metrics for LLMs at the edge: BenchCouncil Trans. is SJR Q1 (re-checked 2026-11-03), so it is citable; re-download the PDF (deleted with `07-not-citable/`).
The PDFs were in `Lits/07-not-citable/`; that folder was deleted on 2026-11-03. Do not cite them.

**Cost of the filter:** almost every agent-aware scheduling paper (TokenCake, Kairos, FlowGuard, QMLFQ) is a preprint or a mid-tier conference, and the deadline/criticality background now rests mainly on Lemix. Tell the pembimbing.

**Gap this thesis fills**: none of the kept papers apply priority scheduling to a *hierarchical, role-differentiated cybersecurity agent pipeline* (they target generic multi-tenant serving, single-domain edge tasks, or CVE triage without a scheduler). That's the specific slot to write into the introduction/related-work gap analysis.

**n8n → vLLM justification:** no peer-reviewed paper compares n8n and vLLM. Argue it architecturally (Parrot + PagedAttention: the scheduler must see the agent graph and control request order, which n8n cannot) and support it with your own Ollama-vs-vLLM measurement in Bab 4.

## 3a. Industry case study: Telco AEGIS (TM Forum Catalyst C26.0.980)

Found while researching — a **real, industry-built** system (not academic literature) that validates the thesis's premise at industry scale: `TELCO_AEGIS/` (13 files, see its own `README.md`).

**What it is**: a 2026 TM Forum Catalyst (Telkomsel/Telin/Singtel/STC as champions; Tritronik/Akuig/SecurityGen/Huawei/Ericsson/MTM as tech partners) — a multi-agent AI security system for telecom networks, built on the **Model Context Protocol (MCP)**, aligned to TM Forum's **Open Digital Architecture (ODA)** and Open APIs (TMF630, TMF724A, TMF688), running a closed-loop **Detect → Decide → Validate → Deploy** lifecycle with named agent roles: Monitoring Agent, Rule/Policy Agent, Validation Agent, Deployer Agent — plus pre-deployment validation via **Breach and Attack Simulation (BAS)**.

**Public figures usable for the intro's motivation section** (from the public-facing summary, safe to cite as industry evidence, not academic literature):
- >40% reduction in MTTD/MTTR (detection/response time)
- >50% reduction in false positives
- >95% pre-deployment validation success rate
- >30% reduction in manual operational effort (OPEX)

**Why it matters for this thesis**: it's concrete, dated (2026) proof that industry is *already* building governed, multi-agent, standards-aligned LLM security systems — strengthens the introduction's motivation ("this isn't speculative — it's happening now") and gives a real agent-role taxonomy (Monitor/Policy/Validate/Deploy) to compare against the base thesis's roles (Direktur/Pencari/Peneliti/Verifikasi/Pengamat Teknis) in the related-work or discussion section. It does **not** discuss request-level priority scheduling or resource contention — it's a closed-loop *architecture* precedent, not a *scheduling* precedent, so it belongs in the introduction/motivation and possibly the architecture-design discussion, not in the scheduling-literature table above.

**⚠️ Usage restriction — read before citing**: the downloaded presentation deck (`TELCO_AEGIS/1_Telco-AEGIS-Summary-Presentation-Deck.pdf`) carries a footer notice: *"This document and all information contained within are not allowed to be disseminated out of Telkomsel... not allowed to be copied, used, or disseminated out for any means except for evaluation and usability for this project only."* This looks like a leftover internal-template restriction rather than something TM Forum intended for a public Catalyst marketing page, but it is explicitly stated in the file. Since a UI skripsi is published openly in the university repository (per the base thesis's own "Hak Bebas Royalti Nonesklusif" clause), **do not quote or reproduce slide content/diagrams verbatim from the internal deck or the 38-page Project Details doc**. Safe alternative: cite the **public TM Forum project webpage** (https://www.tmforum.org/catalysts/projects/C26.0.980/...) and describe the architecture/figures in your own words — that page's content is intentionally public marketing copy, unlike the gated deck files. Recommend confirming with your pembimbing before citing this source at all, given the ambiguity.

---

## 4. Proposed system design (draft, needs validation)

> **Sebagian tidak berlaku (2026-11-10):** n8n tetap dipakai sebagai orchestrator; scheduler dan priority class tidak lagi menjadi inti. vLLM + kuantisasi tetap berlaku. Lihat §0.

- **Agents**: keep the base thesis's five roles, but give each a **priority class** — e.g., Director/Verifier calls for a critical CVE get higher priority than routine Searcher/Researcher polling, or priority is driven by CVSS severity of the finding being processed rather than by agent role alone. *(Open decision — see §6.)*
- **Serving layer**: vLLM, with one or more **quantized** models (AWQ/GPTQ/GGUF — method TBD) sized to run on the target local hardware.
- **Scheduler**: a thin Python layer in front of vLLM's OpenAI-compatible API that tags/reorders/preempts requests by priority before they hit vLLM's own batching — modeled on QMLFQ/FlowGuard rather than reimplemented from scratch.
- **Orchestration**: replaces n8n's workflow triggers with direct async Python calls between agents, so the scheduler can see and control every request in flight (n8n structurally cannot expose this).
- **Domain integration**: keep the CVE/NVD data integration from the base thesis; it's the source of the priority signal (severity, exploitability) as well as the task content.
- **Agent-role naming**: optionally align terminology with Telco AEGIS's industry taxonomy (Monitor → Policy/Rule → Validate → Deploy) when describing how the base thesis's five roles map to a generic detect-decide-validate-deploy loop — strengthens the industry-relevance narrative without needing to cite restricted content (this mapping is your own analysis, not a reproduction of their materials).

---

## 5. Evaluation plan (draft)

> **Digantikan oleh metrik di §0 (2026-11-10).**

Extend the base thesis's four pillars (effectiveness, efficiency, reliability, security) with **scheduling-specific metrics**, benchmarked against a FIFO/unscheduled baseline:

- Latency: p50/p95/p99, specifically for high-priority (e.g. critical-CVE) requests under concurrent load.
- Deadline/SLA miss rate (if deadlines are defined per priority class).
- Throughput under contention (concurrent scan requests).
- Resource utilization (GPU/CPU/memory) of the quantized model vs. the base thesis's unquantized Ollama setup.
- Token-efficiency comparison against the base thesis's reported 7.9%/33.9% figures.
- Qualitative: does a low-priority request ever starve? (priority inversion check)

---

## 6. Open decisions (need your input, not blocking progress)

> **Digantikan oleh "Hal yang perlu diputuskan segera" di §0 (2026-11-10).** Kuantisasi dan target hardware masih relevan.

- **Priority criteria**: by agent role, by CVE/CVSS severity, by SLA/deadline, or a composite? This determines the whole scheduler design.
- **Scheduling algorithm**: weighted priority queue, EDF-inspired, or MLFQ-inspired (à la QMLFQ)?
- **Quantization method**: AWQ, GPTQ, or GGUF — depends on target hardware and vLLM's supported formats.
- **Target hardware**: what "local" means here (single consumer GPU? CPU-only? a specific machine) — this bounds the quantization level and model size choice.
- **Scope guard**: this is an undergrad skripsi, not a systems PhD — the temptation is to novelize quantization *and* the scheduler *and* the agent redesign *and* the cybersecurity evaluation all at once. Recommend treating quantization + vLLM as **infrastructure** (justified briefly, not deeply novel) and keeping the **scheduler as the one thing being rigorously designed, benchmarked, and defended**.
- **Telco AEGIS citation**: confirm with your pembimbing whether/how to cite it at all, given the confidentiality footer on the deck (see §3a). Safest path is citing only the public TM Forum webpage in your own words.

---

## 7. Suggested phase plan

> **Versi baru (2026-11-10):** (1) setujui judul + definisi verifikasi dengan pembimbing → (2) bangun dataset berlabel → (3) jalankan pipeline n8n + vLLM lokal end-to-end → (4) jalankan S1–S3 dan SC → (5) jalankan C-vote dan C-chair → (6) analisis statistik + tulis. Daftar lama di bawah hanya riwayat.

1. **Finalize scope** — lock the open decisions in §6 (likely a short discussion with your pembimbing).
2. **Architecture design** — adapt the base thesis's agent roles + define the priority model on paper (Bab 3 material).
3. **Infrastructure setup** — quantize target model(s), stand up vLLM locally, confirm base agent pipeline runs end-to-end without scheduling (this is your baseline).
4. **Scheduler implementation** — build the priority layer in front of vLLM.
5. **Evaluation** — run baseline vs. scheduled comparisons per §5 metrics.
6. **Write-up** — Bab 4/5, using `Lits/references.md` papers for related-work and discussion framing.

---

*Source materials: `Lits/Copy of Buku skripsi - Ivander Andreas Wijaya...pdf` (base thesis), `Lits/references.md` (33-paper literature set with local PDFs), `TELCO_AEGIS/` (13-file industry case study + `README.md`, usage-restricted — see §3a).*
