import { z } from "zod";

export const ItemDetailsSchema = z.object({
	title: z.string().min(3),
	description: z.string().min(10),
	category: z.string().min(1),
	color: z.string(),
	images: z.array(z.string()),
});

export const ItemSchema = z.object({
	type: z.enum(["lost", "found"]),
	item: ItemDetailsSchema,
	delivred: z.boolean(),
	found_lost_at: z.date(),
	ownerId: z.string().optional(),
	geoCoordinates: z.string(),
});
