'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import DisplayTableInfo from '@/lib/components/DisplayTableInfo';
import FilterBar, { FilterCriteria } from '@/lib/components/FilterBar';
import { Promotion } from '@prisma/client';
import { RegionItem } from '@/modules/region/definitions';
import dayjs from 'dayjs';

interface Props {
  values: Promotion[];
  regions: RegionItem[];
}

const PromotionTable: React.FC<Props> = ({ values, regions }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredData = useMemo(() => {
    return values.filter(promotion => {
      const matchesSearch = filters.search
        ? promotion.name.toLowerCase().includes(filters.search.toString().toLowerCase()) ||
        promotion.code.toLowerCase().includes(filters.search.toString().toLowerCase())
        : true;
      const matchesRegion = filters.region ? promotion.regionId === filters.region : true;
      const matchesDeleted = filters.isDeleted ? promotion.isDeleted : !promotion.isDeleted;
      return matchesSearch && matchesRegion && matchesDeleted;
    });
  }, [values, filters]);

  const headers = [
    'Código',
    'Nombre',
    'Región',
    'Fecha Inicio',
    'Fecha Fin',
    'Descuento',
    'Activo',
    'Eliminado',
    'Opciones',
  ];
  const data = filteredData.map(promotion => ({
    Código: promotion.code,
    Nombre: promotion.name,
    Región: (() => {
      const r = regions.find(r => r.code === promotion.regionId);
      return r ? `${r.flag} ${r.name}` : 'No asignada';
    })(),
    'Fecha Inicio': `${dayjs(promotion.startDate).format('DD/MMM/YYYY')}`,
    'Fecha Fin': `${dayjs(promotion.endDate).format('DD/MMM/YYYY')}`,
    Descuento: `${promotion.discount}%`,
    Activo: promotion.active ? 'Sí' : 'No',
    Eliminado: promotion.isDeleted ? 'Sí' : 'No',
    Opciones: (
      <Link
        className='text-indigo-600 hover:text-indigo-900 transition'
        href={`/admin/promociones/${promotion.id}`}
      >
        Detalles
      </Link>
    ),
  }));

  return (
    <div>
      <FilterBar onFilterChange={setFilters} />
      <DisplayTableInfo headers={headers} data={data} keyField='Código' />
    </div>
  );
};

export default PromotionTable;
