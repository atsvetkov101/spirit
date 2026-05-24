import { TicketImportDto } from "@/contracts/consumer/ticket-import.dto";
import { Ticket, TicketCreationAttributes } from "@/models/ticket.model";
import { Email } from "@/vo/email";
import { Transaction } from 'sequelize';

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
    
    public async save(transaction: Transaction | null = null): Promise<string> {
        const ticketData: TicketCreationAttributes = {
            id: this.id,
            consumer_id: this.consumer_id,
            consumer_email: this.consumer_email.getValue(),
            assignee_id: this.assignee_id,
            status: this.status,
            service: this.service,
            created_by: this.created_by,
            created_time: new Date(this.created_time),
            deadline: new Date(this.deadline),
            act_type: this.act_type,
            wiki_link: this.wiki_link,
            is_service_change_available: this.is_service_change_available,
        };

        const [ticket] = await Ticket.upsert(ticketData, { transaction });
        return ticket.id;
    }
}