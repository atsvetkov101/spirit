import { OrderRepository } from './order-repository';
import { Order } from '@/domain/aggregateroots/order';
import { OrderLine } from '@/domain/entities/order-line';
import { Product } from '@/domain/entities/product';
import { Money } from '@/domain/vo/money';

describe('Тесты для OrderRepository (in-memory)', () => {
  let repository: OrderRepository;

  const validProduct = new Product('prod-001', 'Тестовый продукт', new Money(1000, 'RUB'));
  const validProduct2 = new Product('prod-002', 'Второй продукт', new Money(500, 'RUB'));

  function makeOrderLine(product: Product, quantity: number, id?: string): OrderLine {
    return OrderLine.create(product, quantity, id);
  }

  function makeOrder(id: string, ...lines: OrderLine[]): Order {
    return new Order(id, lines);
  }

  beforeEach(() => {
    repository = new OrderRepository();
  });

  describe('save', () => {
    it('должен сохранить новый заказ', async () => {
      const order = makeOrder('order-001', makeOrderLine(validProduct, 2, 'line-001'));

      await repository.save(order);

      const saved = await repository.getById('order-001');
      expect(saved).not.toBeNull();
      expect(saved!.getId()).toBe('order-001');
    });

    it('должен перезаписать существующий заказ при повторном save', async () => {
      const order1 = makeOrder('order-001', makeOrderLine(validProduct, 2, 'line-001'));
      await repository.save(order1);

      const order2 = makeOrder('order-001', makeOrderLine(validProduct2, 5, 'line-002'));
      await repository.save(order2);

      const saved = await repository.getById('order-001');
      expect(saved).not.toBeNull();
      const items = saved!.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].getProduct().getId()).toBe('prod-002');
      expect(items[0].getQuantity()).toBe(5);
    });

    it('должен сохранить несколько заказов', async () => {
      const order1 = makeOrder('order-001', makeOrderLine(validProduct, 1, 'line-001'));
      const order2 = makeOrder('order-002', makeOrderLine(validProduct2, 3, 'line-002'));

      await repository.save(order1);
      await repository.save(order2);

      const all = await repository.getAll();
      expect(all).toHaveLength(2);
    });
  });

  describe('getById', () => {
    it('должен вернуть null для несуществующего заказа', async () => {
      const result = await repository.getById('non-existent');
      expect(result).toBeNull();
    });

    it('должен вернуть заказ по id', async () => {
      const order = makeOrder('order-001', makeOrderLine(validProduct, 2, 'line-001'));
      await repository.save(order);

      const result = await repository.getById('order-001');
      expect(result).not.toBeNull();
      expect(result!.getId()).toBe('order-001');
      expect(result!.getItems()).toHaveLength(1);
    });

    it('должен вернуть правильный заказ при наличии нескольких', async () => {
      const order1 = makeOrder('order-001', makeOrderLine(validProduct, 1, 'line-001'));
      const order2 = makeOrder('order-002', makeOrderLine(validProduct2, 3, 'line-002'));
      await repository.save(order1);
      await repository.save(order2);

      const result = await repository.getById('order-002');
      expect(result).not.toBeNull();
      expect(result!.getId()).toBe('order-002');
    });
  });

  describe('getAll', () => {
    it('должен вернуть пустой массив, если заказов нет', async () => {
      const result = await repository.getAll();
      expect(result).toEqual([]);
    });

    it('должен вернуть все сохранённые заказы', async () => {
      const order1 = makeOrder('order-001', makeOrderLine(validProduct, 1, 'line-001'));
      const order2 = makeOrder('order-002', makeOrderLine(validProduct2, 2, 'line-002'));
      const order3 = makeOrder('order-003', makeOrderLine(validProduct, 3, 'line-003'));

      await repository.save(order1);
      await repository.save(order2);
      await repository.save(order3);

      const result = await repository.getAll();
      expect(result).toHaveLength(3);
    });

    it('должен вернуть копию массива (иммутабельность)', async () => {
      const order = makeOrder('order-001', makeOrderLine(validProduct, 1, 'line-001'));
      await repository.save(order);

      const all = await repository.getAll();
      expect(all).toHaveLength(1);

      // мутация полученного массива не должна влиять на репозиторий
      (all as Order[]).pop();
      const allAgain = await repository.getAll();
      expect(allAgain).toHaveLength(1);
    });
  });

  describe('delete', () => {
    it('должен удалить существующий заказ', async () => {
      const order = makeOrder('order-001', makeOrderLine(validProduct, 1, 'line-001'));
      await repository.save(order);

      await repository.delete('order-001');

      const result = await repository.getById('order-001');
      expect(result).toBeNull();
    });

    it('не должен выбрасывать ошибку при удалении несуществующего заказа', async () => {
      await expect(repository.delete('non-existent')).resolves.not.toThrow();
    });

    it('должен удалить только указанный заказ', async () => {
      const order1 = makeOrder('order-001', makeOrderLine(validProduct, 1, 'line-001'));
      const order2 = makeOrder('order-002', makeOrderLine(validProduct2, 2, 'line-002'));
      await repository.save(order1);
      await repository.save(order2);

      await repository.delete('order-001');

      const all = await repository.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].getId()).toBe('order-002');
    });
  });
});