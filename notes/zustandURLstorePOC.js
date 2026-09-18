import { create } from 'zustand';

export const store_browser = create((set) => ({
  // State
  URL: "https://google.com",
  URLHistoryStack: ["https://google.com"], // Seeded so index 0 exists
  URLHistoryStackPointer: 0,

  // Action: User types in URL bar or clicks a link
  navigate: (newUrl) => set((state) => {
    // 1. Truncate any "forward" history beyond the current pointer
    const activeHistory = state.URLHistoryStack.slice(0, state.URLHistoryStackPointer + 1);
    
    // 2. Append new URL and update pointer to the top of stack
    const updatedStack = [...activeHistory, newUrl];
    
    return {
      URL: newUrl,
      URLHistoryStack: updatedStack,
      URLHistoryStackPointer: updatedStack.length - 1,
    };
  }),

  // Action: Back button
  goBack: () => set((state) => {
    // Prevent going back if already at the first page
    if (state.URLHistoryStackPointer <= 0) return state;

    const prevPointer = state.URLHistoryStackPointer - 1;
    return {
      URLHistoryStackPointer: prevPointer,
      URL: state.URLHistoryStack[prevPointer],
    };
  }),

  // Action: Forward button
  goForward: () => set((state) => {
    // Prevent going forward if already at the newest page
    if (state.URLHistoryStackPointer >= state.URLHistoryStack.length - 1) return state;

    const nextPointer = state.URLHistoryStackPointer + 1;
    return {
      URLHistoryStackPointer: nextPointer,
      URL: state.URLHistoryStack[nextPointer],
    };
  }),
}));