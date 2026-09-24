'use client';

import { NavBar } from "@/shared/ui/components/nav-bar/NavBar";
import { SideBar } from "@/shared/ui/components/side-bar/SideBar";
import { SideBarMovile } from "@/shared/ui/components/side-bar/SideBarMovile";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  return (
    <>
      <NavBar />
      <main className="flex py-4 bg-gray-50">
        <SideBar />
        <SideBarMovile />
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </main>
    </>
  );
}
