"use client"

import { useEffect } from "react"
import { useGameStore } from "@/lib/game/store"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { GameBoard } from "@/components/game/game-board"
import { GameControls } from "@/components/game/game-controls"
import { VictoryModal } from "@/components/game/victory-modal"
import { Card, CardContent } from "@/components/ui/card"

export function ChromattisGame() {
  const { loadLevel, levelIndex, isWin, nextLevel, prevLevel, undo } = useGameStore()

  useEffect(() => {
    // Load the initial level when the component mounts
    loadLevel(levelIndex)
  }, [loadLevel, levelIndex])

  useKeyboardShortcuts({
    "=": nextLevel,
    "-": prevLevel,
    ArrowRight: nextLevel,
    ArrowLeft: prevLevel,
    z: undo, // Ctrl+Z is handled by browsers, so we use 'z'
  })

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tighter text-gray-800 dark:text-gray-200">Chromattis</h1>
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg">
        <CardContent className="p-4 md:p-6 flex flex-col gap-4">
          <GameControls />
          <GameBoard />
        </CardContent>
      </Card>
      <VictoryModal isOpen={isWin} />
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Use{" "}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            ←
          </kbd>{" "}
          /{" "}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            →
          </kbd>{" "}
          or{" "}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            -
          </kbd>
          /
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            =
          </kbd>{" "}
          to navigate levels.
        </p>
        <p>
          Press{" "}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            Z
          </kbd>{" "}
          to undo a move.
        </p>
      </div>
    </div>
  )
}
