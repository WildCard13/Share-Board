let canvas = document.querySelector("canvas");
let pencilColor = document.querySelectorAll(".pencil-colour")
let pencilWidth = document.querySelector(".pencil-width");
let eraserWidth = document.querySelector(".eraser-width");
let download = document.querySelector(".download"); 
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let penColor = "black";
let ersColor = "white";
let penWidth = pencilWidth.value;
let ersWidth = eraserWidth.value;

let undoRedoTracker = [];
let track = 0;

let mouseDown = false;
let pen = canvas.getContext("2d");

pen.strokeStyle = penColor;
pen.linewidth = penWidth;




canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    let data = { 
        x: e.clientX, 
        y: e.clientY 
    }
    socket.emit("beginPath", data);
})
canvas.addEventListener("mousemove", (e) => {
    // if(mouseDown){
    //     drawPath({ 
    //         x: e.clientX, 
    //         y: e.clientY, 
    //         colour: eraserFlag ? ersColor : penColor,
    //         width: eraserFlag ? ersWidth : penWidth
    //      })
    // }
    if(mouseDown){
        let data = {
            x: e.clientX, 
            y: e.clientY, 
            colour: eraserFlag ? ersColor : penColor,
            width: eraserFlag ? ersWidth : penWidth
        }
        socket.emit("drawPath", data);
    }
})
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

undo.addEventListener("click", (e) => {
    if(track > 0) track--;
    // undo Track Ation :
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("undoRedo", data);

})

redo.addEventListener("click", (e) => {
    if(track < undoRedoTracker.length-1) track++;
    // Redo Track Action :
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("undoRedo", data);
})

function undoRedoTrack (trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        pen.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    pen.beginPath();
    pen.moveTo(strokeObj.x, strokeObj.y);
}
function drawPath(strokeObj) {
    pen.strokeStyle = strokeObj.colour;
    pen.lineWidth = strokeObj.width;
    pen.lineTo(strokeObj.x, strokeObj.y);
    pen.stroke();
}

pencilColor.forEach((colourElem) => {
    colourElem.addEventListener("click", (e) =>{
        let colour = colourElem.classList[0];
        penColor = colour;
        pen.strokeStyle = penColor;
    })
})

pencilWidth.addEventListener("change", (e) => {
    penWidth = pencilWidth.value;
    pen.lineWidth = penWidth;
})

eraserWidth.addEventListener("change", (e) => {
    ersWidth = eraserWidth.value;
    pen.lineWidth = ersWidth;
})
eraser.addEventListener("click", (e) => {
    if(eraserFlag){
        pen.strokeStyle = ersColor;
        pen.lineWidth = ersWidth;

    }
    else{
        pen.strokeStyle = penColor;
        pen.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPath", (data) => {
    // Data -> From Server
    beginPath(data);
})
socket.on("drawPath", (data) => {
    // Data -> From Server
    drawPath(data);
})
socket.on("undoRedo", (data) => {
    // Data -> From Server
    undoRedoTrack(data);
})