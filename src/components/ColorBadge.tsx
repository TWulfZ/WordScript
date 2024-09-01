import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  color?: TailwindColor
}

const ColorBadge = ({ children, className, color = 'blue' }: Props) => {
  console.log(color);
  
  return (
    <span className={`bg-${color}-100 text-${color}-800 text-xsfont-medium me-2 px-1.5 pb-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300 ${className}`}>{children}</span>
  )
}

export default ColorBadge
