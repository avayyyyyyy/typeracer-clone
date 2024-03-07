"use client";

import { Player } from "../types/types";
import { Card } from "./ui/card";

export default function LeaderboardCard({
  player,
  rank,
  score,
}: {
  player: Player;
  rank: number;
  score: number;
}) {
  return (
    <Card className="w-full flex p-5 gap-5">
      <div className="text-xl"># {rank}</div>
      <div className="text-xl">{player.name}</div>
      <div className="ml-auto text-xl">Score: {score}</div>
    </Card>
  );
}
