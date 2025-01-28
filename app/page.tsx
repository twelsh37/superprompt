"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { PromptCardItem } from "@/components/PromptCardItem";
import { PromptCard, PromptCategory } from "@/types/prompts";
import { SuperPromptArea } from "@/components/SuperPromptArea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Add this interface at the top of the file
interface ApiPrompt {
  content: string;
  // Add other properties that might come from the API
}

export default function Home() {
  const [cards, setCards] = useState<PromptCard[]>([]);
  const [categoryCards, setCategoryCards] = useState<PromptCard[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [prompts, setPrompts] = useState<PromptCard[]>([]);
  const [superPrompt, setSuperPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/categories", {
          // Add timeout to client-side fetch as well
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
        setError(
          error instanceof Error ? error.message : "Failed to load categories"
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
          (prompt: ApiPrompt, index: number) => ({
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

  const handleSuperPromptChange = (newSuperPrompt: string) => {
    setSuperPrompt(newSuperPrompt);
    setIsGenerating(false);
  };

  const handleGenerateStart = () => {
    setIsGenerating(true);
    setSuperPrompt("");
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="flex flex-col gap-4">
          {/* Categories/Items Card */}
          <Card className="p-4 h-[45vh] dark:border-gray-800">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedCategory
                    ? `${
                        categories.find((c) => c.id === selectedCategory)?.name
                      } Prompts`
                    : "Select a category"}
                  {isLoading && " (Loading...)"}
                </h2>
                {!selectedCategory && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">Information from:</h4>
                    <a
                      href="https://cursor.directory"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 hover:underline"
                    >
                      cursor.directory
                    </a>
                  </div>
                )}
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
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Categories
                  </button>
                )}
              </div>

              <div className="flex-1 min-h-0">
                {error ? (
                  <div className="flex flex-col items-center justify-center h-full text-red-500">
                    <p>{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
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
                )}
              </div>
            </div>
          </Card>

          {/* Prompt Text Card */}
          <Card className="p-4 h-[45vh] dark:border-gray-800">
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-medium mb-2">Prompt Text</h3>
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
                className="flex-1 resize-none font-mono text-sm whitespace-pre-wrap dark:bg-gray-950 dark:text-gray-200"
              />
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          {/* Super Prompt Builder Card */}
          <Card className="p-4 h-[45vh] dark:border-gray-800">
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-4">
                Super Prompt Builder
              </h2>
              <div className="flex-1 min-h-0">
                <SuperPromptArea
                  prompts={prompts}
                  setPrompts={setPrompts}
                  onSuperPromptChange={handleSuperPromptChange}
                  onGenerateStart={handleGenerateStart}
                />
              </div>
            </div>
          </Card>

          {/* Super Prompt Text Card */}
          <Card className="p-4 h-[45vh] dark:border-gray-800">
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-medium mb-2">Super Prompt Text</h3>
              <div className="flex-1 overflow-auto p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 relative">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-950 gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Generating Prompt
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      This may take a several seconds...</span>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-black dark:text-gray-200 font-mono text-sm">
                    {superPrompt}
                  </pre>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
