import { createServer } from "http";
import { Server } from "socket.io";
import { setUpListners } from "./setUpListners";

const PORT = process.env.PORT || 8080;

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});


setUpListners(io);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
