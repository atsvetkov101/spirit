import { v4 as uuidv4 } from 'uuid';

import { TicketImportDto } from "@/contracts/consumer/ticket-import.dto";
import { Email } from "@/domain/vo/email";
import { TicketUpdateData } from "../vo/ticket-update-data";
import TicketStatus from "../vo/ticket-status";
import { DomainEvent } from "../domain-events/domain-event";
import { TicketStatusChangedEvent } from "../domain-events/ticket-status-changed-event";
import { TicketServiceChangedEvent } from '../domain-events/ticket-service-changed-event';
export class TicketEntity {
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
    private events: DomainEvent[] = [];

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

    public static fromDto(dto: TicketImportDto): TicketEntity {
        return new TicketEntity(dto);
    }

    public static fromDb(data: {
        id: string;
        consumer_id: number;
        consumer_email: string;
        assignee_id: number;
        status: string;
        service: string;
        created_by: number;
        created_time: Date;
        deadline: Date;
        act_type: string;
        wiki_link: string;
        is_service_change_available: boolean;
    }): TicketEntity {
        const dto: TicketImportDto = {
            id: data.id,
            consumer_id: data.consumer_id,
            consumer_email: data.consumer_email,
            assignee_id: data.assignee_id,
            status: data.status,
            service: data.service,
            created_by: data.created_by,
            created_time: data.created_time.toISOString(),
            deadline: data.deadline.toISOString(),
            act_type: data.act_type,
            wiki_link: data.wiki_link,
            is_service_change_available: data.is_service_change_available,
            service_object: {
                address: '',
                name: '',
                search_code: '',
                coords: { lat: '', lng: '' },
                phone_number: '',
            },
        };
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

    statusChangeAllowed(newStatus: TicketStatus): boolean {
        if (this.status === newStatus) {
            // Нельзя перевести тикет в тот же статус
            return false;
        }
        if (this.status === TicketStatus.Done) {
          // Из статуса Завершен тикет не может быть переведен в другой статус
          return false;
        }
        return true;
    }

    // Выполняется ли закрытие тикета при переводе в новый статус
    isClosing(newStatus: TicketStatus): boolean {
        return (newStatus === TicketStatus.Closed || newStatus === TicketStatus.Canceled);
    }

    /**
     * Смена сервиса у заявки происходит в том случае если по факту прибытия на место, исполнитель выяснил
     * , что заявка заведена не верно и требуется изменить сервис
     */
    setService(newService: string) {
      if(this.service !== newService) {
        if(!this.is_service_change_available) {
            throw new Error('Смена сервиса не доступна');
        }
        this.service = newService;
        this.addDomainEvent(new TicketServiceChangedEvent({
          ticketId: this.id,
          newService: newService,
          eventId: uuidv4(),
          occurredAt: new Date()}));
      } else {
        throw new Error('Для изменения сервиса новое значение должно отличаться от текущего');
      }
    }

    applyChangeStatusChanges(newData: TicketUpdateData){
        if(!this.statusChangeAllowed(newData.status)) {
          throw new Error('Такое изменение статуса не поддерживается');
        }

        this.status = newData.status;
        this.addDomainEvent(
          new TicketStatusChangedEvent({ticketId: this.id,
          newStatus: newData.status,
          eventId: uuidv4(),
          occurredAt: new Date()})
        );

        // если передано изменение сервиса, то меняем сервис
        if(newData.service){
          this.setService(newData.service);
        }
    }

    addDomainEvent(event: DomainEvent) {
        this.events.push(event);
    }
}
