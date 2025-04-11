import { prisma } from "@/lib/prima/client";


type DateRange = { start: Date; end: Date };



interface AdminStatsRepository {
    getNumberOfOrders: (date: Date, regionId: string) => Promise<{ result: number }>;
    getTop5Products: (regionId: string) => Promise<{ productName: string; sales: number }[]>;
    getTotalRevenue: (regionId: string, dateRange: DateRange) => Promise<{ totalRevenue: number }>;
    getOrdersInDateRange: (regionId: string, dateRange: DateRange) => Promise<{ orderId: number; totalAmount: number; orderDate: Date }[]>;
    getRecentOrders: (regionId: string, limit?: number) => Promise<{ orderId: number; customerName: string; totalAmount: number; status: string; orderDate: Date }[]>;
    getSalesByCategory: (regionId: string, dateRange: DateRange) => Promise<{ categoryName: string; sales: number }[]>;
    getAvgOrderValue: (regionId: string, dateRange: DateRange) => Promise<{ avgValue: number }>;
}

export default class AdminStatsRepositoryImpl implements AdminStatsRepository {
    async getNumberOfOrders(date: Date, regionId: string): Promise<{ result: number }> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const result = await prisma.order.count({
            where: {
                regionId,
                orderDate: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });
        return { result };
    }

    async getTop5Products(regionId: string): Promise<{ productName: string; sales: number }[]> {
        // Since the schema doesn't directly link OrderItem to Product, we'll use the productName in OrderItem
        const topProducts = await prisma.orderItem.groupBy({
            by: ['productName'],
            _sum: {
                quantity: true,
            },
            where: {
                order: {
                    regionId,
                },
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 5,
        });

        return topProducts.map(item => ({
            productName: item.productName,
            sales: item._sum.quantity || 0,
        }));
    }

    async getTotalRevenue(regionId: string, dateRange: DateRange): Promise<{ totalRevenue: number }> {
        const result = await prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                regionId,
                orderDate: {
                    gte: dateRange.start,
                    lte: dateRange.end,
                },
            },
        });

        return { totalRevenue: result._sum.totalAmount || 0 };
    }

    async getOrdersInDateRange(regionId: string, dateRange: DateRange): Promise<{ orderId: number; totalAmount: number; orderDate: Date }[]> {
        const orders = await prisma.order.findMany({
            where: {
                regionId,
                orderDate: {
                    gte: dateRange.start,
                    lte: dateRange.end,
                },
            },
            select: {
                id: true,
                totalAmount: true,
                orderDate: true,
            },
            orderBy: {
                orderDate: 'desc',
            },
        });

        return orders.map(order => ({
            orderId: order.id,
            totalAmount: order.totalAmount,
            orderDate: order.orderDate,
        }));
    }

    async getRecentOrders(regionId: string, limit: number = 5): Promise<{ orderId: number; customerName: string; totalAmount: number; status: string; orderDate: Date }[]> {
        const recentOrders = await prisma.order.findMany({
            where: {
                regionId,
            },
            select: {
                id: true,
                totalAmount: true,
                orderDate: true,
                status: true,
                customer: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                orderDate: 'desc',
            },
            take: limit,
        });

        return recentOrders.map(order => ({
            orderId: order.id,
            customerName: order.customer.name,
            totalAmount: order.totalAmount,
            status: order.status,
            orderDate: order.orderDate,
        }));
    }

    async getSalesByCategory(regionId: string, dateRange: DateRange): Promise<{ categoryName: string; sales: number }[]> {
        // This is more complex as it requires joining across multiple tables
        // We'll need to get products, their categories, and their order items
        const categories = await prisma.category.findMany({
            where: {
                regionId,
            },
            include: {
                ProductCategory: {
                    include: {
                        product: {
                            include: {
                                ProductVariant: true,
                            },
                        },
                    },
                },
            },
        });

        // This is a simplified version - in a real implementation, you would
        // need to join with orders to filter by date range and sum quantities
        const results = await Promise.all(
            categories.map(async (category) => {
                // Get all product IDs in this category
                
                // Get all product names in this category for filtering
                const productNames = category.ProductCategory.map(pc => pc.product.name);
                
                // Get total sales for these products in the date range
                const sales = await prisma.orderItem.aggregate({
                    _sum: {
                        quantity: true,
                    },
                    where: {
                        order: {
                            regionId,
                            orderDate: {
                                gte: dateRange.start,
                                lte: dateRange.end,
                            },
                        },
                        // Using product names for filtering since we can't directly use productIds
                        // in the current schema structure
                        productName: {
                            in: productNames,
                        },
                        // If schema has a direct reference to productId, we could use:
                        // productId: {
                        //     in: productIds,
                        // },
                    },
                });

                return {
                    categoryName: category.name,
                    sales: sales._sum.quantity || 0,
                };
            })
        );

        return results.sort((a, b) => b.sales - a.sales);
    }

    async getAvgOrderValue(regionId: string, dateRange: DateRange): Promise<{ avgValue: number }> {
        const result = await prisma.order.aggregate({
            _avg: {
                totalAmount: true,
            },
            where: {
                regionId,
                orderDate: {
                    gte: dateRange.start,
                    lte: dateRange.end,
                },
            },
        });

        return { avgValue: result._avg.totalAmount || 0 };
    }
}