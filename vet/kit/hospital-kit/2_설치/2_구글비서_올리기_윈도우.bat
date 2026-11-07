@echo off
chcp 65001 >nul
cd /d "%~dp0..\1_구글비서"
set CLASP=npx -y @google/clasp@2.4.2
where node >nul 2>nul || (echo Node.js가 먼저 필요해요. 1_처음설치_윈도우.bat 을 먼저 실행하세요. & pause & exit /b 1)
echo ① 열리는 페이지에서 Google Apps Script API를 [사용]으로 바꾸고 돌아오세요. ^(한 번만^)
start "" "https://script.google.com/home/usersettings"
pause
echo ② 구글 로그인 창이 열려요. 병원 구글 계정으로 로그인하고 [허용]을 누르세요.
if not exist "%USERPROFILE%\.clasprc.json" call %CLASP% login
if not exist .clasp.json (
  echo ③ 시트를 만들어요.
  call %CLASP% create --type sheets --title "우리 병원 비서" --rootDir .
  copy /Y ..\2_설치\appsscript.json appsscript.json >nul
)
echo ④ 코드를 올려요.
call %CLASP% push -f
echo ⑤ 태블릿 화면 주소^(웹 앱^)를 배포해요.
call %CLASP% deploy --description "태블릿 화면"
echo.
echo ✅ 끝났어요. 위에 나온 시트 주소^(docs.google.com^)를 열고, 메뉴 「🐾 병원 비서」 → ①②③④ 순서로 누르세요.
pause
