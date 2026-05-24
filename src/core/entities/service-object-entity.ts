import { ServiceObjectImportDto } from "@/contracts/consumer/service-object-import.dto";
import { ServiceObject, ServiceObjectCreationAttributes } from "@/models/service-object.model";
import { Transaction } from 'sequelize';

export class ServiceObjectEntity {
    constructor(dto: ServiceObjectImportDto, ticketId: string) {
        this.address = dto.address;
        this.name = dto.name;
        this.search_code = dto.search_code;
        this.lat = dto.coords.lat;
        this.lng = dto.coords.lng;
        this.phone_number = dto.phone_number;
        this.ticket_id = ticketId;
    }
    private id: string | null = null;
    private address: string;
    private name: string;
    private search_code: string;
    private lat: string;
    private lng: string;
    private phone_number: string;
    private ticket_id: string;

    public static fromDto(dto: ServiceObjectImportDto, ticketId: string): ServiceObjectEntity {
        return new ServiceObjectEntity(dto, ticketId);
    }

    getId(): string {
        if (this.id === null) {
            throw new Error('ServiceObject ID is not available before save');
        }
        return this.id;
    }
    
    public async save(transaction: Transaction | null = null): Promise<string> {
        const serviceObjectData: ServiceObjectCreationAttributes = {
            address: this.address,
            name: this.name,
            search_code: this.search_code,
            lat: this.lat,
            lng: this.lng,
            phone_number: this.phone_number,
            ticket_id: this.ticket_id,
        };
        // Если id уже есть (например, при обновлении), передаем его
        if (this.id !== null) {
            serviceObjectData.id = this.id;
        }

        const [serviceObject] = await ServiceObject.upsert(serviceObjectData, { transaction });
        this.id = serviceObject.id;
        return serviceObject.id;
    }
}