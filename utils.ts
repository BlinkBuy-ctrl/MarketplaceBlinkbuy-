import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMK(amount: number | null | undefined): string {
  if (!amount) return "Negotiable";
  return `MK ${amount.toLocaleString()}`;
}
