import type { Tile, LevelData, GameState, HistoryEntry } from "./types"

export class ChromattisGameEngine {
  public state: GameState
  private history: HistoryEntry[] = []
  private levels: LevelData[]

  constructor(levels: LevelData[]) {
    this.levels = levels
    this.state = {
      levelIndex: 0,
      board: [],
      moves: 0,
      isWin: false,
      bestScores: {},
      previewedTileId: null,
    }
    this.loadLevel(0)
  }

  public loadLevel(index: number): GameState {
    const levelData = this.levels[index]
    if (!levelData) return this.state

    let newBoard: Tile[]
    let isInitiallyWon: boolean

    do {
      newBoard = levelData.board.map((tile) => ({
        id: tile.id,
        color: Math.floor(Math.random() * 7),
        targetTiles: tile.targetTiles,
      }))
      isInitiallyWon = newBoard.length > 1 && newBoard.every((t) => t.color === newBoard[0].color)
    } while (isInitiallyWon)

    this.state.levelIndex = index
    this.state.board = newBoard
    this.state.moves = 0
    this.state.isWin = false
    this.history = []
    this.state.previewedTileId = null

    return { ...this.state }
  }

  public clickTile(tileId: number): GameState {
    if (this.state.isWin) return this.state

    this.history.push({ board: this.state.board, moves: this.state.moves })

    const tile = this.state.board.find((t) => t.id === tileId)
    if (!tile) return this.state

    const targetIds = new Set(tile.targetTiles)
    const newBoard = this.state.board.map((t) => {
      if (targetIds.has(t.id)) {
        return { ...t, color: (t.color + 1) % 7 }
      }
      return t
    })

    const isWin = newBoard.every((t) => t.color === newBoard[0].color)

    this.state.board = newBoard
    this.state.moves += 1
    this.state.isWin = isWin

    if (isWin) {
      const currentBest = this.state.bestScores[this.state.levelIndex]
      if (currentBest === null || this.state.moves < currentBest) {
        this.state.bestScores[this.state.levelIndex] = this.state.moves
      }
    }

    return { ...this.state }
  }

  public undo(): GameState {
    if (this.history.length === 0) return this.state

    const lastState = this.history.pop()
    if (lastState) {
      this.state.board = lastState.board
      this.state.moves = lastState.moves
      this.state.isWin = false
    }

    return { ...this.state }
  }

  public setPreviewedTile(tileId: number | null): GameState {
    this.state.previewedTileId = tileId
    return { ...this.state }
  }

  public setBestScores(scores: Record<number, number | null>): void {
    this.state.bestScores = scores
  }

  public countMoves(): number {
    return this.history.length
  }
}
