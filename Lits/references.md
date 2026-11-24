# Reference Longlist — Local/Quantized Multi-Agent LLM Scheduling

Compiled while scoping the follow-on thesis to Ivander Andreas Wijaya's *"Perancangan Agen Kecerdasan Buatan Berbasis LLM Untuk Manajemen Kerentanan Menggunakan n8n"* (2026), for the new title *"Pengaplikasian Priority-Based Scheduling untuk Sistem LLM Multi-Agent dalam Konteks Sistem Keamanan Siber."* Sources: IEEE Xplore, arXiv, ScienceDirect — all via UI's remote-lib proxy / open access. Local PDFs are named `<id>_<ShortTitle>.pdf` in this folder unless noted otherwise.

## Folder layout (organized 2026-10-07)

| Folder | Contents | Citable? |
|---|---|---|
| `00-base-thesis/` | Wijaya's skripsi (baseline) | Baseline, not external evidence |
| `01-serving-scheduling/` | vLLM/PagedAttention, Parrot, Lemix, serving surveys, edge request scheduling, Ollama-vs-vLLM benchmark | Yes |
| `02-risk-management/` | Risk assessment, vulnerability prioritisation, TRiSM, ISO 42001, Syed | Yes |
| `03-slm-local-deployment/` | Small language models, edge/tiny LLM surveys | Yes |
| `04-stix-cti/` | STIX / threat-intelligence papers (2 still missing, see `revisi-pembimbing.md`) | Yes |
| `05-agentic-cyber-landscape/` | Agent-for-cybersecurity survey, CVE-Bench, ChatNVD | Yes |
| `06-borderline-exception-needed/` | QMLFQ, FlowGuard, Edge-LLM, HEXGEN-FLOW, Automated CVE Triage | Only with the pembimbing's OK |
| `07-onsite-self-hosting/` | Pro and counter evidence for running the base thesis on-site / self-hosted for small companies (added 2026-11-03) | Yes (all quartiles confirmed, SJR 2025) |

`07-not-citable/` (preprints, low-tier conferences, unconfirmed-quartile journals; 22 PDFs) was **deleted on 2026-11-03**; rows that pointed to it are marked *dihapus* below and must not be cited.

The *Local file* column in the tables below gives the file name only; find the file in the folders above. Per-paper pros/cons and the keep/drop decision are in `rencana-skripsi.md` §3 and `revisi-pembimbing.md`. The tables below are the original 2026-09-22 longlist and were **not** filtered.

## Justifikasi Ollama → vLLM (added 2026-11-03)

| Title | Authors | Venue / Year | Link | Local file |
|---|---|---|---|---|
| Benchmarking Ollama and vLLM for Concurrent LLM Serving: A Multi-Scenario Evaluation of Performance and Scalability | Betül Ay, Yunus Emre Demirdağ | *Applied Sciences* (MDPI) 16(11), 5435, 2026 — SJR Q2 (2025) | https://doi.org/10.3390/app16115435 | `applsci-16-05435_Benchmarking-Ollama-vLLM.pdf` |
| Efficient Memory Management for Large Language Model Serving with PagedAttention | Woosuk Kwon et al. | SOSP 2023 (konferensi, CORE A*) | https://arxiv.org/abs/2309.06180 | `SOSP23_PagedAttention.pdf` |
| Towards Efficient Generative Large Language Model Serving: A Survey from Algorithms to Systems | Xupeng Miao, Gabriele Oliaro, Zhihao Zhang, Xinhao Cheng, Hongyi Jin, Tianqi Chen, Zhihao Jia | *ACM Computing Surveys*, 2025 — Q1 (DOI 10.1145/3754448) | https://arxiv.org/abs/2312.15234 | *belum diunduh* |

The first paper is the only Q1–Q3 journal article found that compares Ollama and vLLM head-to-head; details in `reading-notes.md` §01.

## On-site / self-hosted deployment for small companies (added 2026-11-03)

