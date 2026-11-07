@echo off
chcp 65001 >nul
cd /d "%~dp0"
claude --chrome "도구/부탁문/10_플레이스_정보_채우기.txt 를 읽고 그대로 해 줘."
pause
