import { app, BrowserWindow } from 'electron';
import { WindowManager } from './window-manager';
import { TrayManager } from './tray-manager';
import { IpcHandler } from './ipc-handler';
import log from 'electron-log';

export class AppController {
  private windowManager: WindowManager;
  private trayManager: TrayManager;
  private ipcHandler: IpcHandler;

  constructor() {
    log.transports.file.level = 'info';
    log.info('AppController initialized.');
    this.windowManager = new WindowManager();
    this.trayManager = new TrayManager(this.windowManager);
    this.ipcHandler = new IpcHandler(this.windowManager);
  }

  public initialize(): void {
    app.on('ready', () => {
      log.info('App is ready.');
      this.windowManager.createMainWindow();
      this.trayManager.createTray();
    });

    app.on('window-all-closed', () => {
      log.info('All windows closed.');
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      log.info('App activated.');
      if (BrowserWindow.getAllWindows().length === 0) {
        this.windowManager.createMainWindow();
      }
    });
  }
}
