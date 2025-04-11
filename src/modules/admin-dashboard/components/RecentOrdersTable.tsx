import React from 'react';
import dayjs from 'dayjs';

interface RecentOrdersTableProps {
    orders: {
        orderId: number;
        customerName: string;
        totalAmount: number;
        status: string;
        orderDate: Date;
    }[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return dayjs(date).format('DD/MM/YYYY');
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'Completada';
            case 'pending':
                return 'Pendiente';
            case 'cancelled':
                return 'Cancelada';
            case 'processing':
                return 'Procesando';
            default:
                return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'badge-success';
            case 'pending':
                return 'badge-warning';
            case 'cancelled':
                return 'badge-error';
            case 'processing':
                return 'badge-info';
            default:
                return 'badge-ghost';
        }
    };

    return (
        <div className="bg-base-100 shadow-xl rounded-box p-6">
            <h2 className="text-xl font-bold mb-4">Órdenes Recientes</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Orden ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId} className="hover">
                                <td>#{order.orderId}</td>
                                <td>{order.customerName}</td>
                                <td>{formatDate(order.orderDate)}</td>
                                <td>{formatCurrency(order.totalAmount)}</td>
                                <td>
                                    <div className={`badge ${getStatusClass(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </div>
                                </td>
                                <td>
                                    <button className="btn btn-xs btn-ghost">Ver</button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4">No hay órdenes recientes</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;