import type { LevelData } from "./types"

export const COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ecf0f1", // clouds
]

export const LEVELS: LevelData[] = [
  {
    id: "9a3c75b1-4d41-4176-83dc-ca53a6220071",
    board: [
      { id: 0, targetTiles: [0], startColor: 0 },
      { id: 1, targetTiles: [1], startColor: 0 },
    ],
  },
  {
    id: "d5b2cd45-4ff7-4a8b-bf1d-82a64a0d5ea0",
    board: [
      { id: 0, targetTiles: [1], startColor: 0 },
      { id: 1, targetTiles: [0, 1], startColor: 0 },
    ],
  },
  {
    id: "1a49af53-2cbf-4bbd-bfb0-a6ab2094c3c1",
    board: [
      { id: 0, targetTiles: [0, 1], startColor: 0 },
      { id: 1, targetTiles: [0, 2], startColor: 0 },
      { id: 2, targetTiles: [2, 1], startColor: 0 },
    ],
  },
  {
    id: "afedc58f-574f-4cbd-a06c-1010fcfdd6e6",
    board: [
      { id: 0, targetTiles: [1, 2], startColor: 0 },
      { id: 1, targetTiles: [0, 2], startColor: 0 },
      { id: 2, targetTiles: [0, 1], startColor: 0 },
    ],
  },
  {
    id: "0024214a-8e4e-427c-99bb-b0222f1ec099",
    board: [
      { id: 0, targetTiles: [0, 1], startColor: 0 },
      { id: 1, targetTiles: [1, 2], startColor: 0 },
      { id: 2, targetTiles: [2, 0], startColor: 0 },
      { id: 3, targetTiles: [3, 2], startColor: 0 },
    ],
  },
  {
    id: "61dce9b6-9349-496a-9af3-e942c297e8c6",
    board: [
      { id: 0, targetTiles: [1, 2, 3], startColor: 0 },
      { id: 1, targetTiles: [0, 1, 2], startColor: 0 },
      { id: 2, targetTiles: [2, 3, 0], startColor: 0 },
      { id: 3, targetTiles: [3, 0, 1], startColor: 0 },
    ],
  },
  {
    id: "a3109dd9-b15d-4d80-a0eb-dc6c6f485e76",
    board: [
      { id: 0, targetTiles: [0, 1, 3, 4], startColor: 0 },
      { id: 1, targetTiles: [3, 1, 5], startColor: 0 },
      { id: 2, targetTiles: [1, 2, 5], startColor: 0 },
      { id: 3, targetTiles: [0, 3, 4], startColor: 0 },
      { id: 4, targetTiles: [0, 2, 4], startColor: 0 },
      { id: 5, targetTiles: [1, 2, 4, 5], startColor: 0 },
    ],
  },
  {
    id: "50c1e6c9-eb43-41ca-a8ca-e8e4b6b885d4",
    board: [
      { id: 0, targetTiles: [0, 1, 2], startColor: 0 },
      { id: 1, targetTiles: [1, 3, 4, 5], startColor: 0 },
      { id: 2, targetTiles: [2, 4, 5], startColor: 0 },
      { id: 3, targetTiles: [1, 3], startColor: 0 },
      { id: 4, targetTiles: [0, 2, 4], startColor: 0 },
      { id: 5, targetTiles: [1, 2, 4, 5], startColor: 0 },
    ],
  },
  {
    id: "d14b2389-234e-4fa8-8d13-6635965ab5b3",
    board: [
      { id: 0, targetTiles: [0, 1, 3, 4], startColor: 0 },
      { id: 1, targetTiles: [1, 5], startColor: 0 },
      { id: 2, targetTiles: [1, 2, 4, 5], startColor: 0 },
      { id: 3, targetTiles: [3, 1], startColor: 0 },
      { id: 4, targetTiles: [4, 5], startColor: 0 },
      { id: 5, targetTiles: [5, 7], startColor: 0 },
      { id: 6, targetTiles: [3, 4, 6, 7], startColor: 0 },
      { id: 7, targetTiles: [3, 7], startColor: 0 },
      { id: 8, targetTiles: [4, 5, 7, 8], startColor: 0 },
    ],
  },
  {
    id: "c0b74e6e-4f48-42b2-a971-65993bfcacd2",
    board: [
      { id: 0, targetTiles: [0, 1, 3], startColor: 0 },
      { id: 1, targetTiles: [1, 3, 5], startColor: 0 },
      { id: 2, targetTiles: [1, 2, 5], startColor: 0 },
      { id: 3, targetTiles: [1, 3, 7], startColor: 0 },
      { id: 4, targetTiles: [1, 3, 5, 7], startColor: 0 },
      { id: 5, targetTiles: [2, 4, 4, 5, 8], startColor: 0 },
      { id: 6, targetTiles: [3, 6, 7], startColor: 0 },
      { id: 7, targetTiles: [6, 7, 8, 4], startColor: 0 },
      { id: 8, targetTiles: [5, 7, 8], startColor: 0 },
    ],
  },
  {
    id: "4d68914f-f84b-41c1-a921-f69702075562",
    board: [
      { id: 0, targetTiles: [0, 1, 4, 5], startColor: 0 },
      { id: 1, targetTiles: [1, 2], startColor: 0 },
      { id: 2, targetTiles: [1, 2], startColor: 0 },
      { id: 3, targetTiles: [2, 3, 6, 7], startColor: 0 },
      { id: 4, targetTiles: [4, 8], startColor: 0 },
      { id: 5, targetTiles: [5, 6, 9, 10], startColor: 0 },
      { id: 6, targetTiles: [5, 6, 9, 10], startColor: 0 },
      { id: 7, targetTiles: [7, 11], startColor: 0 },
      { id: 8, targetTiles: [4, 8], startColor: 0 },
      { id: 9, targetTiles: [5, 6, 9, 10], startColor: 0 },
      { id: 10, targetTiles: [5, 6, 9, 10], startColor: 0 },
      { id: 11, targetTiles: [7, 11], startColor: 0 },
      { id: 12, targetTiles: [8, 9, 12, 13], startColor: 0 },
      { id: 13, targetTiles: [13, 14], startColor: 0 },
      { id: 14, targetTiles: [13, 14], startColor: 0 },
      { id: 15, targetTiles: [10, 11, 14, 15], startColor: 0 },
    ],
  },
  {
    id: "a524afce-86b3-48be-b223-af502cb80829",
    board: [
      { id: 0, targetTiles: [0, 1, 2, 3], startColor: 0 },
      { id: 1, targetTiles: [1, 4], startColor: 0 },
      { id: 2, targetTiles: [2, 5, 8], startColor: 0 },
      { id: 3, targetTiles: [3, 6, 9, 12], startColor: 0 },
      { id: 4, targetTiles: [4, 5, 6, 7], startColor: 0 },
      { id: 5, targetTiles: [5, 2, 8], startColor: 0 },
      { id: 6, targetTiles: [6, 3, 9, 12], startColor: 0 },
      { id: 7, targetTiles: [7, 10, 13], startColor: 0 },
      { id: 8, targetTiles: [8, 9, 10, 11], startColor: 0 },
      { id: 9, targetTiles: [9, 3, 6, 12], startColor: 0 },
      { id: 10, targetTiles: [10, 7, 13], startColor: 0 },
      { id: 11, targetTiles: [11, 14], startColor: 0 },
      { id: 12, targetTiles: [12, 13, 14, 15], startColor: 0 },
      { id: 13, targetTiles: [13, 9, 5, 1], startColor: 0 },
      { id: 14, targetTiles: [14, 10, 6, 2], startColor: 0 },
      { id: 15, targetTiles: [15, 11, 7, 3], startColor: 0 },
    ],
  },
  {
    id: "b16b2728-ec5e-4391-a371-147d2138f52e",
    board: [
      { id: 0, targetTiles: [0, 1, 2, 5, 6, 10], startColor: 0 },
      { id: 1, targetTiles: [1, 7, 13, 19], startColor: 0 },
      { id: 2, targetTiles: [1, 2, 3, 7], startColor: 0 },
      { id: 3, targetTiles: [3, 7, 11, 15], startColor: 0 },
      { id: 4, targetTiles: [4, 3, 2, 9, 8, 14], startColor: 0 },
      { id: 5, targetTiles: [5, 11, 17, 23], startColor: 0 },
      { id: 6, targetTiles: [0, 1, 2, 5, 6, 7, 10, 11, 12], startColor: 0 },
      { id: 7, targetTiles: [2, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 22], startColor: 0 },
      { id: 8, targetTiles: [4, 3, 2, 9, 8, 7, 14, 13, 12], startColor: 0 },
      { id: 9, targetTiles: [9, 13, 17, 21], startColor: 0 },
      { id: 10, targetTiles: [5, 10, 15, 11], startColor: 0 },
      { id: 11, targetTiles: [2, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 22], startColor: 0 },
      { id: 12, targetTiles: [0, 4, 6, 8, 12, 16, 18, 20, 24], startColor: 0 },
      { id: 13, targetTiles: [2, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 22], startColor: 0 },
      { id: 14, targetTiles: [9, 14, 19, 13], startColor: 0 },
      { id: 15, targetTiles: [3, 7, 11, 15], startColor: 0 },
      { id: 16, targetTiles: [20, 21, 22, 15, 16, 17, 10, 11, 12], startColor: 0 },
      { id: 17, targetTiles: [2, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 22], startColor: 0 },
      { id: 18, targetTiles: [24, 23, 22, 19, 18, 17, 14, 13, 12], startColor: 0 },
      { id: 19, targetTiles: [1, 7, 13, 19], startColor: 0 },
      { id: 20, targetTiles: [20, 21, 22, 15, 16, 10], startColor: 0 },
      { id: 21, targetTiles: [9, 13, 17, 21], startColor: 0 },
      { id: 22, targetTiles: [21, 22, 23, 17], startColor: 0 },
      { id: 23, targetTiles: [5, 11, 17, 23], startColor: 0 },
      { id: 24, targetTiles: [24, 23, 22, 19, 18, 14], startColor: 0 },
    ],
  },
]
