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
	title: string;
	description: string;
	color?: string;
	category: string;
	images: Array<string>;
}

interface Item {
	type: OptionType;
	item: ItemDetails;
	delivred: boolean;
	found_lost_at: Date;
	ownerId: string;
	geoCoordinates: GeolocationCoordinates;
}

export { AppUser, Item, ItemDetails, Profile };
