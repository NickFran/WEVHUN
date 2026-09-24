const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserTool', {
    setActive: (isActive) => ipcRenderer.invoke('browser:setActive', isActive),
    setBounds: (rect) => ipcRenderer.invoke('browser:setBounds', rect),
    navigate: (url) => ipcRenderer.invoke('browser:navigate', url),
    URLHistoryForward: () => ipcRenderer.invoke('browser:URLHistoryForward'),
    URLHistoryBack: () => ipcRenderer.invoke('browser:URLHistoryBack'),
    URLHistoryTruncate: () => ipcRenderer.invoke('browser:URLHistoryTruncate'),
    onUrlChanged: (callback) => {
        const listener = (_event, nextUrl) => callback(nextUrl);
        ipcRenderer.on('browser:urlChanged', listener);
        return () => ipcRenderer.removeListener('browser:urlChanged', listener);
    },
});
