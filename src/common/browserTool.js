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
    let pendingHistoryAction = 'push';
    let navigationChain = Promise.resolve();

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
        const currentUrl = state.URLHistoryStack[state.URLHistoryStackPointer];

        if (currentUrl === url) {
            return;
        }

        const nextHistory = [...getTrimmedHistory(state), url];
        commitToHistory(nextHistory, nextHistory.length - 1);
    }

    function syncHistoryOnNavigation(url) {
        const state = getBrowserState();

        if (pendingHistoryAction === 'back') {
            const nextPointer = Math.max(state.URLHistoryStackPointer - 1, 0);
            commitToHistory(state.URLHistoryStack, nextPointer);
        } else if (pendingHistoryAction === 'forward') {
            const nextPointer = Math.min(state.URLHistoryStackPointer + 1, state.URLHistoryStack.length - 1);
            commitToHistory(state.URLHistoryStack, nextPointer);
        } else {
            pushToHistory(url);
        }

        pendingHistoryAction = 'push';
    }

    function queueNavigation(action) {
        const nextOperation = navigationChain.then(action);
        navigationChain = nextOperation.catch(() => {});
        return nextOperation;
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
        return queueNavigation(async () => {
            pendingHistoryAction = shouldPushToHistory ? 'push' : 'push';

            const page = await getBrowserPage();
            await page.goto(url);
            return page.url();
        });
    }

    async function navigateHistory(step) {
        return queueNavigation(async () => {
            const state = getBrowserState();
            const canTraverse = step < 0
                ? browserView.webContents.canGoBack()
                : browserView.webContents.canGoForward();

            if (!canTraverse) {
                return state.URL;
            }

            pendingHistoryAction = step < 0 ? 'back' : 'forward';

            if (step < 0) {
                browserView.webContents.goBack();
            } else {
                browserView.webContents.goForward();
            }

            return new Promise((resolve) => {
                const handleNavigation = (_event, nextUrl) => {
                    browserView.webContents.removeListener('did-navigate', handleNavigation);
                    browserView.webContents.removeListener('did-navigate-in-page', handleNavigation);
                    resolve(nextUrl);
                };

                browserView.webContents.on('did-navigate', handleNavigation);
                browserView.webContents.on('did-navigate-in-page', handleNavigation);
            });
        });
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

    function handleNavigated(nextUrl) {
        STORE.store_browser.setState({ URL: nextUrl });
        syncHistoryOnNavigation(nextUrl);
        mainWindow.webContents.send('browser:urlChanged', nextUrl);
    }

    browserView = new WebContentsView();
    browserView.webContents.loadURL(getBrowserState().URL);
    browserView.webContents.on('did-navigate', (_event, nextUrl) => {
        handleNavigated(nextUrl);
    });
    browserView.webContents.on('did-navigate-in-page', (_event, nextUrl) => {
        handleNavigated(nextUrl);
    });

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
    };
}

export { createBrowserTool };