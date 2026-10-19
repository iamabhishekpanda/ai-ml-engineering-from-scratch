---
id: a2a
title: A2A Protocol
code: AP
subtitle: Discover an agent, send it work, follow the task, read its errors. Pinned to A2A 1.0.1.
hue: 140
sources: manuals/a2a-101
source_hash: 2bf16b666a27a172
---

## Tasks over JSON-RPC
type: task-table
from: manuals/a2a-101/capture/out/01-agent-cards.http, manuals/a2a-101/capture/out/03-blocking-task.http, manuals/a2a-101/capture/out/04-polling.http, manuals/a2a-101/capture/out/05-streaming.http, manuals/a2a-101/capture/out/06-input-required.http, manuals/a2a-101/capture/out/10-cancel.http, manuals/a2a-101/capture/out/14-resubscribe.http, manuals/a2a-101/capture/out/15-push.http

| Task | Code |
|---|---|
| Discover an agent | `GET /.well-known/agent-card.json` |
| Send and wait | `"method": "SendMessage"` |
| Send and return at once | `"configuration": {"returnImmediately": true}` |
| Poll a task | `"method": "GetTask", "params": {"id": "<task id>", "historyLength": 0}` |
| Stream a task | `"method": "SendStreamingMessage"` with `Accept: text/event-stream` |
| Reattach to a stream | `"method": "SubscribeToTask", "params": {"id": "<task id>"}` |
| Answer a question | `"message": {"contextId": "<ctx>", "taskId": "<task id>", ...}` |
| Register a webhook | `"taskPushNotificationConfig": {"url": "<url>", "token": "<token>"}` |

## One SendMessage request
type: annotated-code
lang: http
from: manuals/a2a-101/capture/out/04-polling.http, manuals/a2a-101/sections/5-4-version-and-extension-headers.md, manuals/a2a-101/sections/1-2-one-task-request-by-request.md, manuals/a2a-101/sections/4-1-send-message.md

```http
POST /a2a/jsonrpc HTTP/1.1  # the JSONRPC url from the card
Host: localhost:41241
Content-Type: application/json
A2A-Version: 1.0  # required on every request
{"jsonrpc": "2.0", "id": 1, "method": "SendMessage",
 "params": {
  "message": {"messageId": "<uuid>",  # the client mints it
   "role": "ROLE_USER",
   "parts": [{"text": "<request>"}]},
  "configuration": {"returnImmediately": true}}}  # omit to block
```

## HTTP+JSON routes
type: command-table
from: manuals/a2a-101/sections/r-1-operations-by-binding.md, manuals/a2a-101/capture/out/16-rest-binding.http

| Command | What it does |
|---|---|
| `POST /message:send` | SendMessage |
| `POST /message:stream` | SendStreamingMessage, a stream of `StreamResponse` |
| `GET /tasks/{id=*}` | GetTask. `historyLength` goes in the query |
| `GET /tasks` | ListTasks |
| `POST /tasks/{id=*}:cancel` | CancelTask |
| `POST /tasks/{id=*}:subscribe` | SubscribeToTask. Accept `GET` too |
| `POST /tasks/{task_id=*}/pushNotificationConfigs` | CreateTaskPushNotificationConfig |
| `GET /extendedAgentCard` | GetExtendedAgentCard |

## Capture kit and conformance
type: annotated-code
lang: bash
from: manuals/a2a-101/capture/README.md, manuals/a2a-101/sections/7-3-conformance-testing.md

```bash
python3 run.py  # three agents and a client, writes out/
python3 run.py --check  # capture again and compare
git clone --filter=blob:none https://github.com/a2aproject/a2a-tck.git
cd a2a-tck
git checkout 1.0.0.alpha2  # the TCK tag the manual ran
uv venv && source .venv/bin/activate
uv pip install -e .
./run_tck.py --sut-host http://localhost:9999  # reads the card, tests each binding
```

