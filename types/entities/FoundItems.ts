import { FoundItem, Item } from "../entities.types";
import { GeolocationCoordinates, ItemStatus } from "../utils.types";
import { BaseClass } from "./BaseClass";

export class FoundItemFactory extends BaseClass implements FoundItem {
	item: Item;
	status: ItemStatus;
	delivred: boolean;
	foundAt: Date;
	founderId: string;
	geoCoordinates: GeolocationCoordinates;
	constructor(
		item: Item,
		status: ItemStatus,
		delivred: boolean,
		foundAt: Date,
		founderId: string,
		geoCoordinates: GeolocationCoordinates,

		id: string,
		createdAt: Date,
		updatedAt: Date
	) {
		super(id, createdAt, updatedAt);
		this.item = item;
		this.status = status;
		this.delivred = delivred;
		this.foundAt = foundAt;
		this.founderId = founderId;
		this.geoCoordinates = geoCoordinates;
	}

	builder(): FoundItemFactory {
		return this;
	}

	setItem(item: Item): FoundItemFactory {
		this.item = item;
		return this;
	}

	setStatus(status: ItemStatus): FoundItemFactory {
		this.status = status;
		return this;
	}

	setDelivred(delivred: boolean): FoundItemFactory {
		this.delivred = delivred;
		return this;
	}

	setGeoCoordinates(
		geoCoordinates: GeolocationCoordinates
	): FoundItemFactory {
		this.geoCoordinates = geoCoordinates;
		return this;
	}

	setFoundAt(foundAt: Date): FoundItemFactory {
		this.foundAt = foundAt;
		return this;
	}

	setFounderId(founderId: string): FoundItemFactory {
		this.founderId = founderId;
		return this;
	}

	build(): FoundItem {
		return this;
	}

	getFounderId(): string {
		return this.founderId;
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

	getFoundAt(): Date {
		return this.foundAt;
	}

	getGeoCoordinates(): GeolocationCoordinates {
		return this.geoCoordinates;
	}
}
