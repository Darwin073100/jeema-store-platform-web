import clsx from 'clsx'
import React from 'react'
interface Props{
    children?: React.ReactNode
      color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange'        // ⬅️ nuevo prop
      className?: string
}
const AlertMessage = ({ children, className, color='blue'}:Props) => {
  return (
    <div className={clsx(`p-5 bg-${color}-50 border-l-4 border-${color}-400 text-${color}-800 rounded-md`, className)}>
        {children}
    </div>
  )
}

export {AlertMessage}
