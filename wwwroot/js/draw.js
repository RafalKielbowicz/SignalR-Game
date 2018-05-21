const connection = new signalR.HubConnectionBuilder()
    .withUrl("/signalr")
    .build();

connection.on('newStroke', drawStroke)
connection.on('clearCanvas', clearCanvas)
connection.start().catch(err => console.error)

var canvas = document.getElementById('draw-canvas')
var ctx = canvas.getContext('2d')
ctx.lineWidth = 4

var clearButton = document.getElementById('clear')
clearButton.addEventListener('click', ev => {
    ev.preventDefault()
    if (confirm("Are you sure you want to clear canvas?")) {
        clearCanvas()
        connection.invoke('ClearCanvas')
    }
})

var colorButton = document.getElementById('color')

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

var penDown = false
var previous = { x: 0, y: 0 }
canvas.addEventListener('mousedown', ev => {
    penDown = true
})

canvas.addEventListener('mouseup', ev => {
    penDown = false
})

canvas.addEventListener('mousemove', ev => {
    if (penDown) {
        var start = {
            x: previous.x - canvas.offsetLeft,
            y: previous.y - canvas.offsetTop
        }
        var end = {
            x: ev.pageX - canvas.offsetLeft,
            y: ev.pageY - canvas.offsetTop
        }
        drawStroke(start, end, colorButton.value)
        connection.invoke('NewStroke', start, end, colorButton.value)
    }
    previous = {
        x: ev.pageX,
        y: ev.pageY
    }
})

function drawStroke(start, end, color) {
    color = color || "#000"
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
}

function myFunction(e) {
    var x = e.clientX;
    var y = e.clientY;
    var coor = "Coordinates: (" + x + "," + y + ")";

    document.getElementById("demo").innerHTML = coor;
}

canvas.addEventListener('onmousemove', myFunction);

// Chat
connection.on("ReceiveMessage", (user, message) => {
    const encodedMsg = user + " says: " + message;
    const li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

document.getElementById("sendButton").addEventListener("click", event => {
    const user = document.getElementById("userInput").value;
    const message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
    event.preventDefault();
});
