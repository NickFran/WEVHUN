import process from 'node:process';
import { spawn } from 'node:child_process';

const TERMINAL_CWD_MARKER = '__WEVHUN_CWD__';

function createTerminalToolMain({ app, sendEvent }) {
    let nextTerminalSessionId = 1;
    const terminalSessions = new Map();

    function emitTerminalData(sessionId, chunk) {
        sendEvent('terminal:data', { sessionId, chunk });
    }

    function emitTerminalStatus(sessionId, status) {
        sendEvent('terminal:status', { sessionId, status });
    }

    function emitTerminalExit(sessionId, code) {
        sendEvent('terminal:exit', { sessionId, code });
    }

    function emitTerminalCwd(sessionId, currentDirectory) {
        sendEvent('terminal:cwd', { sessionId, currentDirectory });
    }

    function getTerminalShellConfig() {
        if (process.platform === 'win32') {
            return {
                command: 'powershell.exe',
                args: ['-NoLogo'],
            };
        }

        return {
            command: process.env.SHELL || 'sh',
            args: [],
        };
    }

    function createTerminalRecord() {
        return {
            process: null,
            buffer: '',
            currentDirectory: app.getAppPath(),
            dataRemainder: '',
            pendingEchoes: [],
        };
    }

    function getTerminalStartupBanner(session) {
        return [
            'WEVHUN Shell Terminal',
            `Session root: ${session.currentDirectory}`,
            'Commands execute on the local machine running this Electron app.',
            '',
        ].join('\n');
    }

    function shouldSuppressTerminalLine(line, expectedCommand) {
        if (!line) return false;

        return line === expectedCommand || line.endsWith(`> ${expectedCommand}`);
    }

    function parseTerminalOutput(sessionId, chunk) {
        const session = terminalSessions.get(sessionId);
        if (!session) return '';

        const combinedOutput = `${session.dataRemainder}${chunk}`;
        const lines = combinedOutput.split(/\r?\n/);
        session.dataRemainder = lines.pop() ?? '';

        let visibleOutput = '';

        for (const line of lines) {
            if (line.startsWith(TERMINAL_CWD_MARKER)) {
                session.currentDirectory = line.slice(TERMINAL_CWD_MARKER.length).trim() || session.currentDirectory;
                emitTerminalCwd(sessionId, session.currentDirectory);
                continue;
            }

            const normalizedLine = line.trimEnd();
            const pendingEcho = session.pendingEchoes[0];

            if (pendingEcho && shouldSuppressTerminalLine(normalizedLine, pendingEcho)) {
                session.pendingEchoes.shift();
                continue;
            }

            visibleOutput += `${line}\n`;
        }

        return visibleOutput;
    }

    function flushTerminalRemainder(sessionId) {
        const session = terminalSessions.get(sessionId);
        if (!session || !session.dataRemainder) return '';

        if (session.dataRemainder.startsWith(TERMINAL_CWD_MARKER)) {
            session.currentDirectory = session.dataRemainder.slice(TERMINAL_CWD_MARKER.length).trim() || session.currentDirectory;
            emitTerminalCwd(sessionId, session.currentDirectory);
            session.dataRemainder = '';
            return '';
        }

        const remainder = session.dataRemainder;
        session.dataRemainder = '';
        return remainder;
    }

    function handleTerminalChunk(sessionId, chunk) {
        const session = terminalSessions.get(sessionId);
        if (!session) return;

        const parsedOutput = parseTerminalOutput(sessionId, chunk.toString());
        if (!parsedOutput) return;

        session.buffer += parsedOutput;
        emitTerminalData(sessionId, parsedOutput);
    }

    function getTerminalState(sessionId) {
        const session = terminalSessions.get(sessionId);
        if (!session) return null;

        return {
            sessionId,
            pid: session.process?.pid ?? null,
            output: session.buffer,
            currentDirectory: session.currentDirectory,
            status: session.process ? 'running' : 'stopped',
        };
    }

    function createTerminalSession() {
        const sessionId = `terminal-${nextTerminalSessionId++}`;
        const session = createTerminalRecord();
        const { command, args } = getTerminalShellConfig();

        session.buffer = getTerminalStartupBanner(session);
        session.process = spawn(command, args, {
            cwd: session.currentDirectory,
            env: process.env,
            stdio: 'pipe',
        });

        terminalSessions.set(sessionId, session);

        session.process.stdout.on('data', (chunk) => {
            handleTerminalChunk(sessionId, chunk);
        });

        session.process.stderr.on('data', (chunk) => {
            handleTerminalChunk(sessionId, chunk);
        });

        session.process.on('close', (code) => {
            const activeSession = terminalSessions.get(sessionId);
            if (!activeSession) return;

            const remainingOutput = flushTerminalRemainder(sessionId);
            if (remainingOutput) {
                activeSession.buffer += remainingOutput;
                emitTerminalData(sessionId, remainingOutput);
            }

            activeSession.process = null;
            activeSession.pendingEchoes = [];
            emitTerminalExit(sessionId, code);
            emitTerminalStatus(sessionId, 'stopped');
        });

        session.process.on('error', (error) => {
            const activeSession = terminalSessions.get(sessionId);
            if (!activeSession) return;

            const message = `${error.message}\n`;
            activeSession.buffer += message;
            emitTerminalData(sessionId, message);
        });

        emitTerminalStatus(sessionId, 'running');
        emitTerminalCwd(sessionId, session.currentDirectory);

        return getTerminalState(sessionId);
    }

    function destroyTerminalSession(sessionId) {
        const session = terminalSessions.get(sessionId);
        if (!session) return false;

        if (session.process) {
            session.process.kill();
        }

        terminalSessions.delete(sessionId);
        return true;
    }

    function writeTerminalInput(sessionId, input) {
        const session = terminalSessions.get(sessionId);
        if (!session?.process?.stdin.writable) return false;

        if (process.platform === 'win32') {
            const cwdCommand = `Write-Output "${TERMINAL_CWD_MARKER}$((Get-Location).Path)"`;
            session.pendingEchoes.push(input, cwdCommand);
            session.process.stdin.write(`${input}\n`);
            session.process.stdin.write(`${cwdCommand}\n`);
            return true;
        }

        const cwdCommand = `printf '${TERMINAL_CWD_MARKER}%s\\n' "$(pwd)"`;
        session.pendingEchoes.push(input, cwdCommand);
        session.process.stdin.write(`${input}\n`);
        session.process.stdin.write(`${cwdCommand}\n`);
        return true;
    }

    function resizeTerminalSession(sessionId, size) {
        void sessionId;
        void size;
        return true;
    }

    function registerIpc(ipcMain) {
        ipcMain.handle('terminal:createSession', () => {
            return createTerminalSession();
        });

        ipcMain.handle('terminal:destroySession', (_event, sessionId) => {
            return destroyTerminalSession(sessionId);
        });

        ipcMain.handle('terminal:write', (_event, sessionId, input) => {
            return writeTerminalInput(sessionId, input);
        });

        ipcMain.handle('terminal:resize', (_event, sessionId, size) => {
            return resizeTerminalSession(sessionId, size);
        });
    }

    return {
        registerIpc,
    };
}

export { createTerminalToolMain };