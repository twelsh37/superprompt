"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PromptCard } from "@/types/prompts"
import { PromptCardItem } from "./PromptCardItem"
import { getCategoryColors } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface SuperPromptAreaProps {
  onChange?: (prompts: PromptCard[]) => void;
  onClear: () => void;
  prompts: PromptCard[];
  setPrompts: (prompts: PromptCard[]) => void;
}

export const SuperPromptArea = ({ onChange, onClear, prompts, setPrompts }: SuperPromptAreaProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { toast } = useToast();

  const getCombinedPrompts = () => {
    return prompts.map(prompt => prompt.content).join('\n\n');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    try {
      const data = e.dataTransfer.getData('application/json');
      const droppedCard = JSON.parse(data) as PromptCard;
      
      const isDuplicate = prompts.some(p => p.id === droppedCard.id);
      
      if (!isDuplicate) {
        const newPrompts = [...prompts, droppedCard];
        setPrompts(newPrompts);
        onChange?.(newPrompts);
      } else {
        toast({
          title: "Duplicate Prompt",
          description: "This prompt has already been added to the Super Prompt Builder.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to parse dropped content:', error);
    }
  };

  const handleRemovePrompt = (promptId: string) => {
    const newPrompts = prompts.filter(p => p.id !== promptId);
    setPrompts(newPrompts);
    onChange?.(newPrompts);
  };

  const handleClear = () => {
    setPrompts([]);
    onChange?.([]);
    toast({
      title: "Cleared",
      description: "All prompts have been removed",
    });
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="relative flex-1">
        <div 
          className={`
            h-full rounded-lg border-2 p-2
            transition-colors duration-200
            ${isDraggingOver ? 'border-primary border-dashed bg-primary/5' : 'border-gray-200'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {prompts.length === 0 ? (
            <div className={`
              h-full flex items-center justify-center
              text-muted-foreground text-center
              ${isDraggingOver ? 'text-primary' : ''}
            `}>
              {isDraggingOver ? 'Drop here to add prompt' : 'Drop prompts here'}
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 gap-2">
                {prompts.map(prompt => (
                  <div key={prompt.id} className="relative group pr-2">
                    <PromptCardItem
                      card={prompt}
                      onCardClick={() => {}}
                      isCategory={false}
                      isDraggable={false}
                      className="scale-95"
                    />
                    <button
                      onClick={() => handleRemovePrompt(prompt.id)}
                      className="absolute -top-1 right-1 bg-destructive text-destructive-foreground
                               rounded-full w-5 h-5 flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove prompt"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          variant={prompts.length > 0 ? "default" : "outline"} 
          className="w-24"
          onClick={handleClear}
          disabled={prompts.length === 0}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}; 
