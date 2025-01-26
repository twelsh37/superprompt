"use client"

import { useState } from "react"
import { downloadTextFromElement } from "@/utils/downloadUtils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SelectorDownloadButtonProps {
  onContentDownloaded: (content: string) => void;
}

export const SelectorDownloadButton = ({ onContentDownloaded }: SelectorDownloadButtonProps) => {
  const [selector, setSelector] = useState("")

  const handleDownload = () => {
    if (!selector.trim()) {
      console.error("Please enter a valid CSS selector")
      return
    }

    const result = downloadTextFromElement(selector, 'selected-content.txt')
    if (!result.success) {
      console.error(`Failed to download content from selector: ${selector}`)
    } else {
      onContentDownloaded(result.content)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="text"
        placeholder="Enter CSS selector"
        value={selector}
        onChange={(e) => setSelector(e.target.value)}
        className="max-w-md"
      />
      <Button 
        onClick={handleDownload}
        variant="outline"
      >
        Download from Selector
      </Button>
    </div>
  )
} 
