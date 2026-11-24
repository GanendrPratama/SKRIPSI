# Revisi Pembimbing — Literature Round 3, v2 (2026-10-07)

Pembimbing's points: (1) more Q1 peer-reviewed papers, (2) pros/cons incl. quality and peer-review status, (3) risk management, (4) justification n8n → vLLM, (5) Small LLM + STIX 2.1. **Follow-up: cut anything not peer-reviewed or not Q1/Q2/Q3.**

> **Superseded in part:** after reading the papers, several pros/cons here were corrected (Lemix, LLM-TIKG, IoT-J scheduling, 6G agent framework, Automated CVE Triage, Althar). The current, verified pros/cons are in `rencana-skripsi.md` §3 and `Lits/reading-notes.md`.

## Selection rule used in v2

**Keep** = peer-reviewed **and** either (a) a journal in SJR Q1–Q3, or (b) a conference at the top of its field (CORE A*/A). Conferences have no quartile, so (b) is my reading of the instruction. **Confirm that reading with the pembimbing.**
**Drop** = arXiv-only preprints, blog/vendor material, unranked or low-tier conferences, journals with unconfirmed quartile.

Caveats:
- Quartiles were cross-checked on secondary aggregators (2024 SJR) because Scimago blocked automated access. Spot-check the ones you cite.
- CORE ranks below are from memory, **not verified**. Check at portal.core.edu.au.
- IEEE Access is Q1 but a mega-journal; I flag it where it is the only support for a point.
- Venue facts for the older papers were read from the first page of the PDFs in `Lits/`.

---

## A. KEEP — by pembimbing point

### Point 3: Risk management
| Paper | Venue | Quality | Pros | Cons |
|---|---|---|---|---|
| Unal & Celiktas, *Automating Cyber Risk Assessment With Public LLMs* | IEEE Access 2026 | Q1 (mega) | LLM + risk assessment; contrasts static CVSS with labour-heavy NIST SP 800-30; expert-validated | Cloud LLMs, not local; new, 2 citations |
| Shimizu & Hashimoto, *Vulnerability Management Chaining* | IEEE Access 2026 | Q1 (mega) | CVSS + EPSS + KEV prioritisation = your priority signal | No LLM/agents |
| *Automated Risk Management Based Software Security Vulnerabilities Management* | IEEE Access 2022 | Q1 (mega) | ML-based threat modelling, 30 citations | Older, no LLM |
| *A Security Risk Taxonomy for Prompt-Based Interaction With LLMs* | IEEE Access 2024 | Q1 (mega) | 45 citations; risk taxonomy for the LLM layer | Prompt-level risk, not vuln-mgmt |
| *TRiSM for Agentic AI* | **AI Open** 2026 | Q1 | Risk mgmt for multi-agent LLM; NIST AI RMF (Govern/Map/Measure/Manage) | Review, not experimental |
| *From COBIT to ISO 42001* | **Computers & Security** 2024 | Q1 | Standards mapping for LLM risk | Governance-level |
| Syed, *Cybersecurity vulnerability management: ontology* (already held) | **Information & Management** 2020 | Q1 | Theory-grade vuln-mgmt backbone | Pre-LLM |

*Thin spot:* 4 of 7 are IEEE Access. Look for one or two more in Computers & Security / IEEE TDSC if the pembimbing objects.

### Point 4: n8n → vLLM
No peer-reviewed paper compares n8n with vLLM. The justification is architectural plus your own measurement.
| Paper | Venue | Quality | Pros | Cons |
|---|---|---|---|---|
| Kwon et al., *PagedAttention* (vLLM) | **SOSP 2023** | A* (verify) | Foundational vLLM paper; throughput via paged KV cache + continuous batching | Systems paper; does not address agents or priorities |
| Lin et al., *Parrot* | **OSDI 2024** | A* (verify) | Serving engines see only single requests and lose application structure; supports putting the scheduler above the engine, aware of the agent graph | Targets app-level semantic variables, not security |
| *Co-Optimizing Request Scheduling and KV Caching for Edge LLM Serving* | **IEEE IoT Journal** 2026 | Q1 | Request scheduling for local/edge serving | 0 citations; new |
| *Minimizing Response Latency in LLM-Based Agent Systems* (survey) | IEEE Access 2026 | Q1 (mega) | Agent-latency framing | Survey, mega-journal |
| *BrownoutServe* (SLO-aware serving) | IEEE Trans. Computers 2026 | Q1 (SJR 2025) | SLO-aware under bursty load | MoE-focused |
| Miao et al., *Efficient Generative LLM Serving: Survey* | **ACM Computing Surveys** 2025 | Q1 | Broad serving + scheduling survey | **PDF not yet obtained**; confirm published version |

