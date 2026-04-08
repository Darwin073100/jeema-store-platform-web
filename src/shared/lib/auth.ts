import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userWorkspaceAction } from "@/contexts/authentication-management/auth/presentation/actions/user-workspace.action";
import { validateAuthAction } from "@/contexts/authentication-management/auth/presentation/actions/validate-auth.action";
import { LoginAuthDTO } from "@/contexts/authentication-management/auth/application/dtos/login-auth.dto";
import { IUserWorkspace } from "@/contexts/authentication-management/auth/application/dtos/IUserWorkspace";

// Extender los tipos de NextAuth para incluir nuestros datos personalizados
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      roles: string[];
      permissions: string[];
      workspace: IUserWorkspace;
    }
  }

  interface User {
    id: string;
    roles: string[];
    permissions: string[];
    workspace: IUserWorkspace;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    permissions: string[];
    workspace: IUserWorkspace;
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

          // Obtener la información del workspace usando el accessToken
          const workspaceResult = await userWorkspaceAction();

          if (!workspaceResult.ok || !workspaceResult.value) {
            const errorMessage = workspaceResult.error?.message;
            const message = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage || "Error obteniendo información del workspace";
            console.error('❌ Error obteniendo workspace:', message);
            console.error('Error completo:', workspaceResult.error);
            throw new Error(message);
          }

          const workspace = workspaceResult.value;

          // Retornar el usuario con toda la información necesaria
          return {
            id: loginResult.value.userId.toString(),
            email: loginResult.value.email,
            username: loginResult.value.username,
            roles: loginResult.value.userRoles.map(item => item.role?.name ?? ''),
            permissions: loginResult.value.userRoles.flatMap(item => item.role?.rolePermissions.map(item => item.permission?.name ?? '') ?? ''),
            workspace,
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
      // Si el usuario acaba de loguearse, inyectamos los datos en el token
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.workspace = user.workspace;
      }
      return token;
    },

    async session({ session, token }) {
      // Hacemos que los datos del token estén disponibles en la sesión del cliente
      if (session.user) {
        session.user.id = token.id;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
        session.user.workspace = token.workspace;
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
    maxAge: 1 * 60 * 60, // 1 hora
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };