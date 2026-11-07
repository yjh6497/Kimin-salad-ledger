#!/bin/bash
# 한주_콘텐츠_세트 · 두 번 클릭하면 Claude Code가 이 병원 폴더에서 일을 시작해요
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:$PATH"
claude "도구/부탁문/03_한주_콘텐츠_세트.txt 를 읽고 그대로 해 줘."
