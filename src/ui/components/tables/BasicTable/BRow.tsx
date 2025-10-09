import clsx from 'clsx';
import React from 'react';
interface Props{
    children?: any;
    className?: string;
}

const BRow = ({children, className}: Props) => {
  return (
    <tr className={clsx(`bg-white border-b border-gray-100 hover:bg-gray-50 transition duration-150`, className)}>
      {children}
    </tr>
  )
}

export { BRow }
