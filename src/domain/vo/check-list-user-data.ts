
type  WorkData = {
    id: string;
    action: string;
    actionData: object;
}

export class CheckListUserData{
    private works: WorkData[];
    constructor(works: WorkData[]){
        this.works = works;
    }

    /**
    * Возвращает копию массива работ
    */
    getWorks(): ReadonlyArray<WorkData> {
        return [...this.works];
    }
}
