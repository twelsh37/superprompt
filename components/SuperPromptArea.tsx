"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PromptCard } from "@/types/prompts";
import { PromptCardItem } from "./PromptCardItem";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { defaultPromptSuffix } from "@/data/defaultSuffix";
// import { combinePrompts } from "@/lib/claude";

interface SuperPromptAreaProps {
  onChange?: (prompts: PromptCard[]) => void;
  prompts: PromptCard[];
  setPrompts: (prompts: PromptCard[]) => void;
  onSuperPromptChange?: (superPrompt: string) => void;
  onGenerateStart?: () => void;
}

export const SuperPromptArea = ({
  onChange,
  prompts,
  setPrompts,
  onSuperPromptChange,
  onGenerateStart,
}: SuperPromptAreaProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [prompts]);

  const handleGenerate = async () => {
    if (prompts.length === 0) {
      toast({
        title: "No prompts",
        description: "Add some prompts before generating",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    onGenerateStart?.();

    try {
      const promptTexts = prompts.map((p) => p.content);
      const response = await fetch("/api/claude/combine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompts: promptTexts }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      onSuperPromptChange?.(data.combinedPrompt + "\n\n" + defaultPromptSuffix);
    } catch (error) {
      console.error("Failed to combine prompts:", error);
      toast({
        title: "Error",
        description:
          "Failed to combine prompts. Falling back to simple combination.",
        variant: "destructive",
      });
      // Fallback to simple combination with suffix
      const combined =
        prompts.map((p) => p.content).join("\n\n") +
        "\n\n" +
        defaultPromptSuffix;
      onSuperPromptChange?.(combined);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
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
      const data = e.dataTransfer.getData("application/json");
      const droppedCard = JSON.parse(data) as PromptCard;

      const isDuplicate = prompts.some((p) => p.id === droppedCard.id);

      if (!isDuplicate) {
        const newPrompts = [...prompts, droppedCard];
        setPrompts(newPrompts);
        onChange?.(newPrompts);
      } else {
        toast({
          title: "Duplicate Prompt",
          description:
            "This prompt has already been added to the Super Prompt Builder.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to parse dropped content:", error);
    }
  };

  const handleRemovePrompt = (promptId: string) => {
    const newPrompts = prompts.filter((p) => p.id !== promptId);
    setPrompts(newPrompts);
    onChange?.(newPrompts);
  };

  const handleClear = () => {
    setPrompts([]);
    onChange?.([]);
    onSuperPromptChange?.("");
    toast({
      title: "Cleared",
      description: "All prompts have been removed",
    });
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="relative flex-1 min-h-0">
        <div
          className={`
            h-full rounded-lg border-2 p-2
            transition-colors duration-200 overflow-hidden
            ${
              isDraggingOver
                ? "border-primary border-dashed bg-primary/5"
                : "border-gray-200"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {prompts.length === 0 ? (
            <div
              className={`
              h-full flex items-center justify-center
              text-muted-foreground text-center
              ${isDraggingOver ? "text-primary" : ""}
            `}
            >
              {isDraggingOver ? "Drop here to add prompt" : "Drop prompts here"}
            </div>
          ) : (
            <ScrollArea className="h-full w-full" ref={scrollViewportRef}>
              <div className="grid grid-cols-1 gap-2 pr-4">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="relative group pr-2">
                    <PromptCardItem
                      card={prompt}
                      onCardClick={() => {}}
                      isCategory={false}
                      isDraggable={false}
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

      <div className="flex justify-between items-center">
        <Button
          variant={prompts.length > 0 ? "default" : "outline"}
          className="w-24"
          onClick={handleClear}
          disabled={prompts.length === 0}
        >
          Clear
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={prompts.length === 0 || isGenerating}
          className="w-24"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
};
