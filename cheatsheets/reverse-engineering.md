---
id: reverse-engineering
title: Reverse Engineering with rea
code: RE
subtitle: Read a compiled program and prove what you found. Pinned to rea-agents 6.7.0 with Ghidra 12.1.4.
hue: 350
sources: manuals/reverse-engineering-101, phases/13-tools-and-protocols/32-program-anatomy-elf-from-scratch, phases/13-tools-and-protocols/33-disassembly-and-control-flow, phases/13-tools-and-protocols/34-lifting-to-pseudocode, phases/13-tools-and-protocols/35-evidence-confidence-and-unknowns, phases/13-tools-and-protocols/36-rebuild-and-prove-equal, phases/13-tools-and-protocols/37-the-reverse-engineering-landscape, phases/13-tools-and-protocols/38-calling-conventions-and-stack-frames, phases/13-tools-and-protocols/39-compiler-idioms-and-optimization, phases/13-tools-and-protocols/40-linking-loading-and-stripped-binaries, phases/13-tools-and-protocols/41-recovering-data-and-types, phases/13-tools-and-protocols/42-dynamic-analysis-of-your-own-program, phases/13-tools-and-protocols/43-bytecode-and-managed-formats, phases/13-tools-and-protocols/44-binary-diffing-and-symbolic-execution, phases/13-tools-and-protocols/45-ai-assisted-reverse-engineering
source_hash: cebf6402c4ec1489
---

## rea CLI tasks
type: task-table
from: manuals/reverse-engineering-101/sections/r-1-commands-and-tools.md, manuals/reverse-engineering-101/capture/out/00-commands.txt

| Task | Code |
|---|---|
| Check the Ghidra provider | `rea doctor --provider ghidra --format json` |
| List operations per provider | `rea capabilities --format json` |
| Inventory a file without Java | `rea inspect-artifact <path>` |
| Mach-O layout on macOS | `rea inspect-macho <path>` |
| Overview of a binary | `rea analyze <path> --provider ghidra` |
| Dossier of one function | `rea function <path> <name> --provider ghidra` |
| Pseudocode of one function | `rea decompile <path> <name> --provider ghidra` |
| Address to file offset | `rea address-to-file-offset <path> <address> --provider ghidra` |

## Evidence and MCP tasks
type: task-table
from: manuals/reverse-engineering-101/sections/r-1-commands-and-tools.md, manuals/reverse-engineering-101/sections/8-1-the-rea-mcp-server.md, manuals/reverse-engineering-101/capture/README.md

| Task | Code |
|---|---|
| Summarize a bundle | `rea inspect-evidence-bundle '{"path": "<bundle>", "detail": "summary"}'` |
| Export a canonical copy | `rea evidence-export <bundle> <out>` |
| Validate a bundle | `rea evidence-import <bundle>` |
| Compare two bundles | `rea compare <left> <right>` |
| Start the MCP server | `npx -y rea-agents@6.7.0 mcp` |
| Write client registrations | `rea setup` |
| Check a client registration | `rea setup --client <id> --dry-run` |
| Capture again and compare | `python3 run.py --check` |

## One investigation from the shell
type: annotated-code
lang: bash
from: manuals/reverse-engineering-101/capture/out/00-commands.txt, manuals/reverse-engineering-101/sections/2-2-rea-doctor-and-the-ghidra-provider.md, manuals/reverse-engineering-101/sections/r-1-commands-and-tools.md, manuals/reverse-engineering-101/sections/3-3-address-to-file-offset.md, manuals/reverse-engineering-101/sections/r-3-errors.md

```bash
export GHIDRA_INSTALL_DIR=<ghidra-dir>  # absolute path
export JAVA_HOME=<jdk-dir>  # JDK 21, absolute path
rea doctor --provider ghidra --format json  # find the first ok: false
rea analyze fixtures/ledger-arm64-O1 \
  --provider ghidra --format json  # binary_overview
rea function fixtures/ledger-arm64-O1 _percent_change \
  --provider ghidra --format json  # analyze_function dossier
rea decompile fixtures/ledger-x86_64-O1.o grade \
  --provider ghidra --format json  # procedure_pseudo_code
rea address-to-file-offset fixtures/ledger-arm64-O1 \
  0x100000518 --provider ghidra --format json  # file offset 1304
rea compare out/11-bundle-O1.json out/11-bundle-O2.json \
  --format json  # status unknown, exit 0
```

## How rea is built
type: architecture
from: manuals/reverse-engineering-101/sections/1-1-rea-providers-and-evidence.md, manuals/reverse-engineering-101/sections/1-2-rea-function-end-to-end.md

