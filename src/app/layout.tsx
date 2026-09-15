import { AuthProvider } from '@/shared/ui/providers/auth-provider';
import 'reflect-metadata';
import "src/shared/ui/styles/globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-gradient-to-br from-blue-50 to-indigo-100`} >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
