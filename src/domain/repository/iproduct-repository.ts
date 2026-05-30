import { Product } from "../entities/product";

export interface IProductRepository {
    getById(id: string): Promise<Product | null>;
    getAll(): Promise<Product[]>;
    save(product: Product): Promise<void>;
    delete(id: string): Promise<void>;
}