Framing: the base thesis's own limitations #2 (dependence on cloud LLM, OpenCVE API, Telegram), #4 (local CPU-only verifier took 57% of run time and produced no verified vulnerability) and #5 (public LLMs refuse exploit code) motivate moving the whole pipeline on-site. Abstracts read via remote-lib; full texts not yet read. Quartiles checked on scimagojr.com (SJR 2025, best category) on 2026-11-03.

**Supporting**

| Title | Authors | Venue / Year | Quartile | Link | Local file |
|---|---|---|---|---|---|
| Cyber incident prevention and response for small and medium sized enterprises: A scoping review | Josephine Michalek, Peter "Kevin" O'Shaughnessy, Kirsten Wahlstrom | *Computers & Security*, Oct 2026 | Q1 | https://remote-lib.ui.ac.id:2054/science/article/pii/S0167404826001483 | `S0167404826001483_SME-Cyber-Incident-Scoping-Review_C-and-S.pdf` |
| A quest for research and knowledge gaps in cybersecurity awareness for small and medium-sized enterprises | Sunil Chaudhary, Vasileios Gkioulos, Sokratis Katsikas | *Computer Science Review*, Nov 2023 | Q1 | https://remote-lib.ui.ac.id:2054/science/article/pii/S157401372300059X | `S157401372300059X_SME-Cybersecurity-Awareness-Gaps_CS-Review.pdf` |
| RAG-Augmented LLMs for Penetration Testing: A benchmarking study of open-source LLM models | Oumaima Ben Fadhel, Rui Fernandes, Oscar Ribeiro, Monia Najjar, Nuno Lopes | *Intelligent Systems with Applications*, Sep 2026 | Q1 | https://remote-lib.ui.ac.id:2054/science/article/pii/S2667305326000566 | `S2667305326000566_RAG-LLM-Pentest-OpenSource_ISWA.pdf` |
| The double-edged sword: LLM operations (LLMOps) security in the cloud – a comprehensive review | Sijjad Ali, Dhani Bux Talpur, Mamoona Humayun, Maraam Fahaad Almufareh, Ghadah Naif Alwakid, Jahanzaib Yaqoob | *Neurocomputing*, Jun 2026 | Q1 | https://remote-lib.ui.ac.id:2054/science/article/pii/S0925231226007101 | `S0925231226007101_LLMOps-Cloud-Security_Neurocomputing.pdf` |

Also supporting, already in other folders: Edge-Efficient LLM survey, SLM Fine-Tuning Kubernetes, Tiny LLMs IoT (`03-slm-local-deployment/`).

**Counter-evidence**

