import { CreateEstablishmentForm } from "@/contexts/establishment-management/establishment/presentation/ui/CreateEstablishmentForm";
import Image from "next/image";
import Logo from "@/shared/ui/assets/images/logologo.png"

export const metadata = {
  title: 'Crear Establecimeinto'
}

export default async function () {

  return (
    <>
      <div className="flex flex-col w-full md:gap-2 justify-around items-center py-4">
        <div className="flex flex-col items-center">
          <Image className="w-[250px] max-2xl:w-[250px] max-xl:w-[250px] max-lg:w-[250px] max-md:w-[200px] rounded-full"
            alt="logo" src={Logo} />
        </div>
        <CreateEstablishmentForm />
      </div>
    </>
  )
}
