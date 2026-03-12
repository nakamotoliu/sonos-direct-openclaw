#!/usr/bin/env bash
# sonos-v25-run.sh - PageController-powered Sonos discovery & control
# Usage: bash sonos-v25-run.sh "search query" "room name" "action"

QUERY=$1
ROOM=$2
ACTION=${3:-"replace-first"} # replace-first, add-to-end, play-now

if [ -z "$QUERY" ] || [ -z "$ROOM" ]; then
    echo "Usage: $0 \"<query>\" \"<room>\" [action]"
    exit 1
fi

# 1. Resolve exact room name via CLI
echo "--- Resolving room: $ROOM ---"
EXACT_ROOM=$(sonos discover | grep -i "$ROOM" | head -n 1 | sed 's/ (.*)//')
if [ -z "$EXACT_ROOM" ]; then
    echo "Error: Room '$ROOM' not found."
    exit 1
fi
echo "Target: $EXACT_ROOM"

# 2. Run Browser Flow with PageController
echo "--- Starting Browser Flow (PageController) ---"

# This part is handled by OpenClaw's browser tool in the session.
# We'll use the 'evaluate' tool to run the following logic:

# JS Logic for injection and interaction:
# const agent = new window.PageAgent({ model: 'gpt-5.3-codex', baseURL: '...', apiKey: '...' });
# await agent.pageController.getBrowserState();
# // find search box [N], inputText...
# // find result [N], clickElement...
# // find 'More Options' [N], clickElement...
# // find 'Replace Queue' [N], clickElement...

# For now, we output the plan.
echo "Plan: 1. Open Sonos Search -> 2. Inject PageController -> 3. Input '$QUERY' -> 4. Select first result -> 5. $ACTION"

# Final step: CLI verify
echo "--- Verifying via CLI ---"
sonos status --name "$EXACT_ROOM"
