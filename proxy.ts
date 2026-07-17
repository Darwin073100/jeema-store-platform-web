import { withAuth } from "next-auth/middleware";
import { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    // Aquí puedes agregar lógica adicional de autorización
    // Por ejemplo, verificar roles o permisos específicos
    
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Permitir acceso a páginas de autenticación
    if (pathname.startsWith("/auth/")) {
      return;
    }

    // Verificar si el usuario tiene los permisos necesarios para ciertas rutas
    if (pathname.startsWith("/admin/")) {
      const user = token?.user as { roles?: string[] } | undefined;
      const hasAdminRole = user?.roles?.includes("ADMIN");
      if (!hasAdminRole) {
        return Response.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Aquí puedes agregar más lógica de autorización según tus necesidades
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Permitir acceso a rutas públicas
        if (pathname.startsWith("/auth/") || pathname === "/") {
          return true;
        }
        
        // Requerir autenticación para rutas protegidas
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - api (rutas API)
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * - public (archivos públicos)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
