# Evidence: cheatsheets/inference-optimization.md

Abbreviations: KV = phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md, IO = phases/10-llms-from-scratch/12-inference-optimization/docs/en.md, QZ = phases/10-llms-from-scratch/11-quantization/docs/en.md, VL = phases/17-infrastructure-and-production/04-vllm-serving-internals/docs/en.md, EG = phases/17-infrastructure-and-production/05-eagle3-speculative-decoding/docs/en.md, MT = phases/17-infrastructure-and-production/08-inference-metrics-goodput/docs/en.md, PQ = phases/17-infrastructure-and-production/09-production-quantization/docs/en.md.

## Tasks (task-table, 8)
- --enable-prefix-caching: KV:199
- --kv-cache-dtype fp8: KV:200
- --tensor-parallel-size 4: KV:197
- --max-model-len 32768: KV:198
- --gpu-memory-utilization 0.9 (default 0.9): VL:33
- speculative_config with "method": "eagle3": VL:61, EG:25,49
- spec_decode_metrics.accepted_tokens_per_request: EG:50
- attn_implementation="flash_attention_2": KV:186

## Serve a model (annotated-code, 6 lines)
- pip install vllm and vllm serve command: KV:195-200
- FP8 KV affects attention accuracy: PQ:84

## Offline batch in Python (annotated-code, 10 lines)
- LLM(...) and SamplingParams and llm.generate: IO:695-706
- gpu_memory_utilization as HBM share for KV blocks: VL:33
- continuous batching inside the engine: IO:204 (vLLM: PagedAttention, continuous batching)

## Formulas (concepts, 8)
- KV cache size formula: IO:86
- Llama 3 70B 320 KB, 1.28 GB, 40 GB: IO:92-94
- ops:byte definition and ~1 at decode batch 1: IO:55,58
- TTFT formula: MT:27
- E2E formula: MT:41
- spec speedup and K=5, alpha=0.7 gives 4.1x: EG:31
- INT8 scale and clamp: QZ:100-101
- goodput: MT:53-55

## Serving engine (architecture, 7 nodes, 6 edges)
- Waiting queue, new requests: VL:42, VL:78
- Scheduler, runs every decode step: VL:39
- RUNNING list, prefill and decode: VL:39, 45
- KV block pool, 16-token blocks: VL:31
- Block table, logical to physical: VL:31
- Fused forward, one GPU call: VL:91
- Draft head proposes K tokens, target verifies: EG:21

## One scheduler iteration (flow, 7)
- 1, scheduler removes finished sequences: VL:41, VL:75
- 2, allocator returns blocks to the pool: VL:31, VL:76
- 3, scheduler admits waiting sequences: VL:42, VL:78-81
- 4, prefill chunk of 512 tokens: VL:51, VL:87
- 5, one decode token for every other sequence: VL:89
- 6, one fused forward: VL:91
- 7, allocator adds a block on growth: VL:31

## Defaults worth knowing (defaults, 7)
- PagedAttention block 16 tokens, under 4 percent: VL:31,33
- chunked prefill 512 tokens, P99 ITL: VL:51,14
- --gpu-memory-utilization 0.9: VL:33
- speculative_config opt-in: EG:25
- GGUF Q4_K_M production default: PQ:38
- AWQ datacenter default unless multi-LoRA: PQ:3,52
- PTQ calibration data 128-1024 examples: QZ:154

## Pick a quantization format (command-table, 6)
- GGUF Q4_K_M CPU/edge llama.cpp: PQ:29,38
- GPTQ multi-LoRA, Marlin: PQ:30,44-46
- AWQ ~741 tok/s on 7B: PQ:50-52
- FP8 near-lossless, reasoning, medical, code: PQ:56
- NVFP4 Blackwell, validate per model: PQ:34,58-65
- FP8 KV separate choice: PQ:84

## Troubleshooting (8)
- P99 ITL on long prompts, chunked prefill: VL:49-51
- alpha below 0.55: EG:35,51
- mean ITL down, P99 up, two-pass: EG:56, EG:90
- 4-bit model OOM, KV stays FP16/FP8: PQ:75-82
- calibration on generic text: PQ:69-71
- AWQ INT4 loses 3-5 points on MATH, use FP8 or BF16: PQ:88
- tools disagree on TPOT: MT:76-83
- compatibility matrix: VL:61, EG:71

## Glossary (8)
- TTFT: MT:127
- TPOT: MT:128
- ITL: MT:129
- E2E: MT:130
- P99: MT:133
- HBM 80 GB on H100, ~3 TB/s: KV:220
- Alpha: EG:98
- PTQ: QZ:144

## Q&A (5)
- decode memory-bound ~1 op per weight: IO:58
- GQA 8 KV heads 4 KB per token per layer: KV:45-48,54
- spec decoding exact: IO:186
- Flash Attention exact via running softmax: KV:89
- 60 percent goodput is failure: MT:55

## Tips (6)
- P50, P90, P99: MT:63
- measure alpha first: EG:3,48-51
- prefix caching for agents, 5x: KV:203
- calibrate in-domain, hundreds of samples: PQ:71
- 2x peak concurrency, 30-50 iterations: MT:99-100
- publish tool, version, model, hardware, concurrency, prompt distribution: MT:101
