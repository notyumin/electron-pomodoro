const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  updateTrayIcon: (arrayBuffer) => {
    const nodeBuffer = Buffer.from(arrayBuffer)
    ipcRenderer.send('update-tray-icon', nodeBuffer)
  }
});

