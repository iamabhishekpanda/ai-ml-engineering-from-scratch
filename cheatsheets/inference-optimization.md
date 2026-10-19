---
id: inference-optimization
title: Inference Optimization: KV Cache, Quantization, Batching
code: IO
subtitle: Size the KV cache, batch continuously, pick a quantization format, and measure what users feel.
hue: 180
sources: phases/07-transformers-deep-dive/12-kv-cache-flash-attention, phases/10-llms-from-scratch/11-quantization, phases/10-llms-from-scratch/12-inference-optimization, phases/17-infrastructure-and-production/04-vllm-serving-internals, phases/17-infrastructure-and-production/05-eagle3-speculative-decoding, phases/17-infrastructure-and-production/08-inference-metrics-goodput, phases/17-infrastructure-and-production/09-production-quantization
source_hash: 5835d645afd89270
---

## Tasks
type: task-table
from: phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md, phases/17-infrastructure-and-production/04-vllm-serving-internals/docs/en.md, phases/17-infrastructure-and-production/05-eagle3-speculative-decoding/docs/en.md, phases/17-infrastructure-and-production/08-inference-metrics-goodput/docs/en.md

| Task | Code |
|---|---|
| Reuse KV of shared prompts | `--enable-prefix-caching` |
| Store the KV cache in FP8 | `--kv-cache-dtype fp8` |
| Split the model over 4 GPUs | `--tensor-parallel-size 4` |
| Cap the sequence length | `--max-model-len 32768` |
| Set the HBM share for KV blocks | `--gpu-memory-utilization 0.9` |
| Turn on EAGLE-3 drafts | `speculative_config` with `"method": "eagle3"` |
| Read the acceptance per request | `spec_decode_metrics.accepted_tokens_per_request` |
| Use Flash Attention in transformers | `attn_implementation="flash_attention_2"` |

## Serve a model
type: annotated-code
lang: bash
from: phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md, phases/17-infrastructure-and-production/09-production-quantization/docs/en.md

```bash
pip install vllm  # install the engine
vllm serve meta-llama/Llama-3.1-70B-Instruct \  # model to serve
    --tensor-parallel-size 4 \  # weights split over 4 GPUs
    --max-model-len 32768 \  # longest sequence
    --enable-prefix-caching \  # reuse KV of shared prefixes
    --kv-cache-dtype fp8  # FP8 KV, test accuracy
```

## Offline batch in Python
type: annotated-code
lang: python
from: phases/10-llms-from-scratch/12-inference-optimization/docs/en.md, phases/17-infrastructure-and-production/04-vllm-serving-internals/docs/en.md

```python
from vllm import LLM, SamplingParams
llm = LLM(
    model="meta-llama/Meta-Llama-3-70B-Instruct",
    tensor_parallel_size=4,  # 4 GPUs
    enable_prefix_caching=True,  # skip shared prefill
    max_model_len=8192,  # context cap
    gpu_memory_utilization=0.9,  # HBM share for KV blocks
)
params = SamplingParams(temperature=0.7, max_tokens=256)
outputs = llm.generate(["<prompt>"], params)  # continuous batching inside
```

## Formulas
type: concepts
from: phases/10-llms-from-scratch/12-inference-optimization/docs/en.md, phases/10-llms-from-scratch/11-quantization/docs/en.md, phases/17-infrastructure-and-production/05-eagle3-speculative-decoding/docs/en.md, phases/17-infrastructure-and-production/08-inference-metrics-goodput/docs/en.md

- **KV cache size**: `2 * num_layers * num_kv_heads * head_dim * seq_len * bytes_per_param`.
- **Llama 3 70B, BF16**: 320 KB per token, 1.28 GB at 4,096 tokens, 40 GB at 128K.
- **ops:byte**: FLOPs per token over bytes read. Decode at batch 1 is ~1, so memory-bound.
- **TTFT**: `queue_time + network_request + prefill_time`.
- **E2E**: `TTFT + TPOT * output_tokens + network_response`.
- **Spec speedup**: `(1 + K * alpha) / (1 + epsilon)`. K=5, alpha=0.7 gives 4.1x.
- **INT8 scale**: `max(abs(tensor)) / 127`, then `clamp(round(tensor / scale), -128, 127)`.
- **Goodput**: share of requests that meet every TTFT, TPOT and E2E bound.

## Serving engine
type: architecture
from: phases/17-infrastructure-and-production/04-vllm-serving-internals/docs/en.md, phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md, phases/17-infrastructure-and-production/05-eagle3-speculative-decoding/docs/en.md

```arch
node | wait | 1,1 | Waiting queue | new requests
node | sched | 2,1 | Scheduler | runs every decode step
node | run | 3,1 | RUNNING list | prefill and decode
node | pool | 2,2 | KV block pool | 16-token blocks
node | table | 1,2 | Block table | logical to physical
node | gpu | 3,2 | Fused forward | one GPU call
node | draft | 3,3 | Draft head | proposes K tokens
edge | wait | sched | admit
edge | sched | run | batch
edge | sched | pool | allocate
edge | table | pool | maps
edge | run | gpu | forward
edge | draft | gpu | verify
```

## One scheduler iteration
type: flow
from: phases/17-infrastructure-and-production/04-vllm-serving-internals/docs/en.md

