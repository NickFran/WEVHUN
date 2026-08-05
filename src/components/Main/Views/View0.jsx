import * as STORE from "../../../store/STORE.js";

import { useEffect, useRef, useState } from 'react'
import useTabStore from '../../../store/store_tab.js'

function View0() {
    const containerRef = useRef(null)
    const activeTab = useTabStore((state) => state.activeTab)
    const url = STORE.store_browser((state) => state.URL)
    const setURL = STORE.store_browser((state) => state.setURL)

    useEffect(() => {
        const reportBounds = () => {
            if (!containerRef.current || !window.browserTool) return
            const rect = containerRef.current.getBoundingClientRect()
            window.browserTool.setBounds(rect)
        }

        reportBounds()
        window.addEventListener('resize', reportBounds)
        return () => window.removeEventListener('resize', reportBounds)
    }, [activeTab])

    const handleNavigate = (e) => {
        e.preventDefault()
        window.browserTool?.navigate(url)
    }

    return (
        <div className="flex flex-col h-full">
            <form onSubmit={handleNavigate} className="flex gap-2 p-2 bg-gray-700">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setURL(e.target.value)}
                    className="flex-grow px-2 py-1 rounded bg-gray-800 text-gray-200 text-sm"
                />
                <button type="submit" className="px-3 py-1 rounded bg-gray-500 text-gray-200 text-sm">
                    Go
                </button>
            </form>
            <div ref={containerRef} className="flex-grow" />
        </div>
    );
}

export default View0