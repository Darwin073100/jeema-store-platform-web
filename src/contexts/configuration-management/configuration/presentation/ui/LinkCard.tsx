import Link from 'next/link';

interface Props {
  children?: any[],
  link: string,
  Icon?: any,
  //TODO: Pendiente implementar, soporte para iconos e imagenes.
  picture?: string,
  value: string
}

const LinkCard = ({ link, Icon, picture, value }: Props) => {
  return (
    <Link href={link} className='w-full'>
      <div className="w-full flex flex-col items-center justify-center bg-white p-4 max-sm:flex-row max-sm:gap-2 max-sm:justify-start max-sm:items-center max-sm:w-full transition-all duration-200 cursor-pointer shadow hover:shadow-xl  rounded-2xl hover:bg-blue-200 border-2 border-white hover:border-2 hover:border-blue-700">
        <Icon className="w-[50px] h-[50px] max-sm:h-[30px] max-sm:w-[30px]" />
        <span className='text-center'>{value}</span>
      </div>
    </Link>
  )
}

export { LinkCard };
