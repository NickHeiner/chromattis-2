"use client"

import type { Tile } from "@/lib/game/types"
import { useGameStore } from "@/lib/game/store"
import { COLORS } from "@/lib/game/levels"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GameTileProps {
  tile: Tile
  isBeingPreviewed: boolean
  isTargetPreview: boolean
}

export function GameTile({ tile, isBeingPreviewed, isTargetPreview }: GameTileProps) {
  const { clickTile, setPreviewedTile } = useGameStore()

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => clickTile(tile.id)}
            onMouseEnter={() => setPreviewedTile(tile.id)}
            onMouseLeave={() => setPreviewedTile(null)}
            className={cn(
              "relative w-full aspect-square rounded-lg flex items-center justify-center font-bold text-2xl md:text-3xl text-white transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-900",
              "transform-gpu",
              isBeingPreviewed && "scale-105 z-10 shadow-lg ring-4 ring-white/90 ring-offset-2 ring-offset-gray-800",
              isTargetPreview && !isBeingPreviewed && "scale-95 opacity-80 ring-2 ring-white/50",
              !isBeingPreviewed && !isTargetPreview && "scale-100 opacity-100",
            )}
            style={{ backgroundColor: COLORS[tile.color] }}
            aria-label={`Tile ${tile.id + 1}, color ${tile.color}`}
          >
            <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">{tile.color}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tile ID: {tile.id}</p>
          <p>Targets: [{tile.targetTiles.join(", ")}]</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
