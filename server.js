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
  //Server Code Starts
  // socket.emit("me", socket.id);

  // socket.on("disconnect", () => {
  // 	socket.broadcast.emit("callEnded")
  // });

  // socket.on("callUser", ({ userToCall, signalData, from, name }) => {
  // 	io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  // });

  // socket.on("answerCall", (data) => {
  // 	io.to(data.to).emit("callAccepted", data.signal)
  // });

  socket.on("SendRequest", ({ gameid, peerdata }) => {
    socket.to(gameid).emit("RequestAccept", { gameid, peerdata });
  });

  socket.on("callother", ({ gameid, peerdata }) => {

    socket.to(gameid).emit("answercall", peerdata);
  });

  socket.on("hangup", ({ gameid }) => {
    socket.to(gameid).emit("hangup")
  })

  socket.on("answertocall", ({ answer, gameid, peerdata }) => {
    socket.to(gameid).emit("replytocallrequest", answer, peerdata);
  });
  //Server code ends

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
