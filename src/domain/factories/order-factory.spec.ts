import { OrderFactory } from './order-factory';
import { Order } from '../entities/order';
import { OrderLine } from '../entities/order-line';
import { Product } from '../entities/product';
import { Money } from '../vo/money';

describe('OrderFactory', () => {
  const validProduct = new Product('prod-001', 'Тестовый продукт', new Money(1000, 'RUB'));
  const validProduct2 = new Product('prod-002', 'Второй продукт', new Money(500, 'RUB'));

  describe('create', () => {
    it('должен создать заказ с переданным orderId', () => {
      const order = OrderFactory.create('order-001');

      expect(order).toBeInstanceOf(Order);
      expect(order.getId()).toBe('order-001');
    });

    it('должен создать заказ с UUID, если orderId не передан', () => {
      const order = OrderFactory.create();

      expect(order).toBeInstanceOf(Order);
      expect(order.getId()).toBeDefined();
      // UUID v4 имеет формат xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx
      expect(order.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('должен создать пустой заказ (без позиций)', () => {
      const order = OrderFactory.create('order-001');

      expect(order.getItems()).toHaveLength(0);
    });

    it('должен создавать уникальные заказы при каждом вызове без orderId', () => {
      const order1 = OrderFactory.create();
      const order2 = OrderFactory.create();

      expect(order1.getId()).not.toBe(order2.getId());
    });
  });

  describe('createWithItems', () => {
    it('должен создать заказ с одной позицией', () => {
      const items = [{ product: validProduct, quantity: 2 }];
      const order = OrderFactory.createWithItems(items, 'order-001');

      expect(order).toBeInstanceOf(Order);
      expect(order.getId()).toBe('order-001');
      expect(order.getItems()).toHaveLength(1);

      const line = order.getItems()[0];
      expect(line.getProduct()).toBe(validProduct);
      expect(line.getQuantity()).toBe(2);
    });

    it('должен создать заказ с несколькими позициями', () => {
      const items = [
        { product: validProduct, quantity: 2 },
        { product: validProduct2, quantity: 3 },
      ];
      const order = OrderFactory.createWithItems(items, 'order-002');

      expect(order.getItems()).toHaveLength(2);
      expect(order.getItems()[0].getQuantity()).toBe(2);
      expect(order.getItems()[1].getQuantity()).toBe(3);
    });

    it('должен создать заказ с UUID, если orderId не передан', () => {
      const items = [{ product: validProduct, quantity: 1 }];
      const order = OrderFactory.createWithItems(items);

      expect(order).toBeInstanceOf(Order);
      expect(order.getId()).toBeDefined();
      expect(order.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('должен создать заказ с кастомным lineId для позиции', () => {
      const items = [{ product: validProduct, quantity: 1, lineId: 'custom-line-id' }];
      const order = OrderFactory.createWithItems(items, 'order-003');

      expect(order.getItems()[0].getId()).toBe('custom-line-id');
    });

    it('должен корректно рассчитывать общую сумму заказа', () => {
      const items = [
        { product: validProduct, quantity: 2 },   // 1000 * 2 = 2000
        { product: validProduct2, quantity: 3 },  //  500 * 3 = 1500
      ];
      const order = OrderFactory.createWithItems(items, 'order-004');

      const total = order.getTotal();
      expect(total.getAmount()).toBe(3500);
      expect(total.getCurrency()).toBe('RUB');
    });

    it('должен выбросить ошибку при превышении лимита в 10 позиций', () => {
      const items = Array.from({ length: 11 }, (_, i) => ({
        product: validProduct,
        quantity: 1,
      }));

      expect(() => OrderFactory.createWithItems(items, 'order-005')).toThrow(
        'Максимальное количество товаров в заказе 10',
      );
    });

    it('должен создать заказ ровно с 10 позициями (граничное значение)', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        product: validProduct,
        quantity: 1,
      }));

      const order = OrderFactory.createWithItems(items, 'order-006');
      expect(order.getItems()).toHaveLength(10);
    });

    it('должен создать заказ с пустым массивом items', () => {
      const order = OrderFactory.createWithItems([], 'order-007');

      expect(order.getItems()).toHaveLength(0);
    });

    it('должен создавать уникальные заказы при каждом вызове без orderId', () => {
      const items = [{ product: validProduct, quantity: 1 }];
      const order1 = OrderFactory.createWithItems(items);
      const order2 = OrderFactory.createWithItems(items);

      expect(order1.getId()).not.toBe(order2.getId());
    });
  });
});