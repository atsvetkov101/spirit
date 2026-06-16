
interface ActionData {
    serviceId: string;
}

interface Work {
    id: string;
    action: string;
    actionData: Partial<ActionData>;
}

export interface ChangeStatusCheckListUserData {
    works: Work[];
}
