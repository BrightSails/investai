@echo off
echo ========================================
echo   连接 KV 数据库到项目
echo ========================================
echo.

cd /d %~dp0

echo 正在连接 KV 数据库...
echo.
echo 请在浏览器中完成以下操作：
echo 1. 创建或选择 KV 数据库
echo 2. 选择所有环境（Production, Preview, Development）
echo 3. 点击 Connect
echo.

vercel link --yes

echo.
echo ========================================
echo   连接完成后请运行 REDEPLOY.bat
echo ========================================
echo.
pause
