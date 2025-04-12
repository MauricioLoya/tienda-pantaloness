'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { User } from '@prisma/client';
import DisplayTableInfo from '@/lib/components/DisplayTableInfo';
import FilterBar, { FilterCriteria } from '@/lib/components/FilterBar';

type Props = {
  values: User[];
};

const UserTable: React.FC<Props> = ({ values }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredData = useMemo(() => {
    return values.filter(user => {
      const matchesSearch = filters.search
        ? user.email.toLowerCase().includes(filters.search.toString().toLowerCase()) ||
        user.name.toLowerCase().includes(filters.search.toString().toLowerCase())
        : true;
      const matchesStatus = filters.isDeleted ? user.isDeleted : !user.isDeleted;
      return matchesSearch && matchesStatus;
    });
  }, [values, filters]);
  const headers = ['ID', 'Email', 'Nombre', 'Fecha de Creación', 'Super Admin', 'Opciones'];
  const data = filteredData.map(user => ({
    ID: user.id,
    Email: user.email,
    Nombre: user.name,
    'Fecha de Creación': new Date(user.createdAt).toLocaleDateString(),
    'Super Admin': user.superAdmin ? 'Sí' : 'No',
    Opciones: (
      <Link
        className='text-indigo-600 hover:text-indigo-900 transition'
        href={`/admin/users/${user.id}`}
      >
        Detalles
      </Link>
    ),
  }));

  return (
    <div>
      <FilterBar onFilterChange={setFilters} />
      <DisplayTableInfo headers={headers} data={data} keyField='ID' />
    </div>
  );
};

export default UserTable;
