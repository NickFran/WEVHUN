import { createBrowserTool } from './browserTool.js';

function createBrowserToolMain(mainWindow) {
    const browserTool = createBrowserTool(mainWindow);

    function registerIpc(ipcMain) {
        ipcMain.handle('browser:setActive', (_event, isActive) => {
            browserTool.setActive(isActive);
        });

        ipcMain.handle('browser:setBounds', (_event, rect) => {
            browserTool.setBounds(rect);
        });

        ipcMain.handle('browser:navigate', async (_event, url) => {
            return browserTool.navigate(url);
        });

        ipcMain.handle('browser:URLHistoryForward', async () => {
            return browserTool.URLHistoryForward();
        });

        ipcMain.handle('browser:URLHistoryBack', async () => {
            return browserTool.URLHistoryBack();
        });

        ipcMain.handle('browser:URLHistoryTruncate', async () => {
            return browserTool.URLHistoryTruncate();
        });
    }

    return {
        registerIpc,
    };
}

export { createBrowserToolMain };