import * as STORE from "./store/STORE.js";

import './App.css'
import './index.css'
import { useEffect } from 'react'

import WindowIcon from "./components/Window Shell/WindowIcon.jsx";
import WindowTab from "./components/Window Shell/WindowTab.jsx";
import View0 from "./components/Main/Views/View0.jsx";
import View1 from "./components/Main/Views/View1.jsx";
import View2 from "./components/Main/Views/View2.jsx";
import View3 from "./components/Main/Views/View3.jsx";
import View4 from "./components/Main/Views/View4.jsx";

function App() {
  const activeTab = STORE.store_tab((state) => state.activeTab)
  const setActiveTab = STORE.store_tab((state) => state.setActiveTab)

  useEffect(() => {
    window.browserTool?.setActive(activeTab === 0)
  }, [activeTab])

  return (
    <>
    <div id="windowTopBar" className="flex bg-gray-400 [-webkit-app-region:drag]">
      <WindowIcon />
      <div className="flex [-webkit-app-region:no-drag]">
        <WindowTab tabName="Browser" ApproachLevel="0" onClick={() => setActiveTab(0)} />
        <WindowTab tabName="Source" ApproachLevel="1" onClick={() => setActiveTab(1)} />
        <WindowTab tabName="Terminal" ApproachLevel="2" onClick={() => setActiveTab(2)} />
        <WindowTab tabName="Payload" ApproachLevel="3" onClick={() => setActiveTab(3)} />
        <WindowTab tabName="Exploit" ApproachLevel="4" onClick={() => setActiveTab(4)} />
      </div>
    </div>
    <div id="windowViewport" className="h-[calc(100vh-3rem)]">
      <div className={activeTab === 0 ? 'h-full' : 'hidden'}><View0 /></div>
      <div className={activeTab === 1 ? 'h-full' : 'hidden'}><View1 /></div>
      <div className={activeTab === 2 ? 'h-full' : 'hidden'}><View2 /></div>
      <div className={activeTab === 3 ? 'h-full' : 'hidden'}><View3 /></div>
      <div className={activeTab === 4 ? 'h-full' : 'hidden'}><View4 /></div>
    </div>
    </>
  )
}

export default App