## The capture kit agents
type: architecture
from: manuals/a2a-101/capture/README.md, manuals/a2a-101/sections/2-2-discovery-and-supported-interfaces.md, manuals/a2a-101/sections/4-6-push-notification-configs.md, manuals/a2a-101/sections/7-1-a-client.md

```arch
node | planner | 1,2 | planner.py | client agent
node | card | 2,1 | Agent cards | /.well-known/agent-card.json
node | runner | 2,2 | test-runner | :41241 stream, push
node | reviewer | 3,1 | code-reviewer | :41242 input required
node | deployer | 3,2 | deployer | :41243 bearer, auth required
node | hook | 1,3 | Webhook | :41250 /a2a-events
node | operator | 3,3 | Operator | approves outside A2A
edge | planner | card | GET
edge | planner | runner | JSON-RPC
edge | planner | reviewer | JSON-RPC
edge | planner | deployer | Bearer
edge | runner | hook | push
edge | operator | deployer | approve
```

## One streamed task
type: flow
from: manuals/a2a-101/sections/1-2-one-task-request-by-request.md

1. **Client**: reads the card and checks `capabilities.streaming` is true.
2. **Client**: posts `SendStreamingMessage` with a new `messageId` and no `taskId`.
3. **Server**: frame 1 is the Task in `TASK_STATE_SUBMITTED` with new ids.
4. **Agent**: a `statusUpdate` moves the task to `TASK_STATE_WORKING`.
5. **Agent**: `artifactUpdate` frames build `test-log` with `append`, then `lastChunk`.
6. **Agent**: the last `statusUpdate` sets `TASK_STATE_COMPLETED`.
7. **Server**: closes the stream. The client confirms with `GetTask`.

## Task states
type: concepts
from: manuals/a2a-101/sections/r-3-task-states.md

- **TASK_STATE_SUBMITTED**: active. Wait, poll, or subscribe.
- **TASK_STATE_WORKING**: active. As for a submitted task.
- **TASK_STATE_INPUT_REQUIRED**: interrupted. Answer with the same `taskId` and `contextId`.
- **TASK_STATE_AUTH_REQUIRED**: interrupted. Approval comes outside A2A. Subscribe or poll.
- **TASK_STATE_COMPLETED**: terminal. Read the artifacts.
- **TASK_STATE_FAILED**: terminal. Fix the input and start a new task.
- **TASK_STATE_CANCELED**: terminal. Start a new task in the same context.
- **TASK_STATE_REJECTED**: terminal. Stop and follow the status message.

## Error codes
type: command-table
from: manuals/a2a-101/sections/r-4-errors.md

| Command | What it does |
|---|---|
| `-32001` TaskNotFoundError | HTTP 404, gRPC NOT_FOUND |
| `-32002` TaskNotCancelableError | HTTP 400, FAILED_PRECONDITION |
| `-32003` PushNotificationNotSupportedError | HTTP 400, FAILED_PRECONDITION |
| `-32004` UnsupportedOperationError | HTTP 400, FAILED_PRECONDITION |
| `-32005` ContentTypeNotSupportedError | HTTP 400, INVALID_ARGUMENT |
| `-32009` VersionNotSupportedError | HTTP 400, FAILED_PRECONDITION |
| `-32601` MethodNotFoundError | JSON-RPC only |
| `-32602` InvalidParamsError | HTTP 400, INVALID_ARGUMENT |

## Defaults
type: defaults
from: manuals/a2a-101/sections/4-1-send-message.md, manuals/a2a-101/sections/4-3-get-task-and-list-tasks.md, manuals/a2a-101/sections/5-4-version-and-extension-headers.md, manuals/a2a-101/sections/r-4-errors.md, manuals/a2a-101/sections/4-6-push-notification-configs.md, manuals/a2a-101/sections/7-1-a-client.md

