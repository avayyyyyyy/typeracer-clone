import { Server } from "socket.io";
import { Game } from "./Game";

export const room = new Map<string, Game>();

export function setUpListners(io: Server) {
  io.on("connection", (socket) => {
    console.log(`${socket.id} is connected!`);
    socket.on("join-game", (roomId: string, name: string) => {
      if (!roomId) return socket.emit("error", "Room ID not valid");
      if (!name) return socket.emit("error", "Name not valid");

      socket.join(roomId);

      if (room.has(roomId)) {
        const game = room.get(roomId);

        if (!game) return socket.emit("error", "Game not found");
        game.joinGame(socket.id, name, socket);
      } else {
        const game = new Game(roomId, io, socket.id);
        room.set(roomId, game);
        game.joinGame(socket.id, name, socket);
      }
    });
  });
}
