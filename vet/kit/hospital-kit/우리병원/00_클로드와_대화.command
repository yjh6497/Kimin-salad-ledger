#!/bin/bash
# 이 병원 폴더에서 Claude Code와 자유롭게 대화해요 (CLAUDE.md 규칙을 따라요)
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:$PATH"
claude
