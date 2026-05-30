import { OrderLine } from './order-line';
import { Product } from './product';
import { Money } from '../vo/money';

describe('Тесты для сущности OrderLine', () => {
  const validProduct = new Product('prod-001', 'Тестовый продукт', new Money(1000, 'RUB'));
  const validQuantity = 3;

  describe('создание через конструктор', () => {
    it('должен создать экземпляр OrderLine с валидными данными', () => {
      const orderLine = new OrderLine('line-001', validProduct, validQuantity);

      expect(orderLine.getId()).toBe('line-001');
      expect(orderLine.getProduct()).toBe(validProduct);
      expect(orderLine.getQuantity()).toBe(validQuantity);
    });

    it('должен вычислить price = product.price * quantity', () => {
      const orderLine = new OrderLine('line-001', validProduct, 3);

      const expectedPrice = new Money(3000, 'RUB');
      expect(orderLine.getPrice().equals(expectedPrice)).toBe(true);
    });

    it('должен выбросить ошибку, если quantity равен 0', () => {
      expect(() => new OrderLine('line-001', validProduct, 0)).toThrow(
        'Кол-во товара должно быть положительным',
      );
    });

    it('должен выбросить ошибку, если quantity отрицательный', () => {
      expect(() => new OrderLine('line-001', validProduct, -1)).toThrow(
        'Кол-во товара должно быть положительным',
      );
    });
  });

  describe('статический метод create', () => {
    it('должен создать OrderLine с переданным id', () => {
      const orderLine = OrderLine.create(validProduct, 2, 'custom-id');

      expect(orderLine.getId()).toBe('custom-id');
      expect(orderLine.getProduct()).toBe(validProduct);
      expect(orderLine.getQuantity()).toBe(2);
    });

    it('должен создать OrderLine с автоматически сгенерированным id, если id не передан', () => {
      const orderLine = OrderLine.create(validProduct, 2);

      expect(orderLine.getId()).toBeDefined();
      expect(typeof orderLine.getId()).toBe('string');
      expect(orderLine.getId().length).toBeGreaterThan(0);
    });

    it('должен вычислить price при создании через create', () => {
      const orderLine = OrderLine.create(validProduct, 5);

      const expectedPrice = new Money(5000, 'RUB');
      expect(orderLine.getPrice().equals(expectedPrice)).toBe(true);
    });
  });

  describe('геттеры', () => {
    it('должен вернуть id через getId', () => {
      const orderLine = new OrderLine('line-001', validProduct, 1);
      expect(orderLine.getId()).toBe('line-001');
    });

    it('должен вернуть product через getProduct', () => {
      const orderLine = new OrderLine('line-001', validProduct, 1);
      expect(orderLine.getProduct()).toBe(validProduct);
    });

    it('должен вернуть quantity через getQuantity', () => {
      const orderLine = new OrderLine('line-001', validProduct, 5);
      expect(orderLine.getQuantity()).toBe(5);
    });

    it('должен вернуть price через getPrice', () => {
      const orderLine = new OrderLine('line-001', validProduct, 2);
      const expectedPrice = new Money(2000, 'RUB');
      expect(orderLine.getPrice().equals(expectedPrice)).toBe(true);
    });
  });

  describe('сравнение (equals)', () => {
    it('должен считать две OrderLine равными, если id совпадают', () => {
      const line1 = new OrderLine('line-001', validProduct, 2);
      const line2 = new OrderLine('line-001', validProduct, 5);

      expect(line1.equals(line2)).toBe(true);
    });

    it('не должен считать две OrderLine равными, если id разные', () => {
      const line1 = new OrderLine('line-001', validProduct, 2);
      const line2 = new OrderLine('line-002', validProduct, 2);

      expect(line1.equals(line2)).toBe(false);
    });
  });

  describe('расчёт цены (price = product.price * quantity)', () => {
    it('должен корректно считать цену для quantity = 1', () => {
      const orderLine = new OrderLine('line-001', validProduct, 1);
      const expectedPrice = new Money(1000, 'RUB');
      expect(orderLine.getPrice().equals(expectedPrice)).toBe(true);
    });

    it('должен корректно считать цену для quantity = 10', () => {
      const orderLine = new OrderLine('line-001', validProduct, 10);
      const expectedPrice = new Money(10000, 'RUB');
      expect(orderLine.getPrice().equals(expectedPrice)).toBe(true);
    });

    it('должен корректно считать цену для продукта с ценой в USD', () => {
      const usdProduct = new Product('prod-002', 'Импортный товар', new Money(9.99, 'USD'));
      const orderLine = new OrderLine('line-002', usdProduct, 3);
      const expectedPrice = new Money(29.97, 'USD');
      expect(orderLine.getPrice().equals(expectedPrice)).toBe(true);
    });
  });
});