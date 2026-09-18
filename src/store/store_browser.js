import {create} from 'zustand';

const store_browser = create((set) => ({
    URL:"https://google.com",
    setDisplayURL: (URL) => set({ URL }),
    URLHistoryStack: [],
    URLHistoryStackPointer: 0,
}));

export default store_browser