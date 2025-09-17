import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { IconType } from 'react-icons';

interface Props{
    hover: string;
    Icon: IconType;
    href: string;
    value: string;
}

export const SideLink = ({Icon, href, value}:Props) => {
  return (
    <Link href={href} className="w-16 h-16 bg-white shadow-xl flex flex-col items-center justify-center transition-all duration-500 rounded-lg gap-1 hover:bg-blue-200">
        <span><Icon className="text-2xl"/></span>
        <span
            className={clsx(`transition-all duration-1000 max-sm:hidden text-sm`)}>
                {value}
        </span>
    </Link>
  )
}
