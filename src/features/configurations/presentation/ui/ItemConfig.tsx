import Link from 'next/link';
import React from 'react'
interface Props {
  children?: any[],
  link: string
}
const ItemConfig = ({ children, link }: Props) => {
  return (
    <Link href={link} className='w-full'>
      <div className="w-full flex flex-col items-center justify-center bg-white p-4 max-sm:flex-row max-sm:gap-2 max-sm:justify-start max-sm:items-center max-sm:w-full transition-all duration-200 cursor-pointer shadow hover:shadow-xl  rounded-2xl hover:bg-blue-200 border-2 border-white hover:border-2 hover:border-blue-700">
        {children}
      </div>
    </Link>
  )
}

export { ItemConfig };
