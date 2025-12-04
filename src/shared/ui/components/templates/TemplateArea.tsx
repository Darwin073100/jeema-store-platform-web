import clsx from 'clsx'
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children?: any,
}

export const TemplateArea = ({ children, ...props }:Props ) => {
  return (
    <div className={ clsx(`bg-white shadow-2xl rounded-xl p-4 py-4 ${props.className}` ) } >
        { children }
    </div>
  )
}
