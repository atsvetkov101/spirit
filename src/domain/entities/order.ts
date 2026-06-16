import { OrderLine } from "../entities/order-line";
import { Money } from "../vo/money";
import OrderStatus from "../vo/order-status";
import { DomainEvent } from "../domain-events/domain-event";
import { OrderConfirmedEvent } from "../domain-events/order-confirmed-event";

/**
 * класс Order - агрегат для работы с заказами. Конструктор принимает id заказа и массив строк заказа.
 * @param id - id заказа, защищен от изменения после создания объекта
 * @param items - массив строк заказа. Изменения только через методы addItem и removeItem с проверкой инвариантов
 *
 */
export class Order {
    private static readonly MAX_ITEMS = 10;

    private readonly id: string;
    private readonly items: OrderLine[];
    private status: OrderStatus;
    private events: DomainEvent[] = [];

    constructor(id: string, items: OrderLine[] = []) {
        if (!id || id.trim() === '') {
            throw new Error('ID заказа не может быть пустым');
        }
        this.id = id;
        this.items = [...items];
        this.status = OrderStatus.Created;
    }

    addItem(item: OrderLine): void {
        if (this.items.length >= Order.MAX_ITEMS) {
            throw new Error(`Максимальное количество товаров в заказе ${Order.MAX_ITEMS}`);
        }
        this.items.push(item);
    }

    removeItem(id: string): void {
        const index = this.items.findIndex(
            item => item.getId() === id
        );
        if (index === -1) {
            throw new Error(`Строка заказа с ID ${id} не найдена в заказе`);
        }
        this.items.splice(index, 1);
    }

    getId(): string {
        return this.id;
    }

    getStatus(): OrderStatus {
        return this.status;
    }

    /**
     * Возвращает массив строк заказа
     * Возвращает копию массива строк заказа
     */
    getItems(): ReadonlyArray<OrderLine> {
        return [...this.items];
    }

    getTotal(): Money {
        if (this.items.length === 0) {
            throw new Error('Невозможно подсчитать сумму пустого заказа');
        }
        return this.items
            .map(item => item.getPrice())
            .reduce((acc, price) => acc.add(price));
    }

    addDomainEvent(event: DomainEvent) {
        this.events.push(event);
    }

    сlearDomainEvents()
    {
        this.events.length = 0;
    }

    confirm(){
      if (this.items.length === 0) {
        throw new Error('Невозможно подтвердить пустой заказ');
      }
      // считаем, что только созданный заказ может быть подтвержден
      if (this.status !== OrderStatus.Created) {
        throw new Error('Заказ уже подтвержден');
      }
      this.status = OrderStatus.Confirmed;
      this.addDomainEvent(new OrderConfirmedEvent({ orderId: this.id }));
    }

    getDomainEvents(): ReadonlyArray<DomainEvent> {
      return [...this.events];
    }
}
