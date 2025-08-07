import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private settingsWindow: BrowserWindow | null = null;
  private resultWindow: BrowserWindow | null = null;

  constructor() {
    // Initialize any window-related settings here if needed
  }

  createMainWindow(): BrowserWindow {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    this.mainWindow = new BrowserWindow({
      width: 300,
      height: 200,
      frame: false, // No window frame
      resizable: false,
      show: false, // Don't show until ready
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    this.mainWindow.on('ready-to-show', () => {
      if (this.mainWindow) {
        // Position the window at the bottom right corner
        const x = width - this.mainWindow.getBounds().width - 20; // 20px padding from right
        const y = height - this.mainWindow.getBounds().height - 20; // 20px padding from bottom
        this.mainWindow.setPosition(x, y);
        this.mainWindow.show();
      }
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  // Method to close the main window
  closeMainWindow(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.close();
      this.mainWindow = null;
    }
  }

  createSettingsWindow(): BrowserWindow {
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
      this.settingsWindow.focus();
      return this.settingsWindow;
    }

    this.settingsWindow = new BrowserWindow({
      width: 400,
      height: 300,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    this.settingsWindow.loadFile(path.join(__dirname, '../renderer/settings.html'));

    this.settingsWindow.on('ready-to-show', () => {
      if (this.settingsWindow) {
        this.settingsWindow.show();
      }
    });

    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null;
    });

    return this.settingsWindow;
  }

  getSettingsWindow(): BrowserWindow | null {
    return this.settingsWindow;
  }

  closeSettingsWindow(): void {
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
      this.settingsWindow.close();
      this.settingsWindow = null;
    }
  }

  createResultWindow(): BrowserWindow {
    if (this.resultWindow && !this.resultWindow.isDestroyed()) {
      this.resultWindow.focus();
      return this.resultWindow;
    }

    this.resultWindow = new BrowserWindow({
      width: 600,
      height: 400,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    this.resultWindow.loadFile(path.join(__dirname, '../renderer/result.html'));

    this.resultWindow.on('ready-to-show', () => {
      if (this.resultWindow) {
        this.resultWindow.show();
      }
    });

    this.resultWindow.on('closed', () => {
      this.resultWindow = null;
    });

    return this.resultWindow;
  }

  getResultWindow(): BrowserWindow | null {
    return this.resultWindow;
  }

  closeResultWindow(): void {
    if (this.resultWindow && !this.resultWindow.isDestroyed()) {
      this.resultWindow.close();
      this.resultWindow = null;
    }
  }
}