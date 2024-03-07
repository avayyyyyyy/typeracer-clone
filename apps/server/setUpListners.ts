import { Socket } from "dgram";
import { Server } from "socket.io";

export function setUpListners(io: Server) {
  io.on("connection", (socket) => {
    console.log(`${socket.id} is connected!`);
    socket.on("join-game", (roomId: string, name: string) => {
      if (!roomId) return socket.emit("error", "Room ID not valid");
      if (!name) return socket.emit("error", "Name not valid");

      socket.join(roomId);
    });
  });
}
