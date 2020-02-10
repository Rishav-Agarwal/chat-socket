var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  const nickname = socket.handshake.query.nickname;

  // User connected
  socket.broadcast.emit("user-connect", nickname + " connected");

  // User disconnected
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnect", nickname + " disconnected");
  });

  // User sends a message
  socket.on("chat-msg", msg => {
    // Send the message to all the users
    socket.broadcast.emit(
      "chat-msg",
      "<strong>" + nickname + "</strong>: " + msg
    );
  });
});

http.listen(3000, () => {
  console.log("Listening on port 3000");
});
