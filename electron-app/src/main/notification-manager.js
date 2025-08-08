const { Notification } = require('electron');

function showNotification(title, body, onClickCallback) {
  const notification = new Notification({
    title: title,
    body: body,
    silent: false,
    // icon: './assets/icons/icon.png' // 필요시 아이콘 추가
  });

  notification.show();

  if (onClickCallback) {
    notification.on('click', onClickCallback);
  }
}

module.exports = { showNotification };
