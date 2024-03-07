import { room, setUpListners } from "./setUpListners";
import { Server, Socket } from "socket.io";
import { generateParagraph } from "./utils/para";

export class Game {
  gameStatus: "not-started" | "in-progress" | "completed";
  gameID: string;
  players: { name: string; id: string; score: number }[];
  io: Server;
  gameHost: string;
  paragraph: string;

  constructor(id: string, io: Server, host: string) {
    this.gameID = id;
    this.gameStatus = "not-started";
    this.players = [];
    this.gameHost = host;
    this.paragraph = "";
    this.io = io;
  }

  setUpListners(socket: Socket) {
    socket.on("start-game", async () => {
      if (this.gameHost !== socket.id) {
        return socket.emit("error", "you are not the host! ");
      }
      if (this.gameStatus === "in-progress") {
        return socket.emit("error", "Game is already started");
      }

      for (const player of this.players) {
        player.score = 0;
      }

      this.io.to(this.gameID).emit("player", this.players);

      this.gameStatus = "in-progress";

      const paragraph = await generateParagraph();
      this.paragraph = paragraph;
      this.io.to(this.gameID).emit("game-started", paragraph);

      setTimeout(() => {
        this.gameStatus = "completed";
        this.io.to(this.gameID).emit("game-finished");
        this.io.to(this.gameID).emit("player", this.players);
      }, 60000);

      socket.on("player-typed", (typed: string) => {
        if (this.gameStatus !== "in-progress")
          return socket.emit("error", "The game has not started yet");

        const splittedParagraph = this.paragraph.split(" ");
        const splittedTyped = typed.split(" ");

        let score = 0;

        for (let i = 0; i < splittedTyped.length; i++) {
          if (splittedTyped[i] === splittedParagraph[i]) {
            score++;
          } else {
            break;
          }
        }

        const player = this.players.find((player) => player.id === socket.id);

        if (player) {
          player.score = score;
        }

        this.io.to(this.gameID).emit("players", { id: socket.id, score });
      });

      socket.on("leave", () => {
        if (socket.id === this.gameHost) {
          this.players = this.players.filter(
            (player) => player.id !== this.gameHost
          );

          this.gameHost = this.players[0].id;
        } else {
          room.delete(this.gameID);
        }
      });

      socket.on("disconnect", () => {
        if (socket.id === this.gameHost) {
          this.players = this.players.filter(
            (player) => player.id !== socket.id
          );

          if (this.players.length !== 0) {
            this.gameHost = this.players[0].id;
          } else {
            // Delete the game if the host leaves and there are no players
            room.delete(this.gameID);
          }
        }

        socket.leave(this.gameID);
        this.players = this.players.filter((player) => player.id !== socket.id);
      });
    });
  }

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
