@echo off
echo Đang kiểm tra và dừng process dùng port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /PID %%a /F >nul 2>&1

echo Đang khởi động json-server...
json-server --watch db.json --port 5000
pause

//start start-server.bat
