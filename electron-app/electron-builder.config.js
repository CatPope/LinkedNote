module.exports = {
  appId: 'com.linkednote.app',
  productName: 'LinkedNote',
  copyright: 'Copyright © 2024 ${author}',
  directories: {
    output: 'release/',
    buildResources: 'buildResources',
  },
  files: [
    'dist/**/*',
    'node_modules/**/*',
    'package.json',
  ],
  extraResources: [
    // Add any extra resources here, e.g., backend executable
    // {
    //   from: './backend/dist',
    //   to: 'backend',
    //   filter: ['**/*']
    // }
  ],
  mac: {
    icon: './src/assets/icons/icon.png',
    target: ['dmg', 'zip'],
  },
  win: {
    icon: './src/assets/icons/icon.ico',
    target: ['nsis', 'zip'],
  },
  linux: {
    icon: './src/assets/icons/icon.png',
    target: ['AppImage', 'deb'],
  },
};