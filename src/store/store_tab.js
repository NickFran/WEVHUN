import { create } from 'zustand'

const useTabStore = create((set) => ({
  activeTab: 0,
  setActiveTab: (tab) => set({ activeTab: tab }),
}))

export default useTabStore