import type { Metadata } from "next";
import "../../shared/ui/styles/globals.css";
import { NavBar } from "@/shared/ui/components/nav-bar/NavBar";
import { SideBar } from "@/shared/ui/components/side-bar/SideBar";
import { SideBarMovile } from "@/shared/ui/components/side-bar/SideBarMovile";

export const metadata: Metadata = {
  title: "JEEMA Platform",
  description: "Plataforma para control de inventarios y ventas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavBar/>
        <main className="flex py-4">
          <SideBar />
          <SideBarMovile />
          {children}
        </main>
      </body>
    </html>
  );
}
