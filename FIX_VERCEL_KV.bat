@echo off
echo ========================================
echo   Vercel KV 快速修复指南
echo ========================================
echo.
echo 您的网站响应慢的原因：缺少 Vercel KV 数据库配置
echo.
echo ========================================
echo   立即修复步骤 (5分钟)
echo ========================================
echo.
echo [步骤 1] 创建 Vercel KV 数据库
echo   1. 打开浏览器访问：
echo      https://vercel.com/liyans-projects-8282cc7f/investailiyan/stores
echo   2. 点击 "Create Database"
echo   3. 选择 "KV" (Redis)
echo   4. 名称输入：investai-kv
echo   5. 区域选择：Hong Kong (hkg1)
echo   6. 点击 "Create"
echo.
echo [步骤 2] 连接数据库到项目
echo   1. 点击 "Connect Project"
echo   2. 选择项目：investailiyan
echo   3. 勾选：Production + Preview + Development
echo   4. 点击 "Connect"
echo.
echo [步骤 3] 重新部署
echo   1. 返回项目页面
echo   2. Deployments 标签 -^> 最新部署 -^> "..."
echo   3. 选择 "Redeploy"
echo   4. 取消勾选 "Use existing build cache"
echo   5. 点击 "Redeploy"
echo.
echo ========================================
echo   验证修复
echo ========================================
echo.
echo 等待 2-3 分钟部署完成后：
echo   1. 访问：https://investailiyan-15101130415-7784-liyans-projects-8282cc7f.vercel.app
echo   2. 应该 3 秒内加载完成 (不再超时)
echo   3. 登录/注册功能正常工作
echo.
echo ========================================
echo.
echo 按任意键打开 Vercel 控制台...
pause >nul
start https://vercel.com/liyans-projects-8282cc7f/investailiyan/stores
echo.
echo 浏览器已打开，请按照上述步骤操作。
echo.
pause
