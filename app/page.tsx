import { ChromattisGame } from "@/components/chromattis-game"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <ChromattisGame />
    </main>
  )
}
