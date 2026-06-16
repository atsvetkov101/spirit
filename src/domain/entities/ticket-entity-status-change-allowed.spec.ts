import { TicketEntity } from './ticket-entity';
import TicketStatus from '../vo/ticket-status';
import { TicketImportDto } from '@/contracts/consumer/ticket-import.dto';

function makeTicket(overrides?: Partial<TicketImportDto>): TicketEntity {
  const dto: TicketImportDto = {
    id: 'ticket-001',
    consumer_id: 1,
    consumer_email: 'test@example.com',
    assignee_id: 2,
    status: TicketStatus.New,
    service: 'service-1',
    created_by: 1,
    created_time: '2025-01-01T00:00:00Z',
    deadline: '2025-01-10T00:00:00Z',
    act_type: 'act-1',
    wiki_link: 'https://wiki.example.com',
    is_service_change_available: true,
    service_object: {
      address: 'ул. Ленина, д. 1',
      name: 'Объект',
      search_code: 'SRC-001',
      coords: { lat: '55.7558', lng: '37.6173' },
      phone_number: '+7-123-456-78-90',
    },
    ...overrides,
  };
  return TicketEntity.fromDto(dto);
}

describe('TicketEntity.statusChangeAllowed', () => {
  describe('запрет перевода в тот же статус', () => {
    it.each([
      TicketStatus.New,
      TicketStatus.Assigned,
      TicketStatus.InProgress,
      TicketStatus.Done,
      TicketStatus.Canceled,
      TicketStatus.Closed,
    ])('должен вернуть false при попытке перевести тикет из статуса %s в тот же статус', (status) => {
      const ticket = makeTicket({ status });
      expect(ticket.statusChangeAllowed(status)).toBe(false);
    });
  });

  describe('запрет перевода из статуса Done', () => {
    it.each([
      TicketStatus.New,
      TicketStatus.Assigned,
      TicketStatus.InProgress,
      TicketStatus.Canceled,
      TicketStatus.Closed,
    ])('должен вернуть false при попытке перевести тикет из Done в %s', (targetStatus) => {
      const ticket = makeTicket({ status: TicketStatus.Done });
      expect(ticket.statusChangeAllowed(targetStatus)).toBe(false);
    });
  });

  describe('разрешённые переходы', () => {
    it.each([
      [TicketStatus.New, TicketStatus.Assigned],
      [TicketStatus.New, TicketStatus.InProgress],
      [TicketStatus.New, TicketStatus.Done],
      [TicketStatus.New, TicketStatus.Canceled],
      [TicketStatus.New, TicketStatus.Closed],
      [TicketStatus.Assigned, TicketStatus.New],
      [TicketStatus.Assigned, TicketStatus.InProgress],
      [TicketStatus.Assigned, TicketStatus.Done],
      [TicketStatus.Assigned, TicketStatus.Canceled],
      [TicketStatus.Assigned, TicketStatus.Closed],
      [TicketStatus.InProgress, TicketStatus.New],
      [TicketStatus.InProgress, TicketStatus.Assigned],
      [TicketStatus.InProgress, TicketStatus.Done],
      [TicketStatus.InProgress, TicketStatus.Canceled],
      [TicketStatus.InProgress, TicketStatus.Closed],
      [TicketStatus.Canceled, TicketStatus.New],
      [TicketStatus.Canceled, TicketStatus.Assigned],
      [TicketStatus.Canceled, TicketStatus.InProgress],
      [TicketStatus.Canceled, TicketStatus.Done],
      [TicketStatus.Canceled, TicketStatus.Closed],
      [TicketStatus.Closed, TicketStatus.New],
      [TicketStatus.Closed, TicketStatus.Assigned],
      [TicketStatus.Closed, TicketStatus.InProgress],
      [TicketStatus.Closed, TicketStatus.Done],
      [TicketStatus.Closed, TicketStatus.Canceled],
    ])('должен вернуть true при переводе из %s в %s', (currentStatus, targetStatus) => {
      const ticket = makeTicket({ status: currentStatus });
      expect(ticket.statusChangeAllowed(targetStatus)).toBe(true);
    });
  });
});
