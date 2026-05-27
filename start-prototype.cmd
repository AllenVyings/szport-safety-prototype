@echo off
cd /d "%~dp0"
echo 启动原型本地服务: http://localhost:5173/index.html
echo 按 Ctrl+C 停止
npx --yes serve -p 5173 -s .