### Point 5a: Small LLM
| Paper | Venue | Quality | Pros | Cons |
|---|---|---|---|---|
| *Empowering LLMs to edge intelligence: survey of edge efficient LLMs* | **Computer Science Review** 2025 | Q1 | SLMs, compression, quantisation, edge frameworks | Survey |
| *Tiny LLMs for IoT networks* | **Computers & Electrical Eng.** 2026 | Q1 (2023 confirmed; 2024 not found) | Taxonomy of compression/deployment | IoT-focused |
| *ResilioMate* (multi-agent framework for SLMs) | IEEE Access 2025 | Q1 (mega) | Multi-agent + SLM | General tasks, not security |
| *SLM Fine-Tuning for Intent-Driven Kubernetes Management* | IEEE Access 2026 | Q1 (mega) | Fine-tuned SLM as an ops agent | Kubernetes domain |
| *Network Self-Configuration with Fine-Tuned SLMs* | **IEEE OJCOMS** 2026 | Q1 | Fine-tuned SLM emitting structured config | Telecom domain |
| *Lightweight LM-Driven Agentic Framework for Intrusion Prediction/Detection/Mitigation (6G IoT)* | **IEEE OJCOMS** 2026 | Q1 | Security + lightweight LM + agents in one paper | 6G-IoT scope |

*Dropped here:* the NVIDIA position paper "SLMs are the Future of Agentic AI" (arXiv-only). Mention only as a footnote if the pembimbing allows preprints for motivation.

### Point 5b: STIX 2.1
STIX 2.1 is an **OASIS standard**, not a paper; cite the OASIS specification as the normative reference.
| Paper | Venue | Quality | Pros | Cons |
|---|---|---|---|---|
| *LLM-TIKG: Threat intelligence knowledge graph with LLM* | **Computers & Security** 145, 2024 | Q1 | LLM → structured CTI graph | Check which STIX version it uses |
| *TI-NERmergerV2: threat-intel NER datasets via STIX* | **Computers & Security** 2026 | Q1 | Explicit STIX 2.1 alignment | No LLM agents. **PDF missing** |
| *AttacKG+: attack graph construction with LLMs* | **Computers & Security** 2024 | Q1 | LLM entity/relation extraction on STIX | Uses STIX 2.0 (per snippet). **PDF missing** |
| *LLMs for cyber threat detection: survey* | **Computers & Security** 145, 2024 | Q1 | Broad peer-reviewed survey | Detection focus |
| *Multi-Strategy RAG With ATT&CK STIX Metadata-Enriched Embeddings* | IEEE Access 2026 | Q1 (mega) | STIX metadata with LLM retrieval | ATT&CK technique extraction |

### Existing papers that survive the filter
| Paper | Venue | Quality | Why keep |
|---|---|---|---|
| *Load Balancing for LLM Inference Serving* (survey) | **Neurocomputing** 2026 (Elsevier) | Q1 | Journal survey; baseline/related-work anchor |
| Lemix | **IEEE RTSS 2025** | A* (verify) | Real-time-systems venue; supports the deadline/criticality framing |
| CVE-Bench | **ICML 2025** (confirmed in PDF) | A* | Peer-reviewed benchmark; agent-risk context |
| *LLM-Based Agents for Cybersecurity: Tutorial & Survey* | IEEE Access 2026 | Q1 (mega) | Landscape survey |
| Syed 2020 | I&M | Q1 | See Point 3 |
| ChatNVD (new, extra) | IEEE Access 2026 | Q1 (mega) | LLM over NVD; relevant to the CVE data source. Not yet assessed in detail |

---

## B. BORDERLINE — closest design precedents, **not** Q1–Q3 journals
These are peer-reviewed conference papers but not clearly top-tier, so they fail the strict rule. They are the closest prior art for queue scheduling over quantized or multi-agent LLM serving. **Recommendation:** ask the pembimbing for an exception and cite them in one "closest related work" paragraph, flagged as conference papers. Otherwise cut them.
| Paper | Venue | Issue |
|---|---|---|
| QMLFQ | IEEE SWC 2024 | Unranked venue; best match for quantization-aware queues |
| FlowGuard | IEEE ICCCN 2026 | CORE B (verify); best match for multi-agent overload control |
| Edge-LLM | IEEE ICWS 2024 | CORE rank to verify (possibly A) |
| HEXGEN-FLOW | arXiv v3 (2026); the PDF has no venue line | ICDE acceptance **not confirmed**. Drop unless you can verify |
| Automated CVE Triage | IEEE ISCTurkiye 2025 | Low-tier, but closest to the thesis title |

