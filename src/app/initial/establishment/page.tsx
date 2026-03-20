import { CreateEstablishmentForm } from "@/contexts/establishment-management/establishment/presentation/ui/CreateEstablishmentForm";
import Image from "next/image";
import Logo from "@/shared/ui/assets/images/logologo.png"

export const metadata = {
  title: 'Crear Establecimeinto'
}

export default async function () {

  return (
    <>
      <div className="flex w-full sm:flex-col md:flex-col lg:flex-col md:gap-2 justify-around items-center py-4">
        <div className="flex flex-col items-center">
          <Image className="2xl:w-[250px] 2xl:h-[250px] xl:w-[250px] xl:h-[250px] lg:w-[250px] lg:h-[250px] md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px] rounded-full"
            alt="logo" src={Logo} />
        </div>
        <CreateEstablishmentForm />
      </div>
    </>
  )
}
