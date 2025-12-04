import "../shared/ui/styles/globals.css";
import { AuthProvider } from "@/shared/providers/auth-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
