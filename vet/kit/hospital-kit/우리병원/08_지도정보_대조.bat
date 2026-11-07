@echo off
chcp 65001 >nul
cd /d "%~dp0"
claude --chrome "도구/부탁문/08_지도정보_대조.txt 를 읽고 그대로 해 줘."
pause
