"use client"

import { Card } from "@/components/ui/card"
import { PromptCard } from "@/types/prompts"

interface PromptCardItemProps {
  card: PromptCard;
  onCardClick: (id: string) => void;
  isCategory?: boolean;
}

export const PromptCardItem = ({ card, onCardClick, isCategory = false }: PromptCardItemProps) => {
  return (
    <Card 
      onClick={() => onCardClick(card.id)}
      className={`
        h-16 cursor-pointer 
        hover:shadow-lg transition-all
        ${isCategory ? 'bg-primary/10 hover:bg-primary/20' : 
          card.isLoaded ? 'bg-green-100 hover:bg-green-200' : 'bg-card hover:bg-accent'}
        flex items-center justify-center p-2 text-center
      `}
    >
      <div className="text-xs font-medium">
        {card.title}
      </div>
    </Card>
  )
} 
