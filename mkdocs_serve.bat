@echo off
REM 1. 在新 cmd 視窗中啟動 MkDocs 本地伺服器
start "MkDocs Server" cmd /k "python -m mkdocs serve"

REM 2. 等待伺服器啟動完成（視情況可調秒數）
timeout /t 5 /nobreak >nul

REM 3. 開啟預設瀏覽器指向本地地址
start "" "http://127.0.0.1:8000/"
