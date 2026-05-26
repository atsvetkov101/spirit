import { Money } from './money';

describe('Тесты для объекта-значение Money', () => {
  describe('создание', () => {
    it('должен создать экземпляр Money с допустимой суммой и валютой', () => {
      const money = new Money(100, 'USD');
      expect(money.getAmount()).toBe(100);
      expect(money.getCurrency()).toBe('USD');
    });

    it('должен выбросить ошибку, если сумма отрицательная', () => {
      expect(() => new Money(-10, 'EUR')).toThrow('Величина не может быть отрицательной: -10');
    });

    it('должен выбросить ошибку, если валюта пустая', () => {
      expect(() => new Money(50, '')).toThrow('Неизвестная валюта: ');
    });
  });

  describe('сравнение', () => {
    it('должен считать два объекта Money равными, если сумма и валюта одинаковые', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'USD');
      expect(money1.equals(money2)).toBe(true);
    });

    it('не должен считать два объекта Money равными, если валюты разные', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'EUR');
      expect(money1.equals(money2)).toBe(false);
    });

    it('не должен считать два объекта Money равными, если суммы разные', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(100, 'USD');
      expect(money1.equals(money2)).toBe(false);
    });
  });

  describe('сложение', () => {
    it('должен сложить два объекта Money с одинаковой валютой', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(30, 'USD');
      const result = money1.add(money2);
      expect(result.getAmount()).toBe(80);
      expect(result.getCurrency()).toBe('USD');
    });

    it('должен выбросить ошибку при сложении объектов Money с разными валютами', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(30, 'EUR');
      expect(() => money1.add(money2)).toThrow('Невозможно сложить две разные валюты: USD and EUR');
    });
  });

  describe('вычитание', () => {
    it('должен вычесть два объекта Money с одинаковой валютой', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(20, 'USD');
      const result = money1.subtract(money2);
      expect(result.getAmount()).toBe(30);
      expect(result.getCurrency()).toBe('USD');
    });

    it('должен выбросить ошибку при вычитании объектов Money с разными валютами', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(20, 'EUR');
      expect(() => money1.subtract(money2)).toThrow('Невозможно вычесть две разные валюты: USD and EUR');
    });

    it('должен выбросить ошибку, если результат вычитания - отрицательная сумма', () => {
      const money1 = new Money(30, 'USD');
      const money2 = new Money(50, 'USD');
      expect(() => money1.subtract(money2)).toThrow('Недостаточно средств для операции: 30 < 50');
    });
  });

  describe('форматирование', () => {
    it('должен форматировать денежную сумму как строку с символом валюты', () => {
      const money = new Money(123.45, 'USD');
      expect(money.format()).toBe('$123.45');

      const euroMoney = new Money(99.99, 'EUR');
      expect(euroMoney.format()).toBe('€99.99');

      const rubleMoney = new Money(1500, 'RUB');
      expect(rubleMoney.format()).toBe('1500 ₽');
    });
  });
});