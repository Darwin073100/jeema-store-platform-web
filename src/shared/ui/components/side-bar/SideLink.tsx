'use client'
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
    <Link href={href} className="text-gray-700 w-[75px] h-[75px] bg-white transition-all duration-300 flex flex-col items-center justify-center rounded-2xl gap-1 cursor-pointer shadow hover:shadow-xl border-2 border-white hover:bg-blue-200 hover:border-2 hover:border-blue-700">
        <span><Icon className="text-2xl"/></span>
        <span
            className={clsx(`transition-all duration-1000 max-sm:hidden text-sm`)}>
                {value}
        </span>
    </Link>
  )
}
