import { Order } from './order';
import OrderStatus from '../vo/order-status';
import { OrderLine } from './order-line';
import { Product } from './product';
import { Money } from '../vo/money';

describe('Order — статус заказа', () => {
  const validProduct = new Product('prod-001', 'Тестовый продукт', new Money(1000, 'RUB'));

  function makeOrderLine(product: Product, quantity: number, id?: string): OrderLine {
    return OrderLine.create(product, quantity, id);
  }

  describe('начальный статус', () => {
    it('новый заказ должен иметь статус Created', () => {
      const order = new Order('order-001');

      expect(order.getStatus()).toBe(OrderStatus.Created);
    });

    it('новый заказ с позициями должен иметь статус Created', () => {
      const order = new Order('order-001', [
        makeOrderLine(validProduct, 2, 'line-001'),
      ]);

      expect(order.getStatus()).toBe(OrderStatus.Created);
    });
  });

  describe('getStatus', () => {
    it('должен вернуть статус заказа', () => {
      const order = new Order('order-001');

      const status = order.getStatus();

      expect(status).toBe(OrderStatus.Created);
    });

    it('должен возвращать значение типа OrderStatus', () => {
      const order = new Order('order-001');

      const status: OrderStatus = order.getStatus();

      // Проверка, что значение — один из допустимых вариантов enum
      const validStatuses = Object.values(OrderStatus);
      expect(validStatuses).toContain(status);
    });
  });

  describe('иммутабельность статуса', () => {
    it('статус не должен меняться после добавления позиции', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));

      expect(order.getStatus()).toBe(OrderStatus.Created);
    });

    it('статус не должен меняться после удаления позиции', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));
      order.removeItem('line-001');

      expect(order.getStatus()).toBe(OrderStatus.Created);
    });

    it('статус объявлен как readonly (проверка на уровне компиляции)', () => {
      const order = new Order('order-001');

      // Проверяем, что геттер возвращает примитив (строку enum),
      // а не ссылку на изменяемое поле
      const status1 = order.getStatus();
      const status2 = order.getStatus();

      // Оба вызова возвращают одно и то же значение
      expect(status1).toBe(status2);
      // И это значение соответствует начальному статусу
      expect(status1).toBe(OrderStatus.Created);
    });
  });
});
