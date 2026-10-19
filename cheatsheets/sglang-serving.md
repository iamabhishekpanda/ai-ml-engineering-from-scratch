---
id: sglang-serving
title: LLM Serving with SGLang
code: LS
subtitle: Start, query, size, measure and fix an SGLang server. Pinned to SGLang 0.5.22.
hue: 200
sources: manuals/sglang-101
source_hash: e05476a2a1f9abb9
---

## Tasks
type: task-table
from: manuals/sglang-101/capture/out/server-default.command.txt, manuals/sglang-101/capture/one_request.py, manuals/sglang-101/capture/run.py, manuals/sglang-101/sections/5-1-sglang-benchmark-serving.md, manuals/sglang-101/sections/5-2-the-metrics-endpoint.md, manuals/sglang-101/sections/7-1-operating-sglang.md

| Task | Code |
|---|---|
| Start a server | `sglang serve --model-path <model> --port 30000` |
| Native request | `POST /generate {"text": "<prompt>"}` |
| OpenAI-style request | `POST /v1/chat/completions` |
| Readiness probe | `GET /ready` |
| Read metrics | `GET /metrics` |
| Benchmark at a fixed concurrency cap | `--max-concurrency 8` |
| Benchmark at a fixed request rate | `--request-rate <rps>` |
| Stop with a drain | `docker stop <container>` |

## Start the server (terminal 1)
type: annotated-code
lang: bash
from: manuals/sglang-101/capture/out/server-default.command.txt, manuals/sglang-101/sections/r-1-flags-and-defaults.md, manuals/sglang-101/sections/2-1-sglang-serve-and-the-three-processes.md, manuals/sglang-101/sections/3-2-mem-fraction-static-and-startup-sizing.md

```bash
sglang serve --model-path <model> \  # weights to load
  --port 30000 \  # HTTP port
  --enable-cache-report \  # cached_tokens in usage
  --enable-metrics \  # turns on /metrics
  --mem-fraction-static 0.4  # weights plus KV pool share
```

## Benchmark it (terminal 2)
type: annotated-code
lang: bash
from: manuals/sglang-101/capture/run.py, manuals/sglang-101/sections/5-1-sglang-benchmark-serving.md, manuals/sglang-101/sections/r-1-flags-and-defaults.md, manuals/sglang-101/capture/out/bench-random-c8.txt, manuals/sglang-101/capture/out/bench-random-c32.txt

```bash
# Concurrency cap of 8. The server in terminal 1 must be up.
python -m sglang.benchmark.serving --backend sglang \
  --port 30000 --dataset-name random \
  --random-input-len 512 --random-output-len 128 \
  --random-range-ratio 1.0 \  # default 0.0 halves prompts
  --num-prompts 32 --max-concurrency 8  # 255.63 tok/s on the capture
```

## Key flags
type: command-table
from: manuals/sglang-101/sections/r-1-flags-and-defaults.md, manuals/sglang-101/sections/2-2-the-scheduler-loop-and-schedule-policy.md, manuals/sglang-101/sections/2-3-admission-and-retraction.md, manuals/sglang-101/sections/3-2-mem-fraction-static-and-startup-sizing.md, manuals/sglang-101/sections/6-1-tp-size-dp-size-and-attn-dp-size.md, manuals/sglang-101/sections/5-1-sglang-benchmark-serving.md

| Command | What it does |
|---|---|
| `--mem-fraction-static <f>` | Memory share for weights plus KV pool |
| `--max-total-tokens <n>` | Fixes the KV pool size in tokens |
| `--max-running-requests <n>` | Caps decoding requests. Set it at the knee |
| `--chunked-prefill-size <n>` | Largest prompt piece in one step |
| `--schedule-policy lpm` | Longest prefix match order |
| `--schedule-conservativeness 1.3` | Higher forecast, fewer retractions |
| `--disable-radix-cache` | No prefix reuse. Only to measure |
| `--tp-size <n>` | Splits each layer over n GPUs |

