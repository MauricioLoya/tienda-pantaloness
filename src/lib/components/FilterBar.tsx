'use client';

import React, { useState, useEffect } from 'react';

export interface FilterCriteria {
  search?: string;
  region?: string;
  isDeleted?: boolean;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterCriteria) => void;
  regions?: { code: string; name: string; flag?: string }[];
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, regions = [] }) => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const filters: FilterCriteria = {
      search: search || undefined,
      region: region || undefined,
      isDeleted: isDeleted ? true : undefined,
    };
    onFilterChange(filters);
  }, [search, region, isDeleted, onFilterChange]);

  return (
    <div className="p-4 bg-base-200 rounded-lg mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">
            <span className="label-text">Buscar</span>
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Región</span>
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Todas</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.flag ? `${r.flag} ` : ""}{r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="label cursor-pointer">
            <span className="label-text">Mostrar eliminados</span>
            <input
              type="checkbox"
              checked={isDeleted}
              onChange={(e) => setIsDeleted(e.target.checked)}
              className="toggle toggle-accent"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
