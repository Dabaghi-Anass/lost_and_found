import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...classes: ClassValue[]) {
	return twMerge(clsx(...classes));
}

export function colorLightness(hex: string) {
	const r = parseInt(hex.substr(1, 2), 16);
	const g = parseInt(hex.substr(3, 2), 16);
	const b = parseInt(hex.substr(5, 2), 16);
	return r * 0.299 + g * 0.587 + b * 0.114;
}

export function getCategories() {
	return [
		"All",
		"Electronics",
		"Clothing",
		"Accessories",
		"Other",
		"Jewelry",
		"Documents",
		"Keys",
		"Pets",
		"Bags",
		"Books",
		"Money",
		"Vehicles",
		"Phones",
	];
}

export function getImageOrDefaultTo(
	image: string | null | undefined,
	fallback: any
) {
	return image?.length && image?.length > 0 ? { uri: image } : fallback;
}

export function formAppLink(path: string, param?: string | null): string {
	const WEBSITE_URL = "https://lost-and-found-wisd.expo.app";
	return `${WEBSITE_URL}/${path}${param ? "/" + param : ""}`;
}
export function formAppNativeLink(path: string, param?: string | null): string {
	const APP_SCHEME = "lostandfound://";
	return `${APP_SCHEME}${path}${param ? "/" + param : ""}`;
}

export const isAppInstalled = async (
	customScheme: string
): Promise<boolean> => {
	return new Promise((resolve) => {
		const timeout = setTimeout(() => {
			resolve(false);
		}, 2500);

		window.addEventListener("blur", () => {
			clearTimeout(timeout);
			resolve(true);
		});

		window.location.href = customScheme;
	});
};
