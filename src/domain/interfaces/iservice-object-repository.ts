import { ServiceObjectEntity } from '@/domain/entities/service-object-entity';

export interface IServiceObjectRepository {
  findById(id: string): Promise<ServiceObjectEntity | null>;
  findAll(): Promise<ServiceObjectEntity[]>;
  save(aggregate: ServiceObjectEntity): Promise<void>;
  delete(id: string): Promise<void>;
}