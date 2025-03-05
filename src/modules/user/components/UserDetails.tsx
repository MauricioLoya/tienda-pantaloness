"use client";
import React, { useState } from "react";
import { User } from "@prisma/client";
import { FaCopy } from "react-icons/fa";
import DisplayInfo from "@/lib/components/DisplayInfo";
import GoBack from "@/lib/components/GoBack";
import Link from "next/link";

type Props = {
  user: User;
};

const UserDetails: React.FC<Props> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-2">
      <GoBack href="./" />
      <h1 className="text-2xl font-semibold text-gray-900 my-2">
        Detalles del usuario {user.name}
      </h1>
      <div className="grid gap-6">
        <DisplayInfo
          info={[
            {
              label: "ID",
              value: user.id,
            },
            {
              label: "Email",
              value: (
                <div>
                  <span>{user.email}</span>
                  <button
                    onClick={() => copyToClipboard(user.email)}
                    className={`ml-2 text-grey-500 hover:underline ${
                      copied ? "text-green-500" : ""
                    }`}
                  >
                    {copied ? "Copiado!" : <FaCopy />}
                  </button>
                </div>
              ),
            },
            {
              label: "Nombre",
              value: user.name,
            },
            {
              label: "Fecha de Creación",
              value: new Date(user.createdAt).toLocaleDateString(),
            },
            {
              label: "Última Actualización",
              value: new Date(user.updatedAt).toLocaleDateString(),
            },
            {
              label: "Super Admin",
              value: user.superAdmin ? "Sí" : "No",
            },
            {
              label: "Eliminado",
              value: user.isDeleted ? "Sí" : "No",
            },
            user.isDeleted && user.deletedAt
              ? {
                  label: "Fecha de Eliminación",
                  value: new Date(user.deletedAt).toLocaleDateString(),
                }
              : null,
            {
              label: "Opciones",
              value: (
                <div className="flex items-center gap-4">
                  <Link
                    className="text-indigo-600 hover:text-indigo-900 transition"
                    href={`/admin/users/${user.id}/editar`}
                  >
                    Editar
                  </Link>
                </div>
              ),
            },
          ].filter((item) => item !== null)}
        />
      </div>
    </div>
  );
};

export default UserDetails;
