import { Item } from "../entities.types";
import { BaseClass } from "./BaseClass";

export class ItemFactory extends BaseClass implements Item {
	title: string;
	description: string;
	color?: string | undefined;
	category: string;
	images: string[];

	constructor(
		title: string,
		description: string,
		category: string,
		images: string[],
		id: number,
		createdAt: Date,
		updatedAt: Date,
		color?: string
	) {
		super(id, createdAt, updatedAt);
		this.title = title;
		this.description = description;
		this.category = category;
		this.images = images;
		this.color = color;
	}

	builder(): ItemFactory {
		return this;
	}

	setTitle(title: string): ItemFactory {
		this.title = title;
		return this;
	}

	setDescription(description: string): ItemFactory {
		this.description = description;
		return this;
	}

	setCategory(category: string): ItemFactory {
		this.category = category;
		return this;
	}

	setImages(images: string[]): ItemFactory {
		this.images = images;
		return this;
	}

	setColor(color: string): ItemFactory {
		this.color = color;
		return this;
	}

	build(): Item {
		return this;
	}

	getTitle(): string {
		return this.title;
	}

	getDescription(): string {
		return this.description;
	}

	getCategory(): string {
		return this.category;
	}

	getImages(): string[] {
		return this.images;
	}

	getColor(): string | undefined {
		return this.color;
	}

	getId(): number {
		return this.id;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	getUpdatedAt(): Date {
		return this.updatedAt;
	}
}
