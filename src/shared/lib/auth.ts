import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateAuthAction } from "@/contexts/authentication-management/auth/presentation/actions/validate-auth.action";
import { LoginAuthDTO } from "@/contexts/authentication-management/auth/application/dtos/login-auth.dto";

// NOTA: El JWT siempre debe contener pocos caracteres ya que hya una capacidad maxima.

// Extender los tipos de NextAuth para incluir nuestros datos personalizados
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      roles: string[];
      permissions: string[];
    }
  }

  interface User {
    id: string;
    roles: string[];
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    permissions: string[];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales requeridas");
        }

        try {
          // Usar tu action existente para el login
          const loginDTO: LoginAuthDTO = {
            email: credentials.email,
            password: credentials.password,
          };

          const loginResult = await validateAuthAction(loginDTO);

          if (!loginResult.ok || !loginResult.value) {
            const errorMessage = loginResult.error?.message;
            const message = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage || "Error en el login";
            console.error('❌ Error en login:', message);
            throw new Error(message);
          }

          return {
            id: loginResult.value.userId.toString(),
            email: loginResult.value.email,
            username: loginResult.value.username,
            roles: loginResult.value.userRoles.map(item => item.role?.name ?? ''),
            permissions: loginResult.value.userRoles.flatMap(item => item.role?.rolePermissions.map(item => item.permission?.name ?? '') ?? ''),
          };
        } catch (error) {
          console.error("Error en autorización:", error);
          throw new Error(error instanceof Error ? error.message : "Error de autenticación");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Si el usuario acaba de loguearse, inyectar solo datos esenciales
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
        // NO incluir workspace aquí para mantener el token pequeño
      }
      return token;
    },

    async session({ session, token }) {
      // Hacemos que los datos del token estén disponibles en la sesión del cliente
      if (session.user) {
        session.user.id = token.id;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
        // Workspace se cargará mediante useAuth hook (lazy loading)
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", 
  },
  session: {
    strategy: "jwt",
    // maxAge: 1 * 60 * 60, // 1 hora
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };