import { OrderRepository } from './order-repository';
import { Order } from '@/domain/entities/order';
import { OrderLine } from '@/domain/entities/order-line';
import { Product } from '@/domain/entities/product';
import { OrderFactory } from '@/domain/factories/order-factory';
import { Money } from '@/domain/vo/money';

describe('OrderRepository комплексный тест создаем-сохраняем-извлекаем-проверяем заказ', () => {
    it('Тест создаем-сохраняем в репозиторий-извлекаем-проверяем заказ', async () => {
        const orderId = 'order-001';
        const repository = new OrderRepository();
        const validProduct = new Product('prod-001', 'Тестовый продукт', new Money(1000, 'RUB'));
        const validProduct2 = new Product('prod-002', 'Второй продукт', new Money(500, 'RUB'));
        const items = [
            { product: validProduct, quantity: 2 }, 
            { product: validProduct2, quantity: 3 }
        ];
        const order: Order = OrderFactory.createWithItems(items, orderId);
        repository.save(order);
        const retrieved = await repository.getById(orderId);

        const retrievedOrder: Order = retrieved as Order;
        expect(retrievedOrder).toBeDefined();
        expect(retrievedOrder.getId()).toBe(orderId)
        expect(retrievedOrder.getItems()).toHaveLength(2);
        retrievedOrder.getItems().forEach((line: OrderLine, index: number) => {
          expect(line.getQuantity()).toBe(items[index].quantity);
          expect(line.getProduct()).toBe(items[index].product);
        });
        expect(retrievedOrder.getTotal()).toEqual(new Money(3500, 'RUB'));


    });
});
