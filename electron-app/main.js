const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const { startMonitoring, clipboardEmitter } = require('./src/main/clipboard-monitor');
const { showNotification } = require('./src/main/notification-manager');
const { readConfig, writeConfig } = require('./src/main/config-manager');

let tray = null
let mainWindow = null
let settingsWindow = null
let modeSelectionWindow = null;
let openaiApiKey = null;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('index.html')
  mainWindow.hide()
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    parent: mainWindow,
    modal: true,
    show: false
  })

  settingsWindow.loadFile('settings.html')
  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show()
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

function createModeSelectionWindow(url) {
  if (modeSelectionWindow) {
    modeSelectionWindow.focus();
    return;
  }

  modeSelectionWindow = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    parent: mainWindow,
    modal: true,
    show: false,
    frame: false,
    transparent: true
  })

  modeSelectionWindow.loadFile('mode-selection.html')
  modeSelectionWindow.once('ready-to-show', () => {
    modeSelectionWindow.show()
    modeSelectionWindow.webContents.send('url-to-summarize', url);
  })

  modeSelectionWindow.on('closed', () => {
    modeSelectionWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  // 트레이 아이콘 설정
  tray = new Tray(__dirname + '/assets/icons/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: '설정', click: () => { createSettingsWindow() } },
    { label: '종료', click: () => app.quit() }
  ])
  tray.setToolTip('LinkedNote')
  tray.setContextMenu(contextMenu)

  // 트레이 아이콘 클릭 시 창 토글
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  startMonitoring();

  // 애플리케이션 시작 시 API 키 로드
  const config = readConfig();
  openaiApiKey = config.openaiApiKey;

  clipboardEmitter.on('url-detected', (url) => {
    console.log('URL detected in main.js:', url);
    showNotification('URL 감지됨', `클립보드에서 URL이 감지되었습니다: ${url}`, () => {
      console.log('Notification clicked for URL:', url);
      createModeSelectionWindow(url);
    });
  });

  // IPC 통신 핸들러
  ipcMain.on('request-api-key', (event) => {
    event.sender.send('send-api-key', openaiApiKey);
  });

  ipcMain.on('save-api-key', (event, apiKey) => {
    const config = readConfig();
    config.openaiApiKey = apiKey;
    writeConfig(config);
    openaiApiKey = apiKey;
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})