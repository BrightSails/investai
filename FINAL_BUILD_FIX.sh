#!/bin/bash
# 最终构建修复脚本

echo "🔧 开始全面清理和修复..."
echo ""

# 1. 删除遗留的 Prisma 相关文件（可选，不影响构建）
echo "1️⃣ 清理遗留文件..."
if [ -f "prisma.config.ts" ]; then
    rm -f prisma.config.ts
    echo "   ✅ 删除 prisma.config.ts"
fi

if [ -f "src/lib/db.ts" ]; then
    rm -f src/lib/db.ts
    echo "   ✅ 删除 src/lib/db.ts"
fi

if [ -d "prisma" ]; then
    echo "   ⚠️  保留 prisma/ 目录（不影响构建）"
fi

# 2. 重新生成 package-lock.json
echo ""
echo "2️⃣ 重新生成 package-lock.json..."
rm -f package-lock.json
npm install
echo "   ✅ package-lock.json 已更新"

# 3. 清理构建缓存
echo ""
echo "3️⃣ 清理构建缓存..."
rm -rf .next
rm -rf node_modules/.cache
echo "   ✅ 缓存已清理"

# 4. 初始化数据文件
echo ""
echo "4️⃣ 初始化数据文件..."
npm run db:init
echo "   ✅ 数据文件已初始化"

# 5. 运行构建测试
echo ""
echo "5️⃣ 运行构建测试..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 构建成功！项目已完全就绪！"
    echo ""
    echo "📋 下一步："
    echo "  1. git add ."
    echo "  2. git commit -m 'fix: 完成所有构建问题修复'"
    echo "  3. git push origin main"
    echo "  4. 在 Vercel 上部署"
else
    echo ""
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
