const { clipboard } = require('electron');

let lastClipboardText = '';

function startMonitoring(interval = 1000) {
  setInterval(() => {
    const currentClipboardText = clipboard.readText();
    if (currentClipboardText && currentClipboardText !== lastClipboardText) {
      lastClipboardText = currentClipboardText;
      console.log('Clipboard changed:', currentClipboardText);
      // 여기에 URL 유효성 검사 및 이벤트 발생 로직 추가
    }
  }, interval);
}

module.exports = { startMonitoring };
