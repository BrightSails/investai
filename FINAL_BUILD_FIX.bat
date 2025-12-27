@echo off
REM Windows 批处理脚本 - 最终构建修复

echo 🔧 开始全面清理和修复...
echo.

REM 1. 删除遗留文件
echo 1️⃣ 清理遗留文件...
if exist "prisma.config.ts" (
    del /f "prisma.config.ts"
    echo    ✅ 删除 prisma.config.ts
)

if exist "src\lib\db.ts" (
    del /f "src\lib\db.ts"
    echo    ✅ 删除 src\lib\db.ts
)

REM 2. 重新生成 package-lock.json
echo.
echo 2️⃣ 重新生成 package-lock.json...
if exist "package-lock.json" del /f "package-lock.json"
call npm install
echo    ✅ package-lock.json 已更新

REM 3. 清理构建缓存
echo.
echo 3️⃣ 清理构建缓存...
if exist ".next" rd /s /q ".next"
if exist "node_modules\.cache" rd /s /q "node_modules\.cache"
echo    ✅ 缓存已清理

REM 4. 初始化数据文件
echo.
echo 4️⃣ 初始化数据文件...
call npm run db:init
echo    ✅ 数据文件已初始化

REM 5. 运行构建测试
echo.
echo 5️⃣ 运行构建测试...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 构建成功！项目已完全就绪！
    echo.
    echo 📋 下一步：
    echo   1. git add .
    echo   2. git commit -m "fix: 完成所有构建问题修复"
    echo   3. git push origin main
    echo   4. 在 Vercel 上部署
) else (
    echo.
    echo ❌ 构建失败，请检查错误信息
    exit /b 1
)
