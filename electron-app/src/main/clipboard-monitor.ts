import { clipboard } from 'electron';

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
      console.warn('Clipboard monitor is already running.');
      return;
    }

    this.lastClipboardText = clipboard.readText();

    this.intervalId = setInterval(() => {
      const currentClipboardText = clipboard.readText();
      if (currentClipboardText !== this.lastClipboardText) {
        this.lastClipboardText = currentClipboardText;
        const urlMatch = currentClipboardText.match(/^(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          onUrlDetected(urlMatch[1]);
        }
      }
    }, this.interval);
    console.log('Clipboard monitor started.');
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Clipboard monitor stopped.');
    }
  }
}

export default ClipboardMonitor;
