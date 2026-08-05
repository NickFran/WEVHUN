import { create } from 'zustand'

const store_tab = create((set) => ({
  activeTab: 0,
  setActiveTab: (tab) => set({ activeTab: tab }),
}))

export default store_tab