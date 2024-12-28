import { Item, ItemDetails, OptionType } from "../entities.types";
import { GeolocationCoordinates, ItemStatus } from "../utils.types";

export class ItemBuilder implements Item {
	item: ItemDetails;
	delivred: boolean;
	lostAt: Date;
	ownerId: string;
	found_lost_at: Date;
	type: OptionType;
	geoCoordinates: GeolocationCoordinates;

	constructor(
		item: ItemDetails,
		status: ItemStatus,
		delivred: boolean,
		lostAt: Date,
		ownerId: string,
		geoCoordinates: GeolocationCoordinates,
		found_lost_at: Date,
		type: OptionType
	) {
		this.found_lost_at = found_lost_at;
		this.geoCoordinates = geoCoordinates;
		this.item = item;
		this.type = type;
		this.delivred = delivred;
		this.lostAt = lostAt;
		this.ownerId = ownerId;
	}

	builder(): ItemBuilder {
		return this;
	}

	setItem(item: ItemDetails): ItemBuilder {
		this.item = item;
		return this;
	}
	setDelivred(delivred: boolean): ItemBuilder {
		this.delivred = delivred;
		return this;
	}

	setLostAt(lostAt: Date): ItemBuilder {
		this.lostAt = lostAt;
		return this;
	}

	setOwnerId(ownerId: string): ItemBuilder {
		this.ownerId = ownerId;
		return this;
	}

	build(): ItemBuilder {
		return this;
	}

	getOwnerId(): string {
		return this.ownerId;
	}

	getItem(): ItemDetails {
		return this.item;
	}

	getDelivred(): boolean {
		return this.delivred;
	}

	getLostAt(): Date {
		return this.lostAt;
	}
}
