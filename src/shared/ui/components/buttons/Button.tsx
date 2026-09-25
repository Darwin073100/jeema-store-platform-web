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

// Tailwind solo genera una clase si el string completo aparece literal en el código fuente — con
// `bg-${color}-500` construido en runtime, colores poco usados en otros archivos (orange, teal...)
// nunca quedaban en el CSS final y el botón se veía sin fondo. Mapa estático para que cada clase
// exista como literal.
const colorClasses: Record<NonNullable<Props['color']>, { enabled: string; disabled: string }> = {
  blue: { enabled: 'bg-blue-500 hover:bg-blue-600', disabled: 'bg-blue-300 hover:bg-blue-300' },
  green: { enabled: 'bg-green-500 hover:bg-green-600', disabled: 'bg-green-300 hover:bg-green-300' },
  yellow: { enabled: 'bg-yellow-500 hover:bg-yellow-600', disabled: 'bg-yellow-300 hover:bg-yellow-300' },
  red: { enabled: 'bg-red-500 hover:bg-red-600', disabled: 'bg-red-300 hover:bg-red-300' },
  gray: { enabled: 'bg-gray-500 hover:bg-gray-600', disabled: 'bg-gray-300 hover:bg-gray-300' },
  purple: { enabled: 'bg-purple-500 hover:bg-purple-600', disabled: 'bg-purple-300 hover:bg-purple-300' },
  orange: { enabled: 'bg-orange-500 hover:bg-orange-600', disabled: 'bg-orange-300 hover:bg-orange-300' },
  teal: { enabled: 'bg-teal-500 hover:bg-teal-600', disabled: 'bg-teal-300 hover:bg-teal-300' },
  white: { enabled: 'bg-white hover:bg-gray-100', disabled: 'bg-gray-100 hover:bg-gray-100' },
}

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
  const { enabled, disabled: disabledClasses } = colorClasses[color]

  return (
    <button
      disabled = {!!disabled}
      className={twMerge(
        clsx(
          `cursor-pointer transition-all duration-500 flex justify-center items-center ${size==='sm'? 'rounded-md':'rounded-md'} shadow-sm hover:shadow-lg ${ color=='white'? 'text-black': 'text-white'}`,
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700',
          fullWidth && 'w-full',
          txt,
          `gap-${space} px-${space} py-${space}`,
          disabled ? disabledClasses : enabled,
          className // lo último para que pueda sobrescribir
        )
      )}
      {...props}
    >
      {children}
    </button>
  )
}
