'use client';
import React, { useState, useMemo } from 'react';
import { ProductAdminTableRow } from '../definitions';
import FilterBar, { FilterCriteria, FilterOption, SearchColumn } from '@/lib/components/FilterBar';
import { RegionItem } from '@/modules/region/definitions';
import { CategoryItem } from '@/modules/category/definitions';
import GenericDataTable, { TableHeader } from '@/lib/components/GenericDataTable';
import CopyClipboard from '@/lib/components/CopyClipboard';
import { DetailsEntity } from '@/lib/components/ButtonComponents';

type Props = {
  values: ProductAdminTableRow[];
  categories: CategoryItem[];
  regions: RegionItem[];
};

const ProductTable: React.FC<Props> = ({ values, regions, categories }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filterOptions: FilterOption[] = [
    {
      name: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Buscar...'
    },
    {
      name: 'region',
      label: 'Región',
      type: 'select',
      defaultValue: 'Todas',
      options: regions.map(r => ({
        label: r.flag ? `${r.flag} ${r.name}` : r.name,
        value: r.code,
      })),
    },
    {
      name: 'status',
      label: 'Estatus',
      type: 'select',
      defaultValue: 'Todos',
      options: [
        { label: 'Activos', value: 'true' },
        { label: 'Inactivos', value: 'false' },
      ],
    },
    {
      name: 'isDeleted',
      label: 'Eliminados',
      type: 'checkbox',
    },
    {
      name: 'createdAt',
      label: 'Fecha de Creación (rango)',
      type: 'dateRange',
    },
    {
      name: 'categories',
      label: 'Categorías',
      type: 'multiselect',
      options: categories.map(category => ({
        label: category.name,
        value: category.name,
      })),
    },
  ];

  const searchColumns: SearchColumn[] = useMemo(() => [
    { label: 'Nombre', field: 'name' },
    { label: 'Slug', field: 'slug' },
    { label: 'ID', field: 'id' },
  ], []);

  const filteredProducts = useMemo(() => {
    const activeSearchColumn = searchColumns.find(sc => {
      const val = filters[sc.field];
      return val && String(val).trim() !== '';
    });

    return values.filter(product => {
      let matchesSearch = true;
      if (activeSearchColumn) {
        matchesSearch = String(product[activeSearchColumn.field as keyof ProductAdminTableRow])
          .toLowerCase()
          .includes(String(filters[activeSearchColumn.field]).toLowerCase());
      }
      const matchesRegion = filters.region ? product.regionId === filters.region : true;
      const matchesStatus =
        filters.status !== '' ? product.active === (filters.status === 'true') : true;
      const matchesDeleted =
        filters.isDeleted !== undefined
          ? filters.isDeleted
            ? product.isDeleted
            : !product.isDeleted
          : true;

      let matchesCreatedAt = true;
      const productDateStr = product.createdAt.toISOString().split('T')[0];
      if (filters.createdAt_from) {
        if (productDateStr < filters.createdAt_from) {
          matchesCreatedAt = false;
        }
      }
      if (filters.createdAt_to) {
        if (productDateStr > filters.createdAt_to) {
          matchesCreatedAt = false;
        }
      }
      let matchesCategories = true;
      if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
        const prodCategories = Array.isArray(product.categories)
          ? product.categories
          : product.categories
            ? product.categories.split(',').map(cat => cat.trim())
            : [];
        if (!prodCategories.some(cat => (filters.categories as string[]).includes(cat))) {
          matchesCategories = false;
        }
      }
      return matchesSearch && matchesRegion && matchesStatus && matchesDeleted && matchesCreatedAt && matchesCategories;
    });
  }, [values, filters, searchColumns]);

  const data = useMemo(() => {
    return filteredProducts.map(product => {
      const prodCategories = Array.isArray(product.categories)
        ? product.categories
        : product.categories
          ? product.categories.split(',').map(cat => cat.trim())
          : [];
      return {
        ID: product.id,
        Slug: product.slug,
        Nombre: product.name,
        Estado: product.active ? 'activo' : 'inactivo',
        Eliminado: product.isDeleted ? 'si' : 'no',
        Región: (() => {
          const r = regions.find(r => r.code === product.regionId);
          return r ? `${r.flag} ${r.name}` : 'No asignada';
        })(),
        Categorías: prodCategories.length > 0 ? prodCategories.join(', ') : 'Ninguna',
        'Fecha de Creación': product.createdAt.toISOString().split('T')[0],
        Opciones: (
          <div className="flex flex-col items-center gap-2">
            <DetailsEntity href={`/admin/products/${product.id}`} color="primary" />

            <CopyClipboard
              text={product.slug}
              label="Copiar Slug"
              buttonSize="btn-xs"
              buttonColor="btn-accent"
            />
          </div>
        ),
      };
    });
  }, [filteredProducts, regions]);

  const tableHeaders = [
    { label: 'ID', field: 'ID', sortable: true },
    // { label: 'Slug', field: 'Slug', sortable: true },
    { label: 'Nombre', field: 'Nombre', sortable: true },
    { label: 'Estado', field: 'Estado', sortable: false },
    { label: 'Fecha de Creación', field: 'Fecha de Creación', sortable: true },
    { label: 'Región', field: 'Región', sortable: false },
    { label: 'Eliminado', field: 'Eliminado', sortable: false },
    // { label: 'Categorías', field: 'Categorías', sortable: false },
    { label: 'Opciones', field: 'Opciones', sortable: false },
  ] as TableHeader[];

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
        keyField="ID"
        defaultSortField="ID"
        defaultSortOrder="asc"
        itemsPerPageOptions={[10, 25, 50, 100]}
        defaultItemsPerPage={10}
      />
    </div>
  );
};

export default ProductTable;