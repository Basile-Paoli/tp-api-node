import "reflect-metadata"
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({name: 'product'})
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	price: string;

	@CreateDateColumn({type: 'timestamptz'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamptz'})
	updatedAt: Date;

	constructor(id: number, name: string, price: string, createdAt: Date, updatedAt: Date) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}