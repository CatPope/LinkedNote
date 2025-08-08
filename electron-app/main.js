const { app, BrowserWindow, Tray, Menu } = require('electron')

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
