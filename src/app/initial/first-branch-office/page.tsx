import Logo from "@/shared/ui/assets/images/logologo.png"
import { CreateBranchForm } from "@/contexts/establishment-management/branch-office/presentation/ui/CreateBranchForm"
import Image from "next/image"

export const metadata = {
  title: 'Crear Sucursal'
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
              !Excelente¡ Ahora es momento de ingresa la información para dar de alta
              tu sucursal inicial.
            </h1>
          </div>
        </div>
        <CreateBranchForm />
      </div>
    </>
  )
}