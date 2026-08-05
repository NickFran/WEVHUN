import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBrowserTool } from './src/common/browserTool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const {app, BrowserWindow} = require('electron/main');
// const path = require('node:path');

// Opens a local (loopback-only) Chrome DevTools Protocol endpoint so Playwright
// can attach to the same Chromium instance that renders the embedded browser view.
app.commandLine.appendSwitch('remote-debugging-port', '9222');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 750,
        //frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs')
        }
    });

    const browserTool = createBrowserTool(mainWindow);

    ipcMain.handle('browser:setActive', (_event, isActive) => {
        browserTool.setActive(isActive);
    });

    ipcMain.handle('browser:setBounds', (_event, rect) => {
        browserTool.setBounds(rect);
    });

    ipcMain.handle('browser:navigate', async (_event, url) => {
        return browserTool.navigate(url);
    });

    // IMPORTANT: Change the port if Vite is running on a different one (e.g., 5173, 3000)
    const isDev = !app.isPackaged; 

    if (isDev) {
        // In development, load the Vite server
        mainWindow.loadURL('http://localhost:5173')
        
        // Optional: Automatically open Chrome DevTools to help you debug
        mainWindow.webContents.openDevTools() 
    } else {
        // In production, load the built HTML file
        mainWindow.loadFile('dist/index.html') 
    }
}

app.on('ready', createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});