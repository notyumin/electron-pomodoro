const { menubar } = require('menubar');
const { nativeImage, ipcMain } = require('electron')
const { createCanvas } = require('canvas');
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

// Function to generate tray icon from text
function updateTrayIcon(text) {
  const scaleFactor = 2;
  const size = 32;
  const canvas = createCanvas(size * scaleFactor, size * scaleFactor);
  const ctx = canvas.getContext('2d');

  ctx.scale(scaleFactor, scaleFactor);

  // Clear transparent background
  ctx.clearRect(0, 0, size, size);

  // Draw centered text
  ctx.font = 'bold 12px Sans';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  // Create NativeImage
  const buffer = canvas.toBuffer('image/png');
  let image = nativeImage.createFromBuffer(buffer);
  image = image.resize({ width: size, height: size });

  if (mb.tray) {
    mb.tray.setImage(image);
  }
}

ipcMain.on('update-tray-icon', (event, text) => {
  updateTrayIcon(text);
})
