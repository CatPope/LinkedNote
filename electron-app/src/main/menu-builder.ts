import { Menu, MenuItem, app } from 'electron';
import { WindowManager } from './window-manager';

export class MenuBuilder {
  private windowManager: WindowManager;

  constructor(windowManager: WindowManager) {
    this.windowManager = windowManager;
  }

  buildTrayMenu(): Menu {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Settings',
        click: () => {
          this.windowManager.createSettingsWindow();
        },
      },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ]);
    return contextMenu;
  }
}
