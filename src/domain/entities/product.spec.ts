import { Product } from './product';
import { Money } from '../vo/money';

describe('Тесты для сущности Product', () => {
  const validId = 'prod-001';
  const validName = 'Тестовый продукт';
  const validPrice = new Money(1000, 'RUB');

  describe('создание через конструктор', () => {
    it('должен создать экземпляр Product с валидными данными', () => {
      const product = new Product(validId, validName, validPrice);

      expect(product.getId()).toBe(validId);
      expect(product.getName()).toBe(validName);
      expect(product.getPrice()).toBe(validPrice);
    });

    it('должен создать экземпляр Product с опциональными полями (sku, description)', () => {
      const product = new Product(validId, validName, validPrice, 'SKU-123', 'Описание товара');

      expect(product.getSku()).toBe('SKU-123');
      expect(product.getDescription()).toBe('Описание товара');
    });

    it('должен создать экземпляр Product без опциональных полей', () => {
      const product = new Product(validId, validName, validPrice);

      expect(product.getSku()).toBeUndefined();
      expect(product.getDescription()).toBeUndefined();
    });

    it('должен выбросить ошибку, если id пустой', () => {
      expect(() => new Product('', validName, validPrice)).toThrow('ID продукта не может быть пустым');
    });

    it('должен выбросить ошибку, если id состоит только из пробелов', () => {
      expect(() => new Product('   ', validName, validPrice)).toThrow('ID продукта не может быть пустым');
    });

    it('должен выбросить ошибку, если name пустой', () => {
      expect(() => new Product(validId, '', validPrice)).toThrow('Название продукта не может быть пустым');
    });

    it('должен выбросить ошибку, если name состоит только из пробелов', () => {
      expect(() => new Product(validId, '   ', validPrice)).toThrow('Название продукта не может быть пустым');
    });

    it('должен выбросить ошибку, если цена равна нулю', () => {
      const zeroPrice = new Money(0, 'RUB');
      expect(() => new Product(validId, validName, zeroPrice)).toThrow('Цена продукта должна быть положительной');
    });

  });

  describe('статический метод create', () => {
    it('должен создать экземпляр Product через статический метод', () => {
      const product = Product.create(validId, validName, validPrice, 'SKU-456', 'Описание');

      expect(product).toBeInstanceOf(Product);
      expect(product.getId()).toBe(validId);
      expect(product.getName()).toBe(validName);
      expect(product.getPrice()).toBe(validPrice);
      expect(product.getSku()).toBe('SKU-456');
      expect(product.getDescription()).toBe('Описание');
    });

    it('должен создать экземпляр Product без опциональных параметров', () => {
      const product = Product.create(validId, validName, validPrice);

      expect(product).toBeInstanceOf(Product);
      expect(product.getSku()).toBeUndefined();
      expect(product.getDescription()).toBeUndefined();
    });
  });

  describe('геттеры', () => {
    it('должен вернуть id через getId', () => {
      const product = new Product(validId, validName, validPrice);
      expect(product.getId()).toBe(validId);
    });

    it('должен вернуть name через getName', () => {
      const product = new Product(validId, validName, validPrice);
      expect(product.getName()).toBe(validName);
    });

    it('должен вернуть price через getPrice', () => {
      const product = new Product(validId, validName, validPrice);
      expect(product.getPrice()).toBe(validPrice);
    });

    it('должен вернуть sku через getSku', () => {
      const product = new Product(validId, validName, validPrice, 'SKU-999');
      expect(product.getSku()).toBe('SKU-999');
    });

    it('должен вернуть description через getDescription', () => {
      const product = new Product(validId, validName, validPrice, undefined, 'Описание');
      expect(product.getDescription()).toBe('Описание');
    });
  });

  describe('сравнение (equals)', () => {
    it('должен считать два продукта равными, если id совпадают', () => {
      const product1 = new Product('prod-001', 'Продукт A', validPrice);
      const product2 = new Product('prod-001', 'Продукт B', validPrice);

      expect(product1.equals(product2)).toBe(true);
    });

    it('не должен считать два продукта равными, если id разные', () => {
      const product1 = new Product('prod-001', 'Продукт A', validPrice);
      const product2 = new Product('prod-002', 'Продукт A', validPrice);

      expect(product1.equals(product2)).toBe(false);
    });
  });
});