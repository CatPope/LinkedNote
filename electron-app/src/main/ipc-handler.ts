import { ipcMain, clipboard } from 'electron';
import fetch from 'node-fetch';
import { WindowManager } from './window-manager'; // Import WindowManager
import log from 'electron-log';

export class IpcHandler {
  private windowManager: WindowManager; // Add windowManager property

  constructor(windowManager: WindowManager) { // Accept windowManager in constructor
    this.windowManager = windowManager;
    this.registerListeners();
  }

  private registerListeners(): void {
    ipcMain.on('summarize-url', async (event, { url, mode }) => {
      log.info(`Summarize request received for URL: ${url} with mode: ${mode}`);
      try {
        // Assuming FastAPI backend is running on http://localhost:8000
        const response = await fetch('http://localhost:8000/api/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, mode }),
        });

        const data = await response.json();
        log.info(`Summarize response: ${JSON.stringify(data)}`);

        // Copy summary to clipboard
        if (data.success && data.content) {
          clipboard.writeText(data.content);
          log.info('Summary copied to clipboard.');
        }

        // Open result window and send summary
        const resultWindow = this.windowManager.createResultWindow();
        if (resultWindow) {
          resultWindow.webContents.send('summary-result', { success: response.ok, data });
          log.info('Summary sent to result window.');
        }

        // Original reply to main window (if needed for status updates there)
        event.reply('summarize-url-response', { success: response.ok, data });
      } catch (error: any) {
        log.error('Error summarizing URL:', error);
        const errorMessage = error.message || 'An unknown error occurred during summarization.';
        // Send error to main window
        event.reply('summarize-url-response', { success: false, error: errorMessage });

        // Also try to send error to result window if it was opened
        const resultWindow = this.windowManager.getResultWindow();
        if (resultWindow) {
          resultWindow.webContents.send('summary-result', { success: false, error: errorMessage });
        }
      }
    });

    ipcMain.on('save-api-key', async (event, apiKey: string) => {
      log.info('Save API key request received.');
      try {
        const response = await fetch('http://localhost:8000/settings/api-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ api_key: apiKey }),
        });

        const data = await response.json();
        log.info(`Save API key response: ${JSON.stringify(data)}`);
        event.reply('save-api-key-response', { success: response.ok, data });
      } catch (error: any) {
        log.error('Error saving API key:', error);
        event.reply('save-api-key-response', { success: false, error: error.message });
      }
    });
  }
}
