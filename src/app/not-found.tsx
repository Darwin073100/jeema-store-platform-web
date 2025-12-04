import Link from 'next/link';
import NotFoundImage from '@/shared/ui/assets/images/404.svg';
import Image from 'next/image';
import { ButtonOutLine } from '@/shared/ui/components/buttons/ButtonOutLine';
import { FcLink } from 'react-icons/fc';
 
export default function NotFound() {
  return (
    <main className='h-screen flex flex-col justify-center items-center bg-white'>
      <h2 className='text-3xl'>Página no encontrada</h2>
      <Image 
        src={ NotFoundImage}
        width={300}
        alt='NotFound' />
      <Link href="/">
        <ButtonOutLine><FcLink /> Click para ir al inicio</ButtonOutLine>
      </Link>
    </main>
  )
}