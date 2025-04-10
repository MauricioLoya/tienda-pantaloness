'use client';
import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';

export interface TableHeader {
  label: string;
  field: string;
  sortable?: boolean; // si es false, la columna no se ordenará; por defecto true si no se define.
}

export interface GenericDataTableProps {
  headers: TableHeader[];
  data: { [key: string]: any }[];  // datos ya mapeados para la tabla
  keyField?: string;
  defaultSortField?: string;
  defaultSortOrder?: 'asc' | 'desc';
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
}

const GenericDataTable: React.FC<GenericDataTableProps> = ({
  headers,
  data,
  keyField = 'id',
  defaultSortField = '',
  defaultSortOrder = 'asc',
  itemsPerPageOptions = [10, 25, 50],
  defaultItemsPerPage = 10,
}) => {
  const [sortField, setSortField] = useState<string>(defaultSortField);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage);

  // Ordenar los datos basado en sortField y sortOrder
  const sortedData = useMemo(() => {
    let sorted = [...data];
    if (sortField) {
      sorted.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (aVal instanceof Date && bVal instanceof Date) {
          return sortOrder === 'asc'
            ? aVal.getTime() - bVal.getTime()
            : bVal.getTime() - aVal.getTime();
        }
        const aStr = String(aVal);
        const bStr = String(bVal);
        if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [data, sortField, sortOrder]);

  // Calcular los datos de la página actual
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Función que se llama al hacer clic sobre un header
  const handleHeaderClick = (header: TableHeader) => {
    if (header.sortable === false) return; // si la columna no se debe ordenar, no hace nada.
    if (sortField === header.field) {
      // siempre se alterna el orden al clic en el mismo header
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(header.field);
      setSortOrder('asc');
    }
    // Reinicia la página actual al cambiar el sort
    setCurrentPage(1);
  };

  // Genera una clave única para cada fila
  const generateKey = (row: any, index: number) => {
    return row[keyField] || index;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => handleHeaderClick(header)}
                  className={`px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider ${header.sortable === false ? 'cursor-default' : 'cursor-pointer'
                    }`}
                >
                  {header.label}
                  {header.sortable !== false && sortField === header.field && (
                    sortOrder === 'asc' ? ' 🔼' : ' 🔽'
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-black bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr key={generateKey(row, index)}>
                {headers.map((header, colIndex) => {
                  const field = header.field;
                  return (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {row[field]}
                    </td>
                  );
                })}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value: number) => {
            setItemsPerPage(value);
            setCurrentPage(1); // reiniciamos a la primera página al cambiar el límite
          }}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      </div>
    </div>
  );
};

export default GenericDataTable;
