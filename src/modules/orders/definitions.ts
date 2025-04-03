import { prisma } from '@/lib/prima/client';
import { Customer, Order, OrderItem, Payment, Promotion } from '@prisma/client';

export type OrderAdminTableRow = {
  id: number;
  orderNumber: string;
  client: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  itemsCount: number;
  paymentMethod: string;
  regionId?: string;
};

export type OrderDetail = {
  order: Order;
  items: OrderItem[];
  payment: Payment;
  customer: Customer;
  promotion: Promotion | null;
};

interface IOrderRepository {
  createOrder(order: Order): Promise<Order>;
  getOrderById(id: number): Promise<OrderDetail>;
  getOrders(): Promise<OrderAdminTableRow[]>;
}

export class OrderRepository implements IOrderRepository {
  async createOrder(order: Order): Promise<Order> {
    return order;
  }

  async getOrderById(id: number): Promise<OrderDetail> {
    try {
      const order = await prisma.order.findFirst({
        where: { id },
        include: {
          customer: true,
          OrderItem: true,
          Payment: true,
          promotion: true,
        },
      });

      if (!order) {
        throw new Error('Orden no encontrada');
      }

      return {
        order,
        items: order.OrderItem,
        payment: order.Payment[0],
        customer: order.customer,
        promotion: order.promotion,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener la orden');
    }
  }

  async getOrders(): Promise<OrderAdminTableRow[]> {
    try {
      const orders = await prisma.order.findMany({
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          orderDate: true,
          regionId: true,
          customer: {
            select: { name: true },
          },
          OrderItem: {
            select: { id: true },
          },
          Payment: {
            select: { paymentType: true },
          },
        },
      });

      return orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        client: order.customer.name,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.orderDate,
        itemsCount: order.OrderItem.length,
        paymentMethod: order.Payment.length > 0 ? order.Payment[0].paymentType : 'No definido',
        regionId: order.regionId || '',
      }));
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener las órdenes');
    }
  }
}
