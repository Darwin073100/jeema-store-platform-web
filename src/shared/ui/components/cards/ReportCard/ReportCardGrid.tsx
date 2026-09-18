import React from 'react'
interface ReportCardGridProps {
    children?: React.ReactNode
}
export const ReportCardGrid = ({children}: ReportCardGridProps) => {
  return (
    <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 my-4">
        {children}
    </section>
  )
}
