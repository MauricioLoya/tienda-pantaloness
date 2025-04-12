import React, { Suspense } from 'react';
import AdminStatsRepositoryImpl from '@/modules/admin-dashboard/definitions';
import Header from '@/modules/admin-dashboard/components/Header';
import AdminStats from '@/modules/admin-dashboard/components/AdminStats';
import AdminFilters from '@/modules/admin-dashboard/components/AdminFilters';
import dayjs from 'dayjs';
import { RegionRepository } from '@/modules/region/definitions';

// Skeleton loader component for the admin page
const AdminSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>

      {/* Filter skeleton */}
      <div className="p-4 bg-gray-100 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 bg-gray-200 rounded w-40"></div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Charts and tables skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 rounded-lg h-64"></div>
        <div className="p-4 bg-gray-100 rounded-lg h-64"></div>
      </div>
    </div>
  );
};

// Data fetching component
const AdminDashboard = async ({ regionId, dateRange, regionsRepository }: {
  regionId: string,
  dateRange: { start: Date, end: Date },
  regionsRepository: RegionRepository
}) => {
  // Initialize the stats repository
  const statsRepo = new AdminStatsRepositoryImpl();

  // Fetch all stats in parallel
  const [
    ordersInRange,
    totalRevenue,
    avgOrderValue,
    topProducts,
    recentOrders,
    salesByCategory,
    regionsList
  ] = await Promise.all([
    statsRepo.getOrdersInDateRange(regionId, dateRange),
    statsRepo.getTotalRevenue(regionId, dateRange),
    statsRepo.getAvgOrderValue(regionId, dateRange),
    statsRepo.getTop5Products(regionId),
    statsRepo.getRecentOrders(regionId, 5),
    statsRepo.getSalesByCategory(regionId, dateRange),
    regionsRepository.getAll()
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
    <>
      <AdminFilters regions={regionsList} />
      <AdminStats stats={stats} />
    </>
  );
};

type AdminPageProps = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
const AdminPage = async ({ searchParams }: AdminPageProps) => {
  // Get parameters from URL or use defaults
  const urlParams = await searchParams;
  const regionId = (urlParams?.regionId as string) || 'mx';
  const startDate = (urlParams?.startDate as string) || dayjs().subtract(30, 'day').format('YYYY-MM-DD');
  const endDate = (urlParams?.endDate as string) || dayjs().format('YYYY-MM-DD');

  // Initialize repositories
  const regionsRepository = new RegionRepository();

  // Convert string dates to Date objects
  const dateRange = {
    start: dayjs(startDate).toDate(),
    end: dayjs(endDate).toDate()
  };

  return (
    <>
      <Header
        title='📈 Tu dashboard'
        description='Aquí puedes ver información relevante sobre el sistema.'
      />
      <Suspense fallback={<AdminSkeleton />}>
        <AdminDashboard
          regionId={regionId}
          dateRange={dateRange}
          regionsRepository={regionsRepository}
        />
      </Suspense>
    </>
  );
};

export default AdminPage;
