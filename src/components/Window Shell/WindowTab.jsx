function WindowTab({ tabName, ApproachLevel }) {
    const builtTabInstanceFilePath = `../../media/tabIcon_${ApproachLevel}.png`;

  return (
    // 1. The main tab container (already has "group")
    <div className="
    group flex items-center gap-2 px-3 py-1.5 mt-2 mr-[2px] bg-gray-600 
    hover:bg-gray-300 border-x border-t border-gray-400 rounded-t-md cursor-pointer min-w-[160px] max-w-[240px] transition-colors">
        
        {/* 2. The Favicon */}
        <img 
          src={builtTabInstanceFilePath}
          alt="Icon" 
          className="w-10 h-7 shrink-0 rounded-sm object-cover"
        />
        
        {/* 3. The Tab Title - ADDED group-hover:text-gray-900 HERE */}
        <h2 className="text-xs font-medium text-gray-200 group-hover:text-gray-900 truncate flex-grow text-left select-none transition-colors">
            {tabName}
        </h2>
        
    </div>
  )
}

export default WindowTab