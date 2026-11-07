#!/bin/bash
# 우리 병원 비서 키트 · 맥 처음 설치 (두 번 클릭)
cd "$(dirname "$0")"
echo "🐾 우리 병원 비서 키트 설치를 시작해요."
echo
if command -v claude >/dev/null 2>&1; then
  echo "✅ Claude Code가 이미 있어요: $(claude --version 2>/dev/null)"
else
  echo "① Claude Code를 설치해요 (공식 설치 명령)."
  curl -fsSL https://claude.ai/install.sh | bash
  export PATH="$HOME/.local/bin:$PATH"
fi
echo
if command -v node >/dev/null 2>&1; then
  echo "✅ Node.js가 있어요: $(node --version)"
else
  echo "② 구글 비서를 올릴 때 Node.js가 필요해요."
  echo "   열리는 페이지에서 'LTS' 설치 파일(.pkg)을 받아 설치한 뒤, 이 파일을 다시 두 번 클릭하세요."
  open "https://nodejs.org/ko/download"
fi
echo
echo "③ 병원 폴더를 홈 폴더로 복사해요: ~/우리병원"
if [ -d "$HOME/우리병원" ]; then echo "   이미 있어요. 덮어쓰지 않아요."; else cp -R "../우리병원" "$HOME/우리병원" && chmod +x "$HOME/우리병원"/*.command "$HOME/우리병원/도구/"*.sh; echo "   복사했어요."; fi
echo
echo "다음: ① 2_구글비서_올리기_맥.command 두 번 클릭  ② Finder에서 홈 → 우리병원 폴더의 00_클로드와_대화.command"
echo "처음 한 번은 claude 로그인 화면이 열려요(Claude 계정으로 로그인)."
read -p "엔터를 누르면 창을 닫아요."
