function setup() {
    let canvas = <HTMLCanvasElement>document.getElementById("game");
    canvas.height = window.innerHeight - 100;
    canvas.width = window.innerWidth - 100;

    var ctx = canvas.getContext("2d");
    let moveRight = false;
    let moveLeft = false;
    let moveUp = false;
    let moveDown = false;
    let space = false;

    if (ctx === null) {
        return;
    }

    ctx.fillStyle ="#FF00FF";
    let x = 1;
    let y = 1;
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
        // ctx.fillRect(50 + x, 50, 100, 100);
        ctx.drawImage(<CanvasImageSource>document.getElementById("bg"), 0, 0, 1920, 1080);
        ctx.scale(0.25, 0.25);
        if (moveRight || moveLeft || moveUp || moveDown) {

            ctx.drawImage(<CanvasImageSource>document.getElementById("running" + runningCounter), 100 + x, 100 + y);
        } else {
            if (space) {
                ctx.drawImage(<CanvasImageSource>document.getElementById("jumping" + jumpingCounter), 100 + x, 100 + y - (runningCounter * 100));
            } else {

                ctx.drawImage(<CanvasImageSource>document.getElementById("standing" + standingCounter), 100 + x, 100 + y);
            }
        }
        ctx.scale(4, 4);
    }

    window.addEventListener("keydown", (ev) => {
        moveRight = ev.code === "ArrowRight";
        moveLeft = ev.code === "ArrowLeft"
        moveUp = ev.code === "ArrowUp"
        moveDown = ev.code === "ArrowDown"
        space = ev.code === "Space";

        if (space) {
            jumpingCounter = 1;
        }
    });

    window.addEventListener("keyup", () => {
        moveRight = false;
        moveLeft = false;
        moveUp = false;
        moveDown = false;
    });

    function updatePos() {
        if (moveRight) {
            x += 30;
        }
        if (moveLeft) {
            x -= 30;
        }
        if (moveUp) {
            y -= 30;
        }
        if (moveDown) {
            y += 30;
        }

        update();
        requestAnimationFrame(updatePos);
    }

    requestAnimationFrame(updatePos);

    ctx.fillRect(50, 50, 100, 100);

}

setup();
