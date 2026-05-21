const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
<<<<<<< HEAD
const mysql = require("mysql2");
=======
//const mysql = require("mysql2");
>>>>>>> a07067f34aed7859e707e2ef9e02e3731e6dcde5

const app = express();
const server = http.createServer(app);
const io = new Server(server);

<<<<<<< HEAD
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "live_chat",
});

db.connect((err) => {
  if (err) {
    console.log("MySQL connection error:", err);
    return;
  }
  console.log("MySQL connected");
});
=======
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "1234",
//   database: "live_chat",
// });

// db.connect((err) => {
//   if (err) {
//     console.log("MySQL connection error:", err);
//     return;
//   }
//   console.log("MySQL connected");
// });
>>>>>>> a07067f34aed7859e707e2ef9e02e3731e6dcde5

app.use(express.static(path.join(__dirname, "public")));

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("join", ({ username }) => {
    if (!username) return;

    const sql =
      "INSERT INTO users (socket_id, username, connected_at, status) VALUES (?, ?, NOW(), 'online')";
    db.query(sql, [socket.id, username], (err, result) => {
      if (err) {
        console.log("Insert user error:", err);
        return;
      }

      onlineUsers.set(socket.id, {
        id: result.insertId,
        socketId: socket.id,
        username,
      });

      io.emit("system", {
        text: `${username} joined the chat`,
        time: new Date(),
      });

      io.emit("online-users", {
        users: Array.from(onlineUsers.values()),
      });
    });
  });

  socket.on("message", ({ text }) => {
    const user = onlineUsers.get(socket.id);
    if (!user || !text) return;

    const messageSql =
      "INSERT INTO messages (user_id, message, sent_at) VALUES (?, ?, NOW())";
    db.query(messageSql, [user.id, text], (err) => {
      if (err) {
        console.log("Insert message error:", err);
        return;
      }

      io.emit("message", {
        username: user.username,
        text,
        time: new Date(),
        own: false,
      });
    });
  });

  socket.on("typing", ({ isTyping }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    socket.broadcast.emit("typing", {
      username: user.username,
      isTyping,
    });
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    const updateSql =
      "UPDATE users SET status = 'offline', disconnected_at = NOW(), last_seen = NOW() WHERE id = ?";
    db.query(updateSql, [user.id], (err) => {
      if (err) {
        console.log("Disconnect update error:", err);
      }
    });

    onlineUsers.delete(socket.id);

    io.emit("system", {
      text: `${user.username} left the chat`,
      time: new Date(),
    });

    io.emit("online-users", {
      users: Array.from(onlineUsers.values()),
    });
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
<<<<<<< HEAD
}); 
=======
}); 
>>>>>>> a07067f34aed7859e707e2ef9e02e3731e6dcde5
