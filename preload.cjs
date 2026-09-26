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

contextBridge.exposeInMainWorld('terminalTool', {
    createSession: () => ipcRenderer.invoke('terminal:createSession'),
    destroySession: (sessionId) => ipcRenderer.invoke('terminal:destroySession', sessionId),
    write: (sessionId, input) => ipcRenderer.invoke('terminal:write', sessionId, input),
    resize: (sessionId, size) => ipcRenderer.invoke('terminal:resize', sessionId, size),
    onData: (callback) => {
        const listener = (_event, payload) => callback(payload);
        ipcRenderer.on('terminal:data', listener);
        return () => ipcRenderer.removeListener('terminal:data', listener);
    },
    onExit: (callback) => {
        const listener = (_event, payload) => callback(payload);
        ipcRenderer.on('terminal:exit', listener);
        return () => ipcRenderer.removeListener('terminal:exit', listener);
    },
    onStatus: (callback) => {
        const listener = (_event, payload) => callback(payload);
        ipcRenderer.on('terminal:status', listener);
        return () => ipcRenderer.removeListener('terminal:status', listener);
    },
    onCurrentDirectoryChanged: (callback) => {
        const listener = (_event, payload) => callback(payload);
        ipcRenderer.on('terminal:cwd', listener);
        return () => ipcRenderer.removeListener('terminal:cwd', listener);
    },
});
