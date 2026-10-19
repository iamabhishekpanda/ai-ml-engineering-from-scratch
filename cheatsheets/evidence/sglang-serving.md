# Evidence: cheatsheets/sglang-serving.md

Abbreviations: S = manuals/sglang-101/sections, C = manuals/sglang-101/capture, O = manuals/sglang-101/capture/out.

## Front matter
- subtitle pin 0.5.22: manual.json lines 9-15

## Tasks (task-table, 8)
- sglang serve --model-path --port 30000: O/server-default.command.txt:1
- POST /generate {"text": ...}: C/one_request.py:13
- POST /v1/chat/completions: C/one_request.py:17
- GET /ready readiness: S/7-1-operating-sglang.md:49,57
- GET /metrics: C/run.py:94, S/5-2-the-metrics-endpoint.md:11
- fixed concurrency cap --max-concurrency 8: C/run.py:34, S/5-1-sglang-benchmark-serving.md:29
- fixed request rate --request-rate (default inf): S/5-1-sglang-benchmark-serving.md:42
- docker stop sends SIGTERM to main process: S/7-1-operating-sglang.md:118

## Start the server (terminal 1) (annotated-code, 5 lines)
- sglang serve --model-path --port 30000 --enable-cache-report --enable-metrics --mem-fraction-static 0.4: O/server-default.command.txt:1
- cache report and metrics meaning: S/r-1-flags-and-defaults.md:35,57. fraction meaning: S/3-2-mem-fraction-static-and-startup-sizing.md:55

## Benchmark it (terminal 2) (annotated-code, 5 lines)
- benchmark --backend sglang --port 30000 --dataset-name random --random-input-len 512 --random-output-len 128 --random-range-ratio 1.0: C/run.py:23,26, S/5-1-sglang-benchmark-serving.md:27-29
- default range ratio 0.0 halves prompts: S/5-1-sglang-benchmark-serving.md:40,45
- --num-prompts 32 --max-concurrency 8: C/run.py:34. 255.63 tok/s: O/bench-random-c8.txt:23

## Key flags (command-table, 8)
- --mem-fraction-static: S/3-2-mem-fraction-static-and-startup-sizing.md:55
- --max-total-tokens: S/r-1-flags-and-defaults.md:12
- --max-running-requests at the knee: S/r-1-flags-and-defaults.md:13, S/5-1-sglang-benchmark-serving.md:131
- --chunked-prefill-size: S/r-1-flags-and-defaults.md:14, meaning S/2-1-sglang-serve-and-the-three-processes.md:75
- --schedule-policy lpm: S/2-2-the-scheduler-loop-and-schedule-policy.md:62-71
- --schedule-conservativeness 1.3: S/2-3-admission-and-retraction.md:114
- --disable-radix-cache: S/r-1-flags-and-defaults.md:31
- --tp-size: S/6-1-tp-size-dp-size-and-attn-dp-size.md:13

## Three processes (architecture, 6 nodes, 6 edges)
- Client, HTTP :30000: S/2-1-sglang-serve-and-the-three-processes.md:46
- TokenizerManager main process: S/2-1-sglang-serve-and-the-three-processes.md:19
- Scheduler owns GPU: S/2-1-sglang-serve-and-the-three-processes.md:21
- DetokenizerManager, ids to text: S/2-1-sglang-serve-and-the-three-processes.md:23
- UnifiedRadixCache, match_prefix: S/3-3-radixcache.md:60,77
- KV pool one slot per token: S/3-1-kv-bytes-per-token-and-the-kv-pool.md:59
- ZMQ links between processes: S/2-1-sglang-serve-and-the-three-processes.md:25

## One request, end to end (flow, 7)
- 1 TokenizerManager tokenizes, sends over ZMQ: S/2-1-sglang-serve-and-the-three-processes.md:19,25
- 2 Scheduler adds it to the waiting queue in policy order: S/2-2-the-scheduler-loop-and-schedule-policy.md:21,62
- 3 RadixCache match_prefix, #cached-token: S/3-3-radixcache.md:60, S/2-2-the-scheduler-loop-and-schedule-policy.md:53
- 4 Scheduler admits if prompt plus max_new_tokens fits: S/2-3-admission-and-retraction.md:19
- 5 Scheduler prefills #new-token in chunks, samples first token: S/2-2-the-scheduler-loop-and-schedule-policy.md:22,26
- 6 Scheduler decodes one token per step: S/2-2-the-scheduler-loop-and-schedule-policy.md:22,24
- 7 DetokenizerManager turns ids into text: S/2-1-sglang-serve-and-the-three-processes.md:23

