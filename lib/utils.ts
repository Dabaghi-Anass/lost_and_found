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
