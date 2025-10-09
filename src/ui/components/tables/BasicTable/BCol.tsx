import clsx from 'clsx';
import React from 'react'

interface Props{
    children?: any;
    className?: string;
}

const BCol = ({children, className}: Props) => {
  return (
    <td className={clsx(`px-6 py-4 font-medium`, className)}>
        {children}
    </td>
  )
}

export { BCol };
