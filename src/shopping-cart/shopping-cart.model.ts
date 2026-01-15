import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'shopping_cart' })
export class ShoppingCart extends Model<ShoppingCart> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.INTEGER })
  declare userId: number;

  @Column({ type: DataType.INTEGER })
  declare partId: number;

  @Column({ type: DataType.STRING })
  declare boiler_manufacturer: string;

  @Column({ type: DataType.STRING })
  declare parts_manufacturer: string;

  @Column({ type: DataType.INTEGER })
  declare price: number;

  @Column({ type: DataType.INTEGER })
  declare in_stock: number;

  @Column({ type: DataType.STRING })
  declare image: string;

  @Column({ type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare count: number;

  @Column({ type: DataType.INTEGER })
  declare total_price: number;

  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
