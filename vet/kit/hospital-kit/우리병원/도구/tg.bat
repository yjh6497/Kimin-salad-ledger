@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist 텔레그램.env (echo 도구\텔레그램.env 가 없어 텔레그램은 건너뛰어요. & exit /b 0)
for /f "usebackq tokens=1,* delims==" %%a in ("텔레그램.env") do set %%a=%%b
curl -s -o nul -X POST "https://api.telegram.org/bot%TG_TOKEN%/sendMessage" --data-urlencode "chat_id=%TG_CHAT%" --data-urlencode "text=💻 %*"
echo 텔레그램으로 보냈어요.
