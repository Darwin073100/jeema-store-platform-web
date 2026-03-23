import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { IconType } from 'react-icons';

interface Props{
    hover: string;
    Icon: IconType;
    href: string;
    value: string;
    className?: string;
}

export const NavLink = ({Icon, href, value, className}:Props) => {
  return (
    <Link href={href} className={clsx(`px-4 py-1 flex flex-col items-center justify-center rounded-2xl gap-1 transition-all duration-300 cursor-pointer shadow hover:shadow-xl bg-white text-gray-700 border-2 border-white hover:bg-blue-200 hover:border-2 hover:border-blue-700`,
      className
    )}>
        <span><Icon className="text-xl"/></span>
        <span
            className={clsx(`transition-all duration-1000 max-sm:hidden text-sm`)}>
                {value}
        </span>
    </Link>
  )
}
