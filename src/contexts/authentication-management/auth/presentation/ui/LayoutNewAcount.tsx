import React, { JSX } from 'react'
import { TemplateArea } from '../../../../../shared/ui/components/templates/TemplateArea'
import Logo from '@/presentation/assets/images/MagicLogo.png';
import Image from 'next/image'

interface Props {
    children: JSX.Element|string,
    title: string,
    subtitle: string
}

export const LayoutNewAcount = ({ children, title, subtitle }: Props) => {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Image 
        src={ Logo }
        alt='Logotipo'
        width={500}
        height={500}/>
      <TemplateArea className='w-3/4'>
        <div className='flex items-end gap-4 mb-2'>
          <h1 className='font-bold text-4xl'>{ title }</h1>
          <h2 className='font-bold text-2xl text-gray-700'>{ subtitle }</h2>
        </div>

        <>{ children }</>

      </TemplateArea>
    </div>
  )
}
