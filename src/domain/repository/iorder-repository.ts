import { Order } from "@/domain/entities/order";

export interface IOrderRepository {
    getById(id: string): Promise<Order | null>;
    getAll(): Promise<Order[]>;
    save(order: Order): Promise<void>;
    delete(id: string): Promise<void>;
}

