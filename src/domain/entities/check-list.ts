import { Work } from "./work";

/*
 * Класс для хранения данных о чек-листе
 * Содержит список выполненных работ
 */
export class CheckList {
    private readonly id: string;
    private readonly works: Work[];

    constructor(id: string, works: Work[] = []) {
        this.id = id;
        this.works = works;
    }

    addWork(item: Work): void {
        this.works.push(item);
    }

    removeWork(id: string): void {
        const index = this.works.findIndex(
            item => item.getId() === id
        );
        if (index === -1) {
            throw new Error(`Работа с ID ${id} не найдена в чек-листе`);
        }
        this.works.splice(index, 1);
    }
    /**
     * Возвращает копию массива работ
     */
    getWorks(): ReadonlyArray<Work> {
        return [...this.works];
    }
}
