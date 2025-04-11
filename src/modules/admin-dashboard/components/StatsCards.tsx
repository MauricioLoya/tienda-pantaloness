import React from 'react';

interface StatsCardsProps {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalOrders, totalRevenue, avgOrderValue }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stat bg-base-100 shadow-xl rounded-box">
                <div className="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div className="stat-title">Total de Órdenes</div>
                <div className="stat-value text-primary">{totalOrders}</div>
                <div className="stat-desc">Para el rango de fechas seleccionado</div>
            </div>

            <div className="stat bg-base-100 shadow-xl rounded-box">
                <div className="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                    </svg>
                </div>
                <div className="stat-title">Ingresos Totales</div>
                <div className="stat-value text-secondary">{formatCurrency(totalRevenue)}</div>
                <div className="stat-desc">Para el rango de fechas seleccionado</div>
            </div>

            <div className="stat bg-base-100 shadow-xl rounded-box">
                <div className="stat-figure text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                </div>
                <div className="stat-title">Valor Promedio de Orden</div>
                <div className="stat-value text-accent">{formatCurrency(avgOrderValue)}</div>
                <div className="stat-desc">Para el rango de fechas seleccionado</div>
            </div>
        </div>
    );
};

export default StatsCards;