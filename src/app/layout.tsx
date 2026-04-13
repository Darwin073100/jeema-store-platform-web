import "src/shared/ui/styles/globals.css";
import { AuthProvider } from "@/shared/presentation/providers/auth-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`antialiased bg-gradient-to-br from-blue-50 to-indigo-100`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
