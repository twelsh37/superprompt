import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PromptDisplayProps {
  prompts: Array<{ content: string }>;
  className?: string;
}

export const PromptDisplay = ({ prompts, className }: PromptDisplayProps) => {
  const [combinedText, setCombinedText] = useState<string>("");

  // Update combined text whenever prompts change
  useEffect(() => {
    const text = prompts
      .map((prompt, index) => `${index + 1}. ${prompt.content}`)
      .join("\n\n");
    setCombinedText(text);
  }, [prompts]);

  return (
    <div className={cn("w-full h-full min-h-[300px]", className)}>
      <textarea
        value={combinedText}
        readOnly
        className="w-full h-full min-h-[300px] p-4 rounded-lg border border-gray-200 
                   bg-white/50 backdrop-blur-sm resize-none focus:ring-2 
                   focus:ring-blue-500 focus:border-transparent"
        placeholder="Drag prompts here to see them combined..."
        aria-label="Combined prompts display"
      />
    </div>
  );
}; 
