"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProductAdminTableRow } from "../definitions";
import DisplayTableInfo from "@/lib/components/DisplayTableInfo";
import FilterBar, { FilterCriteria } from "@/lib/components/FilterBar";

type Props = {
  values: ProductAdminTableRow[];
};

const ProductTable: React.FC<Props> = ({ values }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredProducts = useMemo(() => {
    return values.filter((product) => {
      const matchesSearch = filters.search
        ? product.name.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchesActive =
        filters.isDeleted !== undefined
          ? filters.isDeleted
            ? product.active
            : !product.active
          : true;
      return matchesSearch && matchesActive;
    });
  }, [values, filters]);

  const headers = [
    "ID",
    "Nombre",
    "Activo",
    "Categorías",
    "Fecha de Creación",
    "Opciones",
  ];

  const data = filteredProducts.map((product) => ({
    ID: product.id,
    Nombre: product.name,
    Activo: product.active ? "Sí" : "No",
    Categorías:
      product.categories && product.categories.length > 0
        ? Array.isArray(product.categories) ? product.categories.join(", ") : "Ninguna"
        : "Ninguna",
    "Fecha de Creación": new Date(product.createdAt).toLocaleDateString(),
    Opciones: (
      <Link
        className="text-indigo-600 hover:text-indigo-900 transition"
        href={`/admin/catalogo/${product.id}`}
      >
        Detalles
      </Link>
    ),
  }));

  return (
    <div>
      <FilterBar onFilterChange={setFilters} />
      <DisplayTableInfo headers={headers} data={data} keyField="ID" />
    </div>
  );
};

export default ProductTable;
