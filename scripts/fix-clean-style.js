const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '..', 'articles');

function fixCleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 修改 body 的行高和页边距
  content = content.replace(
    /body\{font-family:Menlo,Consolas,Monaco,'Courier New',monospace;font-size:14pt;color:#222;margin:30px auto;padding:0 20px;line-height:1.8;\}/,
    "body{font-family:Menlo,Consolas,Monaco,'Courier New',monospace;font-size:14pt;color:#222;margin:20px auto;padding:0 20px;line-height:1.4;}"
  );
  
  // 修改 @page 的页边距
  content = content.replace(
    /@page\{size:A4;margin:20mm 20mm 18mm;@bottom-center\{content:counter\(page\);font-family:Helvetica,sans-serif;font-size:9pt;color:#999;\}\}/,
    "@page{size:A4;margin:12mm 12mm 14mm;@bottom-center{content:counter(page);font-family:Helvetica,sans-serif;font-size:9pt;color:#999;}}"
  );
  
  // 修改段落间距
  content = content.replace(
    /p\{margin:0 0 14px 0;text-align:justify;\}/,
    "p{margin:0 0 10px 0;text-align:justify;}"
  );
  
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

console.log(`✅ 已调整 ${count} 篇原文版的行高和页边距`);
