import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import './index.css'

import WindowIcon from "./components/Window Shell/WindowIcon.jsx";
import WindowTab from "./components/Window Shell/WindowTab.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div id="windowTopBar" className="flex bg-gray-400 [-webkit-app-region:drag]">
      <WindowIcon />
      <div className="flex [-webkit-app-region:no-drag]">
        <WindowTab tabName="Browser" ApproachLevel="0"/>
        <WindowTab tabName="Source" ApproachLevel="1"/>
        <WindowTab tabName="Terminal" ApproachLevel="2"/>
        <WindowTab tabName="Payload" ApproachLevel="3"/>
        <WindowTab tabName="Exploit" ApproachLevel="4"/>
      </div>
    </div>
    <div id="windowViewport">

    </div>
    </>
  )
}

export default App
