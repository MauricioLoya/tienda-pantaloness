import React from 'react';

interface SalesByCategoryTableProps {
    categories: { categoryName: string; sales: number }[];
}

const SalesByCategoryTable: React.FC<SalesByCategoryTableProps> = ({ categories }) => {
    return (
        <div className="bg-base-100 shadow-xl rounded-box p-6">
            <h2 className="text-xl font-bold mb-4">Ventas por Categoría</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th className="text-right">Unidades Vendidas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={index} className="hover">
                                <td>{category.categoryName}</td>
                                <td className="text-right">{category.sales}</td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center py-4">No hay datos disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesByCategoryTable;