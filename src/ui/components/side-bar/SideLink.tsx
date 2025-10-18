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
    <Link href={href} className="w-[75px] h-[75px] bg-white flex flex-col items-center justify-center rounded-lg gap-1 transition-all duration-200 cursor-pointer shadow hover:shadow-xl">
        <span><Icon className="text-2xl"/></span>
        <span
            className={clsx(`transition-all duration-1000 max-sm:hidden text-sm`)}>
                {value}
        </span>
    </Link>
  )
}
