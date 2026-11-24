# Reading Notes — citable papers (folders 01–06)

Read 2026-10-07. **Depth:** abstract, introduction, key evaluation results and conclusion of each paper, plus targeted searches of the full text (e.g. STIX version, scheduler policy, models used). I did **not** read every page line by line; the two long surveys (Load Balancing, LLM-Agents-Cybersecurity) were read at abstract/section level. Numbers below are as stated in the papers.

## Corrections to what I said earlier

| Paper | What I claimed | What the paper actually says |
|---|---|---|
| **Lemix** (RTSS 2025) | Supports deadline/criticality framing | It co-locates LLM **training and inference** on multi-GPU nodes and improves SLO attainment (up to 2.12×) and throughput (3.53×). No priority classes, deadlines or mixed-criticality. It supports "SLO-aware scheduling at a real-time venue", not mixed-criticality |
| **Edge LLM Request Scheduling + KV Caching** (IoT-J 2026) | Request scheduling for local/edge serving | **Multi-node** edge, joint scheduling and block-level KV caching; TTFT down up to 54.02%. Not single-node, not priority-based |
| **LLM-TIKG** (C&S 2024) | STIX paper, check version | **Zero mentions of STIX.** It builds a threat-intel knowledge graph with LLMs and is not a STIX paper. Drop it from the STIX point; cite for LLM→structured CTI only |
| **Lightweight LM Agentic Framework, 6G IoT** (OJCOMS 2026) | Security + SLM + agents | The SLM is used **only** by the prediction agent (packet-sequence forecasting); detection is gradient boosting, mitigation is a knowledge graph. It does not process CVE text |
| **Automated CVE Triage** (ISCTurkiye 2025) | "Small agentic" CVE triage | Evaluated on **12 reports**; the analysis agent uses the **GPT-4 API**, so it is not local or small. Prototype |
| **Althar et al.** (IEEE Access 2022) | ML threat modelling | Agile software-development data from an **insurance** company; weak link to LLM or CVE scheduling. Candidate to drop |
| **ResilioMate** (IEEE Access 2025) | Multi-agent + SLM | Tasks are knowledge-graph construction, database ops and code correction, using the authors' own LeptoConnect 1.8B/7B models. Not security. Claims such as "81.6% of GPT-4" are self-reported on their benchmarks |

---

## 01 Serving and scheduling

**PagedAttention / vLLM** (SOSP 2023). Paged KV cache plus continuous batching; **2–4× throughput** over FasterTransformer and Orca at similar latency. Key for you: vLLM's scheduler uses **first-come-first-served for all requests** (stated to ensure fairness and prevent starvation), with all-or-nothing preemption by swapping or recomputation, and gang-scheduling of sequences in a request. So FCFS is the true baseline your priority layer replaces. Does not address priorities or agents.

**Parrot** (OSDI 2024). Serving systems see only independent requests and lose application structure. "Semantic Variables" expose the request DAG, from which Parrot deduces per-request objectives (latency-sensitive vs throughput) and schedules accordingly. Up to **11.7×** speedup / 12× throughput; multi-agent (MetaGPT-style) app **2.37×**; mixed workloads reduce average latency **1.68×**. Tested on LLaMA 7B/13B on A100 against vLLM-based baselines. Gap for you: not security, no explicit priority classes.

**Lemix** (RTSS 2025). See corrections. Real-time venue, but training+inference co-location. Llama-8B, 8×A100, LMSYS traces.

**Co-Optimizing Request Scheduling and KV Caching** (IoT-J 2026). See corrections. Online joint optimisation with near-optimality guarantees; zero citations, brand new.

**BrownoutServe** (IEEE Trans. Computers 2026). MoE-model serving under bursty load; up to **2.46×** throughput, **90.28% fewer SLO violations**. Idea worth noting: "brownout" degrades the processing of some tokens to protect SLOs, a form of graceful degradation (with an accuracy cost). Only MoE models, so limited fit with a small dense model. IEEE Trans. Computers is SJR Q1 (2025).

**Minimizing Response Latency in LLM-Based Agent Systems** (IEEE Access 2026, survey). Four layers: core inference (quantization, speculative decoding), agent frameworks, system-level serving, multi-agent coordination. Useful as a taxonomy and for numbers (e.g. 3-bit GPTQ on OPT-175B cuts per-token latency from 230 ms to 71 ms, taken from the GPTQ literature). A secondary source, not original work.

**Load Balancing for LLM Inference Serving** (Neurocomputing 2026, survey). Strongest peer-reviewed secondary source for your design. §4.5 discusses **priority- and deadline-aware** policies (SCORPIO), SLO-oriented queue control (QLM), fairness; §5.1.2 discusses **graph-aware / dependency-aware prioritisation** (SGLang, Ayo, Parrot), noting that a scheduler ignoring structure creates avoidable stalls and tail latency. Agentic workloads are treated only as "conditional extensions". Lets you cite the primary preprints indirectly.

