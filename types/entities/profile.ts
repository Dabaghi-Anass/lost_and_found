import { Profile } from "../entities.types";
export class ProfileBuilder implements Profile {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	imageUri: string | null;
	constructor(
		firstName: string,
		lastName: string,
		phoneNumber: string,
		imageUri: string | null
	) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.phoneNumber = phoneNumber;
		this.imageUri = imageUri;
	}

	getFullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	getFirstName(): string {
		return this.firstName;
	}

	getLastName(): string {
		return this.lastName;
	}

	getPhoneNumber(): string {
		return this.phoneNumber;
	}

	getImageUri(): string {
		return this.imageUri as string;
	}

	static builder(): ProfileBuilder {
		return new ProfileBuilder("", "", "", "");
	}

	build(): Profile {
		return this;
	}

	setFirstName(firstName: string): ProfileBuilder {
		this.firstName = firstName;
		return this;
	}

	setLastName(lastName: string): ProfileBuilder {
		this.lastName = lastName;
		return this;
	}

	setPhoneNumber(phoneNumber: string): ProfileBuilder {
		this.phoneNumber = phoneNumber;
		return this;
	}

	setImageUri(imageUri: string | null): ProfileBuilder {
		this.imageUri = imageUri;
		return this;
	}
}
