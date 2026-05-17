import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

export interface ServiceObjectAttributes {
  id: string;
  address: string;
  name: string;
  search_code: string;
  lat: string;
  lng: string;
  phone_number: string;
  ticket_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ServiceObjectCreationAttributes extends Optional<ServiceObjectAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class ServiceObject extends Model<ServiceObjectAttributes, ServiceObjectCreationAttributes> implements ServiceObjectAttributes {
  public id!: string;
  public address!: string;
  public name!: string;
  public search_code!: string;
  public lat!: string;
  public lng!: string;
  public phone_number!: string;
  public ticket_id!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ServiceObject.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    search_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticket_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tickets',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'service_objects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);