import { BaseEntity } from "../entities.types";

export class BaseClass implements BaseEntity {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(id: string, createdAt: Date, updatedAt: Date) {
		this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	builder(): BaseClass {
		return this;
	}

	setId(id: string): BaseClass {
		this.id = id;
		return this;
	}

	setCreatedAt(createdAt: Date): BaseClass {
		this.createdAt = createdAt;
		return this;
	}

	setUpdatedAt(updatedAt: Date): BaseClass {
		this.updatedAt = updatedAt;
		return this;
	}

	getId(): string {
		return this.id;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	getUpdatedAt(): Date {
		return this.updatedAt;
	}
}
