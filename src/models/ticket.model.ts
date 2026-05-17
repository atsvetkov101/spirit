import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';
import { ServiceObject } from './service-object.model';

export interface TicketAttributes {
  id: string;
  consumer_id: number;
  consumer_email: string;
  assignee_id: number;
  status: string;
  service: string;
  created_by: number;
  created_time: Date;
  deadline: Date;
  act_type: string;
  wiki_link: string;
  is_service_change_available: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface TicketCreationAttributes extends Optional<TicketAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  public id!: string;
  public consumer_id!: number;
  public consumer_email!: string;
  public assignee_id!: number;
  public status!: string;
  public service!: string;
  public created_by!: number;
  public created_time!: Date;
  public deadline!: Date;
  public act_type!: string;
  public wiki_link!: string;
  public is_service_change_available!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Ассоциации
  public service_object?: ServiceObject;
}

Ticket.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    consumer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    consumer_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assignee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    act_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wiki_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_service_change_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'tickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Определение связей
Ticket.hasOne(ServiceObject, {
  foreignKey: 'ticket_id',
  as: 'service_object',
});

ServiceObject.belongsTo(Ticket, {
  foreignKey: 'ticket_id',
  as: 'ticket',
});