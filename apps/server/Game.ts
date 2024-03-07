import { setUpListners } from "./setUpListners";
import { Server, Socket, Socket } from "socket.io";

export class Game {
  gameStatus: "not-started" | "in-progress" | "completed";
  gameID: string;
  players: { name: string; id: string; score: number }[];
  io: Server;
  gameHost: string;
  paragraph: "";

  constructor(id: string, io: Server, host: string) {
    this.gameID = id;
    this.gameStatus = "not-started";
    this.players = [];
    this.gameHost = host;
    this.paragraph = "";
    this.io = io;
  }

  setUpListners(socket: Socket) {}

  joinGame(id: string, name: string, socket: Socket) {
    if (this.gameStatus === "in-progress") {
      return socket.emit("error", "Game is alredy started!");
    }

    this.players.push({ name, id, score: 0 });

    this.io.to(this.gameID).emit("player-joined", { id, name, score: 0 });
    socket.emit("players", this.players);
    socket.emit("new-host", this.gameHost);
    this.setUpListners(socket);
  }
}
