function setup() {
    let canvas = <HTMLCanvasElement>document.getElementById("game");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    var ctx = canvas.getContext("2d");
    let moveRight = false;
    let moveLeft = false;
    let space = false;

    if (ctx === null) {
        return;
    }

    ctx.fillStyle ="#666";
    let x = 1;
    let y = 0;
    let runningCounter = 1;
    let jumpingCounter = 1;
    let standingCounter = 1;

    setInterval(() => {
        runningCounter++;
        if (runningCounter > 8) {
            runningCounter = 1;
        }
    }, 132);

    setInterval(() => {
        jumpingCounter++;
        if (jumpingCounter > 10) {
            jumpingCounter = 1;
            space = false;
        }
    }, 64);

    setInterval(() => {
        standingCounter++;
        if (standingCounter > 4) {
            standingCounter = 1;
        }
    }, 120);

    function update() {
        if (ctx === null) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(0.5, 0.5);
        ctx.drawImage(<CanvasImageSource>document.getElementById("ground"), 0 + x, 200 + y, 4096, 1714);
        ctx.drawImage(<CanvasImageSource>document.getElementById("ground"), 0 + x + 4096, 200 + y, 4096, 1714);
        ctx.scale(2, 2);
        ctx.scale(0.1, 0.1);
        
        if (moveRight || moveLeft) {
            ctx.drawImage(<CanvasImageSource>document.getElementById("running" + runningCounter), 5000, 6000);
        } else {
            if (space) {
                ctx.drawImage(<CanvasImageSource>document.getElementById("jumping" + jumpingCounter), 5000, 6000 - (runningCounter * 100));
            } else {
                ctx.drawImage(<CanvasImageSource>document.getElementById("standing" + standingCounter), 5000, 6000);
            }
        }
        ctx.scale(10, 10);
    }

    window.addEventListener("keydown", (ev) => {
        moveRight = ev.code === "ArrowRight";
        moveLeft = ev.code === "ArrowLeft"
        space = ev.code === "Space";

        if (space) {
            jumpingCounter = 1;
        }
    });

    window.addEventListener("keyup", () => {
        moveRight = false;
        moveLeft = false;
    });

    function updatePos() {
        if (moveRight) {
            x += 150;
        }

        if (moveLeft) {
            x -= 150;
        }

        update();
        requestAnimationFrame(updatePos);
    }

    requestAnimationFrame(updatePos);
}

setup();
