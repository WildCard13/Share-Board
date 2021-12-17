const express = require("express");
const socket = require("socket.io");

const app = express();

app.use(express.static("public"));

let port = 5000;
let server = app.listen(port, () => {
    console.log("Listening to port : "+port);
})

let io = socket(server);

io.on("connection", (socket) => {
    console.log("Made socket connection");

    socket.on("beginPath", (data) => {
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawPath", (data) => {
        io.sockets.emit("drawPath", data);
    })

    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
    })

})