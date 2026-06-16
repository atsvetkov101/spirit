enum OrderStatus {
  Created = 'CREATED',
  Confirmed = 'CONFIRMED',
  AwaitingPayment = 'AWAITING_PAYMENT',
  Processing = 'PROCESSING',
  Delivering = 'DELIVERING',
  Delivered = 'DELIVERED',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Refunded = 'REFUNDED'
}

export default OrderStatus;
