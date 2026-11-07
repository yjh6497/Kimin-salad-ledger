#!/bin/bash
# 동네병원_조사 · 두 번 클릭하면 Claude Code가 이 병원 폴더에서 일을 시작해요
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:$PATH"
claude --chrome "도구/부탁문/09_동네병원_조사.txt 를 읽고 그대로 해 줘."
