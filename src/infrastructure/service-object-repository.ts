import { ServiceObjectEntity } from '@/core/entities/service-object-entity';
import { ServiceObject, ServiceObjectCreationAttributes } from '@/models/service-object.model';
import { Transaction } from 'sequelize';
import { IServiceObjectRepository } from '@/core/interfaces/iservice-object-repository';

export class ServiceObjectRepository implements IServiceObjectRepository {
  async save(aggregate: ServiceObjectEntity, transaction: Transaction | null = null): Promise<void> {
    const serviceObjectData: ServiceObjectCreationAttributes = {
      address: aggregate.getAddress(),
      name: aggregate.getName(),
      search_code: aggregate.getSearchCode(),
      lat: aggregate.getLat(),
      lng: aggregate.getLng(),
      phone_number: aggregate.getPhoneNumber(),
      ticket_id: aggregate.getTicketId(),
    };

    // Если id уже есть (например, при обновлении), передаем его
    const id = aggregate.getId();
    if (id !== null) {
      serviceObjectData.id = id;
    }

    const [instance] = await ServiceObject.upsert(serviceObjectData, { transaction });
    // Устанавливаем ID в сущности, если он был сгенерирован
    aggregate.setId(instance.id);
  }

  async findById(id: string): Promise<ServiceObjectEntity | null> {
    // TODO: Implement
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<ServiceObjectEntity[]> {
    // TODO: Implement
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    // TODO: Implement
    throw new Error('Method not implemented.');
  }
}