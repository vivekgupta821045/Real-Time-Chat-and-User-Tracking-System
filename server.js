
 const os = require("os");
 require("dotenv").config();
const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const mongoose = require("mongoose");

const multer = require("multer");



const QRCode = require("qrcode");

/* ========================= */

const app = express();

const server = http.createServer(app);

const io = new Server(server);

/* =========================
   MONGODB
========================= */

mongoose.connect(
  process.env.MONGO_URI
)

.then(()=>{

  console.log("MongoDB Connected");

})

.catch((err)=>{

  console.log(err);
});

/* =========================
   MESSAGE SCHEMA
========================= */

const MessageSchema =
new mongoose.Schema({

  username:String,

  message:String,

  time:String,

  seen:Boolean

});

const Message =
mongoose.model(
  "Message",
  MessageSchema
);

/* =========================
   STATIC
========================= */

app.use(
  express.static("public")
);

/* =========================
   FILE STORAGE
========================= */

const storage =
multer.diskStorage({

  destination:
  "public/uploads/",

  filename:
  (req,file,cb)=>{

    cb(
      null,
      Date.now() +
      "-" +
      file.originalname
    );
  }
});

const upload =
multer({storage});

/* =========================
   FILE UPLOAD
========================= */

app.post(
  "/upload",

  upload.single("file"),

  (req,res)=>{

    res.json({

      file:req.file.filename
    });
  }
);

/* =========================
   QR ROUTE
========================= */

/* =========================
   QR ROUTE
========================= */

app.get("/qr", async(req,res)=>{

  const interfaces =
  os.networkInterfaces();

  let localIP =
  "localhost";

  for(const name in interfaces){

    for(const net of interfaces[name]){

      if(
        net.family === "IPv4" &&
        !net.internal
      ){

        localIP = net.address;
      }
    }
  }

  const url =
  `http://${localIP}:${process.env.PORT}`;

  const qr =
  await QRCode.toDataURL(url);

  res.send(`

  <body
  style="
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  background:#edf6ff;
  font-family:Arial;
  ">

  <div
  style="
  text-align:center;
  ">

  <h1>
  Scan To Join LAN
  </h1>

  <img
  src="${qr}"
  width="300">

  <p>
  ${url}
  </p>

  </div>

  </body>
  `);
});


/* =========================
   USERS
========================= */

let users = {};

/* =========================
   SOCKET CONNECTION
========================= */

io.on(
  "connection",
  (socket)=>{

  console.log(
    "New Device Connected"
  );

  /* JOIN */

  socket.on(
    "join",
    async(username)=>{

    users[socket.id] =
    username;

    /* SEND USERS */

    io.emit(
      "users",
      Object.values(users)
    );

    /* STATUS */

    io.emit(
      "chatMessage",
      {

      username:"SYSTEM",

      message:
      `🟢 ${username} joined the LAN`,

      time:new Date()
.toLocaleTimeString([],{
  hour:'2-digit',
  minute:'2-digit'
}),

      seen:true
      }
    );

    /* OLD MESSAGES */

    const oldMessages =
    await Message.find();

    socket.emit(
      "oldMessages",
      oldMessages
    );
  });

  /* TYPING */

  socket.on(
    "typing",
    (username)=>{

    socket.broadcast.emit(
      "typing",
      username
    );
  });

  /* CHAT */

socket.on(
  "chatMessage",
  async(data)=>{

    const msg =
    new Message({

      username:
      data.username,

      message:
      data.message,

      time:new Date()
      .toLocaleTimeString([],{
        hour:'2-digit',
        minute:'2-digit'
      }),

      seen:true
    });

    await msg.save();

    io.emit(
      "chatMessage",
      msg
    );
});

  /* DISCONNECT */

  socket.on(
    "disconnect",
    ()=>{

    const username =
users[socket.id] || "Unknown User";

    delete users[socket.id];

    io.emit(
      "users",
      Object.values(users)
    );

    io.emit(
      "chatMessage",
      {

      username:"SYSTEM",

      message:
      `🔴 ${username} left the LAN`,

      time:new Date()
.toLocaleTimeString([],{
  hour:'2-digit',
  minute:'2-digit'
}),

      seen:true
      }
    );

    console.log(
      "Device Disconnected"
    );
  });
});

/* =========================
   SERVER
========================= */

server.listen(
  process.env.PORT,
  "0.0.0.0",
  ()=>{

 console.log(
  `Server Running:
  http://localhost:${process.env.PORT}`
);
});
