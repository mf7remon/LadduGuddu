const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const {
  createRoom,
  joinRoom,
  getRoom,
} = require("./rooms");


dotenv.config();


const app = express();

const server = http.createServer(app);


app.use(cors());

app.use(express.json());



const io = new Server(server, {

  cors: {

    origin: "http://localhost:3000",

    methods: ["GET", "POST"],

  },

});





app.get("/", (req, res) => {

  res.send("LadduGuddu Backend Running 🚀");

});







io.on("connection", (socket) => {



  console.log(
    "Connected:",
    socket.id
  );







  // CREATE ROOM

  socket.on("room:create", () => {



    const roomCode =
      createRoom(socket.id);



    socket.join(roomCode);



    socket.emit("room:created", {

      roomCode,

      role: "HOST",

    });



    console.log(
      "Room created:",
      roomCode
    );


  });









  // JOIN ROOM

  socket.on("room:join", (roomCode) => {



    const joined =
      joinRoom(
        roomCode,
        socket.id
      );



    if (!joined) {


      socket.emit(
        "room:error",
        {
          message: "Room unavailable",
        }
      );


      return;


    }






    socket.join(roomCode);





    socket.emit(
      "room:joined",
      {

        roomCode,

        role: "GUEST",

      }
    );






    io.to(roomCode).emit(
      "participant:joined"
    );





    console.log(

      socket.id,

      "joined",

      roomCode

    );


  });









  // REJOIN ROOM

  socket.on("room:rejoin", (roomCode) => {



    const room =
      getRoom(roomCode);




    if (!room) {

      return;

    }





    socket.join(roomCode);





    console.log(

      socket.id,

      "rejoined",

      roomCode

    );


  });









  // ==========================
  // VIDEO PLAYBACK EVENTS
  // ==========================



  socket.on("video:play", (data) => {


    socket.to(data.roomCode)
      .emit(
        "video:play"
      );


  });







  socket.on("video:pause", (data) => {


    socket.to(data.roomCode)
      .emit(
        "video:pause"
      );


  });







  socket.on("video:seek", (data) => {


    socket.to(data.roomCode)
      .emit(
        "video:seek",
        data.time
      );


  });






// VIDEO SOURCE CHANGE


socket.on("video:change-source", (data) => {


  io.to(data.roomCode)
    .emit(
      "video:source-changed",
      {
        url: data.url
      }
    );


});


  // ==========================
  // VIDEO INITIAL SYNC
  // ==========================



  socket.on("video:request-state", (data) => {


    socket.to(data.roomCode)
      .emit(
        "video:send-state",
        {
          requester: socket.id
        }
      );


  });







  socket.on("video:send-state", (data) => {


    socket.to(data.roomCode)
      .emit(
        "video:sync-state",
        {
          currentTime: data.currentTime,

          isPlaying: data.isPlaying,

        }
      );


  });



  // ==========================
// VIDEO DRIFT CORRECTION
// ==========================


socket.on("video:sync-check", (data) => {



  socket.to(data.roomCode)
    .emit(
      "video:sync-update",
      {
        currentTime: data.currentTime,
      }
    );



});







  // LEAVE ROOM

  socket.on("room:leave", (roomCode) => {



    socket.leave(roomCode);





    socket.to(roomCode)
      .emit(
        "participant:left"
      );





    console.log(

      socket.id,

      "left",

      roomCode

    );


  });









  socket.on("disconnect", () => {



    console.log(

      "Disconnected:",

      socket.id

    );


  });






});









const PORT = 5000;



server.listen(PORT, () => {



  console.log(

    `Server running on ${PORT}`

  );


});