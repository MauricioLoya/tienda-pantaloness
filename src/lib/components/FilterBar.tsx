'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaBroom, FaFilter } from 'react-icons/fa';

export interface FilterCriteria {
  [key: string]: string | number | boolean | string[] | undefined;
}

export type InputType = 'text' | 'number' | 'select' | 'checkbox' | 'dateRange' | 'multiselect';

export interface FilterOption {
  name: string;
  label: string;
  type: InputType;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: {
    label: string;
    value: string;
  }[];
}

export interface SearchColumn {
  label: string;
  field: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterCriteria) => void;
  filtersOptions?: FilterOption[];
  searchColumns?: SearchColumn[];
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, filtersOptions = [], searchColumns }) => {
  const getInitialFilters = (): FilterCriteria =>
    filtersOptions.reduce((acc, option) => {
      switch (option.type) {
        case 'checkbox':
          acc[option.name] = false;
          break;
        case 'dateRange':
          acc[`${option.name}_from`] = '';
          acc[`${option.name}_to`] = '';
          break;
        case 'multiselect':
          acc[option.name] = [];
          break;
        default:
          acc[option.name] = '';
      }
      return acc;
    }, {} as FilterCriteria);

  const [filters, setFilters] = useState<FilterCriteria>(getInitialFilters());
  const [selectedSearchColumn, setSelectedSearchColumn] = useState<string>(
    searchColumns && searchColumns.length > 0 ? searchColumns[0].field : 'search'
  );

  const handleChange = (field: string, value: string | number | boolean | string[]) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
  };

  const clearFilters = () => {
    const initial = getInitialFilters();
    setFilters(initial);
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="max-w-12xl mx-auto collapse collapse-arrow bg-base-200 rounded-lg shadow mb-6">
      <input type="checkbox" className="collapse-checkbox" />
      <div className="collapse-title text-xl font-medium flex items-center">
        <FaFilter className="mr-2" />
        Filtros
      </div>
      <div className="collapse-content">
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {filtersOptions.map((option) => {
              if (option.name === 'search' && searchColumns && searchColumns.length > 0) {
                if (searchColumns.length > 1) {
                  return (
                    <div key="search">
                      <label className="label">
                        <span className="label-text">{option.label}</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={selectedSearchColumn}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            const newField = e.target.value;
                            setFilters((prev) => {
                              const newFilters = { ...prev };
                              delete newFilters[selectedSearchColumn];
                              return newFilters;
                            });
                            setSelectedSearchColumn(newField);
                          }}
                          className="select select-bordered"
                        >
                          {searchColumns.map((col) => (
                            <option key={col.field} value={col.field}>
                              {col.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={(filters[selectedSearchColumn] as string) || ''}
                          placeholder={`Buscar por ${searchColumns.find((col) => col.field === selectedSearchColumn)?.label}`}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(selectedSearchColumn, e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key="search">
                      <label className="label">
                        <span className="label-text">{option.label}</span>
                      </label>
                      <input
                        type="text"
                        value={(filters[searchColumns[0].field] as string) || ''}
                        placeholder={`Buscar por ${searchColumns[0].label}`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(searchColumns[0].field, e.target.value)}
                        className="input input-bordered w-full"
                      />
                    </div>
                  );
                }
              }

              switch (option.type) {
                case 'text':
                  return (
                    <div key={option.name}>
                      <label className="label">
                        <span className="label-text">{option.label}</span>
                      </label>
                      <input
                        type="text"
                        name={option.name}
                        value={filters[option.name] as string}
                        placeholder={option.placeholder || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(option.name, e.target.value)}
                        className="input input-bordered w-full"
                      />
                    </div>
                  );
                case 'number':
                  return (
                    <div key={option.name}>
                      <label className="label">
                        <span className="label-text">{option.label}</span>
                      </label>
                      <input
                        type="number"
                        name={option.name}
                        value={filters[option.name] as string | number}
                        placeholder={option.placeholder || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(option.name, e.target.value)}
                        className="input input-bordered w-full"
                      />
                    </div>
                  );
                case 'select':
                  return (
                    <div key={option.name}>
                      <label className="label">
                        <span className="label-text">{option.label}</span>
                      </label>
                      <select
                        name={option.name}
                        value={filters[option.name] as string}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange(option.name, e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="">{option.defaultValue}</option>
                        {option.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                case 'checkbox':
                  return (
                    <div key={option.name} className="flex flex-col">
                      <label className="label cursor-pointer">
                        <span className="label-text">{option.label}</span>
                        <input
                          type="checkbox"
                          name={option.name}
                          checked={Boolean(filters[option.name])}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(option.name, e.target.checked)
                          }
                          className="toggle toggle-accent"
                        />
                      </label>
                    </div>
                  );
                case 'dateRange':
                  return (
                    <div key={option.name}>
                      <label className="label">
                        <span className="label-text">{option.label}</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          name={`${option.name}_from`}
                          value={filters[`${option.name}_from`] as string}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(`${option.name}_from`, e.target.value)
                          }
                          className="input input-bordered"
                        />
                        <input
                          type="date"
                          name={`${option.name}_to`}
                          value={filters[`${option.name}_to`] as string}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(`${option.name}_to`, e.target.value)
                          }
                          className="input input-bordered"
                        />
                      </div>
                    </div>
                  );
                case 'multiselect':
                  return (
                    <div key={option.name}>
                      <label className="label">
                        <span className="label-text">{option.label}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.options?.map(opt => {
                          const currentSelections = (filters[option.name] as string[]) || [];
                          const isSelected = currentSelections.includes(opt.value);
                          return (
                            <label
                              key={opt.value}
                              className={`btn btn-outline ${isSelected ? 'btn-active' : ''}`}
                            >
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                  if (e.target.checked) {
                                    handleChange(option.name, [...currentSelections, opt.value]);
                                  } else {
                                    handleChange(option.name, currentSelections.filter(val => val !== opt.value));
                                  }
                                }}
                              />
                              {opt.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
          <div className="flex justify-end p-4">
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              <FaBroom className="mr-2" />
              Limpiar filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterBar;
