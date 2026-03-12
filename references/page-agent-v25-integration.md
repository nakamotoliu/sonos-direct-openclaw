# Page-Agent v2.5 Integration (Sonos Direct OpenClaw)

## Objective
Use Page-Agent for all Sonos Web App interaction steps while preserving CLI as the verification source of truth.

## Runtime Contract
- Web actions: Page-Agent only
- Verification: Sonos CLI only
- Fallbacks: none (fail fast with reason)

## Required Environment
- `PAGE_AGENT_API_KEY`
- Optional:
  - `PAGE_AGENT_MODEL` (default: `qwen3.5-plus`)
  - `PAGE_AGENT_BASE_URL` (default: `https://dashscope.aliyuncs.com/compatible-mode/v1`)

## Menu Decision Rule
Priority order:
1. `替换队列`
2. `添加到队列末尾`
3. `立即播放` (only with explicit user consent)

## Verification Rule
- Queue path success: `q1 != q0`
- Immediate-play success: `State=PLAYING` and time advances in 10s window

## Current Deliverables
- `scripts/page-agent-web-flow.mjs`: Page-Agent web flow runner (search/select/menu)
- `scripts/sonos-v25-run.sh`: orchestration wrapper (CLI baseline + verification)

## Next Upgrade
- Add telemetry JSON output: action, latency, outcome, failure step
- Add deterministic retry cap: max 2 retries per web step
