"use client";
import React, { useState } from "react";
import { Promotion } from "@prisma/client";
import { FaCopy } from "react-icons/fa";
import DisplayInfo from "@/lib/components/DisplayInfo";
import Link from "next/link";
import HeaderContent from "@/lib/components/HeaderContent";

type Props = {
  promotion: Promotion;
};

const PromotionDetails: React.FC<Props> = ({ promotion }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="p-2">
      <HeaderContent title={`Detalles de la Promoción ${promotion.name}`} href="./"   />
      <div className="grid gap-6">
        <DisplayInfo
          info={[
            {
              label: "Código",
              value: (
                <div>
                  <span>{promotion.code}</span>
                  <button
                    onClick={() => copyToClipboard(promotion.code)}
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
              value: promotion.name,
            },
            {
              label: "Descripción",
              value: promotion.description,
            },
            {
              label: "Descuento",
              value: `${promotion.discount}%`,
            },
            {
              label: "Fecha de inicio",
              value: new Date(promotion.startDate).toLocaleDateString(),
            },
            {
              label: "Fecha de fin",
              value: new Date(promotion.endDate).toLocaleDateString(),
            },
            {
              label: "Activo",
              value: promotion.active ? "Sí" : "No",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default PromotionDetails;
