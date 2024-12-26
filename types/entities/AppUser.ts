import { AppUser, FoundItem, LostItem, Profile } from "../entities.types";
import { Role } from "../utils.types";
import { BaseClass } from "./BaseClass";

export class AppUserFactory extends BaseClass implements AppUser {
	authUserId: string;
	profile: Profile;
	foundItems: FoundItem[];
	lostItems: LostItem[];
	role?: Role | undefined;
	id: number;
	createdAt: Date;
	updatedAt: Date;

	constructor(
		authUserId: string,
		profile: Profile,
		foundItems: FoundItem[],
		lostItems: LostItem[],
		id: number,
		createdAt: Date,
		updatedAt: Date,
		role?: Role
	) {
		super(id, createdAt, updatedAt);
		this.authUserId = authUserId;
		this.profile = profile;
		this.foundItems = foundItems;
		this.lostItems = lostItems;
		this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.role = role;
	}

	builder(): AppUserFactory {
		return this;
	}

	setRole(role: Role): AppUserFactory {
		this.role = role;
		return this;
	}

	setAuthUserId(authUserId: string): AppUserFactory {
		this.authUserId = authUserId;
		return this;
	}

	setProfile(profile: Profile): AppUserFactory {
		this.profile = profile;
		return this;
	}

	setFoundItems(foundItems: FoundItem[]): AppUserFactory {
		this.foundItems = foundItems;
		return this;
	}

	setLostItems(lostItems: LostItem[]): AppUserFactory {
		this.lostItems = lostItems;
		return this;
	}

	setId(id: number): AppUserFactory {
		this.id = id;
		return this;
	}

	setCreatedAt(createdAt: Date): AppUserFactory {
		this.createdAt = createdAt;
		return this;
	}

	setUpdatedAt(updatedAt: Date): AppUserFactory {
		this.updatedAt = updatedAt;
		return this;
	}

	build(): AppUser {
		return this;
	}

	getAuthUserId(): string {
		return this.authUserId;
	}

	getProfile(): Profile {
		return this.profile;
	}

	getFoundItems(): FoundItem[] {
		return this.foundItems;
	}

	getLostItems(): LostItem[] {
		return this.lostItems;
	}

	getRole(): Role | undefined {
		return this.role;
	}
}
