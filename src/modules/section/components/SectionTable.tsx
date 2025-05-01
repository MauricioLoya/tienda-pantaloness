'use client';

import React, { useState, useMemo } from 'react';
import FilterBar, { FilterCriteria, FilterOption, SearchColumn } from '@/lib/components/FilterBar';
import { RegionItem } from '@/modules/region/definitions';
import { SectionItem } from '../definitions';
import GenericDataTable, { TableHeader } from '@/lib/components/GenericDataTable';
import { DetailsEntity } from '@/lib/components/ButtonComponents';
interface Props {
  values: SectionItem[];
  regions: RegionItem[];
}

const SectionTable: React.FC<Props> = ({ values, regions }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});
  const filterOptions: FilterOption[] = [
    {
      name: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Buscar por ID o Título'
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'select',
      defaultValue: 'Todos',
      options: [
        { label: 'Destacados', value: 'highlight' },
        { label: 'Banner', value: 'banner' },
      ],
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
  ];
  const searchColumns: SearchColumn[] = useMemo(() => ([
    { label: 'ID', field: 'id' },
    { label: 'Título', field: 'title' }
  ]), []);

  const filteredSections = useMemo(() => {
    const activeSearchColumn = searchColumns.find(sc => {
      const val = filters[sc.field];
      return val && String(val).trim() !== '';
    });

    return values.filter(section => {
      let matchesSearch = true;
      if (activeSearchColumn) {
        matchesSearch = String(section[activeSearchColumn.field as keyof SectionItem])
          .toLowerCase()
          .includes(String(filters[activeSearchColumn.field]).toLowerCase());
      }
      const matchesRegion = filters.region ? section.regionId === filters.region : true;
      const matchesType = filters.type ? section.type === filters.type : true;

      return matchesSearch && matchesRegion && matchesType;
    });
  }, [values, filters, searchColumns]);

  const data = filteredSections.map(section => ({
    id: section.id,
    title: section.title,
    type: section.type,
    region: (() => {
      const r = regions.find(rg => rg.code === section.regionId);
      return r ? `${r.flag} ${r.name}` : 'No asignada';
    })(),
    order: section.order,
    options: (
      <div className="flex flex-col items-center gap-2">
        <DetailsEntity href={`/admin/sections/${section.id}`} />
      </div>
    ),
  }));

  const tableHeaders: TableHeader[] = [
    { label: 'ID', field: 'id', sortable: true },
    { label: 'Título', field: 'title', sortable: true },
    { label: 'Tipo', field: 'type', sortable: true },
    { label: 'Región', field: 'region', sortable: true },
    { label: 'Orden', field: 'order', sortable: true },
    { label: 'Opciones', field: 'options', sortable: false },
  ];

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

export default SectionTable;