**Ay & Demirdağ, Benchmarking Ollama and vLLM for Concurrent LLM Serving** (Applied Sciences 2026, Q2). Read 2026-11-03 (abstract, setup, results summary, limitations). Single H100 80 GB, same model Qwen3-4B (Ollama `qwen3:4b-q8_0` GGUF, `OLLAMA_NUM_PARALLEL=4`; vLLM FP8 weights + FP8 KV-cache, argued to be comparable to Q8_0), Ollama 0.24.0 vs vLLM 0.17.0. Five datasets (TriviaQA, GSM8K, HumanEval, HotpotQA, MT-Bench) in four scenarios (baseline QA, complex reasoning, streaming, stress) at rising concurrency. vLLM: **20–29× throughput**, **8–19× lower P95 latency**, 100% success, TTFT 0.5–3.5 s, stable to 100 users (2.6 → 15.2 req/s from 10 to 100 users). Ollama: TTFT 54–122 s, bottleneck near **10 users**, plateau ≈0.45–0.51 req/s, timeout errors 13–30.06% overall and **39.29%** (88/224) in one scenario. Both show memory growth in the 1-hour endurance test. Authors' conclusion: vLLM for high-concurrency serving; Ollama stays practical for light, local or development use. **Limitations (§5.5):** one model family, one GPU; FP8 path needs Hopper or newer, and on older GPUs vLLM falls back to GPTQ/FP16, which "may narrow the gap"; synthetic dataset traffic, not real mixed workloads. → Direct justification for the Ollama → vLLM swap, *provided* the thesis workload is concurrent multi-agent requests; check the thesis GPU against the FP8 caveat.

## 02 Risk management

**Unal & Celiktas, Automating Cyber Risk Assessment With Public LLMs** (IEEE Access 2026). The LLM interprets; a **deterministic metric engine** with expert-derived weights (ROC method, 101 professionals) does the scoring. 15 scenarios; GPT-4o and Gemini 2.0 Flash vs 10 senior experts: Pearson r 0.939–0.972; under 4 s vs 6 min per case. Includes a "safety-first" floor against prompt manipulation. Limits: cloud models, small scenario set.

**Shimizu & Hashimoto, Vulnerability Management Chaining** (IEEE Access 2026). Decision tree: first **KEV membership or EPSS ≥ 0.088**, then **CVSS ≥ 7.0**. On 28,377 vulnerabilities, efficiency rises from 0.5% (CVSS-only) to 9.1% at 85.6% coverage; about 95% workload reduction. Ground truth is vendor-reported exploitation, and one author is an independent researcher. This is your most directly usable priority signal.

**Derner et al., Security Risk Taxonomy for Prompt-Based Interaction** (IEEE Access 2024). Taxonomy of attacks along the user-to-model pipeline, categorised by target and by CIA triad. Covers the LLM layer only.

**TRiSM for Agentic AI** (AI Open 2026). Five pillars (explainability, ModelOps, security, privacy, lifecycle governance); a risk taxonomy including prompt injection, memory poisoning and collusive/cascading failures; evaluation metrics for tool use. NIST AI RMF appears about 19 times. A review, not experimental.

**McIntosh et al., From COBIT to ISO 42001** (Computers & Security 2024). Compares NIST CSF 2.0, COBIT 2019, ISO 27001:2022, ISO 42001:2023 for LLM adoption. ISO 42001 gives the most comprehensive facilitation; COBIT aligns most closely with the EU AI Act; existing frameworks are inadequate for LLM risk oversight. Governance-level.

**Syed, Cybersecurity Vulnerability Management** (Information & Management 2020). Cybersecurity Vulnerability Ontology plus a cyber-alert system combining official sources and social media; evaluated on accuracy, performance and usefulness. Pre-LLM; social-media-centred.

**Althar et al.** (IEEE Access 2022). See corrections; weakest of this group.

## 03 SLM and local deployment

**Edge-Efficient LLMs survey** (Computer Science Review 2025). Covers SLMs, compression, inference optimisation, edge frameworks; discusses **AWQ, GPTQ and GGUF/llama.cpp** (vLLM only once). Useful for the open quantization-method decision.

**Tiny LLMs for IoT** (Computers & Electrical Eng. 2026). PRISMA review of 139 studies (2020–2025) across five dimensions, including explainability-security integration. IoT-focused; barely covers quantization methods.

**SLM Fine-Tuning for Kubernetes** (IEEE Access 2026). Six SLMs (220M–7B), LoRA/QLoRA/Sparse LoRA/IA3; a **capacity threshold at 0.6–1B parameters**; Qwen3-0.6B reaches **87%** task completion vs **94%** for a commercial LLM, validated by live cluster execution through MCP. The best empirical evidence that a small fine-tuned model can do structured agent work on-premise. Not security.

