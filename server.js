// const express = require("express");
// const http = require("http");
// const socketio = require("socket.io");
// const cors = require("cors");
// const app = express();

// app.use(cors({ origin: "*" }));

// const server = http.createServer(app);
// const io = socketio(server);

const io = require("socket.io")(process.env.PORT || 8000, {
  cors: {
    origin: "*",
  },
});

AllRooms = {};

CreatorColor = {};

// server.listen(process.env.PORT || 8000);

io.on("connection", (socket) => {
  console.log("connect", socket.id);

  socket.on("create-game", (game_id, color) => {
    socket.join(game_id);

    CreatorColor[game_id] = color;
    AllRooms[game_id] = [socket.id];
  });

  socket.on("send-message", (message, game_id) => {
    socket.to(game_id).emit("receive-message", message);
  });

  socket.on("join-game", (game_id) => {
    if (game_id in AllRooms) {
      socket.join(game_id);

      AllRooms[game_id].push(socket.id);

      if (CreatorColor[game_id] === "white") {
        socket.emit("receive-color", "black");
      } else {
        // send white color
        socket.emit("receive-color", "white");
      }
    } else {
      console.log("Does not Exist");
    }
  });

  socket.on("send-move", ({ fromPosition, toPosition }, gameid) => {
    socket.to(gameid).emit("receive-move", { fromPosition, toPosition });
  });

  socket.on("disconnect", () => {
    console.log("disconect", socket.id);
  });
});
