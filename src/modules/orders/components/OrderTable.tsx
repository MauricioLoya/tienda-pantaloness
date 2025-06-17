/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useMemo, useState } from 'react';
import { OrderAdminTableRow } from '../definitions';
import FilterBar, { FilterCriteria, FilterOption, SearchColumn } from '@/lib/components/FilterBar';
import { RegionItem } from '@/modules/region/definitions';
import GenericDataTable, { TableHeader } from '@/lib/components/GenericDataTable';
import { DetailsEntity } from '@/lib/components/ButtonComponents';
import { getStatusLabel } from '@/lib/utils';
import { OrderStatusLabels } from '@/lib/types';

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
        ...Object.entries(OrderStatusLabels).map(([value, label]) => ({
          value,
          label,
        }))
      ],
    },
    {
      name: 'createdAt',
      label: 'Fecha (rango)',
      type: 'dateRange',
    },
  ];

  const searchColumns: SearchColumn[] = [
    { label: 'Order #', field: 'orderNumber' },
    { label: 'Cliente', field: 'client.name' },
    { label: 'ID', field: 'id' },
    { label: 'Email', field: 'client.email' },
    { label: 'Teléfono', field: 'client.phone' },
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


  const data = useMemo(() => {
    return filteredOrders.map(order => ({
      order: order.orderNumber,
      client: (
        <div className="flex flex-col">
          <span>{order.client.name}
          </span>
          <span className="text-xs text-gray-500">{order.client.email}</span>
          <span className="text-xs text-gray-500">{order.client.phone}</span>
        </div>
      ),
      clientName: order.client.name,
      clientEmail: order.client.email,
      clientPhone: order.client.phone,
      total: `$${order.totalAmount.toFixed(2)}`,
      state: getStatusLabel(order.status),
      date: order.createdAt.toISOString().split('T')[0],
      items: order.itemsCount,
      region: (() => {
        const r = regions.find(r => r.code === order.regionId);
        return r ? `${r.flag} ${r.name}` : 'No asignada';
      })(),
      action: (
        <DetailsEntity href={`/admin/orders/${order.id}`} color="primary" />
      ),
    }));
  }, [filteredOrders]);

  const tableHeaders = [
    { label: 'Order #', field: 'order', sortable: true },
    { label: 'Cliente', field: 'client', sortable: false },
    { label: 'Total', field: 'total', sortable: true },
    { label: 'Estado', field: 'state', sortable: true },
    { label: 'Fecha', field: 'date', sortable: true },
    { label: 'Región', field: 'region', sortable: false },
    { label: 'Items', field: 'items', sortable: true },
    { label: 'Acciones', field: 'action', sortable: false },
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
        defaultSortField="Fecha"
        defaultSortOrder="desc"
        itemsPerPageOptions={[10, 25, 50, 100]}
        defaultItemsPerPage={10}
      />
    </div>
  );
};

export default OrderTable;
