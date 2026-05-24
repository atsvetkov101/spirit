import { TicketImportDto } from "@/contracts/consumer/ticket-import.dto";
import { Email } from "@/vo/email";

export class TicketEntity {
    constructor(dto: TicketImportDto) {
        this.id = dto.id;
        this.consumer_id = dto.consumer_id;
        this.consumer_email = new Email(dto.consumer_email);
        this.assignee_id = dto.assignee_id;
        this.status = dto.status;
        this.service = dto.service;
        this.created_by = dto.created_by;
        
        const createdTime = new Date(dto.created_time);
        if (isNaN(createdTime.getTime())) {
            throw new Error(`Invalid created_time: ${dto.created_time}`);
        }
        this.created_time = createdTime;
        
        const deadline = new Date(dto.deadline);
        if (isNaN(deadline.getTime())) {
            throw new Error(`Invalid deadline: ${dto.deadline}`);
        }
        this.deadline = deadline;
        
        this.act_type = dto.act_type;
        this.wiki_link = dto.wiki_link;
        this.is_service_change_available = dto.is_service_change_available;
    }
    private id!: string;
    private consumer_id!: number;
    private consumer_email!: Email;
    private assignee_id!: number;
    private status!: string;
    private service!: string;
    private created_by!: number;
    private created_time!: Date;
    private deadline!: Date;
    private act_type!: string;
    private wiki_link!: string;
    private is_service_change_available!: boolean;

    public static fromDto(dto: TicketImportDto): TicketEntity {
        return new TicketEntity(dto);
    }

    getId(): string {
        return this.id;
    }

    getConsumerId(): number {
        return this.consumer_id;
    }

    getConsumerEmail(): Email {
        return this.consumer_email;
    }

    getAssigneeId(): number {
        return this.assignee_id;
    }

    getStatus(): string {
        return this.status;
    }

    getService(): string {
        return this.service;
    }

    getCreatedBy(): number {
        return this.created_by;
    }

    getCreatedTime(): Date {
        return this.created_time;
    }

    getDeadline(): Date {
        return this.deadline;
    }

    getActType(): string {
        return this.act_type;
    }

    getWikiLink(): string {
        return this.wiki_link;
    }

    isServiceChangeAvailable(): boolean {
        return this.is_service_change_available;
    }
}