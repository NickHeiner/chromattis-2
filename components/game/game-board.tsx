"use client"

import { useMemo } from "react"
import { useGameStore } from "@/lib/game/store"
import { GameTile } from "./game-tile"

export function GameBoard() {
  const board = useGameStore((state) => state.board)
  const previewedTileId = useGameStore((state) => state.previewedTileId)

  const gridSize = useMemo(() => Math.ceil(Math.sqrt(board.length)), [board.length])

  const previewedTile = board.find((t) => t.id === previewedTileId)
  const previewTargetIds = useMemo(() => new Set(previewedTile?.targetTiles ?? []), [previewedTile])

  if (board.length === 0) {
    return <div className="aspect-square w-full bg-gray-100 rounded-lg animate-pulse" />
  }

  return (
    <div
      className="grid gap-2 aspect-square w-full"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {board.map((tile) => (
        <GameTile
          key={tile.id}
          tile={tile}
          isBeingPreviewed={tile.id === previewedTileId}
          isTargetPreview={previewTargetIds.has(tile.id)}
        />
      ))}
    </div>
  )
}
