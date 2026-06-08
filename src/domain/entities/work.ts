import { v4 as uuidv4 } from 'uuid';

export class Work {
    private id: string;
    private action: string;
    private actionData: object;

    constructor(action: string, actionData: object, id?: string) {
        this.id = id ?? uuidv4();
        this.action = action;
        this.actionData = actionData;
    }

    getId(): string {
        return this.id;
    }

    getAction(): string {
        return this.action;
    }

    getActionData(): object {
        return this.actionData;
    }

    
}

