import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize a backend URL by removing trailing slashes
 * This prevents double slashes in API URLs when concatenating paths
 * @param url - The backend URL to normalize
 * @returns The normalized URL without trailing slashes
 */
export function normalizeBackendUrl(url: string): string {
  return url.replace(/\/+$/, '')
}
