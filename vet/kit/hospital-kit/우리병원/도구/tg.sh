#!/bin/bash
# 원장님 텔레그램으로 한 줄 보내기: bash 도구/tg.sh "내용"
cd "$(dirname "$0")"
[ -f 텔레그램.env ] || { echo "도구/텔레그램.env 가 없어 텔레그램은 건너뛰어요."; exit 0; }
source ./텔레그램.env
curl -s -o /dev/null -X POST "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${TG_CHAT}" --data-urlencode "text=💻 $*" && echo "텔레그램으로 보냈어요."
