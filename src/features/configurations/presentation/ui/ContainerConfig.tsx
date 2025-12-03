import React, { ReactNode } from 'react'
interface Props{
    children?: any
}
const ContainerConfig = ({ children }:Props) => {
  return (
    <div className="grid grid-cols-8 max-xl:grid-cols-6 max-lg:grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-1 max-sm:justify-items-center">
      {children}
    </div>
  )
}

export { ContainerConfig };
