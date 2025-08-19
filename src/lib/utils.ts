import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for combining and merging Tailwind CSS classes
 *
 * This function combines clsx (for conditional class names) with tailwind-merge
 * (for resolving Tailwind class conflicts). Essential for component libraries
 * where class precedence and conditional styling are important.
 *
 * @param inputs - Array of class values that can include strings, objects, arrays, etc.
 * @returns Merged and deduplicated class string with proper Tailwind precedence
 *
 * @example
 * cn('px-2 py-1', 'px-3', { 'bg-blue-500': isActive })
 * // Returns: 'py-1 px-3 bg-blue-500' (if isActive is true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
