import { GeolocationCoordinates, Role } from "./utils.types";
export type OptionType = "lost" | "found";

/*-----------------entities------------------*/
interface AppUser {
	authUserId: string;
	profile: Profile;
	items: Array<Item>;
	role?: Role;
}

interface Profile {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	imageUri: string;
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
	item: ItemDetails;
	delivred: boolean;
	found_lost_at: Date;
	ownerId: string;
	location: string;
	geoCoordinates?: GeolocationCoordinates;
}

export { AppUser, Item, ItemDetails, Profile };
