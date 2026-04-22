import Logo from "@/shared/ui/assets/images/logologo.png"
import Image from "next/image"
import { InitAcountForm } from "@/contexts/authentication-management/auth/presentation/ui/InitAcountForm"

export const metadata = {
  title: 'Crear usuario'
}

export default async function () {

  return (
    <>
      <div className="flex w-full flex-col md:gap-2 justify-around items-center p-4">
        <div className="flex flex-col items-center">
          <Image className="w-[250px] max-2xl:w-[250px] max-xl:w-[250px] max-lg:w-[250px] max-md:w-[200px] rounded-full"
            alt="logo" src={Logo} />
          <div className="w-full">
            <h1 className="text-lg text-center text-gray-700">
              !Excelente¡ Llegó el momento de dar de alta el usuario con el que por fin podras utilizar la aplicación.
            </h1>
          </div>
        </div>
        <InitAcountForm/>
      </div>
    </>
  )
}