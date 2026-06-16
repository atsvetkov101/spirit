import { ChangeStatusTicketDto } from "./change-status-ticket-dto";

// Создаем тип: id и status — обязательны остальные поля из Ticket — необязательны
export type ChangeStatusTicketUpdateData = Pick<ChangeStatusTicketDto, 'id'| 'status'> & Partial<Omit<ChangeStatusTicketDto, 'id' | 'status'>>;

