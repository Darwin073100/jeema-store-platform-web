'use client'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { ImSpinner, ImSpinner3, ImSpinner5, ImSpinner8, ImSpinner9 } from 'react-icons/im'
interface Props{
  color?: 'white'|'black' | 'gray',
  size?: number,
  className?: string,
}
export const Spinner = ({ color='white', size=14, className }: Props) => {
  const [colorState, setColorState]=React.useState('');
  useEffect(()=>{
    if(color === 'black'){
      setColorState(color);
    } else if(color === 'white'){
      setColorState(color);
    } else {
      setColorState(`${color}-500`);
    }
  }, [color]);
  return (
    <>
        <ImSpinner8 className={clsx(`font-bold text-xl text-${colorState} animate-spin`, className)} size={size}/>
    </>
  )
}
