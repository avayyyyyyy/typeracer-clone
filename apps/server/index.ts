import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 8080;

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", () => {
  console.log("Someone is connected!");
});




server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
