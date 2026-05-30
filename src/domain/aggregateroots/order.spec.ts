import { Order } from './order';
import { OrderLine } from '../entities/order-line';
import { Product } from '../entities/product';
import { Money } from '../vo/money';

describe('Тесты для агрегата Order', () => {
  const validProduct = new Product('prod-001', 'Тестовый продукт', new Money(1000, 'RUB'));
  const validProduct2 = new Product('prod-002', 'Второй продукт', new Money(500, 'RUB'));

  function makeOrderLine(product: Product, quantity: number, id?: string): OrderLine {
    return OrderLine.create(product, quantity, id);
  }

  describe('конструктор (валидация id)', () => {
    it('должен выбросить ошибку, если id пустой', () => {
      expect(() => new Order('')).toThrow('ID заказа не может быть пустым');
    });

    it('должен выбросить ошибку, если id состоит только из пробелов', () => {
      expect(() => new Order('   ')).toThrow('ID заказа не может быть пустым');
    });
  });

  describe('getId', () => {
    it('должен вернуть id заказа', () => {
      const order = new Order('order-001');
      expect(order.getId()).toBe('order-001');
    });
  });

  describe('addItem', () => {
    it('должен добавить OrderLine в заказ', () => {
      const order = new Order('order-001');
      const line = makeOrderLine(validProduct, 2, 'line-001');

      order.addItem(line);

      expect(order.getItems()).toHaveLength(1);
      expect(order.getItems()[0]).toBe(line);
    });

    it('должен добавить несколько позиций в заказ', () => {
      const order = new Order('order-001');
      const line1 = makeOrderLine(validProduct, 1, 'line-001');
      const line2 = makeOrderLine(validProduct2, 3, 'line-002');

      order.addItem(line1);
      order.addItem(line2);

      expect(order.getItems()).toHaveLength(2);
    });

    it('должен выбросить ошибку при превышении лимита в 10 товаров', () => {
      const order = new Order('order-001');

      for (let i = 0; i < 10; i++) {
        order.addItem(makeOrderLine(validProduct, 1, `line-${i}`));
      }

      expect(() => {
        order.addItem(makeOrderLine(validProduct, 1, 'line-extra'));
      }).toThrow('Максимальное количество товаров в заказе 10');
    });

    it('должен сохранить 10 элементов при добавлении ровно 10', () => {
      const order = new Order('order-001');

      for (let i = 0; i < 10; i++) {
        order.addItem(makeOrderLine(validProduct, 1, `line-${i}`));
      }

      expect(order.getItems()).toHaveLength(10);
    });
  });

  describe('removeItem', () => {
    it('должен удалить OrderLine по id', () => {
      const order = new Order('order-001');
      const line1 = makeOrderLine(validProduct, 1, 'line-001');
      const line2 = makeOrderLine(validProduct2, 2, 'line-002');

      order.addItem(line1);
      order.addItem(line2);

      order.removeItem('line-001');

      expect(order.getItems()).toHaveLength(1);
      expect(order.getItems()[0].getId()).toBe('line-002');
    });

    it('должен выбросить ошибку, если строка с указанным id не найдена', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));

      expect(() => order.removeItem('non-existent')).toThrow(
        'Строка заказа с ID non-existent не найдена в заказе',
      );
    });
  });

  describe('getItems', () => {
    it('должен вернуть пустой массив для нового заказа', () => {
      const order = new Order('order-001');

      expect(order.getItems()).toEqual([]);
    });

    /**
     * Проверяем: "внешний код не может напрямую изменить коллекцию строк заказа в обход корня"
     */
    it('должен вернуть копию массива (иммутабельность)', () => {
      const order = new Order('order-001');
      const line = makeOrderLine(validProduct, 1, 'line-001');
      order.addItem(line);

      const items = order.getItems();
      expect(items).toHaveLength(1);

      // мутация полученного массива не должна влиять на заказ
      (items as OrderLine[]).pop();
      expect(order.getItems()).toHaveLength(1);
    });
  });

  describe('getTotal', () => {
    it('должен выбросить ошибку для пустого заказа', () => {
      const order = new Order('order-001');

      expect(() => order.getTotal()).toThrow('Невозможно подсчитать сумму пустого заказа');
    });

    it('должен вернуть сумму одной позиции', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 3, 'line-001')); // 1000 * 3 = 3000

      const total = order.getTotal();
      expect(total.getAmount()).toBe(3000);
      expect(total.getCurrency()).toBe('RUB');
    });

    it('должен вернуть сумму нескольких позиций', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 2, 'line-001'));  // 1000 * 2 = 2000
      order.addItem(makeOrderLine(validProduct2, 3, 'line-002')); //  500 * 3 = 1500

      const total = order.getTotal();
      expect(total.getAmount()).toBe(3500);
      expect(total.getCurrency()).toBe('RUB');
    });

    it('должен корректно считать сумму после удаления позиции', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 2, 'line-001'));  // 2000
      order.addItem(makeOrderLine(validProduct2, 3, 'line-002')); // 1500

      order.removeItem('line-001');

      const total = order.getTotal();
      expect(total.getAmount()).toBe(1500);
    });

    it('должен выбросить ошибку при подсчёте суммы после удаления всех позиций', () => {
      const order = new Order('order-001');
      order.addItem(makeOrderLine(validProduct, 1, 'line-001'));
      order.removeItem('line-001');

      expect(() => order.getTotal()).toThrow('Невозможно подсчитать сумму пустого заказа');
    });
  });
});