import { Order } from './order';
import OrderStatus from '../vo/order-status';
import { OrderLine } from './order-line';
import { Product } from './product';
import { Money } from '../vo/money';
import { OrderConfirmedEvent } from '../domain-events/order-confirmed-event';

describe('Order.confirm', () => {
  const validProduct = new Product('prod-001', 'Тестовый продукт', new Money(1000, 'RUB'));

  function makeOrderLine(product: Product, quantity: number, id?: string): OrderLine {
    return OrderLine.create(product, quantity, id);
  }

  describe('успешное подтверждение', () => {
    it('должен изменить статус заказа на Confirmed', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));

      order.confirm();

      expect(order.getStatus()).toBe(OrderStatus.Confirmed);
    });

    it('должен добавить событие OrderConfirmedEvent', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));

      order.confirm();

      const events = (order as any).events;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderConfirmedEvent);
    });

    it('событие OrderConfirmedEvent должно содержать правильный orderId', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));

      order.confirm();

      const event = (order as any).events[0] as OrderConfirmedEvent;
      expect(event.getOrderId()).toBe('order-001');
    });

    it('должен подтвердить заказ после добавления и удаления позиции', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));
      order.addItem(makeOrderLine(validProduct, 2, 'line-002'));
      order.removeItem('line-001');

      order.confirm();

      expect(order.getStatus()).toBe(OrderStatus.Confirmed);
    });
  });

  describe('пустой заказ', () => {
    it('должен выбросить ошибку при подтверждении заказа без позиций', () => {
      const order = new Order('order-001');

      expect(() => order.confirm()).toThrow('Невозможно подтвердить пустой заказ');
    });

    it('должен выбросить ошибку при подтверждении заказа, из которого удалили все позиции', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));
      order.removeItem('line-001');

      expect(() => order.confirm()).toThrow('Невозможно подтвердить пустой заказ');
    });

    it('не должен добавлять событие при ошибке', () => {
      const order = new Order('order-001');

      expect(() => order.confirm()).toThrow();

      const events = (order as any).events;
      expect(events).toHaveLength(0);
    });
  });

  describe('повторное подтверждение', () => {
    it('должен выбросить ошибку при повторном confirm', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));
      order.confirm();

      expect(() => order.confirm()).toThrow('Заказ уже подтвержден');
    });

    it('не должен добавлять второе событие при повторном confirm', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));
      order.confirm();

      expect(() => order.confirm()).toThrow();

      const events = (order as any).events;
      expect(events).toHaveLength(1);
    });
  });
});
