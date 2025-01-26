"use client"

import { Card } from "@/components/ui/card"
import { PromptCard } from "@/types/prompts"

interface PromptCardItemProps {
  card: PromptCard;
  onCardClick: (id: string) => void;
  isCategory?: boolean;
  isDraggable?: boolean;
}

export const PromptCardItem = ({ 
  card, 
  onCardClick, 
  isCategory = false,
  isDraggable = false 
}: PromptCardItemProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDraggable) {
      e.preventDefault();
      return;
    }

    // Set the drag data
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: card.id,
      title: card.title,
      content: card.content,
      isLoaded: card.isLoaded,
      category: card.category
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger click if we're not starting a drag
    if (!isDraggable || (isDraggable && e.detail > 0)) { // e.detail > 0 means it's a real click
      onCardClick(card.id);
    }
  };

  return (
    <Card 
      onClick={handleClick}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      className={`
        h-16 cursor-pointer 
        hover:shadow-lg transition-all
        ${isCategory ? 'bg-primary/10 hover:bg-primary/20' : 
          card.isLoaded ? 'bg-green-100 hover:bg-green-200' : 'bg-card hover:bg-accent'}
        flex items-center justify-center p-2 text-center
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        relative
      `}
    >
      <div className="text-xs font-medium">
        {card.title}
      </div>
      {isDraggable && (
        <div className="absolute top-1 right-1 opacity-50">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1"/>
          </svg>
        </div>
      )}
    </Card>
  )
}
