const fs = require('fs');
const filePath = '/Users/malen/outward-reading-site-temp/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. 修改手机端的弹窗样式，不要占满整个屏幕
content = content.replace(
  '.modal-card{width:100%;height:100%;border-radius:0;padding:1rem;}',
  '.modal-card{width:95%;height:90%;border-radius:12px;padding:1rem;}'
);

// 2. 放大关闭按钮
content = content.replace(
  '.close-btn{position:sticky;top:0;float:right;cursor:pointer;font-size:1.2rem;color:#888;}',
  '.close-btn{position:sticky;top:0;float:right;cursor:pointer;font-size:1.5rem;color:#888;padding:4px 12px;background:#f5f5f5;border-radius:8px;margin-bottom:8px;}'
);

// 3. 在上传音频弹窗底部加一个明显的关闭按钮
content = content.replace(
  '<button @click="uploadAudio()" style="padding:8px 16px;cursor:pointer;">上传</button>\n      </div>\n    </div>',
  '<div style="display:flex;gap:8px;margin-top:1rem;">\n          <button @click="uploadAudio()" style="padding:8px 16px;cursor:pointer;flex:1;">上传</button>\n          <button @click="showUploadModal=false" style="padding:8px 16px;cursor:pointer;flex:1;background:#f5f5f5;">取消</button>\n        </div>\n      </div>\n    </div>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ 已优化弹窗在手机上的显示');
