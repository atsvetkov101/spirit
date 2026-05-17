export class TicketImportDto {
  readonly id: string;

  readonly consumer_id: number;

  readonly consumer_email: string;

  readonly assignee_id: number;

  readonly status: string;

  readonly service: string;

  readonly created_by: number;

  readonly created_time: string; // datetime as ISO string

  readonly deadline: string; // datetime as ISO string

  readonly act_type: string;

  readonly wiki_link: string;

  readonly is_service_change_available: boolean;

  readonly service_object: {
    readonly address: string;
    readonly name: string;
    readonly search_code: string;
    readonly coords: {
      readonly lat: string;
      readonly lng: string;
    };
    readonly phone_number: string;
  };
}