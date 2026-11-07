#!/bin/bash
# 우리 병원 비서 키트 · 구글 시트 + 봇 코드를 내 구글 계정에 올려요 (두 번 클릭)
cd "$(dirname "$0")/../1_구글비서"
CLASP="npx -y @google/clasp@2.4.2"
if ! command -v node >/dev/null 2>&1; then echo "Node.js가 먼저 필요해요. 1_처음설치_맥.command 를 먼저 실행하세요."; read -p "엔터"; exit 1; fi
echo "🐾 구글 계정에 '우리 병원 비서' 시트를 만들어요."
echo
echo "① 열리는 페이지에서 'Google Apps Script API'를 [사용]으로 바꾸고 돌아오세요. (한 번만)"
open "https://script.google.com/home/usersettings"
read -p "   바꿨으면 엔터"
echo "② 구글 로그인 창이 열려요. 병원 구글 계정으로 로그인하고 [허용]을 누르세요."
[ -f "$HOME/.clasprc.json" ] || $CLASP login
if [ ! -f .clasp.json ]; then
  echo "③ 시트를 만들어요."
  $CLASP create --type sheets --title "우리 병원 비서" --rootDir . || { echo "만들기 실패. 위 메시지를 확인하세요."; read -p "엔터"; exit 1; }
  cp ../2_설치/appsscript.json ./appsscript.json   # 만들 때 덮인 설정을 키트 설정으로 되돌려요
fi
echo "④ 코드를 올려요."
$CLASP push -f || { echo "올리기 실패. 위 메시지를 확인하세요."; read -p "엔터"; exit 1; }
echo "⑤ 태블릿 화면 주소(웹 앱)를 배포해요."
$CLASP deploy --description "태블릿 화면" >/dev/null && echo "   배포했어요."
SHEET=$(node -e "const c=require('./.clasp.json');const p=[].concat(c.parentId||[])[0];if(p)console.log('https://docs.google.com/spreadsheets/d/'+p)")
echo
echo "✅ 끝났어요. 시트를 열어요: $SHEET"
echo "   시트 위쪽 메뉴 「🐾 병원 비서」 → ①②③④ 순서로 누르세요. 처음엔 '권한 검토 → 허용'이 떠요."
[ -n "$SHEET" ] && open "$SHEET"
read -p "엔터를 누르면 창을 닫아요."
