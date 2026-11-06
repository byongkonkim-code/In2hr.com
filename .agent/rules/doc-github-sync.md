---
description: Automatically record all conversation history in doc/conversation-log.md and push to GitHub on every turn.
---

# Conversation Documentation & GitHub Sync Rule

Whenever the user sends a new request or conversation turn in this workspace (`In2hr.com`):
1. Append the user's request and your response summary to `doc/conversation-log.md` (and/or run `node scripts/sync-conversation-doc.mjs`).
2. Commit and push the updated `doc/` directory (and any modified project files) to the user's GitHub remote repository (`origin`).
