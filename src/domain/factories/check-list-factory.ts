import { v4 as uuidv4 } from 'uuid';
import { CheckList } from "../entities/check-list";
import { Work } from "../entities/work";
import { CheckListUserData } from '../vo/check-list-user-data';

export class CheckListFactory {

    static create(id?: string): CheckList {
      return new CheckList(id ?? uuidv4());
    }

    /**
     * Создаёт чек-лист по данным пользователя.
     * @param data - данные для создания чек-листа
     * @param id - идентификатор чек-листа (опционально)
     */
    static createByUserData(data: CheckListUserData, id?: string): CheckList {
        const checkList = new CheckList(id ?? uuidv4());
        for (const workInfo of data.getWorks()) {
            checkList.addWork(
                new Work(
                workInfo.action,
                workInfo.actionData,
                workInfo.id
            ))
        }
        return checkList;
    }

    /**
     * Создаёт чек-лист с переданными работами.
     * @param works - массив работ для добавления в чек-лист
     * @param checkListId - идентификатор чек-листа (опционально)
     */
    static createWithWorks(
        works: Array<{ action: string; actionData: object; workId?: string }>,
        checkListId?: string,
    ): CheckList {
        const checkList = CheckListFactory.create(checkListId);
        for (const item of works) {
            const work = new Work(item.action, item.actionData, item.workId);
            checkList.addWork(work);
        }
        return checkList;
    }
}
