import { Item, ItemDetails, OptionType } from "../entities.types";
import { GeolocationCoordinates } from "../utils.types";

export class ItemBuilder implements Item {
	item: ItemDetails;
	delivred: boolean;
	ownerId: string;
	found_lost_at: Date;
	type: OptionType;
	geoCoordinates: GeolocationCoordinates;
	location: string;

	constructor() {
		this.item = {
			category: "",
			color: "",
			description: "",
			images: [],
			title: "",
		};
		this.delivred = false;
		this.ownerId = "";
		this.found_lost_at = new Date();
		this.type = "lost";
		this.geoCoordinates = { latitude: 0, longitude: 0 };
		this.location = "";
	}

	static builder(): ItemBuilder {
		return new ItemBuilder();
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
		this.found_lost_at = lostAt;
		return this;
	}

	setOwnerId(ownerId: string): ItemBuilder {
		this.ownerId = ownerId;
		return this;
	}

	setType(type: OptionType): ItemBuilder {
		this.type = type;
		return this;
	}

	setLocation(location: string): ItemBuilder {
		this.location = location;
		return this;
	}
	setGeoCoordinates(geoCoordinates: GeolocationCoordinates): ItemBuilder {
		this.geoCoordinates = geoCoordinates;
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
		return this.found_lost_at;
	}

	getType(): OptionType {
		return this.type;
	}

	getGeoCoordinates(): GeolocationCoordinates {
		return this.geoCoordinates;
	}

	getFoundLostAt(): Date {
		return this.found_lost_at;
	}
}
