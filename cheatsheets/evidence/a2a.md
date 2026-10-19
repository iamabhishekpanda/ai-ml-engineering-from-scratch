# Evidence: cheatsheets/a2a.md

Abbreviations: S = manuals/a2a-101/sections, C = manuals/a2a-101/capture, O = manuals/a2a-101/capture/out.

## Front matter
- pin A2A protocol 1.0.1: manual.json lines 9-16

## Tasks over JSON-RPC (task-table, 8)
- GET /.well-known/agent-card.json: O/01-agent-cards.http:2
- "method": "SendMessage" blocking: O/03-blocking-task.http:10, task returned TASK_STATE_COMPLETED at :35
- "configuration": {"returnImmediately": true}: O/04-polling.http:21-23
- GetTask with id and historyLength 0: O/04-polling.http:66-71
- SendStreamingMessage with Accept: text/event-stream: O/05-streaming.http:1,6
- SubscribeToTask with id: O/14-resubscribe.http:38-43
- answer with contextId and taskId in the message: O/06-input-required.http:76-92
- taskPushNotificationConfig url and token: O/15-push.http:21-30

## One SendMessage request (annotated-code, 10 lines)
- POST /a2a/jsonrpc, Host localhost:41241, Content-Type application/json, A2A-Version 1.0: O/04-polling.http:2-5
- A2A-Version required on every request: S/5-4-version-and-extension-headers.md:17 ("Clients MUST send the A2A-Version header with each request")
- jsonrpc 2.0, id, method SendMessage, params.message: O/04-polling.http:7-13
- client mints messageId: S/1-2-one-task-request-by-request.md:46
- role ROLE_USER, parts text: O/04-polling.http:14-18
- configuration returnImmediately true, omit to block: O/04-polling.http:21-23, S/4-1-send-message.md:18 (a send blocks unless returnImmediately is true)

## HTTP+JSON routes (command-table, 8)
- POST /message:send: S/r-1-operations-by-binding.md:9, O/16-rest-binding.http:2
- POST /message:stream: S/r-1-operations-by-binding.md:10
- GET /tasks/{id=*}, historyLength in query: S/r-1-operations-by-binding.md:11, O/16-rest-binding.http:111
- GET /tasks: S/r-1-operations-by-binding.md:12
- POST /tasks/{id=*}:cancel: S/r-1-operations-by-binding.md:13
- SubscribeToTask route, accept both verbs: S/r-1-operations-by-binding.md:14
- POST /tasks/{task_id=*}/pushNotificationConfigs: S/r-1-operations-by-binding.md:15
- GET /extendedAgentCard: S/r-1-operations-by-binding.md:19

## Capture kit and conformance (annotated-code, 8 lines)
- python3 run.py writes out/, --check compares: C/README.md:3,6-7
- git clone, cd, git checkout 1.0.0.alpha2, uv venv, uv pip install, ./run_tck.py --sut-host: S/7-3-conformance-testing.md:11-18
- run_tck reads the card and tests each declared binding: S/7-3-conformance-testing.md:9

## The capture kit agents (architecture, 7 nodes, 6 edges)
- planner.py client agent: C/README.md:20, S/7-1-a-client.md:5
- agent cards at /.well-known/agent-card.json: C/README.md:26, S/2-2-discovery-and-supported-interfaces.md:13
- test-runner :41241 streaming, push: C/README.md:16
- code-reviewer :41242 input required: C/README.md:17
- deployer :41243 bearer, auth required: C/README.md:18
- webhook :41250 /a2a-events: S/4-6-push-notification-configs.md:5, O/15-push.http:25,163
- operator approves outside A2A: C/README.md:71
- edge planner to agents JSON-RPC: S/7-1-a-client.md:13 (JSON-RPC comes first on all three cards)
- edge planner to deployer Bearer: S/7-1-a-client.md:17
- edge runner to hook push: S/4-6-push-notification-configs.md:5

## One streamed task (flow, 7)
- 1: S/1-2-one-task-request-by-request.md:5,19
- 2: S/1-2-one-task-request-by-request.md:33,46
- 3: S/1-2-one-task-request-by-request.md:50-74
- 4: S/1-2-one-task-request-by-request.md:78
- 5: S/1-2-one-task-request-by-request.md:82-87
- 6: S/1-2-one-task-request-by-request.md:93
- 7: S/1-2-one-task-request-by-request.md:95,99

