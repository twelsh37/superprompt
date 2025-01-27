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

  // const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   const data = event.dataTransfer.getData("text");
  //   if (data) {
  //     const prompt = JSON.parse(data);
  //     setDroppedPrompts([...droppedPrompts, prompt]);
  //   }
  // };

  const getCombinedPrompts = () => {
    return prompts.map((prompt) => prompt.content).join("\n\n");
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
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="flex flex-col gap-4">
          {/* Categories/Items Card */}
          <Card className="p-4 h-[45vh]">
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
              </div>
            </div>
          </Card>

          {/* Prompt Text Card */}
          <Card className="p-4 h-[45vh]">
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
                className="flex-1 resize-none font-mono text-sm whitespace-pre-wrap"
              />
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          {/* Super Prompt Builder Card */}
          <Card className="p-4 h-[45vh]">
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
          <Card className="p-4 h-[45vh]">
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-medium mb-2">Super Prompt Text</h3>
              <div className="flex-1 overflow-auto p-4 rounded-lg border border-gray-200 bg-white relative">
                {isGenerating ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-black font-mono text-sm">
                    {superPrompt}
                  </pre>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
