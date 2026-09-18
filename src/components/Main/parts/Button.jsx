function Button({onClick, Type, TextContent, IconPath, IconSide, isubmit}) {
    // 3 button types, Text, Icon, Text+Icon
    // isubmit is used so that this component doesnt auto sumbit forms when used inside a form. If you want to submit a form, use a regular <button> element instead.
    if (isubmit === undefined) isubmit = false;

    const baseStyle = `px-3 py-1 rounded bg-gray-500 text-gray-200 text-sm 
        hover:bg-gray-200 hover:text-gray-900
        active:bg-gray-100 active:text-gray-800 active:scale-90 transition-all duration-150`

    if (!TextContent && !IconPath) {
        console.error("Button component requires at least one of TextContent or IconPath props.")
        return null
    }
    if (IconPath && Type.toLowerCase() === "texticon" && !["left", "right"].includes(IconSide)) {
        console.error("Button component requires IconSide prop to be either 'left' or 'right' when IconPath is provided.")
        return null
    }
    if (Type && !["text", "icon", "texticon"].includes(Type.toLowerCase())) {
        console.error("Button component requires Type prop to be either 'text', 'icon', or 'texticon' when provided.")
        return null
    }

    const TextButton = (
        <button 
        type={isubmit ? "submit" : "button"} 
        className={baseStyle}
        onClick={onClick}>{TextContent}</button>
    );

    const IconButton = (
        <button 
        type={isubmit ? "submit" : "button"} 
        className={`${baseStyle} flex items-center justify-center`}
        onClick={onClick}><img src={`../../../../media/${IconPath}`} alt="" width={'20px'} /></button>
    );

    const TextIconButton = (
        <button
        type={isubmit ? "submit" : "button"} 
        className={`${baseStyle} flex items-center justify-center gap-2`}
        onClick={onClick}>
            {IconSide === "left" && IconPath && <img src={`../../../../media/${IconPath}`} alt="" className="mr-1" />}
            {TextContent}
            {IconSide === "right" && IconPath && <img src={`../../../../media/${IconPath}`} alt="" className="ml-1" />}
        </button>
    );

    let buttonToRender;
    switch (Type?.toLowerCase()) {
        case "text":
            buttonToRender = TextButton;
            break;
        case "icon":
            buttonToRender = IconButton;
            break;
        case "texticon":
            buttonToRender = TextIconButton;
            break;
        default:
            buttonToRender = TextButton;
    }

    return buttonToRender;
}

export default Button