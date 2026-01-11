import clsx from 'clsx';
import React from 'react';
interface Props{
    children?: any;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLTableRowElement> | undefined
}

const PRow = ({children, className, onClick}: Props) => {
  return (
    <tr onClick={onClick} className={clsx(`border-b border-gray-100 hover:bg-gray-50 transition duration-150`, className)}>
      {children}
    </tr>
  )
}

export { PRow }
