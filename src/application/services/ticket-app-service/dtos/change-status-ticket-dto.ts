export interface ChangeStatusTicketDto {
    id: string;
    status: 'closed' | 'canceled';
    service: string;
}
