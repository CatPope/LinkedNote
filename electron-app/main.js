const { app, BrowserWindow, Tray, Menu } = require('electron')
const { startMonitoring, clipboardEmitter } = require('./src/main/clipboard-monitor');
const { showNotification } = require('./src/main/notification-manager');

let tray = null

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
  win.hide() // 창 숨기기
}

app.whenReady().then(() => {
  createWindow()

  // 트레이 아이콘 설정
  tray = new Tray(__dirname + '/assets/icons/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: '설정', click: () => { /* 설정 창 열기 로직 */ } },
    { label: '종료', click: () => app.quit() }
  ])
  tray.setToolTip('LinkedNote')
  tray.setContextMenu(contextMenu)

  // 트레이 아이콘 클릭 시 창 토글
  tray.on('click', () => {
    const win = BrowserWindow.getAllWindows()[0] // 첫 번째 창 가져오기
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })

  startMonitoring(); // 클립보드 모니터링 시작

  clipboardEmitter.on('url-detected', (url) => {
    console.log('URL detected in main.js:', url);
    showNotification('URL 감지됨', `클립보드에서 URL이 감지되었습니다: ${url}`, () => {
      console.log('Notification clicked for URL:', url);
      // 여기에 알림 클릭 시 수행할 동작 추가 (예: URL 열기, 요약 창 띄우기)
    });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})