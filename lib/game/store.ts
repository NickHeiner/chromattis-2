import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { GameState, GameActions } from "./types"
import { LEVELS } from "./levels"
import { ChromattisGameEngine } from "./engine"
import { set as lodashSet } from "lodash" // Importing set from lodash to fix the undeclared variable error

// Create a single, shared instance of the headless engine
const engine = new ChromattisGameEngine(LEVELS)

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (setFn, get) => ({
      ...engine.state,

      // Actions are now wrappers around engine methods
      loadLevel: (index: number) => {
        lodashSet(engine, "state", engine.loadLevel(index))
        setFn(engine.state)
      },
      clickTile: (tileId: number) => {
        lodashSet(engine, "state", engine.clickTile(tileId))
        setFn(engine.state)
      },
      undo: () => {
        lodashSet(engine, "state", engine.undo())
        setFn(engine.state)
      },
      setPreviewedTile: (tileId: number | null) => {
        lodashSet(engine, "state", engine.setPreviewedTile(tileId))
        setFn(engine.state)
      },

      // Navigation logic remains in the store as it orchestrates engine state
      nextLevel: () => {
        const currentIndex = get().levelIndex
        if (currentIndex < LEVELS.length - 1) {
          get().loadLevel(currentIndex + 1)
        }
      },
      prevLevel: () => {
        const currentIndex = get().levelIndex
        if (currentIndex > 0) {
          get().loadLevel(currentIndex - 1)
        }
      },

      // Resetting progress is a store-level concern
      resetProgress: () => {
        // This could also be a method on the engine if needed
        localStorage.removeItem("chromattis-game-storage")
        window.location.reload()
      },
    }),
    {
      name: "chromattis-game-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the parts of the state that represent user progress
      partialize: (state) => ({
        levelIndex: state.levelIndex,
        bestScores: state.bestScores,
      }),
      // On rehydration, load the persisted data back into the engine
      onRehydrateStorage: () => (state) => {
        if (state) {
          engine.loadLevel(state.levelIndex)
          engine.setBestScores(state.bestScores)
          lodashSet(engine, "state", engine.state)
          setFn(engine.state)
        }
      },
    },
  ),
)
