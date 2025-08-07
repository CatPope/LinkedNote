import { Tray, nativeImage } from 'electron';
import * as path from 'path';
import { MenuBuilder } from './menu-builder';
import { WindowManager } from './window-manager';

export class TrayManager {
  private tray: Tray | null = null;
  private windowManager: WindowManager;

  constructor(windowManager: WindowManager) {
    this.windowManager = windowManager;
  }

  createTray(): void {
    const iconPath = path.join(__dirname, '../assets/icons/tray-icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    this.tray = new Tray(icon);

    const menuBuilder = new MenuBuilder(this.windowManager);
    const contextMenu = menuBuilder.buildTrayMenu();
    this.tray.setContextMenu(contextMenu);

    this.tray.setToolTip('LinkedNote');

    this.tray.on('click', () => {
      // Optional: Show/hide main window on click
      // if (this.windowManager.getMainWindow()?.isVisible()) {
      //   this.windowManager.getMainWindow()?.hide();
      // } else {
      //   this.windowManager.getMainWindow()?.show();
      // }
    });
  }

  getTray(): Tray | null {
    return this.tray;
  }

  destroyTray(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}