**Network Self-Configuration with SLMs** (OJCOMS 2026). Fine-tuned SLM ("SLM netconfig") beats GPT-4o few/zero-shot and Llama 3.1 baselines on syntactic and goal accuracy with lower latency, on-premise. Telecom domain; the paper text does not give a single headline number in the abstract.

**ResilioMate** and **Lightweight LM Agentic Framework**: see corrections. The latter reports 98.24% accuracy for forecast-based detection and 99.94% for flow-based detection on CICIoT2023.

## 04 STIX / CTI

**Multi-Strategy RAG with ATT&CK STIX Metadata** (IEEE Access 2026). Embeds 14,998 ATT&CK STIX entries with metadata; micro-F1 **92.46%** on CTI-ATE; 78.2% top-1 on AthenaBench (GPT-5 zero-shot 76.0%); 60.47% F1 on AnnoCTR. Runs open models (Gemma 4 31B QAT, GPT-OSS 120B), so quantization-aware models are used. It *consumes* STIX data and mentions STIX 2.1 once; it does not produce STIX bundles.

**LLM Cyber Threat Detection survey** (C&S 2024). Broad survey; STIX appears four times (automated CTI-to-STIX extraction tools, one with 99% recall and a 204-report STIX dataset). Detection-centred.

**LLM-TIKG** (C&S 2024). See corrections: no STIX.

**Evidence gap:** after reading, only the RAG paper and the survey touch STIX. The two papers that actually address STIX (TI-NERmergerV2 for STIX 2.1, AttacKG+ for STIX 2.0) are the ones whose PDFs are still missing. Priority to obtain.

## 05 Agentic cybersecurity landscape

**LLM-Based Agents for Cybersecurity** (IEEE Access 2026). Tutorial and survey of agents for **vulnerability discovery and penetration testing**, 155 sources (2022–early 2026), a four-phase walkthrough, MCP and benchmarks. Offensive-security focus, with multi-agent role specialisation discussed.

**CVE-Bench** (ICML 2025; proceedings header confirmed in the PDF). Agents exploit **up to 13%** of real-world web vulnerabilities (about 10% in the main runs), showing both agent capability and remaining limits. Offensive benchmark.

**ChatNVD** (IEEE Access 2026). RAG chatbot over NVD with GPT-4o Mini, LLaMA 3 and Gemini 1.5 Pro; GPT-4o Mini best with **over 92%** exact-match accuracy. Relevant to your NVD data integration; cloud models lead.

## 06 Borderline (exception needed)

**QMLFQ** (IEEE SWC 2024). Multi-level feedback queue that also switches between quantized model variants; notes that continuous-batching systems still use simple FCFS. Evaluated on "open-source datasets" with relative JCT improvements; the abstract and text give **no single headline number**, so quantitative claims need a closer look at the figures.

**FlowGuard** (IEEE ICCCN 2026). Recomputes per-request **slack** and prioritises by deadline, plus a KV-cache-aware dispatcher. Deadline-miss rate down **14–28 percentage points** (BurstGPT load) and **34–38 points** (co-located mixed-agent load) on a two-GPU backend; absolute miss rates remain high.

**Edge-LLM** (IEEE ICWS 2024). Server-node collaboration with adaptive quantization, FM cache and **value-density-first (VDF)** scheduling; reports 17× speed-up, 63% fewer timeouts, up to 43% less GPU overhead. Adapter/fine-tuning focus.

**HEXGEN-FLOW** (arXiv v3, 2026). Hierarchical scheduler with global workload-balanced dispatch and an **adaptive local priority queue** for multi-stage agentic Text-to-SQL workflows on heterogeneous GPUs: P95 tail latency down **1.42–1.56×**, throughput up **1.49–1.81×**. The closest structural precedent to your scheduler, but venue unverified (the PDF carries no venue line).

**Automated CVE Triage** (IEEE ISCTurkiye 2025). See corrections.

---

## What this changes for the thesis

1. **Baseline is FCFS.** vLLM's own paper states FCFS; QMLFQ says the same of other systems. Your FIFO/unscheduled baseline is justified.
2. **Strongest design citations are secondary or borderline.** Parrot and the Load Balancing survey justify "scheduler must see the agent graph"; FlowGuard and HEXGEN-FLOW are the closest design precedents but are outside the Q1–Q3/A*/A rule.
3. **Priority signal:** Chaining (KEV/EPSS≥0.088 → CVSS≥7.0) gives a concrete, citable, open-data rule; Unal & Celiktas shows LLM-for-interpretation plus deterministic-scoring as a safe architecture.
4. **SLM claim is supported but not for security:** the Kubernetes paper (0.6–1B threshold; 87% vs 94%) is the best evidence; nothing kept shows a small model doing CVE reasoning.
5. **Quantization choice:** the Edge-Efficient LLM survey is the place to compare AWQ/GPTQ/GGUF; the vLLM paper itself does not cover quantization.
6. **STIX is the weakest point** (see §04).
