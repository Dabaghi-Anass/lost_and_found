import { Profile } from "../entities.types";
import { BaseClass } from "./BaseClass";

export class ProfileFactory extends BaseClass implements Profile {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	imageUri: string;
	id: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(
		firstName: string,
		lastName: string,
		phoneNumber: string,
		imageUri: string,
		id: string,
		createdAt: Date,
		updatedAt: Date
	) {
		super(id, createdAt, updatedAt);
		this.firstName = firstName;
		this.lastName = lastName;
		this.phoneNumber = phoneNumber;
		this.imageUri = imageUri;
		this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
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
		return this.imageUri;
	}

	builder(): ProfileFactory {
		return this;
	}

	build(): Profile {
		return this;
	}

	setFirstName(firstName: string): ProfileFactory {
		this.firstName = firstName;
		return this;
	}

	setLastName(lastName: string): ProfileFactory {
		this.lastName = lastName;
		return this;
	}

	setPhoneNumber(phoneNumber: string): ProfileFactory {
		this.phoneNumber = phoneNumber;
		return this;
	}

	setImageUri(imageUri: string): ProfileFactory {
		this.imageUri = imageUri;
		return this;
	}
}