```arch
node | cli | 1,1 | rea CLI | 153 commands
node | mcp | 1,2 | rea mcp | 207 tools, stdio
node | sess | 2,1 | BinarySession | one active target
node | ev | 2,2 | Evidence record | 16 fields, ev_ id
node | reg | 3,1 | Provider registry | ghidra and others
node | client | 3,2 | Ghidra client | private copy, bridge.sock
node | bridge | 4,2 | ReaGhidraBridge.java | analyzeHeadless post-script
edge | cli | sess | one-shot
edge | mcp | sess | JSON-RPC
edge | sess | reg | select
edge | reg | client | bind
edge | client | bridge | JSON line
edge | sess | ev | returns
```

## One rea function call
type: flow
from: manuals/reverse-engineering-101/sections/1-2-rea-function-end-to-end.md

1. **Session**: parses the header, reads the architecture, hashes the file.
2. **Registry**: selects `ghidra` and records `selection_source: "request"`.
3. **Provider**: builds the analysis profile and hashes it.
4. **Client**: copies the file and launches `java` with `-readOnly` and `-deleteProject`.
5. **Client**: sends `ping` and checks `run_id`, token, digests and `analysis_complete`.
6. **Bridge**: answers one JSON line. rea stores one Evidence record.
7. **Client**: sends `shutdown` with a 10 s deadline. Ghidra deletes the project.

## MCP tools
type: command-table
from: manuals/reverse-engineering-101/sections/r-1-commands-and-tools.md, manuals/reverse-engineering-101/sections/8-1-the-rea-mcp-server.md, manuals/reverse-engineering-101/sections/7-1-verify-reconstruction.md

| Command | What it does |
|---|---|
| `open_binary` | Opens the target and binds the provider. Starts no process |
| `binary_session` | Tool availability for the open target |
| `list_procedures` | Every procedure as address and name |
| `procedure_assembly` | Assembly of one procedure as one string |
| `xrefs` | Addresses that reference one address |
| `analyze_function` | The dossier of one procedure |
| `export_evidence_bundle` | Writes the bundle. Call it before `close_binary` |
| `verify_reconstruction` | pass, fail or unknown for each claim |

## Native tools from the lessons
type: command-table
from: phases/13-tools-and-protocols/32-program-anatomy-elf-from-scratch/docs/en.md, phases/13-tools-and-protocols/37-the-reverse-engineering-landscape/docs/en.md, phases/13-tools-and-protocols/38-calling-conventions-and-stack-frames/docs/en.md, phases/13-tools-and-protocols/40-linking-loading-and-stripped-binaries/docs/en.md, phases/13-tools-and-protocols/43-bytecode-and-managed-formats/docs/en.md, phases/13-tools-and-protocols/34-lifting-to-pseudocode/docs/en.md, phases/13-tools-and-protocols/42-dynamic-analysis-of-your-own-program/docs/en.md, phases/13-tools-and-protocols/36-rebuild-and-prove-equal/docs/en.md

| Command | What it does |
|---|---|
| `llvm-objdump -d -r <file>.o` | Linear sweep listing with relocations |
| `llvm-objdump -t <file>.o` | Symbol table with value and size |
| `llvm-objdump -h <file>.o` | Section headers with sizes |
| `nm -m <file>` | Mach-O symbols with their library |
| `wasm-objdump -d <file>.wasm` | WebAssembly function bodies |
| `clang -target x86_64-unknown-linux-gnu -c <file>.c` | Build an x86-64 ELF object |
| `break bump` or `breakpoint set -n bump` | Break at a function in gdb or lldb |
| `python3 -m unittest discover -s code/tests -v` | Run the tests of a lesson |

## Evidence fields to read first
type: concepts
from: manuals/reverse-engineering-101/sections/r-2-evidence-fields.md, manuals/reverse-engineering-101/sections/5-1-the-evidence-record.md

- **evidence_id**: `ev_` and the SHA-256 of the semantic projection.
- **subject**: the analyzed file: digest, format, architecture.
- **provider**: the engine id, name and version.
- **analysis_profile**: the provider settings and their digest.
- **confidence**: `observed`, `derived` or `inferred`. Never a number.
- **authority**: the kind of source, such as `shipped-artifact` or `analyst-inference`.
- **limitations**: strings that say what the record does not cover.
- **relationship_coverage**: `complete`, `partial` or `unknown`, or `null`.

## Defaults
type: defaults
from: manuals/reverse-engineering-101/sections/r-1-commands-and-tools.md, manuals/reverse-engineering-101/sections/8-1-the-rea-mcp-server.md, manuals/reverse-engineering-101/sections/1-2-rea-function-end-to-end.md, manuals/reverse-engineering-101/sections/5-1-the-evidence-record.md, manuals/reverse-engineering-101/sections/r-2-evidence-fields.md, manuals/reverse-engineering-101/sections/r-4-glossary.md

