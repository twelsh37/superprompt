"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Settings, PlusCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-64 border-r bg-gray-100/40", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Super Prompt Builder
          </h2>
          <div className="space-y-1">
            <Link href="/">
              <Button 
                variant={pathname === "/" ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/templates">
              <Button 
                variant={pathname === "/templates" ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </Link>
            <Link href="/create">
              <Button 
                variant={pathname === "/create" ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Settings</h2>
          <div className="space-y-1">
            <Link href="/settings">
              <Button 
                variant={pathname === "/settings" ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 