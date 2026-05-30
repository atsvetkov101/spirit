import { IProductRepository } from "@/domain/repository/iproduct-repository";
import { Product } from "@/domain/entities/product";

export class ProductRepository implements IProductRepository {
    private products: Map<string, Product> = new Map();

    async getById(id: string): Promise<Product | null> {
        const product = this.products.get(id);
        return product || null;
    }

    async getAll(): Promise<Product[]> {
        return Array.from(this.products.values());
    }

    async save(product: Product): Promise<void> {
        this.products.set(product.getId(), product);
    }

    async delete(id: string): Promise<void> {
        this.products.delete(id);
    }
}