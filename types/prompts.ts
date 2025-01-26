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
  selector: string;
  count: number;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: 'nextjs', name: 'Next.js', selector: '#NextJS', count: 0 },
  { id: 'typescript', name: 'TypeScript', selector: '#TypeScript', count: 0 },
  { id: 'react', name: 'React', selector: '#React', count: 0 },
  { id: 'javascript', name: 'JavaScript', selector: '#JavaScript', count: 0 },
]; 