| Title | Authors | Venue / Year | Quartile | Counter-argument | Link | Local file |
|---|---|---|---|---|---|---|
| Assessing privacy risks of proprietary and open-weight large language models: A GDPR-oriented comparative analysis | Yehia Ibrahim Alzoubi, Alok Mishra | *Journal of Responsible Technology*, Sep 2026 | Q1 | Proprietary models show higher privacy-governance maturity; open-weight models weaker on documentation and accountability, so "local = private" is not automatic | https://remote-lib.ui.ac.id:2054/science/article/pii/S2666659626000399 | `S2666659626000399_GDPR-Privacy-Proprietary-vs-OpenWeight_JRT.pdf` |
| Navigating institutional and capability barriers in agentic artificial intelligence adoption: evidence from small and medium enterprises in Bangladesh | Md Asadul Islam, Mahfuzur Rahman, Francesca Dal Mas, Shamim Ehsanul Haque, Umme Hani | *VINE J. Information and Knowledge Management Systems* (Emerald), 2026, DOI 10.1108/VJIKMS-11-2025-0504 | Q1 | SMEs in developing economies lack skills, infrastructure and budget to adopt agentic AI | https://doi.org/10.1108/VJIKMS-11-2025-0504 (accepted manuscript may be on https://repository.lincoln.ac.uk/articles/journal_contribution/Navigating_Institutional_and_Capability_Barriers_in_Agentic_Artificial_Intelligence_Adoption_Evidence_from_Small_and_Medium_Enterprises_in_Bangladesh/31017028) | `VJIKMS-11-2025-0504_Agentic-AI-Adoption-Barriers-SMEs_VINE.pdf` |
| Evaluating the lifecycle economics of AI: The levelized cost of artificial intelligence (LCOAI) | Eliseo Curcio | *Information Systems*, Feb 2026 | Q1 | Compares GPT-4.1 API, Claude Haiku API, self-hosted and cloud-hosted LLaMA-2-13B; cost depends heavily on inference volume (read results before claiming which wins) | https://remote-lib.ui.ac.id:2054/science/article/pii/S0306437925001206 | `S0306437925001206_LCOAI-Lifecycle-Cost-AI_InfoSys.pdf` |
| Leveraging Large Language Models for advanced static code analysis: Assessing the feasibility of AI superseding traditional vulnerability detection methods | Damian Koterba, Maryna Łukaczyk, Wojciech Książek | *Information and Software Technology*, 2026 | Q1 | 30 LLMs compared; best F1 (0.88) by proprietary Gemini 3 Pro | https://remote-lib.ui.ac.id:2054/science/article/pii/S0950584926002028 | `S0950584926002028_LLM-SAST-30-Models_IST.pdf` |

Also counter, already in other folders: Unal & Celiktas (cloud GPT-4o/Gemini match experts, r 0.939–0.972, `02-risk-management/`); Ay & Demirdağ §5.5 (vLLM advantage measured on H100 FP8, may shrink on SME-class GPUs, `01-serving-scheduling/`).

## Quantization + priority/queue scheduling for LLM serving (core match)

| Title | Authors | Venue / Year | Link | Local file |
|---|---|---|---|---|
| Load balancing for large language model inference serving: A control and learning oriented survey | (see ScienceDirect listing) | ScienceDirect (Elsevier), 2026 | https://remote-lib.ui.ac.id:2054/science/article/pii/S0925231226023714 | `Load_Balancing_for_LLM.pdf` |
| An evaluation framework for measuring prompt wise metrics for large language models in resource-constrained edge | (see ScienceDirect listing) | ScienceDirect (Elsevier), 2025 | https://remote-lib.ui.ac.id:2054/science/article/pii/S2772485925000626 | *(dihapus 2026-11-03 — tidak citable)* |
| QMLFQ: A Quantization-based Queue Scheduling Framework for Efficient LLM Serving | Jiali Wu, Hao Dai, Jiashu Wu, Wenming Jin, Yang Wang | IEEE Smart World Congress (SWC), 2024 | https://remote-lib.ui.ac.id:2147/document/10924817/ | `10924817_QMLFQ.pdf` |
| FlowGuard: Slack-Aware Overload Control for Multi-Agent LLM Serving | Ali Zafar Sadiq, Haiying Shen | IEEE ICCCN, 2026 | https://remote-lib.ui.ac.id:2147/document/11662939/ | `11662939_FlowGuard.pdf` |
| Lemix: Unified Scheduling for LLM Training and Inference on Multi-GPU Systems | Yufei Li, Zexin Li, Yinglun Zhu, Cong Liu | IEEE Real-Time Systems Symposium (RTSS), 2025 | https://remote-lib.ui.ac.id:2147/document/11315052/ | `11315052_Lemix.pdf` |
| Adaptive Task Scheduling for Edge Large Language Models Based on Multi-Source Sensing Context | Yihui Feng, Ya-Hui Yang, Tian Liao | IEEE ICEITCE, 2026 | https://remote-lib.ui.ac.id:2147/document/11634410/ | *(dihapus 2026-11-03 — tidak citable)* |
| Edge-LLM: A Collaborative Framework for Large Language Model Serving in Edge Computing | Fenglong Cai, Dong Yuan, Zhe Yang, Lizhen Cui | IEEE ICWS, 2024 | https://remote-lib.ui.ac.id:2147/document/10707514/ | `10707514_Edge-LLM.pdf` |
| HEXGEN-FLOW: Optimizing LLM Inference Request Scheduling for Agentic Text-to-SQL | You Peng, Youhe Jiang, Wenqi Jiang, Chen Wang, Binhang Yuan | IEEE ICDE 2026 / arXiv:2505.05286 | https://arxiv.org/abs/2505.05286 | `2505.05286_HEXGEN-FLOW.pdf` |

