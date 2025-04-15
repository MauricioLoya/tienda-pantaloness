'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import GenericDataTable, { TableHeader } from '@/lib/components/GenericDataTable';
import FilterBar, { FilterCriteria, FilterOption, SearchColumn } from '@/lib/components/FilterBar';
import { User } from '@prisma/client';
import CopyClipboard from '@/lib/components/CopyClipboard';

type Props = {
  values: User[];
};

const UserTable: React.FC<Props> = ({ values }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filterOptions: FilterOption[] = [
    {
      name: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Buscar por Email o Nombre',
    },
    {
      name: 'isDeleted',
      label: 'Eliminados',
      type: 'checkbox',
    },
    {
      name: 'superAdmin',
      label: 'Super Admin',
      type: 'select',
      defaultValue: 'Todos',
      options: [
        { label: 'Todos', value: 'Todos' },
        { label: 'Sí', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
  ];

  const searchColumns: SearchColumn[] = [
    { label: 'Email', field: 'email' },
    { label: 'Nombre', field: 'name' },
    { label: 'ID', field: 'id' },
  ];

  const filteredData = useMemo(() => {
    const activeSearchColumn = searchColumns.find(sc => {
      const val = filters[sc.field];
      return val && String(val).trim() !== '';
    });
    return values.filter(user => {
      let matchesSearch = true;
      if (activeSearchColumn) {
        matchesSearch = String(user[activeSearchColumn.field as keyof User])
          .toLowerCase()
          .includes(String(filters[activeSearchColumn.field]).toLowerCase());
      }
      const matchesDeleted =
        filters.isDeleted !== undefined
          ? filters.isDeleted
            ? user.isDeleted
            : !user.isDeleted
          : true;
      const matchesSuperAdmin =
        filters.superAdmin && filters.superAdmin !== 'Todos'
          ? user.superAdmin === (filters.superAdmin === 'true')
          : true;
      return matchesSearch && matchesDeleted && matchesSuperAdmin;
    });
  }, [values, filters, searchColumns]);

  const tableHeaders: TableHeader[] = [
    { label: 'ID', field: 'id', sortable: true },
    { label: 'Email', field: 'email', sortable: true },
    { label: 'Nombre', field: 'name', sortable: true },
    { label: 'Fecha de Creación', field: 'createdAt', sortable: true },
    { label: 'Super Admin', field: 'superAdmin', sortable: true },
    { label: 'Eliminado', field: 'isDeleted', sortable: true },
    { label: 'Opciones', field: 'options', sortable: false },
  ];

  const data = filteredData.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    superAdmin: user.superAdmin ? 'Sí' : 'No',
    isDeleted: user.isDeleted ? 'Sí' : 'No',


    options: (
      <div className="flex flex-col items-center gap-2">
        <Link
          className="btn btn-xs btn-primary"
          href={`/admin/users/${user.id}`}
        >
          Detalles
        </Link>
        <CopyClipboard
          text={user.email}
          label="Copiar email"
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
        keyField="id"
        defaultSortField="id"
        defaultSortOrder="asc"
        itemsPerPageOptions={[10, 25, 50, 100]}
        defaultItemsPerPage={10}
      />
    </div>
  );
};

export default UserTable;
