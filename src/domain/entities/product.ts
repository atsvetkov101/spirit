import { Money } from "../vo/money";

export class Product {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly price: Money,
        private readonly sku?: string,
        private readonly description?: string
    ) {
        if (!id || id.trim() === '') {
            throw new Error('ID продукта не может быть пустым');
        }
        if (!name || name.trim() === '') {
            throw new Error('Название продукта не может быть пустым');
        }
        if (price.getAmount() <= 0) {
            throw new Error('Цена продукта должна быть положительной');
        }
    }

    public static create(
        id: string,
        name: string,
        price: Money,
        sku?: string,
        description?: string
    ): Product {
        return new Product(id, name, price, sku, description);
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getPrice(): Money {
        return this.price;
    }

    getSku(): string | undefined {
        return this.sku;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    equals(other: Product): boolean {
        return this.id === other.id;
    }
}