## Three processes
type: architecture
from: manuals/sglang-101/sections/2-1-sglang-serve-and-the-three-processes.md, manuals/sglang-101/sections/3-1-kv-bytes-per-token-and-the-kv-pool.md, manuals/sglang-101/sections/3-3-radixcache.md

```arch
node | client | 1,1 | Client | HTTP :30000 | client
node | tok | 2,1 | TokenizerManager | main process, tokenize | process
node | sched | 3,1 | Scheduler | owns the GPU | gpu
node | detok | 2,2 | DetokenizerManager | ids to text | process
node | radix | 3,2 | UnifiedRadixCache | prefix tree | store
node | pool | 3,3 | KV pool | one slot per token | store
edge | client | tok | HTTP
edge | tok | sched | ZMQ
edge | sched | detok | ZMQ
edge | detok | tok | ZMQ
edge | sched | radix | match
edge | radix | pool | slots
```

## One request, end to end
type: flow
from: manuals/sglang-101/sections/2-1-sglang-serve-and-the-three-processes.md, manuals/sglang-101/sections/2-2-the-scheduler-loop-and-schedule-policy.md, manuals/sglang-101/sections/2-3-admission-and-retraction.md, manuals/sglang-101/sections/3-3-radixcache.md

1. **TokenizerManager**: applies the chat template, tokenizes, sends it over ZMQ.
2. **Scheduler**: adds it to the waiting queue in policy order.
3. **RadixCache**: `match_prefix` finds the cached prefix, shown as `#cached-token`.
4. **Scheduler**: admits it if prompt plus `max_new_tokens` fits the pool.
5. **Scheduler**: prefills `#new-token` in chunks and samples the first token.
6. **Scheduler**: decodes one token per step until a stop condition.
7. **DetokenizerManager**: turns ids into text for the TokenizerManager to stream.

## Defaults in the code
type: defaults
from: manuals/sglang-101/sections/r-1-flags-and-defaults.md

| Setting | Default | Note |
|---|---|---|
| `--mem-fraction-static` | `None` | Derived at startup. Kit sets 0.4 |
| `--max-running-requests` | `None` | Derived from pool and context |
| `--chunked-prefill-size` | `None` | Derived from GPU memory |
| `--schedule-conservativeness` | 1.0 | Raise it on retractions |
| `--schedule-policy` | `fcfs` | Try `lpm` for long shared prefixes |
| `--enable-cache-report` | `False` | Set it always |
| `--enable-metrics` | `None` | Resolves to off |
| `--watchdog-timeout` | 300 s | Long forward passes |

## Key metrics
type: concepts
from: manuals/sglang-101/sections/r-2-metrics.md, manuals/sglang-101/sections/5-2-the-metrics-endpoint.md

- **sglang:time_to_first_token_seconds**: histogram. Alert on p99 over 5 min.
- **sglang:inter_token_latency_seconds**: histogram. Shows stream stutter.
- **sglang:queue_time_seconds**: histogram. Wait before first prefill.
- **sglang:num_queue_reqs**: gauge. Above 0 for minutes means past the knee.
- **sglang:token_usage**: gauge. Near 1.0 means the pool is full.
- **sglang:num_retracted_reqs**: gauge. Alert above 0.
- **sglang:prefill_effective_tokens_total**: counter. Windowed hit rate from its modes.
- **sglang:cache_hit_rate**: gauge. Last log interval only.

## Log lines to read
type: command-table
from: manuals/sglang-101/capture/out/server-default.log, manuals/sglang-101/capture/out/server-small-pool.log, manuals/sglang-101/capture/out/oom-exploratory.log, manuals/sglang-101/sections/2-1-sglang-serve-and-the-three-processes.md, manuals/sglang-101/sections/2-3-admission-and-retraction.md

