"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SignOut } from "../components/signout-button";

interface Props {
  logoUrl: string | null;
  storeName: string | null;
}

const NavBar: React.FC<Props> = ({ logoUrl, storeName }) => {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", href: "/admin", emoji: "📈" },
    {
      name: "Ordenes",
      href: "/admin/orders",
      emoji: "📦",
    },
    {
      name: "Categorias",
      href: "/admin/categorias",
      emoji: "📝",
    },
    {
      name: "Productos",
      href: "/admin/products",
      emoji: "👖",
    },
    {
      name: "Promociones",
      href: "/admin/promotions",
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
    {
      name: "Configuracion",
      href: "/admin/settings",
      emoji: "⚙️",
    },
  ];
  return (
    <div className='flex h-full flex-col px-3 py-4 md:px-2'>
      <Link
        className='bg-white mb-2 flex h-20 md:h-32 items-center justify-center rounded-md p-4 shadow-sm hover:shadow transition-all duration-200'
        href='/admin'
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt='Logo'
            className='h-full max-h-16 md:max-h-24 object-contain'
          />
        )}
      </Link>

      {storeName && (
        <div className='mb-4 text-center'>
          <h4 className='text-base font-semibold text-gray-700 truncate'>{storeName}</h4>
        </div>
      )}

      <div className="text-black flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 ${pathname === link.href ? "bg-sky-100 text-blue-600" : ""
                }`}
            >
              <span>{link.emoji}</span>
              <p className='hidden md:block'>{link.name}</p>
            </Link>
          );
        })}

        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        <SignOut />
      </div>
    </div >
  );
};

export default NavBar;
