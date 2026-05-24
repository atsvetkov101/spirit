export class ServiceObjectImportDto {
    readonly address!: string;
    readonly name!: string;
    readonly search_code!: string;
    readonly coords!: {
        readonly lat: string;
        readonly lng: string;
    };
    readonly phone_number!: string;
}