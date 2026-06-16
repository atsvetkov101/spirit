import { TicketEntity } from './ticket-entity';
import TicketStatus from '../vo/ticket-status';
import { TicketImportDto } from '@/contracts/consumer/ticket-import.dto';
import { TicketServiceChangedEvent } from '../domain-events/ticket-service-changed-event';

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

describe('TicketEntity.setService', () => {
  describe('успешная смена сервиса', () => {
    it('должен изменить сервис на новое значение', () => {
      const ticket = makeTicket({ service: 'service-1' });
      ticket.setService('service-2');
      expect(ticket.getService()).toBe('service-2');
    });

    it('должен добавить событие TicketServiceChangedEvent', () => {
      const ticket = makeTicket({ service: 'service-1' });
      ticket.setService('service-2');

      const events = (ticket as any).events;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TicketServiceChangedEvent);
    });
  });

  describe('смена сервиса недоступна', () => {
    it('должен выбросить ошибку, если is_service_change_available = false', () => {
      const ticket = makeTicket({
        service: 'service-1',
        is_service_change_available: false,
      });

      expect(() => ticket.setService('service-2')).toThrow('Смена сервиса не доступна');
    });

    it('не должен менять сервис при недоступной смене', () => {
      const ticket = makeTicket({
        service: 'service-1',
        is_service_change_available: false,
      });

      try {
        ticket.setService('service-2');
      } catch {
        // ignore
      }

      expect(ticket.getService()).toBe('service-1');
    });

    it('не должен добавлять событие при недоступной смене', () => {
      const ticket = makeTicket({
        service: 'service-1',
        is_service_change_available: false,
      });

      try {
        ticket.setService('service-2');
      } catch {
        // ignore
      }

      const events = (ticket as any).events;
      expect(events).toHaveLength(0);
    });
  });

  describe('новый сервис совпадает с текущим', () => {
    it('должен выбросить ошибку, если новое значение равно текущему', () => {
      const ticket = makeTicket({ service: 'service-1' });

      expect(() => ticket.setService('service-1')).toThrow(
        'Для изменения сервиса новое значение должно отличаться от текущего',
      );
    });

    it('не должен менять сервис при совпадающем значении', () => {
      const ticket = makeTicket({ service: 'service-1' });

      try {
        ticket.setService('service-1');
      } catch {
        // ignore
      }

      expect(ticket.getService()).toBe('service-1');
    });

    it('не должен добавлять событие при совпадающем значении', () => {
      const ticket = makeTicket({ service: 'service-1' });

      try {
        ticket.setService('service-1');
      } catch {
        // ignore
      }

      const events = (ticket as any).events;
      expect(events).toHaveLength(0);
    });
  });
});