## Task states (concepts, 8, all S/r-3)
- TASK_STATE_SUBMITTED, active: S/r-3-task-states.md:10
- TASK_STATE_WORKING, active: S/r-3-task-states.md:11
- TASK_STATE_INPUT_REQUIRED, interrupted: S/r-3-task-states.md:12
- TASK_STATE_AUTH_REQUIRED, interrupted: S/r-3-task-states.md:13
- TASK_STATE_COMPLETED, terminal: S/r-3-task-states.md:14
- TASK_STATE_FAILED, terminal: S/r-3-task-states.md:15
- TASK_STATE_CANCELED, terminal: S/r-3-task-states.md:16
- TASK_STATE_REJECTED, terminal: S/r-3-task-states.md:17
- UNSPECIFIED left out (S/r-3-task-states.md:9) for the 8-line limit

## Error codes (command-table, 8, all S/r-4)
- -32001 TaskNotFoundError: S/r-4-errors.md:9
- -32002 TaskNotCancelableError: S/r-4-errors.md:10
- -32003 PushNotificationNotSupportedError: S/r-4-errors.md:11
- -32004 UnsupportedOperationError: S/r-4-errors.md:12
- -32005 ContentTypeNotSupportedError: S/r-4-errors.md:13
- -32009 VersionNotSupportedError: S/r-4-errors.md:17
- -32601 MethodNotFoundError: S/r-4-errors.md:20
- -32602 InvalidParamsError: S/r-4-errors.md:21

## Defaults (8)
- returnImmediately false: S/4-1-send-message.md:29 (proto makes false the default)
- historyLength unset, server default: S/4-3-get-task-and-list-tasks.md:19
- includeArtifacts false: S/4-3-get-task-and-list-tasks.md:71
- pageSize 50, maximum 100: S/4-3-get-task-and-list-tasks.md:68
- missing A2A-Version read as 0.3, refused: S/5-4-version-and-extension-headers.md:3,51
- JSON-RPC error with 200 OK: S/r-4-errors.md:32
- push token in X-A2A-Notification-Token: S/4-6-push-notification-configs.md:74
- kit request timeout 15 seconds, spec sets none: S/7-1-a-client.md:95

## Troubleshooting (8)
- -32009, no header read as 0.3: O/11-errors.http:38,67-68, S/5-4-version-and-extension-headers.md:5
- -32601, v0.3 method name message/send: O/11-errors.http:83,113-114, S/7-4-from-0-3-to-1-0.md:5,44
- -32602, no messageId: O/11-errors.http:118-148
- -32005, image/png part: O/11-errors.http:163-195
- -32004 on message to terminal task or subscribe on finished task: O/10-cancel.http:176-209, S/r-3-task-states.md:19
- -32002 cancel again: O/10-cancel.http:138-161
- HTTP 401 on GetExtendedAgentCard without token: O/18-extended-card.http:1-24
- TCK trailing slash gives 404: S/7-3-conformance-testing.md:25

## Glossary (8, all S/r-5)
- Agent card: S/r-5-glossary.md:8
- Task: S/r-5-glossary.md:34
- Context: S/r-5-glossary.md:13
- Message: S/r-5-glossary.md:21
- Part: S/r-5-glossary.md:23
- Artifact: S/r-5-glossary.md:9
- Push notification: S/r-5-glossary.md:26
- Service parameter: S/r-5-glossary.md:30

## Q&A (5)
- task or message, direct reply: S/r-1-operations-by-binding.md:23, S/r-5-glossary.md:14
- lastChunk closes one artifact: S/1-2-one-task-request-by-request.md:89
- 200 OK on JSON-RPC error: S/r-4-errors.md:32
- first supportedInterfaces entry it speaks: S/2-2-discovery-and-supported-interfaces.md:3
- blocking replaced by returnImmediately, send now waits: S/7-4-from-0-3-to-1-0.md:74

## Tips (4)
- returnImmediately when polling, subscribing, webhook: S/4-1-send-message.md:128
- task id and context id from first frame: S/1-2-one-task-request-by-request.md:102
- skip operation whose flag is absent or false: S/2-2-discovery-and-supported-interfaces.md:122
- idempotent push processing, duplicates: S/4-6-push-notification-configs.md:98
