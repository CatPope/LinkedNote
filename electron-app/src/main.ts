import { app, BrowserWindow, Tray, Menu } from 'electron';
import path from 'path';
import ClipboardMonitor from './clipboard-monitor';

let tray: Tray | null = null;
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Hide the main window initially
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  const clipboardMonitor = new ClipboardMonitor();
  clipboardMonitor.start((url) => {
    console.log('URL detected:', url);
    // TODO: Implement notification and further processing
  });

  tray = new Tray(path.join(__dirname, '../assets/icons/tray-icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => {
        // Open settings window (to be implemented)
        console.log('Settings clicked');
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('LinkedNote');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    // Show/hide main window on tray icon click (optional)
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});