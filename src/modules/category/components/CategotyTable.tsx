"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import DisplayTableInfo from "@/lib/components/DisplayTableInfo";
import FilterBar, { FilterCriteria } from "@/lib/components/FilterBar";
import { CategoryItem } from "../definitions";
import { RegionItem } from "@/modules/region/definitions";

interface Props {
  values: CategoryItem[];
  regions: RegionItem[];
}

const CategoryTable: React.FC<Props> = ({ values, regions }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredData = useMemo(() => {
    return values.filter((category) => {
      const matchesSearch = filters.search
        ? category.name.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchesRegion = filters.region
        ? category.regionId === filters.region
        : true;
      const matchesStatus =filters.isDeleted ? category.isDeleted
            : !category.isDeleted
      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [values, filters]);

  const headers = [
    "ID",
    "Nombre",
    "Descripción",
    "Region",
    "Estatus",
    "Opciones",
  ];
  const data = filteredData.map((category) => ({
    ID: category.id,
    Nombre: category.name,
    Descripción: category.description,
    Region:
      (() => {
        const r = regions.find((r) => r.code === category.regionId);
        return r ? `${r.flag} ${r.name}` : "No asignada";
      })(),
    Estatus: category.isDeleted ? "Eliminado" : "Activo",
    Opciones: (
      <Link
        className="text-indigo-600 hover:text-indigo-900 transition"
        href={`/admin/categorias/${category.id}`}
      >
        Detalles
      </Link>
    ),
  }));

  return (
    <div>
      <FilterBar onFilterChange={setFilters} regions={regions} />
      <DisplayTableInfo headers={headers} data={data} keyField="ID" />
    </div>
  );
};

export default CategoryTable;
