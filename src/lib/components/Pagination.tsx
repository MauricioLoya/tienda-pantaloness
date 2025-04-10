'use client';
import React, { ChangeEvent } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50],
}) => {
  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    onItemsPerPageChange(value);
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="btn btn-sm"
        >
          Anterior
        </button>
        <span className="mx-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="btn btn-sm"
        >
          Siguiente
        </button>
      </div>
      <div>
        <label className="text-sm mr-2" htmlFor="itemsPerPageSelect">
          Ítems por página:
        </label>
        <select
          id="itemsPerPageSelect"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="select select-sm"
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
