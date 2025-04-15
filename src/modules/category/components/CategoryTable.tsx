'use client';
import React, { useState, useMemo } from 'react';
import GenericDataTable, { TableHeader } from '@/lib/components/GenericDataTable';
import FilterBar, { FilterCriteria, FilterOption, SearchColumn } from '@/lib/components/FilterBar';
import { CategoryItem } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import Link from 'next/link';

interface Props {
  values: CategoryItem[];
  regions: RegionItem[];
}

const CategoryTable: React.FC<Props> = ({ values, regions }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filterOptions: FilterOption[] = [
    {
      name: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Buscar por Nombre o Descripción',
    },
    {
      name: 'region',
      label: 'Región',
      type: 'select',
      defaultValue: 'Todas',
      options: [
        { label: 'Todas', value: 'Todas' },
        ...regions.map(r => ({
          label: r.flag ? `${r.flag} ${r.name}` : r.name,
          value: r.code,
        })),
      ],
    },
    {
      name: 'isDeleted',
      label: 'Eliminados',
      type: 'checkbox',
    },
  ];

  const searchColumns: SearchColumn[] = useMemo(() => ([
    { label: 'Nombre', field: 'name' },
    { label: 'ID', field: 'id' },
  ]), []);

  const filteredData = useMemo(() => {
    const activeSearchColumn = searchColumns.find(sc => {
      const val = filters[sc.field];
      return val && String(val).trim() !== '';
    });
    return values.filter(category => {
      let matchesSearch = true;
      if (activeSearchColumn) {
        matchesSearch = String(category[activeSearchColumn.field as keyof CategoryItem])
          .toLowerCase()
          .includes(String(filters[activeSearchColumn.field]).toLowerCase());
      }
      const matchesRegion =
        filters.region && filters.region !== 'Todas'
          ? category.regionId === filters.region
          : true;
      const matchesStatus =
        filters.isDeleted !== undefined
          ? filters.isDeleted
            ? category.isDeleted
            : !category.isDeleted
          : true;
      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [values, filters, searchColumns]);

  // Definición de las columnas de la tabla para el GenericDataTable.
  const tableHeaders: TableHeader[] = [
    { label: 'ID', field: 'id', sortable: true },
    { label: 'Nombre', field: 'name', sortable: true },
    { label: 'Región', field: 'region', sortable: true },
    { label: 'Estatus', field: 'status', sortable: true },
    { label: 'Opciones', field: 'options', sortable: false },
  ];

  const data = filteredData.map(category => ({
    id: category.id,
    name: category.name,
    region: (() => {
      const r = regions.find(rg => rg.code === category.regionId);
      return r ? `${r.flag} ${r.name}` : 'No asignada';
    })(),
    status: category.isDeleted ? 'Eliminado' : 'Activo',
    options: (
      <Link
        className="btn btn-xs btn-primary"
        href={`/admin/categories/${category.id}`}
      >
        Detalles
      </Link>
    ),
  }));

  return (
    <div>
      <FilterBar
        onFilterChange={setFilters}
        filtersOptions={filterOptions}
        searchColumns={searchColumns}
      />
      <GenericDataTable
        headers={tableHeaders}
        data={data}
        keyField="id"
        defaultSortField="id"
        defaultSortOrder="asc"
        itemsPerPageOptions={[10, 25, 50, 100]}
        defaultItemsPerPage={10}
      />
    </div>
  );
};

export default CategoryTable;
