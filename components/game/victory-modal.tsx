"use client"

import { useGameStore } from "@/lib/game/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { PartyPopper, Twitter } from "lucide-react"

interface VictoryModalProps {
  isOpen: boolean
}

export function VictoryModal({ isOpen }: VictoryModalProps) {
  const { moves, bestScores, levelIndex, nextLevel } = useGameStore()
  const bestScore = bestScores[levelIndex]

  const shareText = `I solved Level ${levelIndex + 1} of Chromattis in ${moves} moves! Can you beat my score?`
  const shareUrl = "https://v0.dev" // Placeholder URL
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && nextLevel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <PartyPopper className="h-8 w-8 text-yellow-500" />
            Level Complete!
          </DialogTitle>
          <DialogDescription>Congratulations, you've solved the puzzle.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-sm text-muted-foreground">Your Moves</p>
              <p className="text-3xl font-bold">{moves}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Moves</p>
              <p className="text-3xl font-bold">{bestScore}</p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 pt-4">
            <Button variant="outline" size="sm" asChild>
              <a href={twitterIntentUrl} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4 mr-2" /> Share on X
              </a>
            </Button>
            {/* Add other share buttons here */}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={nextLevel} className="w-full">
            Next Level
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
