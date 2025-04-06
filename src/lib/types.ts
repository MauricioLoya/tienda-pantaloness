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

export const OrderStatus = {
  PROCESSING: 'processing',
  SUCCEED: 'succeed',
  SHIPPED: 'shipped',
  CANCELED: 'canceled',
};
