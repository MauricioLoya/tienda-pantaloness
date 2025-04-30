'use client';
import React, { useState, useMemo } from 'react';
import GenericDataTable, { TableHeader } from '@/lib/components/GenericDataTable';
import FilterBar, { FilterCriteria, FilterOption, SearchColumn } from '@/lib/components/FilterBar';
import { Promotion } from '@prisma/client';
import { RegionItem } from '@/modules/region/definitions';
import dayjs from 'dayjs';
import CopyClipboard from '@/lib/components/CopyClipboard';
import { DetailsEntity } from '@/lib/components/ButtonComponents';

interface Props {
  values: Promotion[];
  regions: RegionItem[];
}

const PromotionTable: React.FC<Props> = ({ values, regions }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filterOptions: FilterOption[] = [
    {
      name: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Buscar por Nombre o Código',
    },
    {
      name: 'region',
      label: 'Región',
      type: 'select',
      defaultValue: 'Todas',
      options: [
        ...regions.map((r) => ({
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
    {
      name: 'active',
      label: 'Activo',
      type: 'select',
      defaultValue: 'Todos',
      options: [
        { label: 'Sí', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      name: 'startDate',
      label: 'Fecha Inicio (rango)',
      type: 'dateRange',
    },
  ];

  const searchColumns: SearchColumn[] = useMemo(() => ([
    { label: 'Nombre', field: 'name' },
    { label: 'Código', field: 'code' },
  ]), []);

  const filteredData = useMemo(() => {
    const activeSearchColumn = searchColumns.find((sc) => {
      const val = filters[sc.field];
      return val && String(val).trim() !== '';
    });
    return values.filter((promotion) => {
      let matchesSearch = true;
      if (activeSearchColumn) {
        matchesSearch = String(promotion[activeSearchColumn.field as keyof Promotion])
          .toLowerCase()
          .includes(String(filters[activeSearchColumn.field]).toLowerCase());
      }
      const matchesRegion =
        filters.region && filters.region !== 'Todas'
          ? promotion.regionId === filters.region
          : true;
      const matchesDeleted =
        filters.isDeleted !== undefined
          ? filters.isDeleted
            ? promotion.isDeleted
            : !promotion.isDeleted
          : true;
      const matchesActive =
        filters.active && filters.active !== 'Todos'
          ? promotion.active === (filters.active === 'true')
          : true;
      let matchesStartDate = true;
      if (filters.startDate_from) {
        const promoStart = dayjs(promotion.startDate).format('YYYY-MM-DD');
        if (promoStart < filters.startDate_from) {
          matchesStartDate = false;
        }
      }
      if (filters.startDate_to) {
        const promoStart = dayjs(promotion.startDate).format('YYYY-MM-DD');
        if (promoStart > filters.startDate_to) {
          matchesStartDate = false;
        }
      }
      return matchesSearch && matchesRegion && matchesDeleted && matchesActive && matchesStartDate;
    });
  }, [values, filters, searchColumns]);

  const tableHeaders: TableHeader[] = [
    { label: 'Código', field: 'code', sortable: true },
    { label: 'Nombre', field: 'name', sortable: true },
    { label: 'Región', field: 'region', sortable: true },
    { label: 'Fecha Inicio', field: 'startDate', sortable: true },
    { label: 'Fecha Fin', field: 'endDate', sortable: true },
    { label: 'Descuento', field: 'discount', sortable: true },
    { label: 'Activo', field: 'active', sortable: true },
    // { label: 'Eliminado', field: 'isDeleted', sortable: true },
    { label: 'Opciones', field: 'options', sortable: false },
  ];

  const data = filteredData.map((promotion) => ({
    code: promotion.code,
    name: promotion.name,
    region: (() => {
      const r = regions.find((r) => r.code === promotion.regionId);
      return r ? `${r.flag} ${r.name}` : 'No asignada';
    })(),
    startDate: dayjs(promotion.startDate).format('DD/MMM/YYYY'),
    endDate: dayjs(promotion.endDate).format('DD/MMM/YYYY'),
    discount: `${promotion.discount}%`,
    active: promotion.active ? 'Sí' : 'No',
    isDeleted: promotion.isDeleted ? 'Sí' : 'No',
    options: (
      <div className="flex flex-col items-center gap-2">
        <DetailsEntity href={`/admin/promotions/${promotion.id}`} color="primary" />
        <CopyClipboard
          text={promotion.code}
          label="Copiar código"
          buttonSize="btn-xs"
          buttonColor="btn-accent"
        />
      </div>
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
        keyField="code"
        defaultSortField="code"
        defaultSortOrder="asc"
        itemsPerPageOptions={[10, 25, 50, 100]}
        defaultItemsPerPage={10}
      />
    </div>
  );
};

export default PromotionTable;
