import * as STORE from "../../../store/STORE.js";
import { useEffect, useRef } from 'react'
import Button from "../parts/Button.jsx";

function View0() {
    const containerRef = useRef(null)
    const activeTab = STORE.store_tab((state) => state.activeTab)
    const url = STORE.store_browser((state) => state.URL)
    const setDisplayURL = STORE.store_browser((state) => state.setDisplayURL)

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

    const handleNavigate = async (e) => {
        e.preventDefault()
        const nextUrl = await window.browserTool?.navigate(url)
        if (nextUrl) setDisplayURL(nextUrl)
    }

    return (
        <div className="flex flex-col h-full">
            <form onSubmit={handleNavigate} className="flex gap-2 p-2 bg-gray-700">
                <Button TextContent="test" IconPath="arrow-left.svg" Type="icon" onClick={() => {
                    console.log("Clicked!");
                    window.browserTool?.URLHistoryBack().then((nextUrl) => {
                        if (nextUrl) setDisplayURL(nextUrl)
                    });
                    }} />
                <Button TextContent="test" IconPath="arrow-right.svg" Type="icon" onClick={() => {
                    console.log("Clicked!");
                    window.browserTool?.URLHistoryForward().then((nextUrl) => {
                        if (nextUrl) setDisplayURL(nextUrl)
                    });
                    }} />
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setDisplayURL(e.target.value)}
                    className="flex-grow px-2 py-1 rounded bg-gray-800 text-gray-200 text-sm"
                />
                <Button TextContent="Go" IconPath="search.svg" IconSide="right" Type="texticon" isubmit={true} onClick={() => {
                    console.log("Clicked!");
                    window.browserTool?.URLHistoryPush(url);
                    }} />
            </form>
            <div ref={containerRef} className="flex-grow" />
        </div>
    );
}

export default View0