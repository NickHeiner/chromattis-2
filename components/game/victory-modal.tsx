"use client";

import { useGameStore } from "@/lib/game/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { PartyPopper, Twitter } from "lucide-react";

interface VictoryModalProps {
  isOpen: boolean;
}

export function VictoryModal({ isOpen }: VictoryModalProps) {
  const { moves, bestScores, levelIndex, nextLevel } = useGameStore();
  const bestScore = bestScores[levelIndex];

  if (!isOpen) return null;

  const shareText = `I solved Level ${
    levelIndex + 1
  } of Chromattis in ${moves} moves! Can you beat my score?`;
  const shareUrl = "https://v0.dev"; // Placeholder URL
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <Card
      className="w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg animate-slide-down"
      aria-live="polite"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <PartyPopper className="h-8 w-8 text-yellow-500" />
          Level Complete!
        </CardTitle>
        <CardDescription>
          Congratulations, you've solved the puzzle.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
        <div className="flex justify-center items-center gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href={twitterIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-4 w-4 mr-2" /> Share on X
            </a>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={nextLevel} className="w-full">
          Next Level
        </Button>
      </CardFooter>
    </Card>
  );
}
