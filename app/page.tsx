"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { PromptCardItem } from "@/components/PromptCardItem";
import { PromptCard, PROMPT_CATEGORIES, PromptCategory } from "@/types/prompts";

export default function Home() {
  const [cards, setCards] = useState<PromptCard[]>([]);
  const [categoryCards, setCategoryCards] = useState<PromptCard[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("Starting category fetch...");
        const response = await fetch("/api/categories");
        console.log("Response status:", response.status);

        const data = await response.json();
        console.log("API Response:", data);

        if (data.error) {
          throw new Error(data.message || "Failed to load categories");
        }

        if (data.categories) {
          console.log("Categories found:", data.categories.length);
          setCategories(data.categories);

          // Create initial cards from categories
          const initialCards = data.categories.map(
            (category: PromptCategory) => ({
              id: category.id,
              title: `${category.name}\n(${category.count})`,
              content: "",
              isLoaded: false,
              category: category.id,
            })
          );

          console.log("Created category cards:", initialCards.length);
          setCards(initialCards);
          setCategoryCards(initialCards);

          setDebugInfo(
            `Found ${data.categories.length} categories. ` +
              `HTML size: ${data.debug?.htmlLength || 0} bytes. ` +
              `Total cards: ${data.debug?.totalCards || 0}`
          );
        } else {
          setDebugInfo("No categories found in response");
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        setDebugInfo(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
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

  return (
    <main className="flex h-screen w-full">
      <div className="w-1/2 p-4 bg-background">
        <div className="space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {selectedCategory
                ? `${
                    categories.find((c) => c.id === selectedCategory)?.name
                  } Prompts`
                : "Select a Category"}
              {isLoading && " (Loading...)"}
            </h2>
            {selectedCategory && (
              <button
                onClick={handleBackClick}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                ← Back to Categories
              </button>
            )}
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-200px)]">
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
              <PromptCardItem
                key={card.id}
                card={card}
                onCardClick={handleCardClick}
                isCategory={!selectedCategory}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 h-[150px]">
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
            className="h-full resize-none font-mono text-sm whitespace-pre-wrap"
          />
        </div>
      </div>

      {/* Right side - Super Prompt Area */}
      <div className="w-1/2 p-4 border-l bg-muted">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Super Prompt</h2>
            <div className="min-h-[200px] rounded-lg border bg-card p-4">
              Drop prompts here
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
