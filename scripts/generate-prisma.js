const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('🔄 开始生成 Prisma Client...');
  
  // 切换到项目根目录
  process.chdir(path.join(__dirname, '..'));
  
  // 执行 prisma generate
  const prismaPath = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');
  execSync(`node "${prismaPath}" generate`, { stdio: 'inherit' });
  
  console.log('✅ Prisma Client 生成成功！');
} catch (error) {
  console.error('❌ 生成失败:', error.message);
  process.exit(1);
}
