import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to a string
export function formatDate(date: Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}
