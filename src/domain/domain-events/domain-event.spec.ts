import { DomainEvent } from '../domain-events/domain-event';

describe('Тесты для DomainEvent', () => {
  describe('создание', () => {
    it('должен генерировать eventId автоматически', () => {
      const event = new DomainEvent();
      expect(event.EventId).toBeDefined();
    });

    it('должен генерировать CreatedAt автоматически', () => {
      const event = new DomainEvent('38601230-3e07-4359-9ad5-3fa96043ea9d');
      expect(event.OccurredAt).toBeDefined();
    });
  });
});

