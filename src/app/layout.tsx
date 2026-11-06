import { authOptions } from '@/shared/lib/auth';
import { AuthProvider } from '@/shared/ui/providers/auth-provider';
import { getServerSession } from 'next-auth';
import 'reflect-metadata';
import "src/shared/ui/styles/globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sesión inicial desde el servidor: evita el estado "loading" de useSession al recargar la página.
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`antialiased bg-gray-50`} >
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
