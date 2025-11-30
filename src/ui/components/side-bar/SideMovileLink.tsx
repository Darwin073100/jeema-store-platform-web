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

export const SideMovileLink = ({Icon, href, value}:Props) => {
  return (
    <Link href={href} className="bg-white flex py-2 px-4 items-center justify-start rounded-lg gap-1 transition-all duration-200 cursor-pointer shadow-xl">
        <span><Icon className="text-2xl"/></span>
        <span
            className={clsx(`transition-all duration-1000 text-sm`)}>
                {value}
        </span>
    </Link>
  )
}