## Defaults in the code (8, all S/r-1)
- mem-fraction-static None: S/r-1-flags-and-defaults.md:11
- max-running-requests None: S/r-1-flags-and-defaults.md:13
- chunked-prefill-size None: S/r-1-flags-and-defaults.md:14
- schedule-conservativeness 1.0: S/r-1-flags-and-defaults.md:16
- schedule-policy fcfs: S/r-1-flags-and-defaults.md:23
- enable-cache-report False: S/r-1-flags-and-defaults.md:35
- enable-metrics None, resolves to off: S/r-1-flags-and-defaults.md:57
- watchdog-timeout 300 s: S/r-1-flags-and-defaults.md:58

## Key metrics (concepts, 8)
- time_to_first_token_seconds histogram, p99 over 5 min alert: S/r-2-metrics.md:11, S/5-2-the-metrics-endpoint.md:81
- inter_token_latency_seconds histogram: S/r-2-metrics.md:12
- queue_time_seconds histogram: S/r-2-metrics.md:15
- num_queue_reqs alert: S/5-2-the-metrics-endpoint.md:83
- token_usage alert: S/5-2-the-metrics-endpoint.md:84
- num_retracted_reqs alert: S/5-2-the-metrics-endpoint.md:85
- prefill_effective_tokens_total windowed hit rate: S/5-2-the-metrics-endpoint.md:47,66
- cache_hit_rate last interval: S/5-2-the-metrics-endpoint.md:39

## Log lines to read (command-table, 8)
- bytes_per_slot=114688, pool_size=181574: O/server-default.log:61
- max_total_num_tokens=181574: O/server-default.log:70
- max_running_requests=4096: O/server-default.log:70
- #new-token: 3, #cached-token: 2: O/server-default.log:94, S/2-1 listing via 1-2:87
- #running-req: 5 ... #queue-req: 11: O/server-small-pool.log:118
- KV cache pool is full. Retract requests.: S/2-3-admission-and-retraction.md:82
- crashed with exit code -15: O/server-default.log:566, S/2-1-sglang-serve-and-the-three-processes.md:111
- Insufficient Memory: O/oom-exploratory.log:15, S/3-2-mem-fraction-static-and-startup-sizing.md:43 (memory outside the pool)

## Troubleshooting (8)
- Insufficient Memory, 87 percent, 0.4: S/r-3-incident-index.md:11
- RuntimeError, --disable-overlap-schedule, keep overlap on: S/r-3-incident-index.md:12
- retractions, raise conservativeness: S/2-3-admission-and-retraction.md:114, S/r-3-incident-index.md:21
- high TTFT fast TPOT, past knee, cap: S/2-3-admission-and-retraction.md:65-74, S/5-1-sglang-benchmark-serving.md:123,131
- no cached_tokens without --enable-cache-report: S/1-2-one-request-end-to-end.md:133
- #cached-token near 0, id at start, shared text first: S/3-4-prefix-friendly-prompts.md:29-33
- health check failed, 20 s, /ready: S/r-3-incident-index.md:70
- crash line at shutdown, process group: S/r-3-incident-index.md:13

## Glossary (8)
- TTFT: S/r-4-glossary.md:71, expansion S/3-3-radixcache.md:16
- TPOT: S/r-4-glossary.md:69, O/bench-shared-prefix.txt:40
- ITL: S/r-4-glossary.md:34, O/bench-shared-prefix.txt:46
- KV cache: S/r-4-glossary.md:35
- TP: S/r-4-glossary.md:65
- DP: S/r-4-glossary.md:20
- EP: S/r-4-glossary.md:25
- PD: S/r-4-glossary.md:55

## Q&A (5)
- Why three processes, GIL: S/2-1-sglang-serve-and-the-three-processes.md:3,13
- Five requests, 768 each: S/2-3-admission-and-retraction.md:38
- 2,998 of 2,999 cached: S/3-3-radixcache.md:65
- 0.942 vs 0.636, trust counters: S/5-2-the-metrics-endpoint.md:56,111
- Knee at or below 8: S/5-1-sglang-benchmark-serving.md:123

## Tips (6)
- --random-range-ratio 1.0: S/5-1-sglang-benchmark-serving.md:47
- p50/p99 TTFT and TPOT: S/5-1-sglang-benchmark-serving.md:129
- steps of 0.02: S/3-2-mem-fraction-static-and-startup-sizing.md:88
- radix cache on, measure hit rate per feature: S/3-3-radixcache.md:98-102
- pin lmsysorg/sglang:v0.5.22: S/7-1-operating-sglang.md:24,161
- mount ~/.cache/sglang: S/7-1-operating-sglang.md:41,162
