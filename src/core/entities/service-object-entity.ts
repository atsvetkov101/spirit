import { ServiceObjectImportDto } from "@/contracts/consumer/service-object-import.dto";

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

    getId(): string | null {
        return this.id;
    }

    getAddress(): string {
        return this.address;
    }

    getName(): string {
        return this.name;
    }

    getSearchCode(): string {
        return this.search_code;
    }

    getLat(): string {
        return this.lat;
    }

    getLng(): string {
        return this.lng;
    }

    getPhoneNumber(): string {
        return this.phone_number;
    }

    getTicketId(): string {
        return this.ticket_id;
    }

    setId(id: string): void {
        this.id = id;
    }
}