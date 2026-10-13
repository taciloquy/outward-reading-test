const fs = require('fs');
const filePath = '/Users/malen/outward-reading-site-temp/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. 修改 startRecording，先弹确认框
content = content.replace(
  '// 开始录音\n      async startRecording(){\n        try {',
  '// 开始录音\n      async startRecording(){\n        const ready = confirm("准备好开始录音了吗？\\n\\n建议先把文章打印出来，然后点确定开始录音。");\n        if (!ready) return;\n        try {'
);

// 2. 修改 stopRecording，录完先填名字再保存
content = content.replace(
  'this.mediaRecorder.onstop = () => {\n            const blob = new Blob(this.recordedChunks, { type: \'audio/webm\' });\n            const reader = new FileReader();\n            reader.onload = (e) => {\n              const audioData = e.target.result;\n              const articleId = this.currentArticle.fileKey;\n              const uploaderName = this.uploaderName || "匿名";\n              \n              // 保存到 IndexedDB\n              this.saveAudioToDB(articleId, uploaderName, audioData, "录音_" + new Date().toLocaleTimeString() + ".webm");\n              \n              alert("录音完成，已保存！");\n            };\n            reader.readAsDataURL(blob);',
  'this.mediaRecorder.onstop = () => {\n            const blob = new Blob(this.recordedChunks, { type: \'audio/webm\' });\n            const reader = new FileReader();\n            reader.onload = (e) => {\n              const audioData = e.target.result;\n              const articleId = this.currentArticle.fileKey;\n              \n              // 先让用户填名字\n              const uploaderName = prompt("请输入录音者名字：", this.uploaderName || "");\n              if (!uploaderName) {\n                alert("已取消，录音未保存");\n                return;\n              }\n              localStorage.setItem("uploaderName", uploaderName);\n              this.uploaderName = uploaderName;\n              \n              // 保存到 IndexedDB\n              this.saveAudioToDB(articleId, uploaderName, audioData, "录音_" + new Date().toLocaleTimeString() + ".webm");\n              \n              alert("录音完成，已保存！\\n可以点🎵按钮查看和播放。");\n            };\n            reader.readAsDataURL(blob);'
);

// 3. 修改播放音频弹窗里的 AI 朗读按钮，让它能用
content = content.replace(
  '<!-- AI 音频 -->\n        <div style="margin:1rem 0;padding:1rem;border:1px solid #ddd;border-radius:8px;">\n          <strong>AI 朗读</strong>\n          <p style="color:#666;font-size:0.9rem;margin:0.5rem 0 0 0;">使用浏览器自带的 AI 语音朗读文章</p>\n        </div>',
  '<!-- AI 音频 -->\n        <div style="margin:1rem 0;padding:1rem;border:1px solid #ddd;border-radius:8px;cursor:pointer;" @click="playAI() {\n          <div style="display:flex;justify-content:space-between;align-items:center;">\n            <div>\n              <strong>AI 朗读</strong>\n              <p style="color:#666;font-size:0.9rem;margin:0.5rem 0 0 0;">使用浏览器自带的语音朗读文章</p>\n            </div>\n            <button style="padding:6px 16px;cursor:pointer;">播放</button>\n          </div>\n        </div>'
);

// 4. 加 playAI 方法
content = content.replace(
  '// 播放音频\n      playAudio(audio){',
  '// AI 朗读\n      playAI(){\n        // 提取文章纯文本\n        const div = document.createElement("div");\n        div.innerHTML = this.articleHtml;\n        const text = div.textContent || div.innerText || "";\n        \n        // 使用浏览器 TTS\n        if (\'speechSynthesis\' in window) {\n          window.speechSynthesis.cancel();\n          const utterance = new SpeechSynthesisUtterance(text);\n          utterance.lang = \'en-US\';\n          utterance.rate = 1.0;\n          window.speechSynthesis.speak(utterance);\n          alert("开始 AI 朗读，再点一次停止");\n        } else {\n          alert("你的浏览器不支持语音朗读");\n        }\n      },\n      // 播放音频\n      playAudio(audio){'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ 已修复录音和播放功能');
