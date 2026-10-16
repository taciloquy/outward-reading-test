const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 删除 header-bar div（含带引号的变体）
  const headerBarRe = /<div class=['"]header-bar['"]>[\s\S]*?<\/div>/;
  if (headerBarRe.test(content)) {
    content = content.replace(headerBarRe, '');
    changed = true;
  }

  // 删除 subtitle div
  const subtitleRe = /<div class=['"]subtitle['"]>[\s\S]*?<\/div>/;
  if (subtitleRe.test(content)) {
    content = content.replace(subtitleRe, '');
    changed = true;
  }

  // h1/h2 加 margin-bottom:20px（若没有 inline style）
  content = content.replace(/<h1>([\s\S]*?)<\/h1>/g, '<h1 style="margin-bottom:20px;">$1</h1>');
  content = content.replace(/<h2>([\s\S]*?)<\/h2>/g, '<h2 style="margin-bottom:20px;">$1</h2>');

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return changed;
}

function walkDir(dir, stats) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, stats);
    } else if (entry.name.endsWith('.html')) {
      if (fixFile(fullPath)) stats.changed++;
      stats.total++;
    }
  }
}

for (const root of ['/Users/malen/outward-reading-site-prod/articles', '/Users/malen/outward-reading-site-temp/articles']) {
  if (!fs.existsSync(root)) continue;
  const stats = { total: 0, changed: 0 };
  walkDir(root, stats);
  console.log(`${root}: 扫描 ${stats.total} 个文件，修改 ${stats.changed} 个`);
}
console.log('✅ 完成');
