const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '..', 'articles');

function fixCleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 修改段落间距：14px → 10px，和批注版一致
  content = content.replace(/margin:0 0 14px 0;/g, 'margin:0 0 10px 0;');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

// 修复所有 clean 文件
const yearDirs = fs.readdirSync(articlesDir);
let count = 0;
for (const year of yearDirs) {
  const yearPath = path.join(articlesDir, year);
  if (!fs.statSync(yearPath).isDirectory()) continue;
  
  const monthDirs = fs.readdirSync(yearPath);
  for (const month of monthDirs) {
    const monthPath = path.join(yearPath, month);
    if (!fs.statSync(monthPath).isDirectory()) continue;
    
    const files = fs.readdirSync(monthPath);
    for (const file of files) {
      if (file.endsWith('.clean.html')) {
        const filePath = path.join(monthPath, file);
        fixCleanFile(filePath);
        count++;
      }
    }
  }
}

console.log(`✅ 已修复 ${count} 个原文版文件的段落间距`);
