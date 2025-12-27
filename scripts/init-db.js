const fs = require('fs');
const path = require('path');

// 确保 data 目录存在
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ 创建 data 目录');
}

// 初始化 JSON 文件
const files = [
  { name: 'users.json', content: [] },
  { name: 'profiles.json', content: [] },
  { name: 'projects.json', content: [] },
  { name: 'recommendations.json', content: [] }
];

files.forEach(file => {
  const filePath = path.join(dataDir, file.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(file.content, null, 2));
    console.log(`✅ 创建 ${file.name}`);
  } else {
    console.log(`⏭️  ${file.name} 已存在，跳过`);
  }
});

console.log('✅ JSON 数据库初始化完成！');
console.log(`📁 数据库位置: ${dataDir}`);

