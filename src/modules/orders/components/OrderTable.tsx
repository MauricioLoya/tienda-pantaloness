'use client';

import React, { useMemo, useState } from 'react';
import { OrderAdminTableRow } from '../definitions';
import Link from 'next/link';
import FilterBar, { FilterCriteria } from '@/lib/components/FilterBar';
import { RegionItem } from '@/modules/region/definitions';
import DisplayTableInfo from '@/lib/components/DisplayTableInfo';
type Props = {
  values: OrderAdminTableRow[];
  regions: RegionItem[];
};
const OrderTable: React.FC<Props> = ({ values, regions }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredData = useMemo(() => {
    return values.filter(order => {
      const matchesSearch = filters.search
        ? order.client.toLowerCase().includes(filters.search.toLowerCase()) ||
          order.orderNumber.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchesRegion = filters.region ? order.regionId === filters.region : true;
      return matchesSearch && matchesRegion;
    });
  }, [values, filters]);

  const headers = [
    'Order #',
    'Cliente',
    'Total',
    'Estado',
    'Fecha',
    'Items',
    'Método de Pago',
    'Acciones',
  ];

  const data = filteredData.map(order => ({
    'Order #': order.orderNumber,
    Cliente: order.client,
    Total: `$${order.totalAmount.toFixed(2)}`,
    Estado: order.status,
    Fecha: order.createdAt.toLocaleDateString(),
    Items: order.itemsCount,
    'Método de Pago': order.paymentMethod,
    Acciones: (
      <Link
        className='text-indigo-600 hover:text-indigo-900 transition'
        href={`/admin/ordenes/${order.id}`}
      >
        Detalles
      </Link>
    ),
  }));

  return (
    <div>
      <FilterBar onFilterChange={setFilters} regions={regions} />
      <DisplayTableInfo headers={headers} data={data} keyField='Order #' />
    </div>
  );
};

export default OrderTable;
