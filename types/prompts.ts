export interface PromptCard {
  id: string;
  title: string;
  content: string;
  isLoaded: boolean;
  category?: string;
}

export interface PromptCategory {
  id: string;
  name: string;
  count: number;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: 'nextjs', name: 'Next.js', count: 0 },
  { id: 'typescript', name: 'TypeScript', count: 0 },
  { id: 'react', name: 'React', count: 0 },
  { id: 'javascript', name: 'JavaScript', count: 0 },
]; 
