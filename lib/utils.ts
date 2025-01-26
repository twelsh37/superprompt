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

// Color mapping for categories
export const categoryColors = {
  1: "bg-red-100 border-red-200 text-red-900 hover:bg-red-200",
  2: "bg-blue-100 border-blue-200 text-blue-900 hover:bg-blue-200",
  3: "bg-green-100 border-green-200 text-green-900 hover:bg-green-200",
  4: "bg-purple-100 border-purple-200 text-purple-900 hover:bg-purple-200",
  5: "bg-yellow-100 border-yellow-200 text-yellow-900 hover:bg-yellow-200",
  6: "bg-pink-100 border-pink-200 text-pink-900 hover:bg-pink-200",
  7: "bg-indigo-100 border-indigo-200 text-indigo-900 hover:bg-indigo-200",
  8: "bg-orange-100 border-orange-200 text-orange-900 hover:bg-orange-200",
  9: "bg-teal-100 border-teal-200 text-teal-900 hover:bg-teal-200",
  10: "bg-cyan-100 border-cyan-200 text-cyan-900 hover:bg-cyan-200",
} as const;

// Get color classes for a category
export function getCategoryColors(categoryId: string | number): string {
  const colorIndex = (parseInt(String(categoryId)) % 10) + 1;
  return (
    categoryColors[colorIndex as keyof typeof categoryColors] ||
    categoryColors[1]
  );
}
