export type ServerActionResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string | null>;
  error?: string;
  errorCode?: string;
};

export interface ModalCreateProps {
  title: string;
  triggerBtnTitle: string;
  children: React.ReactNode;
  actionBtnText: string;
  cancelBtnText: string;
  actionBtnFunction: (close: () => void) => void;
  cancelBtnFunction?: () => void;
  fullScreen?: boolean;
}

export type ToastType = 'success' | 'error' | 'info';

export enum OrderStatus {
  PENDING = 'pending',
  PENDING_SHIPPED = 'pending_shipment',
  SHIPPED = 'shipped',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.PENDING_SHIPPED]: 'Pendiente de envio',
  [OrderStatus.SHIPPED]: 'Enviado',
  [OrderStatus.CANCELLED]: 'Cancelado',
  [OrderStatus.REFUNDED]: 'Reembolsado',
  [OrderStatus.COMPLETED]: 'Completado',
};
