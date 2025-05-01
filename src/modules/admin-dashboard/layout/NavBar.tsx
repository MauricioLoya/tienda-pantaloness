"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SignOut } from "../components/signout-button";
import { FaStore, FaUser } from "react-icons/fa";

interface Props {
  logoUrl: string | null;
  storeName: string | null;
  userName: string;
}

const NavBar: React.FC<Props> = ({ logoUrl, storeName, userName }) => {
  const pathname = usePathname() ?? "";

  // Determina si la ruta está activa
  const isActive = (href: string) => pathname.endsWith(href);

  const links = [
    { name: "Dashboard", href: "/admin", emoji: "📈" },
    { name: "Ordenes", href: "/admin/orders", emoji: "📦" },
    { name: "Categorias", href: "/admin/categories", emoji: "📝" },
    { name: "Productos", href: "/admin/products", emoji: "👖" },
    { name: "Promociones", href: "/admin/promotions", emoji: "🎉" },
    { name: "Usuarios", href: "/admin/users", emoji: "👥" },
    { name: "Secciones", href: "/admin/sections", emoji: "🌟" },
    { name: "Configuración", href: "/admin/settings", emoji: "⚙️" },
  ];

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        href="/admin"
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-white p-4 shadow-sm hover:shadow transition-all"
      >
        {logoUrl && <img src={logoUrl} alt="Logo" className="h-full object-contain" />}
      </Link>

      {storeName && (
        <div className="mb-4 text-center">
          <h4 className="text-base font-semibold text-gray-700 truncate">
            {storeName}
          </h4>
        </div>
      )}

      <div className="mb-4 flex justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-sky-100"
        >
          <FaStore className="text-primary text-3xl" />
        </Link>
      </div>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                `relative flex h-[48px] items-center gap-2 rounded-md p-3 text-sm font-medium transition-all ` +
                (active
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-50 hover:bg-sky-100 hover:text-blue-600")
              }
            >
              <span className={`${active ? "scale-110" : ""}`}>{link.emoji}</span>
              <p className={`hidden md:block ${active ? "font-semibold" : ""}`}>{link.name}</p>
              {active && <span className="absolute left-0 top-0 h-full w-1 rounded-r-md" />}
            </Link>
          );
        })}

        {/* Sección de Mi Perfil */}
        <Link
          href="/admin/profile"
          className={
            `relative flex h-[48px] items-center gap-2 rounded-md p-3 text-sm font-medium transition-all ` +
            (isActive("/admin/profile")
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-50 hover:bg-sky-100 hover:text-blue-600")
          }
        >
          <FaUser className="text-lg" />
          <p className={`hidden md:block ${isActive("/admin/profile") ? "font-semibold" : ""}`}>
            {userName}
          </p>
          {isActive("/admin/profile") && <span className="absolute left-0 top-0 h-full w-1 rounded-r-md" />}
        </Link>

        <div className="hidden grow rounded-md bg-gray-50 md:block" />
        <SignOut />
      </div>
    </div>
  );
};

export default NavBar;
