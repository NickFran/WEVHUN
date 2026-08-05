import {create} from 'zustand';

const store_browser = create((set) => ({
    URL:"https://google.com",
    setURL: (URL) => set({URL: URL})
}))

export default store_browser