1. **Scheduler**: removes sequences that hit EOS or max_tokens.
2. **Allocator**: returns the blocks of finished sequences to the pool.
3. **Scheduler**: admits waiting sequences while free KV blocks exist.
4. **Scheduler**: adds a prefill chunk of 512 tokens for prompts in prefill.
5. **Scheduler**: adds one decode token for every other running sequence.
6. **GPU**: runs the whole batch in one fused forward.
7. **Allocator**: adds one block when a sequence grows past its blocks.

## Defaults worth knowing
type: defaults
from: phases/17-infrastructure-and-production/04-vllm-serving-internals/docs/en.md, phases/17-infrastructure-and-production/05-eagle3-speculative-decoding/docs/en.md, phases/17-infrastructure-and-production/09-production-quantization/docs/en.md, phases/10-llms-from-scratch/11-quantization/docs/en.md

| Setting | Default | Note |
|---|---|---|
| PagedAttention block | 16 tokens | Fragmentation under 4 percent |
| Chunked prefill slice | 512 tokens | Protects the P99 ITL |
| `--gpu-memory-utilization` | 0.9 | HBM for KV after weights |
| `speculative_config` | opt-in | No config, no acceleration |
| GGUF quant | Q4_K_M | CPU and edge serving |
| Datacenter INT4 | AWQ | Unless you need multi-LoRA |
| PTQ calibration data | 128-1024 examples | Match the deployment domain |

## Pick a quantization format
type: command-table
from: phases/17-infrastructure-and-production/09-production-quantization/docs/en.md, phases/10-llms-from-scratch/11-quantization/docs/en.md

| Command | What it does |
|---|---|
| `GGUF Q4_K_M` | CPU and edge, through llama.cpp |
| `GPTQ` | Multi-LoRA on vLLM, Marlin kernels |
| `AWQ` | GPU chat without LoRA. ~741 tok/s on 7B |
| `FP8` | Reasoning, code, medical. Near-lossless |
| `NVFP4` | Blackwell. Validate quality per model |
| `FP8 KV` | Separate choice. Affects attention accuracy |

## Troubleshooting
type: troubleshooting
from: phases/17-infrastructure-and-production/04-vllm-serving-internals/docs/en.md, phases/17-infrastructure-and-production/05-eagle3-speculative-decoding/docs/en.md, phases/17-infrastructure-and-production/08-inference-metrics-goodput/docs/en.md, phases/17-infrastructure-and-production/09-production-quantization/docs/en.md

| Symptom | Cause | Fix |
|---|---|---|
| P99 ITL jumps on long prompts | Prefill blocks decode | Chunked prefill in 512-token slices |
| Spec decode slows the tail | Alpha below 0.55 | Disable it or train a domain draft |
| Mean ITL falls, P99 ITL rises | Rejected drafts need two passes | Watch P99 and tune |
| 4-bit model still runs out of HBM | KV cache stays FP16 or FP8 | Budget weights, KV, activations |
| Domain quality drops after INT4 | Calibrated on generic web text | Calibrate on in-domain data |
| MATH score drops | AWQ INT4 loses 3 to 5 points | Use FP8 or BF16 |
| Tools report different TPOT | One tool excludes TTFT from ITL | State the tool and definition |
| Two features fail together | Combination not supported | Check the compatibility matrix |

## Glossary
type: glossary
from: phases/17-infrastructure-and-production/08-inference-metrics-goodput/docs/en.md, phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md, phases/17-infrastructure-and-production/05-eagle3-speculative-decoding/docs/en.md, phases/10-llms-from-scratch/11-quantization/docs/en.md

- **TTFT**: time to first token. Queue plus network plus prefill.
- **TPOT**: time per output token. Decode cost per token after the first.
- **ITL**: inter-token latency. Same as TPOT in most tools.
- **E2E**: end to end latency of one request.
- **P99**: the 1 in 100 worst latency. The user experience metric.
- **HBM**: high bandwidth memory. 80 GB on H100, ~3 TB/s.
- **Alpha**: share of draft tokens that the target accepts.
- **PTQ**: post-training quantization. No retraining.

## Q&A
type: qa
from: phases/10-llms-from-scratch/12-inference-optimization/docs/en.md, phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md, phases/17-infrastructure-and-production/08-inference-metrics-goodput/docs/en.md

- **Why is decode memory-bound?** It does ~1 operation per weight loaded at batch 1.
- **Why does GQA matter?** Llama 3 70B with 8 KV heads uses 4 KB per token per layer.
- **Is speculative decoding exact?** Yes. The output distribution equals the target model's.
- **Is Flash Attention approximate?** No. The running softmax keeps the result exact.
- **Why goodput over throughput?** High throughput at 60 percent goodput is failure.

## Tips
type: tips
from: phases/17-infrastructure-and-production/08-inference-metrics-goodput/docs/en.md, phases/17-infrastructure-and-production/05-eagle3-speculative-decoding/docs/en.md, phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md, phases/17-infrastructure-and-production/09-production-quantization/docs/en.md

- Report P50, P90 and P99. Never report only the mean.
- Measure alpha on real traffic before you turn on spec decode.
- Use prefix caching for agents with repeated tool prompts.
- Calibrate on in-domain data. Hundreds of samples is usually enough.
- Benchmark at 2x peak concurrency for 30 to 50 iterations.
- Publish tool, version, model, hardware, concurrency and prompt mix.
