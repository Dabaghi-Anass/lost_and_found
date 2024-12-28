import { AppUser, Item, Profile } from "../entities.types";
import { Role } from "../utils.types";

export class AppUserBuilder implements AppUser {
	authUserId: string;
	profile: Profile;
	items: Item[];
	role?: Role | undefined;

	constructor(
		authUserId: string,
		profile: Profile,
		items: Item[],
		role?: Role
	) {
		this.authUserId = authUserId;
		this.profile = profile;
		this.items = items;
		this.role = role;
	}

	builder(): AppUserBuilder {
		return this;
	}

	setRole(role: Role): AppUserBuilder {
		this.role = role;
		return this;
	}

	setAuthUserId(authUserId: string): AppUserBuilder {
		this.authUserId = authUserId;
		return this;
	}

	setProfile(profile: Profile): AppUserBuilder {
		this.profile = profile;
		return this;
	}

	setItems(Items: Item[]): AppUserBuilder {
		this.items = Items;
		return this;
	}

	build(): AppUserBuilder {
		return this;
	}

	getAuthUserId(): string {
		return this.authUserId;
	}

	getProfile(): Profile {
		return this.profile;
	}

	getItems(): Item[] {
		return this.items;
	}

	getRole(): Role | undefined {
		return this.role;
	}
}
