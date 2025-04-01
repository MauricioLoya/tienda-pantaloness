"use client";

import React, { useState, useMemo } from "react";

interface Product {
  id: number;
  name: string;
}

interface HighlightProductSelectorProps {
  availableProducts: Product[];
  selected: number[];
  onChange: (selected: number[]) => void;
}

const HighlightProductSelector: React.FC<HighlightProductSelectorProps> = ({
  availableProducts,
  selected,
  
  onChange,
}) => {
  const [filter, setFilter] = useState("");

  const filteredAvailable = useMemo(() => {
    return availableProducts.filter(
      (prod) =>
        !selected.includes(prod.id) &&
        prod.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [availableProducts, selected, filter]);

  const handleAdd = (id: number) => {
    if (selected.length < 4) {
      onChange([...selected, id]);
    }
  };

  const handleRemove = (id: number) => {
    onChange(selected.filter((pid) => pid !== id));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Panel de productos disponibles */}
      <div className="flex-1 border p-4 rounded">
        <h3 className="font-semibold mb-2">Productos Disponibles</h3>
        <input
          type="text"
          placeholder="Filtrar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {filteredAvailable.map((prod) => (
            <li key={prod.id} className="flex justify-between items-center">
              <span>{prod.name}</span>
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => handleAdd(prod.id)}
                disabled={selected.length >= 4}
              >
                Agregar
              </button>
            </li>
          ))}
          {filteredAvailable.length === 0 && (
            <li className="text-gray-500 text-sm">
              No hay productos disponibles
            </li>
          )}
        </ul>
      </div>
      {/* Panel de productos seleccionados */}
      <div className="flex-1 border p-4 rounded">
        <h3 className="font-semibold mb-2">
          Productos Seleccionados ({selected.length}/4)
        </h3>
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {selected.map((id) => {
            const prod = availableProducts.find((p) => p.id === id);
            if (!prod) return null;
            return (
              <li key={id} className="flex justify-between items-center">
                <span>{prod.name}</span>
                <button
                  type="button"
                  className="btn btn-xs btn-error"
                  onClick={() => handleRemove(id)}
                >
                  Eliminar
                </button>
              </li>
            );
          })}
          {selected.length === 0 && (
            <li className="text-gray-500 text-sm">
              Ningún producto seleccionado
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HighlightProductSelector;
