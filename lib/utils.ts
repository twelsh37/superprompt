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
