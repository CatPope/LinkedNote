const { app, BrowserWindow, Tray, Menu, ipcMain, clipboard } = require('electron')
const { startMonitoring, clipboardEmitter } = require('./src/main/clipboard-monitor');
const { showNotification } = require('./src/main/notification-manager');
const { readConfig, writeConfig } = require('./src/main/config-manager');
const axios = require('axios');

let tray = null
let mainWindow = null
let settingsWindow = null
let modeSelectionWindow = null;
let resultWindow = null;
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

function createResultWindow(summaryContent) {
  if (resultWindow) {
    resultWindow.focus();
    return;
  }

  resultWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    parent: mainWindow,
    modal: true,
    show: false
  })

  resultWindow.loadFile('result.html')
  resultWindow.once('ready-to-show', () => {
    resultWindow.show()
    resultWindow.webContents.send('summary-content', summaryContent);
    clipboard.writeText(summaryContent);
  })

  resultWindow.on('closed', () => {
    resultWindow = null
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

  // 모드 선택 팝업에서 요약 요청 수신
  ipcMain.on('request-summary', async (event, { url, mode }) => {
    console.log(`Summarizing URL: ${url} with mode: ${mode}`);
    if (modeSelectionWindow) {
      modeSelectionWindow.close();
    }

    // 로딩 인디케이터 표시
    createResultWindow('');
    if (resultWindow) {
      resultWindow.webContents.send('show-loading');
    }

    try {
      const response = await axios.post('http://localhost:8000/api/summarize', {
        url: url,
        mode: mode
      });
      createResultWindow(response.data.summary);
    } catch (error) {
      console.error('Error summarizing URL:', error.message);
      let errorMessage = '요약 중 오류가 발생했습니다.';
      if (error.response) {
        errorMessage = `오류: ${error.response.data.detail || error.message}`;
      } else if (error.request) {
        errorMessage = '네트워크 오류: 백엔드 서버에 연결할 수 없습니다.';
      } else {
        errorMessage = `알 수 없는 오류: ${error.message}`;
      }
      createResultWindow(errorMessage);
    }
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
