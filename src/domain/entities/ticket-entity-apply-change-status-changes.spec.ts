import { TicketEntity } from './ticket-entity';
import TicketStatus from '../vo/ticket-status';
import { TicketImportDto } from '@/contracts/consumer/ticket-import.dto';
import { TicketUpdateData } from '../vo/ticket-update-data';
import { TicketStatusChangedEvent } from '../domain-events/ticket-status-changed-event';
import { TicketServiceChangedEvent } from '../domain-events/ticket-service-changed-event';

function makeTicket(overrides?: Partial<TicketImportDto>): TicketEntity {
  const dto: TicketImportDto = {
    id: 'ticket-001',
    consumer_id: 1,
    consumer_email: 'test@example.com',
    assignee_id: 2,
    status: TicketStatus.New,
    service: '',
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

function makeUpdateData(overrides?: Partial<TicketUpdateData>): TicketUpdateData {
  const data = new TicketUpdateData(
    overrides?.status ?? TicketStatus.Assigned,
    overrides?.service,
  );
  return data;
}

describe('TicketEntity.applyChangeStatusChanges', () => {
  describe('успешное изменение статуса', () => {
    it('должен изменить статус тикета на новый', () => {
      const ticket = makeTicket({ status: TicketStatus.New });
      const updateData = makeUpdateData({ status: TicketStatus.Assigned });

      ticket.applyChangeStatusChanges(updateData);

      expect(ticket.getStatus()).toBe(TicketStatus.Assigned);
    });

    it('должен добавить событие TicketStatusChangedEvent', () => {
      const ticket = makeTicket({ status: TicketStatus.New });
      const updateData = makeUpdateData({ status: TicketStatus.InProgress });

      ticket.applyChangeStatusChanges(updateData);

      const events = (ticket as any).events;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TicketStatusChangedEvent);
    });

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
    ])('должен успешно сменить статус с %s на %s', (currentStatus, targetStatus) => {
      const ticket = makeTicket({ status: currentStatus });
      const updateData = makeUpdateData({ status: targetStatus });

      expect(() => ticket.applyChangeStatusChanges(updateData)).not.toThrow();
      expect(ticket.getStatus()).toBe(targetStatus);
    });
  });

  describe('ошибки при недопустимом изменении статуса', () => {
    it.each([
      TicketStatus.New,
      TicketStatus.Assigned,
      TicketStatus.InProgress,
      TicketStatus.Done,
      TicketStatus.Canceled,
      TicketStatus.Closed,
    ])('должен бросить ошибку при попытке перевести в тот же статус %s', (status) => {
      const ticket = makeTicket({ status });
      const updateData = makeUpdateData({ status });

      expect(() => ticket.applyChangeStatusChanges(updateData)).toThrow('Такое изменение статуса не поддерживается');
    });

    it.each([
      TicketStatus.New,
      TicketStatus.Assigned,
      TicketStatus.InProgress,
      TicketStatus.Canceled,
      TicketStatus.Closed,
    ])('должен бросить ошибку при попытке перевести из Done в %s', (targetStatus) => {
      const ticket = makeTicket({ status: TicketStatus.Done });
      const updateData = makeUpdateData({ status: targetStatus });

      expect(() => ticket.applyChangeStatusChanges(updateData)).toThrow('Такое изменение статуса не поддерживается');
    });
  });

  describe('взаимодействие с setService', () => {
    it('должен изменить сервис на новое значение, если service передан в updateData', () => {
      const ticket = makeTicket({
        status: TicketStatus.New,
        service: 'service-1',
        is_service_change_available: true,
      });
      const updateData = makeUpdateData({
        status: TicketStatus.Assigned,
        service: 'service-2',
      });

      ticket.applyChangeStatusChanges(updateData);

      expect(ticket.getStatus()).toBe(TicketStatus.Assigned);
      expect(ticket.getService()).toBe('service-2');
    });

    it('должен добавить TicketServiceChangedEvent при смене сервиса через updateData', () => {
      const ticket = makeTicket({
        status: TicketStatus.New,
        service: 'service-1',
        is_service_change_available: true,
      });
      const updateData = makeUpdateData({
        status: TicketStatus.Assigned,
        service: 'service-2',
      });

      ticket.applyChangeStatusChanges(updateData);

      const events = (ticket as any).events;
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(TicketStatusChangedEvent);
      expect(events[1]).toBeInstanceOf(TicketServiceChangedEvent);
    });

    it('должен бросить ошибку, если service в updateData совпадает с текущим', () => {
      const ticket = makeTicket({
        status: TicketStatus.New,
        service: 'service-1',
        is_service_change_available: true,
      });
      const updateData = makeUpdateData({
        status: TicketStatus.Assigned,
        service: 'service-1',
      });

      expect(() => ticket.applyChangeStatusChanges(updateData)).toThrow(
        'Для изменения сервиса новое значение должно отличаться от текущего',
      );
    });

    it('должен бросить ошибку, если is_service_change_available = false', () => {
      const ticket = makeTicket({
        status: TicketStatus.New,
        service: 'service-1',
        is_service_change_available: false,
      });
      const updateData = makeUpdateData({
        status: TicketStatus.Assigned,
        service: 'service-2',
      });

      expect(() => ticket.applyChangeStatusChanges(updateData)).toThrow(
        'Смена сервиса не доступна',
      );
    });

    it('не должен менять сервис при ошибке смены сервиса (статус уже изменён до вызова setService)', () => {
      const ticket = makeTicket({
        status: TicketStatus.New,
        service: 'service-1',
        is_service_change_available: false,
      });
      const updateData = makeUpdateData({
        status: TicketStatus.Assigned,
        service: 'service-2',
      });

      try {
        ticket.applyChangeStatusChanges(updateData);
      } catch {
        // ignore
      }

      // Статус меняется до вызова setService, поэтому он уже изменён
      expect(ticket.getStatus()).toBe(TicketStatus.Assigned);
      // Сервис не должен измениться, так как setService выбросил ошибку
      expect(ticket.getService()).toBe('service-1');
    });
  });

  describe('изменение статуса не должно влиять на другие поля', () => {
    it('должен сохранить consumer_id', () => {
      const ticket = makeTicket({ consumer_id: 42 });
      const updateData = makeUpdateData({ status: TicketStatus.Assigned });

      ticket.applyChangeStatusChanges(updateData);

      expect(ticket.getConsumerId()).toBe(42);
    });

    it('должен сохранить assignee_id', () => {
      const ticket = makeTicket({ assignee_id: 10 });
      const updateData = makeUpdateData({ status: TicketStatus.Assigned });

      ticket.applyChangeStatusChanges(updateData);

      expect(ticket.getAssigneeId()).toBe(10);
    });

    it('должен сохранить consumer_email', () => {
      const ticket = makeTicket({ consumer_email: 'user@test.com' });
      const updateData = makeUpdateData({ status: TicketStatus.Assigned });

      ticket.applyChangeStatusChanges(updateData);

      expect(ticket.getConsumerEmail().getValue()).toBe('user@test.com');
    });
  });
});
