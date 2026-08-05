const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserTool', {
    setActive: (isActive) => ipcRenderer.invoke('browser:setActive', isActive),
    setBounds: (rect) => ipcRenderer.invoke('browser:setBounds', rect),
    navigate: (url) => ipcRenderer.invoke('browser:navigate', url),
});
