import { v4 as uuidv4 } from 'uuid';
import { Order } from "../entities/order";
import { OrderLine } from "../entities/order-line";
import { Product } from "../entities/product";
import { Money } from "../vo/money";

/**
 * Фабрика для создания агрегата Order.
 */
export class OrderFactory {

    static create(orderId?: string): Order {
        return new Order(orderId ?? uuidv4());
    }

    /**
     * Создаёт заказ с несколькими строками заказа.
     * @param items - массив объектов OrderLine
     * @param orderId - идентификатор заказа (опционально)
     */
    static createWithItems(
        items: Array<{ product: Product; quantity: number; lineId?: string }>,
        orderId?: string,
    ): Order {
        const order = new Order(orderId ?? uuidv4());
        for (const item of items) {
            const line = OrderLine.create(item.product, item.quantity, item.lineId);
            order.addItem(line);
        }
        return order;
    }
}