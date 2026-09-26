import { useEffect, useRef } from 'react';
import * as STORE from '../../../store/STORE.js';
import { initTerminalTool } from '../../../common/terminalTool.ts';

const terminalTool = initTerminalTool();

function getPromptLabel(currentDirectory) {
    if (!currentDirectory) return 'PS >';
    return `PS ${currentDirectory}>`;
}

function renderOutputBlocks(outputBlocks, fallbackOutput) {
    if (!outputBlocks?.length) {
        return (
            <div className="m-2 rounded border border-white/9 bg-white/5 px-3 py-2 text-[#d7e8d1]">
                <pre className="whitespace-pre-wrap break-words">{fallbackOutput || 'Starting shell session...\n'}</pre>
            </div>
        );
    }

    return outputBlocks.map((block) => (
        <div
            key={block.id}
            className="m-2 rounded border border-green-950 px-3 py-2 text-[#d7e8d1]"
        >
            <pre className="whitespace-pre-wrap break-words">{block.text}</pre>
        </div>
    ));
}

function View2() {
    const activeSessionId = STORE.store_terminal((state) => state.activeSessionId);
    const sessionOrder = STORE.store_terminal((state) => state.sessionOrder);
    const sessions = STORE.store_terminal((state) => state.sessions);
    const setActiveSession = STORE.store_terminal((state) => state.setActiveSession);
    const setInput = STORE.store_terminal((state) => state.setInput);
    const appendOutput = STORE.store_terminal((state) => state.appendOutput);
    const outputRef = useRef(null);
    const inputRef = useRef(null);

    const activeSession = activeSessionId ? sessions[activeSessionId] : null;
    const output = activeSession?.output ?? '';
    const outputBlocks = activeSession?.outputBlocks ?? [];
    const status = activeSession?.status ?? 'idle';
    const input = activeSession?.input ?? '';
    const pid = activeSession?.pid ?? null;
    const currentDirectory = activeSession?.currentDirectory ?? '';
    const promptLabel = getPromptLabel(currentDirectory);

    useEffect(() => {
        if (sessionOrder.length > 0) return;

        terminalTool.createTerminalSession().catch((error) => {
            console.error(error);
        });
    }, [sessionOrder.length]);

    useEffect(() => {
        if (!outputRef.current) return;
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }, [output, activeSessionId]);

    useEffect(() => {
        if (status !== 'running') return;
        inputRef.current?.focus();
    }, [status, activeSessionId]);

    const handleCreateSession = () => {
        terminalTool.createTerminalSession().catch((error) => {
            console.error(error);
        });
    };

    const handleCloseSession = (sessionId) => {
        terminalTool.destroyTerminalSession(sessionId).catch((error) => {
            console.error(error);
        });
    };

    const submitCommand = async () => {
        if (!activeSessionId) return;

        const nextInput = input.trim();
        if (!nextInput) return;

        try {
            appendOutput(activeSessionId, `${promptLabel} ${nextInput}\n`, 'command');
            await terminalTool.writeToTerminal(activeSessionId, nextInput);
            setInput(activeSessionId, '');
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyDown = async (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        await submitCommand();
    };

    return (
        <div className="flex h-full flex-col bg-[#0c0c0c] text-[#d7e8d1]">
            <div className="flex items-center justify-between border-b border-green-900 px-3 py-2 text-sm">
                <span>Shell Terminal</span>
                <div className="flex items-center gap-2">
                    <span>Status: {status}{pid ? ` (pid ${pid})` : ''}</span>
                    <button
                        type="button"
                        onClick={handleCreateSession}
                        className="rounded border border-green-900 px-2 py-1 text-xs text-[#8fd48f]"
                    >
                        New Session
                    </button>
                </div>
            </div>
            <div className="flex gap-2 border-b border-green-950 px-3 py-2 text-xs">
                {sessionOrder.map((sessionId, index) => (
                    <div
                        key={sessionId}
                        className={`flex items-center gap-2 rounded border px-2 py-1 ${sessionId === activeSessionId ? 'border-green-500 bg-green-950/40 text-green-200' : 'border-green-900 text-green-400'}`}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveSession(sessionId)}
                            className="text-left"
                        >
                            {`Session ${index + 1}`}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCloseSession(sessionId)}
                            className="text-red-300"
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
            <div
                ref={outputRef}
                className="terminal-selectable flex-1 overflow-y-auto px-3 py-2 font-mono text-sm pl-[calc(env(safe-area-inset-left)+1vw]"
            >
                {renderOutputBlocks(outputBlocks, output)}
                {activeSessionId ? (
                    <div
                        className="m-2 flex items-center gap-2 whitespace-pre-wrap rounded border border-white/9 bg-white/3 px-3 py-2"
                        onClick={() => inputRef.current?.focus()}
                    >
                        <span className="shrink-0 text-[#8fd48f]">{promptLabel}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(event) => setInput(activeSessionId, event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-[#d7e8d1] outline-none bg-white/5 px-3 py-2 rounded border border-white/9"
                            spellCheck={false}
                            autoCapitalize="off"
                            autoComplete="off"
                            autoCorrect="off"
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default View2