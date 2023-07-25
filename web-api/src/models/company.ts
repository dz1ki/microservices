import { Client } from "./client";
import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";

@Table({
  tableName: "companies",
  timestamps: true,
  underscored: true,
})
export class Company extends Model {
  @Column({
    type: DataType.INTEGER(),
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING(),
  })
  address: string;

  @Column({
    type: DataType.STRING(),
  })
  scope: string;

  @HasMany(() => Client)
  clients: Client[];
}
