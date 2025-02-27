"use client";
import React from "react";
import { Promotion } from "@prisma/client";
import { FaCopy } from "react-icons/fa";

type Props = {
  promotion: Promotion;
};

const PromotionDetails: React.FC<Props> = ({ promotion }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Detalles de la Promoción</h1>
      <p>
      <strong>Código:</strong> {promotion.code}{" "}
        <FaCopy
          className="inline cursor-pointer text-blue-600"
          onClick={() => copyToClipboard(promotion.code)}
        />
      </p>
      <p>
        <strong>Nombre:</strong> {promotion.name}
      </p>
      <p>
        <strong>Descripción:</strong> {promotion.description}
      </p>
      <p>
        <strong>Descuento:</strong> {promotion.discount}%
      </p>
      <p>
        <strong>Fecha de inicio:</strong>{" "}
        {new Date(promotion.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Fecha de fin:</strong>{" "}
        {new Date(promotion.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Activo:</strong> {promotion.active ? "Sí" : "No"}
      </p>
      <div className="flex justify-end">
        <a
          href={`/admin/promociones/${promotion.id}/editar`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Editar
        </a>
      </div>
    </div>
  );
};

export default PromotionDetails;
