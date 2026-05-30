import { v4 as uuidv4 } from 'uuid';
import { Money } from "../vo/money";
import { Product } from "./product";

/**
 * класс OrderLine - строка заказа
 * @param id - идентификатор строки заказа
 * @param product - продукт
 * @param quantity - количество
 * @param price - цена
 * 
 */
export class OrderLine  {
    // цена заказа
    private price: Money;
    constructor(
        private readonly id: string,
        private readonly product: Product,
        private readonly quantity: number
    ) {
        if (quantity <= 0) {
            throw new Error('Кол-во товара должно быть положительным');
        }
        this.price = product.getPrice().multiply(quantity);
    }

    getId(): string {
        return this.id;
    }

    getProduct(): Product {
        return this.product;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getPrice(): Money {
        return this.price;
    }

    equals(other: OrderLine): boolean {
        return this.id === other.id;
    }

    static create(product: Product, quantity: number, id?: string): OrderLine {
        return new OrderLine(id ?? uuidv4(), product, quantity);
    }
}