## Multi-agent LLM serving frameworks (the "agent part")

| Title | Authors | Venue / Year | Link | Local file |
|---|---|---|---|---|
| TokenCake: A KV-Cache-centric Serving Framework for LLM-based Multi-Agent Applications | Zhuohang Bian, Feiyang Wu, Zhuoran Li, Teng Ma, Youwei Zhuo | arXiv, 2025 | https://arxiv.org/abs/2510.18586 | *(dihapus 2026-11-03 — tidak citable)* |
| Kairos: Low-latency Multi-Agent Serving with Shared LLMs and Excessive Loads in the Public Cloud | Jinyuan Chen, Jiuchen Shi, Quan Chen, Minyi Guo | arXiv, 2025 | https://arxiv.org/abs/2508.06948 | *(dihapus 2026-11-03 — tidak citable)* |
| HeraSys: Collaborative Serving of Multiple LLM Workflows via Fine-Grained End-to-End Optimization | Size Li, Zhiqing Tang, Hongrui Liang, Jianxiong Guo, Jiong Lou, Tian Wang, Weijia Jia | arXiv, 2026 | https://arxiv.org/abs/2607.22578 | *(dihapus 2026-11-03 — tidak citable)* |
| Deadline-Driven Hierarchical Agentic Resource Sharing for AI Services and RAN Functions in AI-RAN | (see arXiv listing) | arXiv, 2026 | https://arxiv.org/abs/2605.07547 | *(dihapus 2026-11-03 — tidak citable)* |

## vLLM-relevant: SLO-aware / real-time vs. best-effort request scheduling

| Title | Authors | Venue / Year | Link | Local file |
|---|---|---|---|---|
| SLO-Aware Scheduling for Large Language Model Inferences | (see arXiv listing) | arXiv, 2025 | https://arxiv.org/abs/2504.14966 | *(dihapus 2026-11-03 — tidak citable)* |
| Efficient LLM Serving on Hybrid Real-time and Best-effort Requests | (see arXiv listing) | arXiv, 2025 | https://arxiv.org/abs/2504.09590 | *(dihapus 2026-11-03 — tidak citable)* |

## Background: deadline / mixed-criticality scheduling applied to LLM agents

| Title | Authors | Venue / Year | Link | Local file |
|---|---|---|---|---|
| When Do LLM Agents Help? Deadline-Aware Mixed-Criticality Task Scheduling at the Autonomous-Vehicle Edge | (see arXiv listing) | arXiv, 2026 | https://arxiv.org/abs/2608.19557 | *(dihapus 2026-11-03 — tidak citable)* |
| Agentic-V2X: Small Language Model Agents for Deadline-Aware V2X Scheduling in 5G/6G Networks | (see arXiv listing) | arXiv, 2026 | https://arxiv.org/abs/2607.04290 | *(dihapus 2026-11-03 — tidak citable)* |