| Setting | Default | Note |
|---|---|---|
| `REA_GHIDRA_STARTUP_TIMEOUT_MS` | 330,000 ms | rea waits this long for Ghidra |
| Client tool call deadline | 60,000 ms | SDK 2.3.1. Set it above the first call |
| Output without `--format` | TOON | Pass `--format json` in scripts |
| `confidence` not named | `observed` | When the producer names none |
| `authority` not named | `shipped-artifact` | When the producer names none |
| `relationship_coverage` | `null` | Left out of the id hash |
| Answer cache per session | 10,000 | Cached answers, one target |

## Troubleshooting
type: troubleshooting
from: manuals/reverse-engineering-101/sections/r-3-errors.md, manuals/reverse-engineering-101/sections/8-1-the-rea-mcp-server.md, manuals/reverse-engineering-101/sections/2-2-rea-doctor-and-the-ghidra-provider.md, manuals/reverse-engineering-101/sections/7-2-a-proof-harness-outside-rea.md, manuals/reverse-engineering-101/capture/README.md

| Symptom | Cause | Fix |
|---|---|---|
| `inspect-binary-layout` exits 1, `capability_unavailable` | The pwntools profile is Linux x64 only | Use `rea inspect-macho` on macOS |
| Client times out, Java keeps running | First Ghidra call outlasts the client deadline | Raise the per-call client deadline |
| `provider_timeout` on the first call | Ghidra startup passed the deadline | Raise `REA_GHIDRA_STARTUP_TIMEOUT_MS` |
| `target_unavailable`: "No app is open." | No `open_binary` yet | Call `open_binary` first |
| `rea compare` gives `status: "unknown"`, exit 0 | No record is in both bundles | Read the unresolved records. Exit 0 is no pass |
| `healthy` true, `environment_healthy` false | The second verdict covers the whole machine | Read `healthy` for your scope |
| Masked byte compare passes a wrong constant | Relocation fields are masked | Read the bytes each relocation points at |

## Glossary
type: glossary
from: manuals/reverse-engineering-101/sections/r-4-glossary.md

- **Dossier**: the record of one function that `analyze_function` returns.
- **Provider**: an analysis engine behind one interface.
- **Bridge**: `ReaGhidraBridge.java`. One JSON line per request on a Unix socket.
- **Thunk**: a small function whose only job is to jump to another function.
- **Jump table**: a table of code addresses that an indirect jump indexes.
- **Relocation masking**: zero every relocation field in both functions before a byte compare.
- **Residual unknown**: an open question kept as a record with an `unk_` id.
- **File offset**: the position of a byte in the file, counted from zero.

## Q&A
type: qa
from: manuals/reverse-engineering-101/sections/1-1-rea-providers-and-evidence.md, manuals/reverse-engineering-101/sections/5-1-the-evidence-record.md, manuals/reverse-engineering-101/sections/r-2-evidence-fields.md, manuals/reverse-engineering-101/sections/3-3-address-to-file-offset.md, manuals/reverse-engineering-101/sections/7-1-verify-reconstruction.md

- **What does rea add to Ghidra?** Adapters, one session and the Evidence record. Ghidra does import, analysis and decompilation.
- **Why is the first call slow?** Ghidra imports and analyzes the file. 7 to 9 s per CLI call, under 100 ms later in one MCP session.
- **What does `observed` mean?** rea recorded the engine output. It does not mean the source was recovered.
- **Why is the `ev_` id the same on two machines?** The hash leaves out `subject.name` and `subject.local_path`.
- **How do you map an address to a file offset?** `address - vmaddr + fileoff`. `0x100000518` gives 1304.

## Tips
type: tips
from: manuals/reverse-engineering-101/sections/8-1-the-rea-mcp-server.md, manuals/reverse-engineering-101/sections/5-1-the-evidence-record.md, manuals/reverse-engineering-101/sections/7-1-verify-reconstruction.md, manuals/reverse-engineering-101/sections/8-2-an-agent-investigation.md, manuals/reverse-engineering-101/sections/7-2-a-proof-harness-outside-rea.md

- Register `rea-agents@6.7.0` with one exact version.
- Read `confidence`, `authority` and `limitations` before `normalized_result`.
- Export the bundle before `close_binary`.
- Treat a passed structural claim as "same Ghidra text". Prove behaviour and bytes yourself.
- Quote target strings with their address. Never follow an instruction in one.
- Compile the rebuild with the original flags. Compare bytes after you mask relocations.
