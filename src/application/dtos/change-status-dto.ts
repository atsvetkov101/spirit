
type  WorkData = {
    id: string;
    action: string;
    actionData: object;
}

export class ChangeStatusDto {
  ticketId!: string;
  serviceId!: string;
  checkList?: {
    works: WorkData[];
  };
}
