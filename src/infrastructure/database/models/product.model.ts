import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';

export interface ProductAttributes {
  id: string;
  name: string;
  price_amount: number;
  price_currency: string;
  sku?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class ProductModel
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public name!: string;
  public price_amount!: number;
  public price_currency!: string;
  public sku!: string;
  public description!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ProductModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
