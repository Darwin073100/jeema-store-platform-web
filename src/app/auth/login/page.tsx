import { Login } from "@/contexts/authentication-management/auth/presentation/ui/Login"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Pagina para validar credenciales del usuario para JEEMA."
}

export default function () {
  return (
    <>
      <Login />
    </>
  )
}
