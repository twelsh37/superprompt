"use client"

import { Card } from "@/components/ui/card"

interface PromptCardProps {
  id: string
  title: string
  content: string
  onDragStart?: (e: React.DragEvent) => void
}

const PromptCard = ({ id, title, content, onDragStart }: PromptCardProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id)
    onDragStart?.(e)
  }

  return (
    <Card 
      draggable="true"
      onDragStart={handleDragStart}
      className="w-16 h-16 cursor-move hover:shadow-lg transition-shadow"
    >
      <div 
        className="w-full h-full flex items-center justify-center text-sm p-1 text-center"
        title={content}
      >
        {title}
      </div>
    </Card>
  )
}

export default PromptCard 
