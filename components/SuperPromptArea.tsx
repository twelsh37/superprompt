"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PromptCard } from "@/types/prompts"
import { PromptCardItem } from "./PromptCardItem"

export const SuperPromptArea = () => {
  const [droppedPrompts, setDroppedPrompts] = useState<PromptCard[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only set dragging false if we're leaving the drop target, not its children
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    try {
      const data = e.dataTransfer.getData('application/json');
      const droppedCard = JSON.parse(data) as PromptCard;
      
      // Check if card is already in the list
      if (!droppedPrompts.some(p => p.id === droppedCard.id)) {
        setDroppedPrompts(prev => [...prev, droppedCard]);
      }
    } catch (error) {
      console.error('Failed to parse dropped content:', error);
    }
  };

  return (
    <div className="w-1/2 p-4 border-l bg-muted">
      <ScrollArea className="h-full">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Super Prompt</h2>
          <div 
            className={`
              min-h-[200px] rounded-lg border bg-card p-4
              transition-colors duration-200
              ${isDraggingOver ? 'border-primary border-dashed bg-primary/5' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {droppedPrompts.length === 0 ? (
              <div className={`
                text-muted-foreground text-center py-8
                ${isDraggingOver ? 'text-primary' : ''}
              `}>
                {isDraggingOver ? 'Drop here to add prompt' : 'Drop prompts here'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {droppedPrompts.map(prompt => (
                  <PromptCardItem
                    key={prompt.id}
                    card={prompt}
                    onCardClick={() => {}}
                    isCategory={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}; 
