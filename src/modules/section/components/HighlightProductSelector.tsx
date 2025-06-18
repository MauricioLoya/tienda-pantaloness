'use client';

import React, { useState, useMemo } from 'react';
import { HighlightProductItem } from '../definitions';

interface HighlightProductSelectorProps {
  availableProducts: HighlightProductItem[];
  selected: HighlightProductItem[];
  onChange: (selected: HighlightProductItem[]) => void;
}

const HighlightProductSelector: React.FC<HighlightProductSelectorProps> = ({
  availableProducts,
  selected,
  onChange,
}) => {
  const [filter, setFilter] = useState('');

  const selectedIds = selected.map(p => p.id);

  const filteredAvailable = useMemo(() => {
    return availableProducts.filter(
      prod =>
        !selectedIds.includes(prod.id) && prod.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [availableProducts, selectedIds, filter]);

  const handleAdd = (product: HighlightProductItem) => {
    if (selected.length < 4) {
      onChange([...selected, product]);
    }
  };

  const handleRemove = (id: number) => {
    const updatedSelected = selected.filter(p => p.id !== id);
    onChange(updatedSelected);
  };

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <div className='flex-1 border p-4 rounded'>
        <h3 className='font-semibold mb-2'>Productos Disponibles</h3>
        <input
          type='text'
          placeholder='Filtrar...'
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className='input input-bordered w-full mb-2'
        />
        <ul className='space-y-1 max-h-60 overflow-y-auto'>
          {filteredAvailable.map(prod => (
            <li key={prod.id} className='flex justify-between items-center'>
              <span>{prod.name}</span>
              <button
                type='button'
                className='btn btn-xs btn-primary'
                onClick={() => handleAdd(prod)}
                disabled={selected.length >= 4}
              >
                Agregar
              </button>
            </li>
          ))}
          {filteredAvailable.length === 0 && (
            <li className='text-gray-500 text-sm'>No hay productos disponibles</li>
          )}
        </ul>
      </div>

      <div className='flex-1 border p-4 rounded'>
        <h3 className='font-semibold mb-2'>Productos Seleccionados ({selected.length}/4)</h3>
        <ul className='space-y-1 max-h-60 overflow-y-auto'>
          {selected.map(prod => (
            <li key={prod.id} className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                {prod.imageUrl && (
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className='w-8 h-8 object-cover rounded'
                  />
                )}
                <span>{prod.name}</span>
              </div>
              <button
                type='button'
                className='btn btn-xs btn-error'
                onClick={() => handleRemove(prod.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
          {selected.length === 0 && (
            <li className='text-gray-500 text-sm'>Ningún producto seleccionado</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HighlightProductSelector;
