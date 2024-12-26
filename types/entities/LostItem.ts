import { Item, LostItem } from "../entities.types";
import { ItemStatus } from "../utils.types";
import { BaseClass } from "./BaseClass";

export class LostItemFactory extends BaseClass implements LostItem {
	item: Item;
	status: ItemStatus;
	delivred: boolean;
	lostAt: Date;
	ownerId: string;

	constructor(
		item: Item,
		status: ItemStatus,
		delivred: boolean,
		lostAt: Date,
		ownerId: string,
		id: string,
		createdAt: Date,
		updatedAt: Date
	) {
		super(id, createdAt, updatedAt);
		this.item = item;
		this.status = status;
		this.delivred = delivred;
		this.lostAt = lostAt;
		this.ownerId = ownerId;
	}

	builder(): LostItemFactory {
		return this;
	}

	setItem(item: Item): LostItemFactory {
		this.item = item;
		return this;
	}

	setStatus(status: ItemStatus): LostItemFactory {
		this.status = status;
		return this;
	}

	setDelivred(delivred: boolean): LostItemFactory {
		this.delivred = delivred;
		return this;
	}

	setLostAt(lostAt: Date): LostItemFactory {
		this.lostAt = lostAt;
		return this;
	}

	setOwnerId(ownerId: string): LostItemFactory {
		this.ownerId = ownerId;
		return this;
	}

	build(): LostItem {
		return this;
	}

	getOwnerId(): string {
		return this.ownerId;
	}

	getItem(): Item {
		return this.item;
	}

	getStatus(): ItemStatus {
		return this.status;
	}

	getDelivred(): boolean {
		return this.delivred;
	}

	getLostAt(): Date {
		return this.lostAt;
	}
}
