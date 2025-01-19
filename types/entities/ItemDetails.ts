import { ItemDetails } from "../entities.types";

export class ItemDetailsBuilder implements ItemDetails {
	title: string;
	description: string;
	color?: string | undefined;
	category: string;
	images: string[];
	id?: string | undefined;

	constructor(
		title: string,
		description: string,
		category: string,
		images: string[],
		color?: string
	) {
		this.title = title;
		this.description = description;
		this.category = category;
		this.images = images;
		this.color = color;
	}

	static builder(): ItemDetailsBuilder {
		return new ItemDetailsBuilder("", "", "", []);
	}

	setTitle(title: string): ItemDetailsBuilder {
		this.title = title;
		return this;
	}

	setDescription(description: string): ItemDetailsBuilder {
		this.description = description;
		return this;
	}

	setCategory(category: string): ItemDetailsBuilder {
		this.category = category;
		return this;
	}

	setImages(images: string[]): ItemDetailsBuilder {
		this.images = images;
		return this;
	}

	setColor(color: string): ItemDetailsBuilder {
		this.color = color;
		return this;
	}

	build(): ItemDetailsBuilder {
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
}
