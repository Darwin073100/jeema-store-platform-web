'use client'

import React from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' |'white' | 'orange' | 'teal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fullWidth?: boolean; // ⬅️ nuevo prop
  className?: string;
  disabled?: boolean;
}

const sizeConfig = {
  sm: { txt: 'text-sm', space: 1 },
  md: { txt: 'text-base', space: 2 },
  lg: { txt: 'text-lg', space: 4 },
  xl: { txt: 'text-xl', space: 6 },
  '2xl': { txt: 'text-2xl', space: 8 },
} as const

export function Button({
  children,
  color = 'blue',
  size = 'md',
  className,
  fullWidth = false,
  disabled = false,
  ...props
}: Props) {
  const { txt, space } = sizeConfig[size]

  return (
    <button
      disabled = {!!disabled}
      className={twMerge(
        clsx(
          `cursor-pointer transition-all duration-500 flex justify-center items-center ${size==='sm'? 'rounded-lg':'rounded-xl'} shadow-sm hover:shadow-lg ${ color=='white'? 'text-black': 'text-white'}`,
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
          fullWidth && 'w-full',
          txt,
          `gap-${space} px-${space} py-${space}`,
          `bg-${color}-500 hover:bg-${color}-600`,
          `${!!disabled? `bg-${color}-300`: ''}`,
          className // lo último para que pueda sobrescribir
        )
      )}
      {...props}
    >
      {children}
    </button>
  )
}
