import * as STORE from "../store/STORE.js";

import { WebContentsView } from 'electron';
import { chromium } from 'playwright';

const FALLBACK_TOP_BAR_HEIGHT = 48;
const FALLBACK_BROWSER_TOOLBAR_HEIGHT = 44;

export function createBrowserTool(mainWindow) {
    let browserView;
    let playwrightBrowser;
    let browserViewPage;
    let browserViewIsAttached = false;
    let lastBrowserBounds;

    function getFallbackBrowserBounds() {
        const [windowWidth, windowHeight] = mainWindow.getContentSize();
        const y = FALLBACK_TOP_BAR_HEIGHT + FALLBACK_BROWSER_TOOLBAR_HEIGHT;

        return {
            x: 0,
            y,
            width: windowWidth,
            height: Math.max(windowHeight - y, 200),
        };
    }

    function updateBrowserViewBounds(rect) {
        if (!browserView) return;

        const nextBounds = rect && rect.width > 0 && rect.height > 0
            ? {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            }
            : getFallbackBrowserBounds();

        lastBrowserBounds = nextBounds;
        browserView.setBounds(nextBounds);
    }

    function setActive(isActive) {
        if (!browserView) return;

        if (isActive && !browserViewIsAttached) {
            mainWindow.contentView.addChildView(browserView);
            browserViewIsAttached = true;
            updateBrowserViewBounds(lastBrowserBounds);
            return;
        }

        if (!isActive && browserViewIsAttached) {
            mainWindow.contentView.removeChildView(browserView);
            browserViewIsAttached = false;
        }
    }

    async function getBrowserPage() {
        if (browserViewPage) return browserViewPage;

        if (!playwrightBrowser) {
            playwrightBrowser = await chromium.connectOverCDP('http://localhost:9222');
        }

        const context = playwrightBrowser.contexts()[0];
        const targetUrl = browserView.webContents.getURL();
        browserViewPage = context.pages().find((page) => page.url() === targetUrl) ?? context.pages()[0];
        return browserViewPage;
    }

    browserView = new WebContentsView();
    browserView.webContents.loadURL(STORE.store_browser.getState().URL);
    updateBrowserViewBounds();

    mainWindow.on('resize', () => {
        if (browserViewIsAttached) {
            updateBrowserViewBounds(lastBrowserBounds);
        }
    });

    return {
        setActive,
        setBounds: updateBrowserViewBounds,
        async navigate(url) {
            const page = await getBrowserPage();
            await page.goto(url);
            return page.url();
        },
    };
}