const { clipboard } = require('electron');

let lastClipboardText = '';

function isValidUrl(text) {
  try {
    new URL(text);
    return true;
  } catch (e) {
    return false;
  }
}

function startMonitoring(interval = 1000) {
  setInterval(() => {
    const currentClipboardText = clipboard.readText();
    if (currentClipboardText && currentClipboardText !== lastClipboardText) {
      lastClipboardText = currentClipboardText;
      if (isValidUrl(currentClipboardText)) {
        console.log('Valid URL detected:', currentClipboardText);
        // 여기에 URL 감지 시 이벤트 발생 로직 추가
      } else {
        console.log('Non-URL text detected:', currentClipboardText);
      }
    }
  }, interval);
}

module.exports = { startMonitoring };