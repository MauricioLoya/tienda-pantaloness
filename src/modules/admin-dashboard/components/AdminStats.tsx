import React from 'react';
import AdminStatsRepositoryImpl from '../definitions';
import dayjs from 'dayjs';
import { DateRangePicker } from './DateRangePicker';
import StatsCards from './StatsCards';
import TopProductsTable from './TopProductsTable';
import SalesByCategoryTable from './SalesByCategoryTable';
import RecentOrdersTable from './RecentOrdersTable';
import { RegionSelectorWrapper } from './RegionSelectorWrapper';


// Server component that fetches and displays admin statistics
async function AdminStats({
    searchParams
}: {
    searchParams?: {
        regionId?: string;
        startDate?: string;
        endDate?: string;
    }
}) {
    // Get parameters from URL or use defaults
    const regionId = searchParams?.regionId || 'MX';
    const startDate = searchParams?.startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const endDate = searchParams?.endDate || dayjs().format('YYYY-MM-DD');

    // Initialize the stats repository
    const statsRepo = new AdminStatsRepositoryImpl();

    // Convert string dates to Date objects
    const dateRange = {
        start: dayjs(startDate).toDate(),
        end: dayjs(endDate).toDate()
    };

    // Fetch all stats in parallel
    const [
        ordersInRange,
        totalRevenue,
        avgOrderValue,
        topProducts,
        recentOrders,
        salesByCategory
    ] = await Promise.all([
        statsRepo.getOrdersInDateRange(regionId, dateRange),
        statsRepo.getTotalRevenue(regionId, dateRange),
        statsRepo.getAvgOrderValue(regionId, dateRange),
        statsRepo.getTop5Products(regionId),
        statsRepo.getRecentOrders(regionId, 5),
        statsRepo.getSalesByCategory(regionId, dateRange)
    ]);

    const stats = {
        totalOrders: ordersInRange.length,
        totalRevenue: totalRevenue.totalRevenue,
        avgOrderValue: avgOrderValue.avgValue,
        topProducts,
        recentOrders,
        salesByCategory
    };

    return (
        <div className="p-6  min-h-screen">


            {/* Filters (these will be client components) */}
            <div className="bg-base-100 shadow-xl rounded-box p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <RegionSelectorWrapper initialRegionId={regionId} />
                    <DateRangePicker initialStartDate={startDate} initialEndDate={endDate} />
                </div>
            </div>

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