## C. DROPPED
**arXiv-only, not peer-reviewed (16):** Can LLMs Classify CVEs (CVSS vectors), TokenCake, Kairos, HeraSys, AI-RAN Agentic Resource Sharing, SLO-Aware Scheduling for LLM, Hybrid Real-time/Best-effort, Deadline-Aware Mixed-Criticality (AV), Agentic-V2X, Malatji agent selection, Streamlining Vuln Triage with LLMs, Teams of LLM Agents (zero-day), Cybersecurity AI CTF, Agentic AI Frameworks, Red-MIRROR, PrAIoritize.
**Low-tier / unranked conference:** Adaptive Task Scheduling for Edge LLMs (ICEITCE), CVSS Scoring ML (BlackSeaCom), SBOM-AI (IATMSI), Lightweight Skill-Based LLM Workflows (SERA), RAPID (IEEE ISI).
**Re-check 2026-11-03:** *Prompt-wise metrics for LLMs in resource-constrained edge* (*BenchCouncil Trans. on Benchmarks, Standards and Evaluations*) is **SJR Q1 (2025)**, so it is citable after all. Its PDF was deleted with `07-not-citable/` and must be re-downloaded.
**New items dropped (preprint / grey):** arXiv 2603.20131 (multi-agent risk mgmt), 2507.16576 (AZERG), 2607.23312 (STIX 2.1 dataset), 2506.02153 (SLM position paper), Red Hat Ollama-vs-vLLM blog (grey literature; run the comparison yourself in Bab 4 instead).
**Kept as baseline, not evidence:** Wijaya's skripsi.

### Impact of the filter
- Scheduling-specific support drops to **RTSS (Lemix), IoT-J, Parrot, SOSP, ACM CSUR survey, Neurocomputing survey**. Every agent-aware scheduling paper (TokenCake, Kairos, FlowGuard, QMLFQ…) is a preprint or a mid-tier conference, so section B matters.
- The deadline/mixed-criticality background now rests mainly on Lemix. Say this to the pembimbing, because it weakens the theory section.
- The 16 preprints and 5 low-tier conference papers dropped from the original 33 are now outside the filter, so the old reference list shrinks to about 8 papers, plus the 5 borderline ones in section B.

---

## D. Quartile check (re-checked 2026-11-03 directly on scimagojr.com, SJR 2025, best category)
| Journal | SJR 2025 |
|---|---|
| IEEE Access | Q1 |
| IEEE Internet of Things Journal | Q1 |
| IEEE Open Journal of the Communications Society | Q1 |
| IEEE Trans. on Computers | Q1 |
| IEEE Trans. on Reliability | Q1 |
| Computers & Security | Q1 |
| Computers & Electrical Engineering | Q1 |
| Computer Science Review | Q1 |
| ACM Computing Surveys | Q1 |
| AI Open | Q1 |
| Information & Management | Q1 |
| Neurocomputing | Q1 |
| Information Systems (Elsevier) | Q1 |
| Information and Software Technology | Q1 |
| Journal of Systems and Software | Q1 |
| Intelligent Systems with Applications | Q1 |
| Journal of Responsible Technology | Q1 |
| VINE J. Information and Knowledge Management Systems | Q1 |
| BenchCouncil Trans. on Benchmarks, Standards and Evaluations | Q1 |
| Applied Sciences (MDPI) | Q2 |
| Software and Systems Modeling | Q2 |
| Software: Practice and Experience | Q2 |

"Best category" is the highest quartile among the journal's subject categories; some journals sit lower in secondary categories (e.g. Applied Sciences is Q3 in Process Chemistry, J. Responsible Technology is Q2 in HCI).

## E. Files (now sorted into `Lits/01-…` to `Lits/07-…`, see the layout table in `references.md`)
- **IEEE (13):** all journal items above plus ChatNVD.
- **ScienceDirect (6):** TRiSM (AI Open), Edge-Efficient LLM Survey (CS Review), Tiny LLMs IoT (CEE), COBIT→ISO 42001, LLM Cyber Threat Detection Survey, LLM-TIKG (all C&S).
- **Systems (2):** `SOSP23_PagedAttention.pdf`, `OSDI24_Parrot.pdf`.

**Still missing:** TI-NERmergerV2 (`S0167404826000143`), AttacKG+ (`S0167404824005261`), ACM CSUR serving survey (arXiv copy: arxiv.org/abs/2312.15234; get the ACM version if possible).

## F. Next steps
1. Confirm with the pembimbing: conferences at CORE A*/A count as equivalent to Q1–Q3, and whether section B gets an exception.
2. Verify CORE ranks (RTSS, SOSP, OSDI, ICML, ICWS, ICCCN). Journal quartiles are done (section D).
3. Download the 3 missing papers.
4. Update `references.md` to this keep/drop list.
