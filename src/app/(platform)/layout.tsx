import { LayoutContent } from "./layout-content";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutContent>
      {children}
    </LayoutContent>
  );
}
