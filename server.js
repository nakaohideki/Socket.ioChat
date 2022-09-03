const app = require("express")(); //Declararing the module to be applied in this application
const http = require("http").createServer(app);
const io = require("socket.io")(http); //Connecting the server js to socket.io.

app.get("/", (req, res) => {
  //Sending the index.html file to the navigator.
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  //Warning by the console.log in case of new connection at socket.io
  console.log("new connection", socket.id);
  //In case os msg event occurs, printing the msg.
  socket.on("msg", (msg) => {
    console.log(msg);
    //Sending the msg to the all of other clients by socket.io
    socket.broadcast.emit("msg", msg);
    //Creating a channel restricting the clients.
    socket.join("contador");
  });
});

let counter = 0; //Criating a variable to count the messages.
setInterval(() => {
  //Sending the message msg to clients in contador channel only every 1 second.
  io.to("contador").emit("msg", counter++);
}, 1000);

http.listen(3000, function () {
  //Listening the port 3000
  console.log("Listening on port 3000");
});
