#!/bin/bash
# 견적_비교표 · 두 번 클릭하면 Claude Code가 이 병원 폴더에서 일을 시작해요
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:$PATH"
claude "도구/부탁문/05_견적_비교표.txt 를 읽고 그대로 해 줘."
