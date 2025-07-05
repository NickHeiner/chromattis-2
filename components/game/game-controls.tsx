"use client"

import { useGameStore } from "@/lib/game/store"
import { LEVELS as RAW_LEVELS } from "@/lib/game/levels"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, RotateCcw, Undo } from "lucide-react"

// If the import failed or is still undefined, fall back to an empty array
const LEVELS = Array.isArray(RAW_LEVELS) ? RAW_LEVELS : []

export function GameControls() {
  const { levelIndex, moves, bestScores, loadLevel, nextLevel, prevLevel, undo, history } = useGameStore()

  const bestScore = bestScores[levelIndex] ?? "N/A"
  const canUndo = history.length > 0
  const totalLevels = LEVELS.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevLevel} disabled={levelIndex === 0} aria-label="Previous Level">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Select value={String(levelIndex)} onValueChange={(value) => loadLevel(Number(value))}>
          <SelectTrigger className="w-[180px] text-center font-semibold">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {LEVELS.map?.((_, index) => (
              <SelectItem key={index} value={String(index)}>
                Level {index + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextLevel}
          disabled={levelIndex >= totalLevels - 1}
          aria-label="Next Level"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 px-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
            <Undo className="h-4 w-4 mr-2" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={() => loadLevel(levelIndex)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        <div className="text-right">
          <div>
            Moves: <span className="font-bold">{moves}</span>
          </div>
          <div>
            Best: <span className="font-bold">{bestScore}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
