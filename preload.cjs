const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserTool', {
    setActive: (isActive) => ipcRenderer.invoke('browser:setActive', isActive),
    setBounds: (rect) => ipcRenderer.invoke('browser:setBounds', rect),
    navigate: (url) => ipcRenderer.invoke('browser:navigate', url),
    URLHistoryForward: () => ipcRenderer.invoke('browser:URLHistoryForward'),
    URLHistoryBack: () => ipcRenderer.invoke('browser:URLHistoryBack'),
    URLHistoryTruncate: () => ipcRenderer.invoke('browser:URLHistoryTruncate'),
    URLHistoryPush: (newUrl) => ipcRenderer.invoke('browser:URLHistoryPush', newUrl),
});
