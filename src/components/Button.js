const Button = (props) => {
  let classes = "font-mono flex items-center justify-center"
  
  // Size
  if(props.size === "small") classes += " p-2 space-x-2 text-base"
  else if(props.size === "medium") classes += " p-3 space-x-3 text-2xl"
  else classes += " p-6 space-x-3 text-2xl"
  
  // Style
  if(props.style === "outline") classes += " border-2 border-purple-dark dark:border-lime"
  else classes += " bg-purple-dark text-lime dark:bg-lime dark:text-purple-dark"
  
  // Icon Position
  if(props.iconPosition === "left") classes += " flex-row-reverse space-x-reverse"
  else classes += " flex-row"
  
  // Icon Only
  if(props.icon && props.iconOnly) classes += " space-x-0"
  
  // Grow to fill container
  if(props.grow) classes += " w-full"

  const Icon = () => <span className={props.size === 'small' ? 'w-4 h-4' : 'w-6 h-6'}>{props.icon}</span>
  
  return(
    <>
      <button className={classes}>
        <span className={props.icon && props.iconOnly ? 'absolute left-[-999rem]' : ''}>{props.text}</span>
        <Icon />
      </button>
    </>
  )
}

export default Button