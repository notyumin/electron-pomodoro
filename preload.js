const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  updateTrayIcon: (text) => ipcRenderer.send('update-tray-icon', text)
});

