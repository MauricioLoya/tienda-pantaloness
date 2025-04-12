import React from 'react';
import StatsCards from './StatsCards';
import TopProductsTable from './TopProductsTable';
import SalesByCategoryTable from './SalesByCategoryTable';
import RecentOrdersTable from './RecentOrdersTable';


type TopProduct = {

    productName: string
    sales: number;
}
type RecentOrder = {
    orderId: number;
    customerName: string;
    totalAmount: number;
    status: string,
    orderDate: Date
}
type SalesByCategory = {
    categoryName: string;
    sales: number;
}

// Interface for the stats props
interface StatsProps {
    stats: {
        totalOrders: number;
        totalRevenue: number;
        avgOrderValue: number;
        topProducts: TopProduct[];
        recentOrders: RecentOrder[];
        salesByCategory: SalesByCategory[];
    };
}

// Pure presentational component that displays admin statistics
function AdminStats({ stats }: StatsProps) {
    return (
        <div className="p-6 min-h-screen">
            {/* Key Stats */}
            <StatsCards
                totalOrders={stats.totalOrders}
                totalRevenue={stats.totalRevenue}
                avgOrderValue={stats.avgOrderValue}
            />

            {/* Charts and Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Products */}
                <TopProductsTable products={stats.topProducts} />

                {/* Sales by Category */}
                <SalesByCategoryTable categories={stats.salesByCategory} />
            </div>

            {/* Recent Orders */}
            <RecentOrdersTable orders={stats.recentOrders} />
        </div>
    );
}

export default AdminStats;