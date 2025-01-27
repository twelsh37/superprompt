import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type PromptCard, type PromptCategory } from "../types/prompts";

// Combines Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type guard for PromptCard
export function isPromptCard(item: unknown): item is PromptCard {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "title" in item &&
    "content" in item
  );
}

// Type guard for PromptCategory
export function isPromptCategory(item: unknown): item is PromptCategory {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "name" in item &&
    "count" in item
  );
}

// Truncates text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Generates a unique ID for new prompts
export function generatePromptId(): string {
  return `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Formats a date string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Debounce function for search/filter operations
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Color mapping for categories using CSS custom properties
export const categoryColors = {
  1: "category-card-1",
  2: "category-card-2",
  3: "category-card-3",
  4: "category-card-4",
  5: "category-card-5",
} as const;

// Fixed category to color mapping
const categoryColorMap: Record<string, number> = {
  typescript: 1, // sky
  python: 2, // amber
  react: 3, // emerald
  "next.js": 4, // purple
  php: 5, // rose
  tailwindcss: 1, // sky
  laravel: 2, // amber
  // add more as needed
};

export function getCategoryColorIndex(categoryId: string | number): number {
  if (typeof categoryId === "string") {
    return categoryColorMap[categoryId.toLowerCase()] || 1;
  }
  return (categoryId % 5) + 1;
}

export function getCategoryColors(categoryId: string | number): string {
  const colorIndex = getCategoryColorIndex(categoryId);
  return (
    categoryColors[colorIndex as keyof typeof categoryColors] ||
    categoryColors[1]
  );
}
