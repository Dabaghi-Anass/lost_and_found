import { GeolocationCoordinates, Role } from "./utils.types";
export type OptionType = "lost" | "found";

/*-----------------entities------------------*/
interface AppUser {
	id?: string;
	authUserId: string;
	email: string;
	profileId?: string;
	profile: Profile;
	items: Array<Item>;
	role?: Role;
}

interface Profile {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	imageUri?: string | null;
	id?: string;
}

interface ItemDetails {
	id?: string;
	title: string;
	description: string;
	color?: string;
	category: string;
	images: Array<string>;
}

interface Item {
	id?: string;
	type: OptionType;
	itemId: string;
	item: ItemDetails;
	delivered: boolean;
	found_lost_at: Date;
	deliveredAt?: Date;
	ownerId: string;
	realOwnerId: string;
	owner: Profile;
	realOwner: Profile;
	location: string;
	geoCoordinates?: GeolocationCoordinates;
}

export { AppUser, Item, ItemDetails, Profile };
