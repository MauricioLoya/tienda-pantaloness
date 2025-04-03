"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { SignOut } from "../components/signout-button";
import Drawer from "@/lib/components/Drawer";
import StoreSettings from "@/modules/settings/StoreSettings";

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [openSettings, setOpenSettings] = useState(false);
  const links = [
    { name: "Dashboard", href: "/admin", emoji: "📈" },
    {
      name: "Ordenes",
      href: "/admin/ordenes",
      emoji: "📦",
    },
    {
      name: "Categorias",
      href: "/admin/categorias",
      emoji: "📝",
    },
    {
      name: "Catalogo",
      href: "/admin/catalogo",
      emoji: "👖",
    },
    {
      name: "Promociones",
      href: "/admin/promociones",
      emoji: "🎉",
    },
    {
      name: "Usuarios",
      href: "/admin/users",
      emoji: "👥",
    },
    {
      name: "Secciones",
      href: "/admin/sections",
      emoji: "🌟",
    },
  ];
  return (
    <div className='flex h-full flex-col px-3 py-4 md:px-2'>
      <Link
        className='bg-gray-50 mb-2 flex h-20 items-end justify-start rounded-md  p-4 md:h-40 border-dashed border-2'
        href='/admin'
      />
      <div className="text-black flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 ${
                pathname === link.href ? "bg-sky-100 text-blue-600" : ""
              }`}
            >
              <span>{link.emoji}</span>
              <p className='hidden md:block'>{link.name}</p>
            </Link>
          );
        })}
        <button
          onClick={() => setOpenSettings(true)}
          className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <span>⚙️</span>
          <p className="hidden md:block">Ajustes</p>
        </button>

        <Drawer
          title="Ajustes de la tienda"
          isOpen={openSettings}
          onClose={() => setOpenSettings(false)}
        >
          <StoreSettings />
        </Drawer>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        <SignOut />
      </div>
    </div>
  );
};

export default NavBar;
