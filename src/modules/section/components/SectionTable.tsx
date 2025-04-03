'use client';

import React, { useState, useMemo } from 'react';
import DisplayTableInfo from '@/lib/components/DisplayTableInfo';
import FilterBar, { FilterCriteria } from '@/lib/components/FilterBar';
import { RegionItem } from '@/modules/region/definitions';
import { SectionItem } from '../definitions';

interface Props {
  values: SectionItem[];
  regions: RegionItem[];
}

const SectionTable: React.FC<Props> = ({ values, regions }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredData = useMemo(() => {
    return values.filter(section => {
      const matchesSearch = filters.search
        ? section.title.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchesRegion = filters.region ? section.regionId === filters.region : true;
      return matchesSearch && matchesRegion;
    });
  }, [values, filters]);

  const headers = ['ID', 'Tipo', 'Título', 'Región', 'Orden', 'Opciones'];
  const data = filteredData.map(section => ({
    ID: section.id,
    Tipo: section.type,
    Título: section.title,
    Región: (() => {
      const r = regions.find(rg => rg.code === section.regionId);
      return r ? `${r.flag} ${r.name}` : 'No asignada';
    })(),
    Orden: section.order,
    Opciones: (
      <a
        href={`/admin/sections/${section.id}`}
        className='text-indigo-600 hover:text-indigo-900 transition'
      >
        Detalles
      </a>
    ),
  }));

  return (
    <div>
      <FilterBar onFilterChange={setFilters} regions={regions} />
      <DisplayTableInfo headers={headers} data={data} keyField='ID' />
    </div>
  );
};

export default SectionTable;
