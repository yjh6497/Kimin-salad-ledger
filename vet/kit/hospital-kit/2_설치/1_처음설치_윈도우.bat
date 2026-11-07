@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 🐾 우리 병원 비서 키트 설치를 시작해요.
where claude >nul 2>nul
if %errorlevel%==0 (echo ✅ Claude Code가 이미 있어요.) else (
  echo ① Claude Code를 설치해요 ^(공식 설치 명령^).
  powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://claude.ai/install.ps1 | iex"
)
where node >nul 2>nul
if %errorlevel%==0 (echo ✅ Node.js가 있어요.) else (
  echo ② 구글 비서를 올릴 때 Node.js가 필요해요. 열리는 페이지에서 LTS 설치 파일^(.msi^)을 받아 설치한 뒤 이 파일을 다시 실행하세요.
  start "" "https://nodejs.org/ko/download"
)
echo ③ 병원 폴더를 내 문서 옆^(사용자 폴더^)으로 복사해요: %USERPROFILE%\우리병원
if exist "%USERPROFILE%\우리병원" (echo    이미 있어요. 덮어쓰지 않아요.) else (xcopy /E /I /Q "..\우리병원" "%USERPROFILE%\우리병원" >nul & echo    복사했어요.)
echo.
echo 다음: 2_구글비서_올리기_윈도우.bat 실행, 그리고 우리병원 폴더의 00_클로드와_대화.bat
pause
