import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SuperPromptOutputProps {
  superPrompt: string;
}

const SuperPromptOutput = ({ superPrompt }: SuperPromptOutputProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(superPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full">
      <Button
        onClick={handleCopy}
        size="sm"
        variant="ghost"
        className="absolute right-2 top-2 z-10"
        aria-label="Copy super prompt to clipboard"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </>
        )}
      </Button>
      <ScrollArea className="h-full w-full">
        <textarea
          value={superPrompt}
          readOnly
          className="w-full h-full min-h-[200px] rounded-lg border border-input bg-background px-3 py-2 pt-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </ScrollArea>
    </div>
  );
};

export default SuperPromptOutput; 