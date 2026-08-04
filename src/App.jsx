import './App.css'
import './index.css'

import useTabStore from "./store/store_tab.js";
import WindowIcon from "./components/Window Shell/WindowIcon.jsx";
import WindowTab from "./components/Window Shell/WindowTab.jsx";
import View0 from "./components/Main/Views/View0.jsx";
import View1 from "./components/Main/Views/View1.jsx";
import View2 from "./components/Main/Views/View2.jsx";
import View3 from "./components/Main/Views/View3.jsx";
import View4 from "./components/Main/Views/View4.jsx";

function App() {
  const activeTab = useTabStore((state) => state.activeTab)
  const setActiveTab = useTabStore((state) => state.setActiveTab)

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
    <div id="windowViewport">
      <div className={activeTab === 0 ? '' : 'hidden'}><View0 /></div>
      <div className={activeTab === 1 ? '' : 'hidden'}><View1 /></div>
      <div className={activeTab === 2 ? '' : 'hidden'}><View2 /></div>
      <div className={activeTab === 3 ? '' : 'hidden'}><View3 /></div>
      <div className={activeTab === 4 ? '' : 'hidden'}><View4 /></div>
    </div>
    </>
  )
}

export default App
