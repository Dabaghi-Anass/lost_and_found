import { GeolocationCoordinates, ItemStatus, Role } from "./utils.types";

interface BaseEntity {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

/*-----------------entities------------------*/
interface AppUser extends BaseEntity {
	authUserId: string;
	profile: Profile;
	foundItems: Array<FoundItem>;
	lostItems: Array<LostItem>;
	role?: Role;
}

interface Profile extends BaseEntity {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	imageUri: string;
}

interface Item extends BaseEntity {
	title: string;
	description: string;
	color?: string;
	category: string;
	images: Array<string>;
}

interface FoundItem extends BaseEntity {
	item: Item;
	status: ItemStatus;
	delivred: boolean;
	foundAt: Date;
	founderId: string;
	geoCoordinates: GeolocationCoordinates;
}

interface LostItem extends BaseEntity {
	item: Item;
	status: ItemStatus;
	delivred: boolean;
	lostAt: Date;
	ownerId: string;
}

export { AppUser, BaseEntity, FoundItem, Item, LostItem, Profile };
