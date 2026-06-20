import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';
import { OrderLineModel } from './order-line.model';

export interface OrderAttributes {
  id: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status' | 'created_at' | 'updated_at'> {}

export class OrderModel
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public status!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Ассоциации
  public items?: OrderLineModel[];
}

OrderModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'CREATED',
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Определение связей
OrderModel.hasMany(OrderLineModel, {
  foreignKey: 'order_id',
  as: 'items',
});

OrderLineModel.belongsTo(OrderModel, {
  foreignKey: 'order_id',
  as: 'order',
});
