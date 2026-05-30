import { Order } from "@/domain/entities/order";
import { IOrderRepository } from "@/domain/repository/iorder-repository";

export class OrderRepository implements IOrderRepository {
    private orders: Map<string, Order> = new Map();
     
    async getById(id: string): Promise<Order | null> {
        const product = this.orders.get(id);
        return product || null;
    }

    async getAll(): Promise<Order[]> {
        return Array.from(this.orders.values());
    }

    async save(order: Order): Promise<void> {
        this.orders.set(order.getId(), order);
    }

    async delete(id: string): Promise<void> {
        this.orders.delete(id);
    }
}
    