| Setting | Default | Note |
|---|---|---|
| `returnImmediately` | `false` | A send waits for a terminal or interrupted state |
| `historyLength` | Unset | Server returns its default amount |
| `includeArtifacts` | `false` | ListTasks omits artifacts |
| `pageSize` in ListTasks | 50 | The maximum is 100 |
| Missing `A2A-Version` | `0.3` | A 1.0 server refuses it |
| JSON-RPC error status | `200 OK` | Kit and SDK. The spec sets none |
| Push token header | `X-A2A-Notification-Token` | Kit and SDK choice |
| Kit request timeout | 15 seconds | The spec sets none |

## Troubleshooting
type: troubleshooting
from: manuals/a2a-101/capture/out/11-errors.http, manuals/a2a-101/capture/out/10-cancel.http, manuals/a2a-101/capture/out/18-extended-card.http, manuals/a2a-101/sections/5-4-version-and-extension-headers.md, manuals/a2a-101/sections/7-4-from-0-3-to-1-0.md, manuals/a2a-101/sections/r-3-task-states.md, manuals/a2a-101/sections/7-3-conformance-testing.md

| Symptom | Cause | Fix |
|---|---|---|
| `-32009` Protocol version not supported | No `A2A-Version` header, read as 0.3 | Send `A2A-Version: 1.0` |
| `-32601` Method not found | A 0.3 name such as `message/send` | Use `SendMessage` |
| `-32602` Invalid parameters | The message has no `messageId` | Mint a `messageId` per message |
| `-32005` Content type not supported | An `image/png` part | Send a mode the card accepts |
| `-32004` on a message or a subscribe | The task is terminal | Start a new task |
| `-32002` Task cannot be canceled | The task already ended | Read it with `GetTask` |
| HTTP 401 on GetExtendedAgentCard | No bearer token | Send `Authorization: Bearer <token>` |
| TCK JSON-RPC records fail with 404 | The TCK adds a trailing slash to `url` | Post to the exact `url` |

## Glossary
type: glossary
from: manuals/a2a-101/sections/r-5-glossary.md

- **Agent card**: JSON that describes an agent, usually at `/.well-known/agent-card.json`.
- **Task**: the unit of work a server creates for a message, with an `id`.
- **Context**: a conversation that groups tasks and messages under one `contextId`.
- **Message**: one turn, with a `messageId`, a `role`, and parts.
- **Part**: smallest unit of content: `text`, `raw`, `url`, or `data`.
- **Artifact**: an output of a task, made of parts. Long ones arrive in chunks.
- **Push notification**: an HTTP POST of a `StreamResponse` to a client webhook.
- **Service parameter**: a per-request key such as `A2A-Version`, sent as a header.

## Q&A
type: qa
from: manuals/a2a-101/sections/r-1-operations-by-binding.md, manuals/a2a-101/sections/7-4-from-0-3-to-1-0.md, manuals/a2a-101/sections/1-2-one-task-request-by-request.md, manuals/a2a-101/sections/r-4-errors.md, manuals/a2a-101/sections/2-2-discovery-and-supported-interfaces.md

- **What does a send return?** One `task` or one `message`. A message alone is a direct reply.
- **Does `lastChunk` end the task?** No. It closes one artifact only.
- **Why 200 OK on a JSON-RPC error?** The spec sets no status. The kit and the SDK send `200 OK`.
- **Which interface does a client use?** The first `supportedInterfaces` entry that it speaks.
- **How did 0.3 `blocking` change?** `returnImmediately` replaced it, and a send now waits.

## Tips
type: tips
from: manuals/a2a-101/sections/4-1-send-message.md, manuals/a2a-101/sections/1-2-one-task-request-by-request.md, manuals/a2a-101/sections/2-2-discovery-and-supported-interfaces.md, manuals/a2a-101/sections/4-6-push-notification-configs.md

- Set `returnImmediately: true` when you poll, subscribe, or wait for a webhook.
- Take the task id and context id from the first frame.
- Skip any operation whose capability flag is absent or `false`.
- Process push notifications idempotently. Duplicates can arrive.
