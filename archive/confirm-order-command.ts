//C:\gh\spirit\src\application\order\confirm-order\confirm-order-command.ts
export class ConfirmOrderCommand {
    constructor(
        public readonly orderId: string,
        public readonly customerId?: string,
        public readonly customerEmail?: string
    ) {
    }
}
