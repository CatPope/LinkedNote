const { clipboard, EventEmitter } = require('electron');

let lastClipboardText = '';
const clipboardEmitter = new EventEmitter();

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
        clipboardEmitter.emit('url-detected', currentClipboardText);
      } else {
        console.log('Non-URL text detected:', currentClipboardText);
      }
    }
  }, interval);
}

module.exports = { startMonitoring, clipboardEmitter };
