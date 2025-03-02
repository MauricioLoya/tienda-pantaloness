"use client";
import React from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import DisplayTableInfo from "@/lib/components/DisplayTableInfo";

type Props = {
  values: User[];
};

const UserTable: React.FC<Props> = ({ values }) => {
  const headers = [
    "ID",
    "Email",
    "Nombre",
    "Fecha de Creación",
    "Super Admin",
    "Opciones",
  ];
  const data = values.map((user) => ({
    ID: user.id,
    Email: user.email,
    Nombre: user.name,
    "Fecha de Creación": new Date(user.createdAt).toLocaleDateString(),
    "Super Admin": user.superAdmin ? "Sí" : "No",
    Opciones: (
      <Link
        className="text-indigo-600 hover:text-indigo-900 transition"
        href={`/admin/users/${user.id}`}
      >
        Detalles
      </Link>
    ),
  }));
  return <DisplayTableInfo headers={headers} data={data} />;
};

export default UserTable;
