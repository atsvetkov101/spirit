import { ServiceObjectEntity } from '@/domain/entities/service-object-entity';

export const SERVICE_OBJECT_REPOSITORY = Symbol('SERVICE_OBJECT_REPOSITORY');

export interface IServiceObjectRepository {
  findById(id: string): Promise<ServiceObjectEntity | null>;
  findAll(): Promise<ServiceObjectEntity[]>;
  save(aggregate: ServiceObjectEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
