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

describe('TicketEntity.isClosing', () => {
  describe('должен вернуть true для закрывающих статусов', () => {
    it.each([
      TicketStatus.Closed,
      TicketStatus.Canceled,
    ])('isClosing(%s) → true', (status) => {
      const ticket = makeTicket();
      expect(ticket.isClosing(status)).toBe(true);
    });
  });

  describe('должен вернуть false для не закрывающих статусов', () => {
    it.each([
      TicketStatus.New,
      TicketStatus.Assigned,
      TicketStatus.InProgress,
      TicketStatus.Done,
    ])('isClosing(%s) → false', (status) => {
      const ticket = makeTicket();
      expect(ticket.isClosing(status)).toBe(false);
    });
  });
});
