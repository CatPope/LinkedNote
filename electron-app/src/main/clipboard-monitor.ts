import { clipboard } from 'electron';
import log from 'electron-log';

interface ClipboardMonitorOptions {
  interval?: number; // Polling interval in milliseconds
}

class ClipboardMonitor {
  private lastClipboardText: string = '';
  private intervalId: NodeJS.Timeout | null = null;
  private readonly interval: number;

  constructor(options?: ClipboardMonitorOptions) {
    this.interval = options?.interval || 500; // Default to 500ms
  }

  public start(onUrlDetected: (url: string) => void): void {
    if (this.intervalId) {
      log.warn('Clipboard monitor is already running.');
      return;
    }

    this.lastClipboardText = clipboard.readText();
    log.info('Clipboard monitor started.');

    this.intervalId = setInterval(() => {
      const currentClipboardText = clipboard.readText();
      if (currentClipboardText !== this.lastClipboardText) {
        this.lastClipboardText = currentClipboardText;
        log.debug('Clipboard content changed.');
        const urlMatch = currentClipboardText.match(/^(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          log.info(`URL detected: ${urlMatch[1]}`);
          onUrlDetected(urlMatch[1]);
        }
      }
    }, this.interval);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      log.info('Clipboard monitor stopped.');
    }
  }
}

export default ClipboardMonitor;