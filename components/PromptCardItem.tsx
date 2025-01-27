"use client"

import { Card } from "@/components/ui/card"
import { PromptCard } from "@/types/prompts"
import { getCategoryColors } from "@/lib/utils"
import { cn } from "@/lib/utils"

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
    if (!isDraggable || (isDraggable && e.detail > 0)) {
      onCardClick(card.id);
    }
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={cn(
        "p-4 rounded-lg border-2",
        "transition-all duration-200 ease-in-out",
        "hover:shadow-md flex items-center justify-center",
        "min-h-[4rem] text-center relative",
        isDraggable && "cursor-grab active:cursor-grabbing"
      )}
      role="button"
      tabIndex={0}
    >
      <div className="text-sm font-medium">
        {card.title}
      </div>
      {isDraggable && (
        <div className="absolute top-2 right-2 opacity-50">
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
    </div>
  )
}
