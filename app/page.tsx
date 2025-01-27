"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { PromptCardItem } from "@/components/PromptCardItem";
import { PromptCard, PROMPT_CATEGORIES, PromptCategory } from "@/types/prompts";
import { SuperPromptArea } from "@/components/SuperPromptArea";
import { PromptDisplay } from "@/components/PromptDisplay";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [cards, setCards] = useState<PromptCard[]>([]);
  const [categoryCards, setCategoryCards] = useState<PromptCard[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [droppedPrompts, setDroppedPrompts] = useState<PromptCard[]>([]);
  const [prompts, setPrompts] = useState<PromptCard[]>([]);
  const [superPrompt, setSuperPrompt] = useState<string>("");

  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (data.error) {
          throw new Error(data.message || "Failed to load categories");
        }

        if (data.categories) {
          setCategories(data.categories);

          // Create initial cards from categories
          const initialCards = data.categories.map(
            (category: PromptCategory) => ({
              id: category.id,
              title: `${category.name} (${category.count})`,
              content: "",
              isLoaded: false,
              category: category.id,
            })
          );

          setCards(initialCards);
          setCategoryCards(initialCards);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCardClick = async (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card) return;

    if (!selectedCategory) {
      // Clicking a category card
      setIsLoading(true);
      try {
        const category = categories.find((c) => c.id === id);
        if (!category) return;

        const response = await fetch(`/api/prompts?category=${category.name}`);
        const data = await response.json();

        // Create new cards for the prompts in this category
        const promptCards: PromptCard[] = data.prompts.map(
          (prompt: any, index: number) => ({
            id: `${category.id}-${index}`,
            title: `${index + 1}`,
            content: prompt.content,
            isLoaded: true,
            category: category.id,
          })
        );

        setCards(promptCards);
        setSelectedCategory(category.id);

        if (promptCards.length > 0) {
          setSelectedContent(promptCards[0].content);
        }
      } catch (error) {
        console.error("Error loading category prompts:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Clicking a prompt card within a category
      setSelectedContent(card.content);
    }
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
    setCards(categoryCards);
    setSelectedContent("");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    if (data) {
      const prompt = JSON.parse(data);
      setDroppedPrompts([...droppedPrompts, prompt]);
    }
  };

  return (
    <main className="container mx-auto p-8">
      <div className="grid grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
        {/* Left Panel */}
        <Card className="p-6">
          <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {selectedCategory
                  ? `${categories.find((c) => c.id === selectedCategory)?.name} Prompts`
                  : "Select a category"}
                {isLoading && " (Loading...)"}
              </h2>
              {selectedCategory && (
                <button
                  onClick={handleBackClick}
                  className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Categories
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <ScrollArea className="h-[calc(100%-2rem)]">
                <div className="grid grid-cols-3 gap-4 pb-4">
                  {cards.map((card) => (
                    <PromptCardItem
                      key={card.id}
                      card={card}
                      onCardClick={handleCardClick}
                      isCategory={!selectedCategory}
                      isDraggable={!!selectedCategory}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Prompt Text</h3>
              <Textarea
                value={selectedContent}
                readOnly
                placeholder={
                  isLoading
                    ? "Loading prompts..."
                    : selectedCategory
                    ? "Click on a prompt card to view its content..."
                    : "Select a category to view prompts..."
                }
                className="h-[200px] resize-none font-mono text-sm whitespace-pre-wrap"
              />
            </div>
          </div>
        </Card>

        {/* Right Panel */}
        <Card className="p-6">
          <div className="flex flex-col gap-6 h-full">
            <h2 className="text-xl font-semibold">Super Prompt Builder</h2>
            
            <div className="flex-1 relative">
              <SuperPromptArea
                prompts={prompts}
                setPrompts={setPrompts}
                superPrompt={superPrompt}
                setSuperPrompt={setSuperPrompt}
              />
            </div>

            <div className="flex flex-col gap-2">
              {/* <h3 className="text-lg font-medium">Super Prompt Text</h3> */}
              {/* <PromptDisplay 
                prompts={droppedPrompts}
                className="h-[200px]"
              /> */}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
