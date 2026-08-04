import useTabStore from "../../store/store_tab.js";

function WindowTab({ tabName, ApproachLevel, onClick}) {
    const builtTabInstanceFilePath = `../../media/tabIcon_${ApproachLevel}.png`;
    const activeTab = useTabStore((state) => state.activeTab);
    const isActive = activeTab === Number(ApproachLevel);

  return (
    // 1. The main tab container (already has "group")
    <div 
    onClick={onClick}
    className={`
    group flex items-center gap-2 px-3 py-1 mt-2 mr-[2px] border-x border-t border-gray-400 rounded-t-md cursor-pointer min-w-[140px] max-w-[240px] transition-colors
    ${isActive ? 'bg-gray-100' : 'bg-gray-600 hover:bg-gray-300'}`}>
        
        {/* 2. The Favicon */}
        <img 
          src={builtTabInstanceFilePath}
          alt="Icon" 
          className="w-9 h-7 shrink-0 rounded-sm object-cover"
        />
        
        {/* 3. The Tab Title - ADDED group-hover:text-gray-900 HERE */}
        <h2 className={`text-xs font-medium truncate flex-grow text-left select-none transition-colors group-hover:text-gray-900 ${isActive ? 'text-gray-900' : 'text-gray-200'}`}>
            {tabName}
        </h2>
        
    </div>
  )
}

export default WindowTab