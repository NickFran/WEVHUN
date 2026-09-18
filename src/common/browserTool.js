import * as STORE from "../store/STORE.js";

import { WebContentsView } from 'electron';
import { chromium } from 'playwright';

const FALLBACK_TOP_BAR_HEIGHT = 48;
const FALLBACK_BROWSER_TOOLBAR_HEIGHT = 44;

function createBrowserTool(mainWindow) {

    let browserView;
    let playwrightBrowser;
    let browserViewPage;
    let browserViewIsAttached = false;
    let lastBrowserBounds;

    const getBrowserState = () => STORE.store_browser.getState();

    function commitToHistory(history, pointer) {
        STORE.store_browser.setState({
            URLHistoryStack: history,
            URLHistoryStackPointer: pointer,
        });
    }

    function getTrimmedHistory(state) {
        return state.URLHistoryStack.slice(0, state.URLHistoryStackPointer + 1);
    }

    function truncateHistory() {
        const state = getBrowserState();
        commitToHistory(getTrimmedHistory(state), state.URLHistoryStackPointer);
    }

    function pushToHistory(url) {
        const state = getBrowserState();
        const nextHistory = [...getTrimmedHistory(state), url];
        commitToHistory(nextHistory, nextHistory.length - 1);
    }

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
        if (browserViewPage && !browserViewPage.isClosed()) return browserViewPage;

        if (!playwrightBrowser) {
            playwrightBrowser = await chromium.connectOverCDP('http://localhost:9222');
        }

        const context = playwrightBrowser.contexts()[0];
        const pages = context?.pages() ?? [];
        const targetUrl = browserView.webContents.getURL();

        browserViewPage = pages.find((page) => page.url() === targetUrl) ?? pages[0];
        return browserViewPage;
    }

    async function navigate(url, shouldPushToHistory = false) {
        const page = await getBrowserPage();
        await page.goto(url);

        const nextUrl = page.url();
        STORE.store_browser.setState({ URL: nextUrl });

        if (shouldPushToHistory) {
            pushToHistory(nextUrl);
        }

        return nextUrl;
    }

    async function navigateHistory(step) {
        const state = getBrowserState();
        const nextPointer = state.URLHistoryStackPointer + step;

        if (nextPointer < 0 || nextPointer >= state.URLHistoryStack.length) {
            return state.URL;
        }

        const nextUrl = state.URLHistoryStack[nextPointer];
        STORE.store_browser.setState({
            URLHistoryStackPointer: nextPointer,
            URL: nextUrl,
        });

        return navigate(nextUrl);
    }

    async function URLHistoryForward() {
        return navigateHistory(1);
    }

    async function URLHistoryBack() {
        return navigateHistory(-1);
    }

    function URLHistoryTruncate() {
        truncateHistory();
        return getBrowserState().URLHistoryStack;
    }

    function URLHistoryPush(newUrl) {
        pushToHistory(newUrl);
        return getBrowserState().URLHistoryStack;
    }

    browserView = new WebContentsView();
    browserView.webContents.loadURL(getBrowserState().URL);

    pushToHistory(getBrowserState().URL);

    updateBrowserViewBounds();

    mainWindow.on('resize', () => {
        if (browserViewIsAttached) {
            updateBrowserViewBounds(lastBrowserBounds);
        }
    });

    return {
        setActive,
        setBounds: updateBrowserViewBounds,
        navigate,
        URLHistoryForward,
        URLHistoryBack,
        URLHistoryTruncate,
        URLHistoryPush,
    };
}

export { createBrowserTool };