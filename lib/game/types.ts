export type Tile = {
  id: number
  color: number
  targetTiles: number[]
}

export type LevelData = {
  id: string
  board: {
    id: number
    targetTiles: number[]
    startColor: number
  }[]
}

export type GameState = {
  levelIndex: number
  board: Tile[]
  moves: number
  isWin: boolean
  bestScores: Record<number, number | null>
  previewedTileId: number | null
}

// GameActions now omits 'history' as it's an internal detail of the engine
export type GameActions = {
  loadLevel: (index: number) => void
  clickTile: (tileId: number) => void
  undo: () => void
  nextLevel: () => void
  prevLevel: () => void
  resetProgress: () => void
  setPreviewedTile: (tileId: number | null) => void
}

export type HistoryEntry = {
  board: Tile[]
  moves: number
}
