var canvas = document.querySelector('canvas');
canvas.width = 1920;
canvas.height = 1080;
var c = canvas.getContext('2d');

var pointsLeft = 0;
var pointsRight = 0;

var mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

function Bar(x, y, w, h, dy){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dy = dy;

    this.draw = function() {
        c.fillStyle = "White"
        c.fillRect(this.x, this.y, this.w, this.h);
    }

    this.update = function() {
        LeftBar.y = mouse.y - 147 - LeftBar.h / 2;
        RightBar.y = RightBar.y + this.dy;
        this.draw();
    }
}

// Right Bar Control
window.addEventListener("keydown", function(event) {
    if(event.defaultPrevented) {
        return;
    }

    switch(event.code){
        case "KeyS":
        case "ArrowDown":
            RightBar.dy = 10;
            break;
        case "KeyW":
        case "ArrowUp":
            RightBar.dy = -10;
            break;
    }

    event.preventDefault();
})
window.addEventListener("keyup", function(event) {
    if(event.defaultPrevented) {
        return;
    }

    switch(event.code){
        case "KeyS":
        case "ArrowDown":
            RightBar.dy = 0;
            break;
        case "KeyW":
        case "ArrowUp":
            dy = 0;
            RightBar.dy = 0;
            break;
    }

    event.preventDefault();
})

function Circle(x, y, dx, dy, radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.fill();
    }

    this.update = function(){
        // Left Bar Collision
        if(this.x - radius - LeftBar.w < LeftBar.x &&
         this.y > LeftBar.y - radius &&
         this.y < LeftBar.y + LeftBar.h + radius) {
            this.dx = -this.dx;
        }

        // Right Bar Collision
        if(this.x - radius + RightBar.w > RightBar.x &&
            this.y > RightBar.y - radius &&
            this.y < RightBar.y + RightBar.h + radius) {
               this.dx = -this.dx;
           }

        // Edge Collision
        if (this.x + this.radius > canvas.width) {
            pointsLeft++;
            console.log(pointsLeft);
            document.getElementById("left").innerHTML = pointsLeft;
            this.dx = -this.dx;
        }
        else if (this.x - this.radius < 0){
            pointsRight++;
            document.getElementById("right").innerHTML = pointsRight;
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height ||
            this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }

}

const RightBar = new Bar(canvas.width - 60, canvas.height / 2, 50, 200, 0);
const LeftBar = new Bar(10, canvas.height / 2, 50, 200, 0);
const Ball = new Circle(canvas.width/ 2, canvas.height / 2, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 15, 30);

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    LeftBar.update();
    RightBar.update();
    Ball.update();
}

animate();