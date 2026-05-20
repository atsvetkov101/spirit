export class Money {
  private amount: number;
  private currency: string;
  static knownCurrencies = ['RUB', 'USD', 'EUR'];
  
  constructor(amount: number, currency: string) {
    if (amount < 0) {
        throw new Error(`Величина не может быть отрицательной: ${amount}`);
    }
    this.amount = amount;
    if (!Money.knownCurrencies.includes(currency)){
        throw new Error(`Неизвестная валюта: ${currency}`);
    }
    this.currency = currency;
  }
  
  getAmount(): number {
    return this.amount;
  }
  
  getCurrency(): string {
    return this.currency;
  }
  
  equals(money: Money): boolean {
    return this.amount === money.amount && this.currency === money.currency;
  }
  
  add(money: Money): Money {
    if (this.currency === money.currency) {
      return new Money(this.amount + money.amount, this.currency);
    } else {
      throw new Error(`Невозможно сложить две разные валюты: ${this.currency} and ${money.currency}`);
    }
  }
  
  subtract(money: Money): Money {   
    if (this.currency !== money.currency) {
        throw new Error(`Невозможно вычесть две разные валюты: ${this.currency} and ${money.currency}`);
    }
    if (this.amount >= money.amount) {
        return new Money(this.amount - money.amount, this.currency);
    } else {
        throw new Error(`Недостаточно средств для операции: ${this.amount} < ${money.amount}`);
    }
  }
  
  format(): string {
    switch (this.currency) {
      case 'USD':
        return `$${this.amount.toFixed(2)}`;
      case 'EUR':
        return `€${this.amount.toFixed(2)}`;
      case 'RUB':
        return `${this.amount} ₽`;
      default:
        return `${this.amount} ${this.currency}`;
    }
  }
}