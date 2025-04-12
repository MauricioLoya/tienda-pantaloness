import React from 'react';

interface TopProductsTableProps {
    products: { productName: string; sales: number }[];
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({ products }) => {
    return (
        <div className="bg-base-100 shadow-xl rounded-box p-6">
            <h2 className="text-xl font-bold mb-4">Top 5 Productos</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th className="text-right">Unidades Vendidas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index} className="hover">
                                <td>
                                    <span className="font-semibold">{index + 1}.</span> {product.productName}
                                </td>
                                <td className="text-right">{product.sales}</td>
                            </tr>
                        ))}
                        {products.length === 0 && (
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

export default TopProductsTable;