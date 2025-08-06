module.exports = {
  appId: 'com.example.linkednote',
  productName: 'LinkedNote',
  directories: {
    output: 'release',
    buildResources: 'assets',
  },
  files: [
    'dist/**/*',
    'node_modules/**/*',
    'package.json',
  ],
  mac: {
    icon: 'assets/icons/icon.png',
  },
  win: {
    icon: 'assets/icons/icon.ico',
  },
  linux: {
    icon: 'assets/icons/icon.png',
  },
};