*(Note: ScienceDirect's PDF link redirects through a signed, short-lived S3 URL gated by anti-bot checks that reject both scripted `fetch()` and `curl` — even with matching browser headers/cookies/referer, only a real top-level browser navigation gets through. Both ScienceDirect papers above were retrieved this way by hand.)*

## Cybersecurity / CVE-specific sources

Pulled from two places: (a) the base thesis's own "Penelitian Terkait" (§2.2) and bibliography — its most directly relevant CVE/agentic-cybersecurity citations, downloaded here for direct reference instead of citing through the base thesis; and (b) fresh IEEE/arXiv searches for CVE-prioritization and vulnerability-management material published since.

**From the base thesis's bibliography** (numbers below are its own `[n]` citation numbers):

| Title | Authors | Venue / Year | Link | Local file |
|---|---|---|---|---|
| [1] Automated CVE Triage: AI-Agent Framework for Scalable Vulnerability Triaging and Security Automation | Novruz Amirov, Emil Huseynov, Nahid Aliyev, Şerif Bahtiyar | IEEE, 18th ISCTurkiye, 2025 | https://remote-lib.ui.ac.id:2147/document/11224852/ | `11224852_Automated-CVE-Triage.pdf` |
| [3] A cybersecurity AI agent selection and decision support framework | M. Malatji | arXiv, 2025 | https://arxiv.org/abs/2510.01751 | *(dihapus 2026-11-03 — tidak citable)* |
| [7] Cybersecurity vulnerability management: A conceptual ontology and cyber intelligence alert system | R. Syed | ScienceDirect, *Information & Management*, vol. 57, no. 6, 2020 | https://remote-lib.ui.ac.id:2054/science/article/pii/S0378720620302718 | `Cybersecurity_Vulnerability_Management.pdf` |
| [21] Streamlining Security Vulnerability Triage with Large Language Models | M. J. Torkamani, J. Ng, N. Mehrotra, M. Chandramohan, P. Krishnan, R. Purandare | arXiv, 2025 | https://arxiv.org/abs/2501.18908 | *(dihapus 2026-11-03 — tidak citable)* |
| [23] Teams of LLM Agents can Exploit Zero-Day Vulnerabilities | Y. Zhu, A. Kellermann, A. Gupta, P. Li, R. Fang, R. Bindu, D. Kang | arXiv, 2025 | https://arxiv.org/abs/2406.01637 | *(dihapus 2026-11-03 — tidak citable)* |
| [24] CVE-Bench: A Benchmark for AI Agents' Ability to Exploit Real-World Web Application Vulnerabilities | Y. Zhu et al. | arXiv, 2025 | https://arxiv.org/abs/2503.17332 | `2503.17332_CVE-Bench.pdf` |
| [26] Cybersecurity AI: Evaluating Agentic Cybersecurity in Attack/Defense CTFs | F. Balassone et al. | arXiv, 2025 | https://arxiv.org/abs/2510.17521 | *(dihapus 2026-11-03 — tidak citable)* |
| [28] Agentic AI Frameworks: Architectures, Protocols, and Design Challenges | H. Derouiche, Z. Brahmi, H. Mazeni | arXiv, 2025 | https://arxiv.org/abs/2508.10146 | *(dihapus 2026-11-03 — tidak citable)* |

*(Skipped from the base thesis's bibliography as lower-relevance to the priority-scheduling angle: [8]/[9] VulDeePecker family — classic static ML vulnerability detection, well-summarized already in the base thesis §2.2.1; [25]/[27] PentestGPT/Aracne — pentesting agents, tangential to CVE triage/scheduling.)*

**Newly found** (not in the base thesis — published on CVE prioritization / vulnerability-management automation):

| Title | Authors | Venue / Year | Link | Local file |
|---|---|---|---|---|
| Automating Vulnerability Assessment Using a Machine Learning Framework for CVSS Scoring | (see IEEE listing) | IEEE, 2025 | https://remote-lib.ui.ac.id:2147/document/11598324/ | *(dihapus 2026-11-03 — tidak citable)* |
| SBOM-AI: An Explainable ML Framework for High-Risk Component Prioritization in Software Supply Chains | (see IEEE listing) | IEEE, 2025 | https://remote-lib.ui.ac.id:2147/document/11465652/ | *(dihapus 2026-11-03 — tidak citable)* |
| RAPID: An LLM-Driven Framework for Autonomous Vulnerability Remediation Across Heterogeneous Operating Systems Environments | (see IEEE listing) | IEEE, 2025 | https://remote-lib.ui.ac.id:2147/document/11201167/ | *(dihapus 2026-11-03 — tidak citable)* |
| LLM-Based Intelligent Agents for Cybersecurity: A Tutorial and Survey of Automated Vulnerability Discovery | (see IEEE listing) | IEEE, 2026 | https://remote-lib.ui.ac.id:2147/document/11580353/ | `11580353_LLM-Agents-Cybersecurity-Survey.pdf` |
| Lightweight Skill-Based LLM Workflows for Vulnerability Identification and Classification | (see IEEE listing) | IEEE, 2026 | https://remote-lib.ui.ac.id:2147/document/11655058/ | *(dihapus 2026-11-03 — tidak citable)* |
| Can LLMs Classify CVEs? Investigating LLMs Capabilities in Computing CVSS Vectors | (see arXiv listing) | arXiv, 2025 | https://arxiv.org/abs/2504.10713 | *(dihapus 2026-11-03 — tidak citable)* |
| PrAIoritize: Automated Early Prediction and Prioritization of Vulnerabilities (in Smart Contracts) | (see arXiv listing) | arXiv, 2023 | https://arxiv.org/abs/2308.11082 | *(dihapus 2026-11-03 — tidak citable)* |
| Red-MIRROR: Agentic LLM-based Autonomous Penetration Testing with Reflective Verification and Knowledge-augmented Interaction | (see arXiv listing) | arXiv, 2026 | https://arxiv.org/abs/2603.27127 | *(dihapus 2026-11-03 — tidak citable)* |

**Why these matter for the thesis**: `Automated CVE Triage` [1] and `Streamlining Security Vulnerability Triage with LLMs` [21] are the two closest prior-art papers to the actual title — both are literally "prioritize/triage CVEs automatically," just without the multi-agent + local/quantized-serving angle this thesis adds. `Can LLMs Classify CVEs?` and the `CVSS Scoring` / `SBOM-AI` papers give concrete precedent for how to turn a CVE into a numeric priority score (the input signal your scheduler will consume). `LLM-Based Intelligent Agents for Cybersecurity` (survey, 34pp) is worth reading first for related-work framing — it's broad enough to cite for the "agentic AI in cybersecurity" landscape paragraph.

## Not pursued

- **iG Library / iG Publishing eBook Platform** and **Brill**: searched ("large language model edge quantization", "large language model scheduling") — both platforms' catalogs are general engineering/math/business/humanities ebooks (SIAM, ASTD, Brill's humanities imprints), no relevant hits on this topic.

## Working framing (per discussion 2026-09-22)

- Base thesis used **n8n** (visual workflow orchestration) + Google ADK + Ollama for a hierarchical agent pipeline (Director → Searcher → Researcher → Verifier → Technical Observer).
- New direction: swap Ollama for **vLLM** as the serving engine, and frame the contribution as **agent/request-level priority scheduling in front of vLLM** — following the QMLFQ / FlowGuard / TokenCake pattern above.
- Dropping n8n for this direction is a step forward, not backward: n8n is a workflow-trigger tool with no hooks into request-level queuing, latency measurement, or priority/deadline control over concurrent LLM calls — exactly the mechanism the new contribution needs to expose and instrument. A custom orchestration layer (Python + vLLM's OpenAI-compatible API) is necessary to implement and measure the scheduler; n8n could still wrap the outer workflow trigger if useful, but the scheduling core must be custom code.
- Cite the mixed-criticality/deadline-aware papers (AV-Edge, Agentic-V2X) as optional background, with the actual implementation scoped as agent-level priority scheduling (closest precedent: QMLFQ, FlowGuard, TokenCake).
