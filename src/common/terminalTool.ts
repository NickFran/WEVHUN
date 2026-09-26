import * as STORE from "../store/STORE.js";

let hasBoundListeners = false;

function initTerminalTool() {
    const terminalStore = STORE.store_terminal;

    if (!hasBoundListeners) {
        window.terminalTool?.onData(({ sessionId, chunk }) => {
            terminalStore.getState().appendOutput(sessionId, chunk);
        });

        window.terminalTool?.onExit(({ sessionId, code }) => {
            terminalStore.getState().appendOutput(sessionId, `\n[terminal exited with code ${code}]\n`);
            terminalStore.getState().updateSession(sessionId, {
                status: 'stopped',
                pid: null,
            });
        });

        window.terminalTool?.onStatus(({ sessionId, status }) => {
            terminalStore.getState().updateSession(sessionId, { status });
        });

        window.terminalTool?.onCurrentDirectoryChanged(({ sessionId, currentDirectory }) => {
            terminalStore.getState().updateSession(sessionId, { currentDirectory });
        });

        hasBoundListeners = true;
    }

    async function createTerminalSession() {
        const session = await window.terminalTool?.createSession();

        if (!session) return null;

        terminalStore.getState().addSession(session);
        terminalStore.getState().setActiveSession(session.sessionId);

        return session;
    }

    async function destroyTerminalSession(sessionId: string) {
        const didDestroy = await window.terminalTool?.destroySession(sessionId);
        if (didDestroy) {
            terminalStore.getState().removeSession(sessionId);
        }
        return didDestroy;
    }

    async function writeToTerminal(sessionId: string, input: string) {
        return window.terminalTool?.write(sessionId, input);
    }

    async function handleResize(sessionId: string, size: { cols?: number; rows?: number }) {
        return window.terminalTool?.resize(sessionId, size);
    }

    return {
        createTerminalSession,
        destroyTerminalSession,
        handleResize,
        writeToTerminal,
    };
}

export { initTerminalTool };