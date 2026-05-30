import { Order } from "@/domain/aggregateroots/order";

export interface IOrderRepository {
    getById(id: string): Promise<Order | null>;
    getAll(): Promise<Order[]>;
    save(order: Order): Promise<void>;
    delete(id: string): Promise<void>;
}

