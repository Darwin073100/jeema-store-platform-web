import React from "react"

interface Props {
  Icon?: any,
  value: string,
  children?: React.ReactNode
}

export const ConfigurationContainer = ({ value, Icon, children}: Props) => {
  return (
    <div className="w-full">
      <div className="flex gap-4 items-center mt-4">
        <Icon className="text-xl" />
        <h2 className="text-lg">{value}</h2>
      </div>
      {children}
    </div>
  )
}
