'use client'

import React from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' |'amber' | 'teal'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  fullWidth?: boolean           // ⬅️ nuevo prop
  className?: string
}

const sizeConfig = {
  sm: { txt: 'text-sm', space: 1 },
  md: { txt: 'text-base', space: 2 },
  lg: { txt: 'text-lg', space: 4 },
  xl: { txt: 'text-xl', space: 6 },
  '2xl': { txt: 'text-2xl', space: 8 },
} as const

// Mismo problema que Button.tsx: `text-${color}-600` construido en runtime nunca queda en el CSS
// final para colores que no aparecen como literal en otro archivo. Mapa estático.
const colorClasses: Record<NonNullable<Props['color']>, string> = {
  blue: 'text-blue-600 hover:text-blue-950',
  green: 'text-green-600 hover:text-green-950',
  yellow: 'text-yellow-600 hover:text-yellow-950',
  red: 'text-red-600 hover:text-red-950',
  gray: 'text-gray-600 hover:text-gray-950',
  purple: 'text-purple-600 hover:text-purple-950',
  amber: 'text-amber-600 hover:text-amber-950',
  teal: 'text-teal-600 hover:text-teal-950',
}

export function ButtonOutLine({
  children,
  color = 'blue',
  size = 'md',
  className,
  fullWidth = false,
  ...props
}: Props) {
  const { txt, space } = sizeConfig[size]

  return (
    <button
      className={twMerge(
        clsx(
          `cursor-pointer transition-all duration-500 flex justify-center items-center ${size==='sm'? 'rounded-md':'rounded-md'} shadow-sm hover:shadow-lg bg-white`,
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700',
          fullWidth && 'w-full',
          txt,
          `gap-${space} px-${space} py-${space}`,
          colorClasses[color],
          className // lo último para que pueda sobrescribir
        )
      )}
      {...props}
    >
      {children}
    </button>
  )
}
