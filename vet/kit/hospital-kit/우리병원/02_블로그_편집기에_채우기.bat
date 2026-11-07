@echo off
chcp 65001 >nul
cd /d "%~dp0"
claude --chrome "도구/부탁문/02_블로그_편집기에_채우기.txt 를 읽고 그대로 해 줘."
pause
