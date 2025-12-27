@echo off
echo ========================================
echo   正在部署到 Vercel...
echo ========================================
echo.

cd /d %~dp0

echo [1/2] 检查 Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装 Vercel CLI
    echo.
    echo 正在安装 Vercel CLI...
    npm install -g vercel
    echo ✅ Vercel CLI 安装完成
    echo.
)

echo [2/2] 开始部署到生产环境...
echo.
vercel --prod

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 请查看上方输出的 URL 访问您的网站
echo.
pause
