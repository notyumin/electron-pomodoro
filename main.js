const { menubar } = require('menubar');
const { nativeImage, ipcMain } = require('electron')
const path = require("path")

const mb = menubar({
  preloadWindow: true, // important to enable preload
  browserWindow: {
    height: 280,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  },
});

mb.on('ready', () => {
  console.log('app is ready');
});



ipcMain.on('update-tray-icon', (event, buffer) => {
  const size = 32;
  let image = nativeImage.createFromBuffer(buffer);
  image = image.resize({ width: size, height: size });

  if (mb.tray) {
    mb.tray.setImage(image);
  }
})
