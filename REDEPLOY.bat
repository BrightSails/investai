@echo off
echo ========================================
echo   重新部署到 Vercel（使用新环境变量）
echo ========================================
echo.

cd /d %~dp0

echo 正在触发重新部署...
echo.

vercel --prod --force

echo.
echo ========================================
echo   重新部署完成！
echo ========================================
echo.
echo 请访问新的 URL 测试网站
echo.
pause