| Command | What it does |
|---|---|
| `bytes_per_slot=114688, pool_size=181574` | KV bytes per token, pool slots |
| `max_total_num_tokens=181574` | Pool size SGLang computed |
| `max_running_requests=4096` | Computed request cap |
| `#new-token: 3, #cached-token: 2` | New plus cached is the prompt |
| `#running-req: 5, ... #queue-req: 11` | Admission holds requests back |
| `KV cache pool is full. Retract requests.` | Retraction. A performance alarm |
| `crashed with exit code -15` | Our SIGTERM, not a fault |
| `Insufficient Memory` | Out of memory outside the pool |

## Troubleshooting
type: troubleshooting
from: manuals/sglang-101/sections/r-3-incident-index.md, manuals/sglang-101/sections/2-3-admission-and-retraction.md, manuals/sglang-101/sections/1-2-one-request-end-to-end.md, manuals/sglang-101/sections/3-4-prefix-friendly-prompts.md, manuals/sglang-101/sections/5-1-sglang-benchmark-serving.md

| Symptom | Cause | Fix |
|---|---|---|
| Metal `Insufficient Memory` | Pool took 87 percent of free memory | `--mem-fraction-static 0.4` |
| `RuntimeError` on first batch, MLX | `--disable-overlap-schedule` | Keep overlap on |
| Retractions again and again | Admission forecast too bold | Raise `--schedule-conservativeness` |
| High TTFT, fast TPOT | Past the knee, requests queue | Cap concurrency at the knee |
| No `cached_tokens` in usage | No `--enable-cache-report` | Add the flag |
| `#cached-token` near 0 | Changing id at prompt start | Put shared text first |
| "health check failed" under load | No detokenizer output for 20 s | Use `/ready` for readiness |
| Crash line at shutdown | SIGTERM to the process group | SIGTERM to the main process |

## Glossary
type: glossary
from: manuals/sglang-101/sections/r-4-glossary.md, manuals/sglang-101/sections/3-3-radixcache.md, manuals/sglang-101/capture/out/bench-shared-prefix.txt

- **TTFT**: time to first token. Send to first streamed chunk.
- **TPOT**: time per output token, after the first token.
- **ITL**: inter-token latency. Gap between two streamed chunks.
- **KV cache**: stored keys and values of earlier tokens.
- **TP**: tensor parallelism. Layer weights cut into slices per GPU.
- **DP**: data parallelism. Full model copies with own KV cache.
- **EP**: expert parallelism. MoE experts divided among GPUs.
- **PD**: prefill-decode disaggregation. Separate prefill and decode servers.

## Q&A
type: qa
from: manuals/sglang-101/sections/2-1-sglang-serve-and-the-three-processes.md, manuals/sglang-101/sections/2-3-admission-and-retraction.md, manuals/sglang-101/sections/3-3-radixcache.md, manuals/sglang-101/sections/5-2-the-metrics-endpoint.md, manuals/sglang-101/sections/5-1-sglang-benchmark-serving.md

- **Why three processes?** The GIL. Text work must not delay GPU steps.
- **How many 256 in, 512 out requests fit 4,096 tokens?** Five. Each reserves 768.
- **Why 2,998 cached of 2,999?** The last prompt token always prefills.
- **Gauge 0.942, counters 0.636?** Gauge is the last interval. Trust the counters.
- **What is the knee?** The cap where throughput stops rising. Here at or below 8.

## Tips
type: tips
from: manuals/sglang-101/sections/5-1-sglang-benchmark-serving.md, manuals/sglang-101/sections/3-2-mem-fraction-static-and-startup-sizing.md, manuals/sglang-101/sections/3-3-radixcache.md, manuals/sglang-101/sections/7-1-operating-sglang.md

- Pass `--random-range-ratio 1.0` in every benchmark.
- Report throughput with p50 and p99 TTFT and TPOT.
- Raise `--mem-fraction-static` in steps of 0.02 only.
- Keep the radix cache on. Measure hit rate per feature.
- Pin `lmsysorg/sglang:v0.5.22`, never `latest`.
- Mount `~/.cache/sglang` on a persistent volume.
