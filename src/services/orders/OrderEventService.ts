import { EventEmitter } from 'events';

export class OrderEventService {
  private static instance: OrderEventService;
  private eventEmitter: EventEmitter;

  private constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public static getInstance(): OrderEventService {
    if (!OrderEventService.instance) {
      OrderEventService.instance = new OrderEventService();
    }
    return OrderEventService.instance;
  }

  public emit<T>(eventName: string, data: T) {
    this.eventEmitter.emit(eventName, data);
  }

  public on<T>(eventName: string, listener: (data: T) => void) {
    this.eventEmitter.on(eventName, listener);
  }
}
