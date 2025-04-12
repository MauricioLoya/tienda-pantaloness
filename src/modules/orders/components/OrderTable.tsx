/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useMemo, useState } from 'react';
import { OrderAdminTableRow } from '../definitions';
import Link from 'next/link';
import FilterBar, { FilterCriteria, FilterOption, SearchColumn } from '@/lib/components/FilterBar';
import { RegionItem } from '@/modules/region/definitions';
import GenericDataTable, { TableHeader } from '@/lib/components/GenericDataTable';

type Props = {
  values: OrderAdminTableRow[];
  regions: RegionItem[];
};

const OrderTable: React.FC<Props> = ({ values, regions }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filterOptions: FilterOption[] = [
    {
      name: 'search',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Buscar por '
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
      label: 'Estado',
      type: 'select',
      defaultValue: 'Todos',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'Completado', value: 'completed' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentMethod',
      label: 'Método de Pago',
      type: 'select',
      defaultValue: 'Todos',
      options: [
        { label: 'Tarjeta de crédito', value: 'card' },
        { label: 'Paypal', value: 'paypal' },
        { label: 'Transferencia', value: 'transfer' },
      ],
    },
    {
      name: 'createdAt',
      label: 'Fecha (rango)',
      type: 'dateRange',
    },
  ];

  // Las columnas de búsqueda se aplican al filtro "search".
  const searchColumns: SearchColumn[] = [
    { label: 'Cliente', field: 'client' },
    { label: 'Order #', field: 'orderNumber' },
  ];

  const filteredOrders = useMemo(() => {
    const activeSearchColumn = searchColumns.find(sc => {
      const val = filters[sc.field];
      return val && String(val).trim() !== '';
    });

    return values.filter(order => {
      let matchesSearch = true;
      if (activeSearchColumn) {
        matchesSearch = String(order[activeSearchColumn.field as keyof OrderAdminTableRow])
          .toLowerCase()
          .includes(String(filters[activeSearchColumn.field]).toLowerCase());
      }
      const matchesRegion =
        filters.region && filters.region !== 'Todas'
          ? order.regionId === filters.region
          : true;
      // Filtro por Estado
      const matchesStatus =
        filters.status && filters.status !== 'Todos'
          ? order.status === filters.status
          : true;
      // Filtro por Método de Pago
      const matchesPayment =
        filters.paymentMethod && filters.paymentMethod !== 'Todos'
          ? order.paymentMethod === filters.paymentMethod
          : true;
      // Filtro por Rango de Fecha (aplicado a createdAt)
      let matchesCreatedAt = true;
      const orderDateStr = order.createdAt.toISOString().split('T')[0];
      if (filters.createdAt_from && orderDateStr < filters.createdAt_from) {
        matchesCreatedAt = false;
      }
      if (filters.createdAt_to && orderDateStr > filters.createdAt_to) {
        matchesCreatedAt = false;
      }

      return matchesSearch && matchesRegion && matchesStatus && matchesPayment && matchesCreatedAt;
    });
  }, [values, filters]);


  // Mapeamos la data para la tabla.
  const data = useMemo(() => {
    return filteredOrders.map(order => ({
      'Order #': order.orderNumber,
      Cliente: order.client,
      Total: `$${order.totalAmount.toFixed(2)}`,
      Estado: order.status,
      Fecha: order.createdAt.toISOString().split('T')[0],
      Items: order.itemsCount,
      Región: (() => {
        const r = regions.find(r => r.code === order.regionId);
        return r ? `${r.flag} ${r.name}` : 'No asignada';
      })(),
      'Método de Pago': order.paymentMethod,
      Acciones: (
        <Link
          className="text-indigo-600 hover:text-indigo-900 transition"
          href={`/admin/orders/${order.id}`}
        >
          Detalles
        </Link>
      ),
    }));
  }, [filteredOrders]);

  // Definición de las columnas de la tabla, indicando cuáles son ordenables.
  const tableHeaders = [
    { label: 'Order #', field: 'Order #', sortable: true },
    { label: 'Cliente', field: 'Cliente', sortable: true },
    { label: 'Total', field: 'Total', sortable: true },
    { label: 'Estado', field: 'Estado', sortable: true },
    { label: 'Fecha', field: 'Fecha', sortable: true },
    { label: 'Región', field: 'Región', sortable: false },
    { label: 'Items', field: 'Items', sortable: true },
    { label: 'Método de Pago', field: 'Método de Pago', sortable: true },
    { label: 'Acciones', field: 'Acciones', sortable: false },
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
        keyField="Order #"
        defaultSortField="Order #"
        defaultSortOrder="asc"
        itemsPerPageOptions={[10, 25, 50, 100]}
        defaultItemsPerPage={10}
      />
    </div>
  );
};

export default OrderTable;
