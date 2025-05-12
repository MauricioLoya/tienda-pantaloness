import { EmailService } from './../../services/email/EmailService';
import { prisma } from '@/lib/prima/client';
import { formatPrice } from '@/lib/utils';
import OrderConfirmationEmail from '@/services/email/templates/OrderConfirmation';
import { Customer, Order, OrderItem, Payment, Promotion } from '@prisma/client';

export type OrderStatusInput = {
  status: string;
};

export type OrderStatusItem = {
  id: number;
  status: string;
};

export type OrderAdminTableRow = {
  id: number;
  orderNumber: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
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
  resendEmailCorfirmation(orderId: number, emailService: EmailService): Promise<void>;
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
            select: { name: true, email: true, phone: true },
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
        orderNumber: order.orderNumber || 'N/A',
        client: {
          name: order.customer.name || 'N/A',
          email: order.customer.email || 'N/A',
          phone: order.customer.phone || 'N/A',
        },
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
  async resendEmailCorfirmation(orderId: number, emailService: EmailService): Promise<void> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
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

      const subject = `${order.regionId === 'mx' ? 'Confirmación de pedido' : 'Order Confirmation'} ${order.orderNumber}`;

      const items = order.OrderItem.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: formatPrice(item.price),
        subtotal: formatPrice(item.price * item.quantity),
      }));
      const orderTotal = order.totalAmount;

      const shippingAddress = `${order.shipping_line1}, ${order.shipping_line2}, ${order.city}, ${order.state}, ${order.postalCode}, ${order.country}`;
      console.log('region', order.regionId);

      await emailService.sendEmail({
        to: order.customer.email,
        subject,
        html: OrderConfirmationEmail({
          region: order.regionId!.toLowerCase(),
          orderNumber: order.orderNumber!,
          items,
          orderDate: order.orderDate.toISOString(),
          orderTotal: formatPrice(orderTotal),
          shippingAddress,
        }),
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error al reenviar el correo de confirmación');
    }
  }
}
