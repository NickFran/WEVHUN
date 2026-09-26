import {create} from 'zustand';

function createSessionState(sessionId) {
	return {
		sessionId,
		output: '',
		outputBlocks: [],
		status: 'idle',
		pid: null,
		input: '',
		currentDirectory: '',
	};
}

function createOutputBlock(sessionId, blockCount, text, kind) {
	return {
		id: `${sessionId}-${blockCount + 1}`,
		text,
		kind,
	};
}

const store_terminal = create((set) => ({
	activeSessionId: null,
	sessionOrder: [],
	sessions: {},
	addSession: (session) => set((state) => {
		const sessionId = session.sessionId;
		const existing = state.sessions[sessionId] ?? createSessionState(sessionId);

		return {
			activeSessionId: state.activeSessionId ?? sessionId,
			sessionOrder: state.sessionOrder.includes(sessionId)
				? state.sessionOrder
				: [...state.sessionOrder, sessionId],
			sessions: {
				...state.sessions,
				[sessionId]: {
					...existing,
					...session,
				},
			},
		};
	}),
	removeSession: (sessionId) => set((state) => {
		const nextSessions = { ...state.sessions };
		delete nextSessions[sessionId];

		const nextOrder = state.sessionOrder.filter((id) => id !== sessionId);
		const nextActiveSessionId = state.activeSessionId === sessionId
			? (nextOrder[0] ?? null)
			: state.activeSessionId;

		return {
			activeSessionId: nextActiveSessionId,
			sessionOrder: nextOrder,
			sessions: nextSessions,
		};
	}),
	setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
	updateSession: (sessionId, patch) => set((state) => ({
		sessions: {
			...state.sessions,
			[sessionId]: {
				...(state.sessions[sessionId] ?? createSessionState(sessionId)),
				...patch,
			},
		},
	})),
	appendOutput: (sessionId, chunk, kind = 'output') => set((state) => {
		const currentSession = state.sessions[sessionId] ?? createSessionState(sessionId);
		const outputBlocks = [...currentSession.outputBlocks];
		const lastBlock = outputBlocks[outputBlocks.length - 1];

		if (!lastBlock || lastBlock.kind !== kind || kind === 'command') {
			outputBlocks.push(createOutputBlock(sessionId, outputBlocks.length, chunk, kind));
		} else {
			outputBlocks[outputBlocks.length - 1] = {
				...lastBlock,
				text: `${lastBlock.text}${chunk}`,
			};
		}

		return {
			sessions: {
				...state.sessions,
				[sessionId]: {
					...currentSession,
					output: `${currentSession.output}${chunk}`,
					outputBlocks,
				},
			},
		};
	}),
	setInput: (sessionId, input) => set((state) => ({
		sessions: {
			...state.sessions,
			[sessionId]: {
				...(state.sessions[sessionId] ?? createSessionState(sessionId)),
				input,
			},
		},
	})),
}));

export default store_terminal