import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

export interface OrderLineAttributes {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_amount: number;
  price_currency: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface OrderLineCreationAttributes extends Optional<OrderLineAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class OrderLineModel
  extends Model<OrderLineAttributes, OrderLineCreationAttributes>
  implements OrderLineAttributes
{
  public id!: string;
  public order_id!: string;
  public product_id!: string;
  public quantity!: number;
  public price_amount!: number;
  public price_currency!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

OrderLineModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      /*
      references: {
        model: 'orders',
        key: 'id',
      },
      */
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      /*
      references: {
        model: 'products',
        key: 'id',
      },
      */
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    price_currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'RUB',
    },
  },
  {
    sequelize,
    tableName: 'order_lines',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
