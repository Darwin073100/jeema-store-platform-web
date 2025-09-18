import clsx from 'clsx'
import React from 'react'
import { ImSpinner, ImSpinner3, ImSpinner5, ImSpinner8, ImSpinner9 } from 'react-icons/im'
interface Props{
  color?: 'white'|'black'
}
export const Spinner = ({ color='white' }: Props) => {
  return (
    <>
        <ImSpinner8 className={clsx(`font-bold text-xl text-${color} animate-spin`)}/>
    </>
  )
}
