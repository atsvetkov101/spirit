import { Injectable } from "@nestjs/common";
import { TicketDomainService } from "../../domain/domain-services/ticket-domain-service";
import { TicketRepository } from "@/infrastructure/repository/ticket-repository";
import { TicketUpdateData } from "@/domain/vo/ticket-update-data";
import { ChangeStatusTicketUpdateData } from "./ticket-app-service/dtos/change-status-ticket-update-data";
import { ChangeStatusCheckListUserData } from "./ticket-app-service/dtos/change-status-check-list-user-data";
import { TicketEntity } from "@/domain/entities/ticket-entity";
import { ChangeStatusMapper } from "../mappers/change-status-mapper";
import { CheckListUserData } from "@/domain/vo/check-list-user-data";
@Injectable()
export class TicketAppService {
  constructor(private readonly ticketDomainService: TicketDomainService,
    private readonly ticketRepository: TicketRepository
  ){}

  /**
   * Метод для изменения статуса тикета
   * Метод можно вызывать только для сохраненных в системе тикетов
   */
  async changeStatus(ticketId: string,
    inputTicketUpdateData: ChangeStatusTicketUpdateData,
    inputCheckListUserData: ChangeStatusCheckListUserData | undefined): Promise<string> {

    const ticket: TicketEntity | null = await this.ticketRepository.findById(ticketId);
    if(!ticket) {
      throw new Error('Такого тикета не существует');
    }

    const newData: TicketUpdateData = ChangeStatusMapper.toDomainTicketUpdateData(inputTicketUpdateData);
    const checkListUserData: CheckListUserData | undefined = ChangeStatusMapper.toDomainCheckListUserData(inputCheckListUserData);

    const res = await this.ticketDomainService.changeStatus(ticket, newData, checkListUserData);

    await this.ticketRepository.save(ticket);

    return Promise.resolve(res.ticket.getId());
  }

}
