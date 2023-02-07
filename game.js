"use strict";
let x = 1;
let ending = false;
let y = 0;
let antsSpeed = 0;
let space = false;
let firstTime = true;
const defaultPlayerY = 640;
let playerY = defaultPlayerY;
var particlesTimer = 0;
var drawDoor = true;
let playerBox = { y1: 0, x1: 0, x2: 0, y2: 0 };
let xMove = 900;
let walkingSound = false;
var walkingAudio = new Audio("assets/music/walking.ogg");
var soundtrackAudio = new Audio("assets/music/toro_menu.mp3");
var attackingAudio = new Audio("assets/music/Attack.ogg");
let collisionOccurring = false;
function getFirstBranchX() {
    return x + 2200 + 50;
}
function getSecondBranchX() {
    return x + 400 + 1850 + 700 + 1000;
}
let firstBranchRemainingLife = 3;
let secondBranchRemainingLife = 3;
let particles = [];
function drawBlock(ctx, x, y, width, height = 500) {
    ctx.fillStyle = "#14171d";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#666";
}
function setupParticles(canvas) {
    for (let i = 0; i < 100; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, rnd: Math.random() });
    }
}
function handleParticles(ctx) {
    for (const particle of particles) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255, " + particle.rnd / 10 + ")";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "white";
        ctx.arc(particle.x + Math.floor(particlesTimer / 3) + x, particle.y, 5 + Math.floor(particle.rnd * 5), 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    particlesTimer++;
}
function drawPlatform(ctx, platform) {
    platform.x1 += x;
    platform.x2 += x;
    platform.y1 += y;
    platform.y2 += y;
    ctx.drawImage(platform.elm, platform.x1, platform.y1);
    /*
     * The reason I added the collisionOccurring flag is that the collision is for each object and playerY is global, so if part of the collisions fail and part succeed
     * playerY will not be reliable if the flag would not be tracked
     */
    if (areObjectsColliding(ctx, platform, playerBox)) {
        playerY = platform.y1 - 150;
        collisionOccurring = true;
    }
    else {
        if (!collisionOccurring) {
            playerY = defaultPlayerY;
        }
    }
    platform.x1 -= x;
    platform.x2 -= x;
    platform.y1 -= y;
    platform.y2 -= y;
}
function curveValue(value, middle) {
    if (value > middle) {
        return middle - (value - middle);
    }
    return value;
}
function isFlyDownEvent(e) {
    return e.code === "ArrowDown" || e.code === "KeyS";
}
function isWalkLeftEvent(e) {
    return e.code === "ArrowLeft" || e.code === "KeyA";
}
function isWalkRightEvent(e) {
    return e.code === "ArrowRight" || e.code === "KeyD";
}
function strokeStuff(ctx, obj1, obj2, ok) {
    const saved = ctx.strokeStyle;
    ctx.strokeStyle = ok ? "green" : "red";
    ctx.strokeRect(obj1.x1, obj1.y1, obj1.x2 - obj1.x1, obj1.y2 - obj1.y1);
    ctx.strokeRect(obj2.x1, obj2.y1, obj2.x2 - obj2.x1, obj2.y2 - obj2.y1);
    ctx.strokeStyle = saved;
}
function areObjectsColliding(ctx, obj1, obj2) {
    if (obj2.x1 >= obj1.x1 && obj2.x1 <= obj1.x2) {
        if ((obj2.y1 >= obj1.y1 && obj2.y1 <= obj1.y2)) {
            strokeStuff(ctx, obj1, obj2, true);
            return true;
        }
        if (obj2.y2 >= obj1.y1 && obj2.y1 <= obj1.y1) {
            strokeStuff(ctx, obj1, obj2, true);
            return true;
        }
    }
    if (obj1.x1 >= obj2.x1 && obj1.x1 <= obj2.x2) {
        if ((obj1.y1 >= obj2.y1 && obj1.y1 <= obj2.y2)) {
            strokeStuff(ctx, obj1, obj2, true);
            return true;
        }
        if (obj1.y2 >= obj2.y1 && obj1.y1 <= obj2.y1) {
            strokeStuff(ctx, obj1, obj2, true);
            return true;
        }
    }
    strokeStuff(ctx, obj1, obj2, false);
    return false;
}
function setupPlatforms() {
    const platX = 50;
    const platY = 1700;
    const platElm = document.getElementById("platform-1");
    const plat1 = { x1: platX, y1: platY, x2: (platX + platElm.width), y2: (platY + platElm.height), elm: platElm };
    const plat2X = -50;
    const plat2Y = 2000;
    const plat2 = { x1: plat2X, y1: plat2Y, x2: (plat2X + platElm.width), y2: (plat2Y + platElm.height), elm: platElm };
    const plat3X = 600;
    const plat3Y = 2500;
    const plat3 = { x1: plat3X, y1: plat3Y, x2: (plat3X + platElm.width), y2: (plat3Y + platElm.height), elm: platElm };
    const plat4X = 2200 + x + 400 + 1850 + 700 + 2500;
    const plat4Y = 2400 + y;
    const plat4Elm = document.getElementById("long-cube-1");
    const plat4 = { x1: plat4X, y1: plat4Y, x2: (plat4X + plat4Elm.width), y2: (plat4Y + plat4Elm.height), elm: plat4Elm };
    const plat5X = 2200 + x + 400 + 1850 + 700 + 2500 + 300;
    const plat5Y = 2400 + y;
    const plat5Elm = plat4Elm;
    const plat5 = { x1: plat5X, y1: plat5Y, x2: (plat5X + plat5Elm.width), y2: (plat5Y + plat5Elm.height), elm: plat5Elm };
    const plat6X = 2200 + x + 400 + 1850 + 700 + 2500 + 600;
    const plat6Y = 2400 + y;
    const plat6Elm = plat4Elm;
    const plat6 = { x1: plat6X, y1: plat6Y, x2: (plat6X + plat6Elm.width), y2: (plat6Y + plat6Elm.height), elm: plat6Elm };
    return [plat1, plat2, plat3, plat4, plat5, plat6];
}
function setup() {
    let canvas = document.getElementById("game");
    canvas.height = 1080;
    canvas.width = 1920;
    setupParticles(canvas);
    var ctx = canvas.getContext("2d");
    let isFacingRight = true;
    let moveRight = false;
    let moveLeft = false;
    let flyDown = false;
    let flyUp = false;
    let attack = false;
    let doubleJump = false;
    let debugMod = false;
    if (ctx === null) {
        return;
    }
    let platforms = setupPlatforms();
    ctx.fillStyle = "#666";
    let runningCounter = 1;
    let attackCounter = 1;
    let jumpingCounter = 1;
    let standingCounter = 1;
    let endingCounter = 1;
    let death = false;
    setInterval(() => {
        runningCounter++;
        if (runningCounter > 8) {
            runningCounter = 1;
        }
    }, 132);
    setInterval(() => {
        endingCounter++;
        if (endingCounter > 10) {
            endingCounter = 1;
        }
    }, 132);
    setInterval(() => {
        attackCounter++;
        if (attackCounter > 8) {
            attackCounter = 1;
            attack = false;
        }
    }, 60);
    setInterval(() => {
        jumpingCounter++;
        if (jumpingCounter > 10) {
            jumpingCounter = 1;
            space = false;
            if (doubleJump) {
                doubleJump = false;
                // TODO: Consider thinking of a solution for transition back to ground
                space = false;
            }
        }
    }, 60);
    setInterval(() => {
        standingCounter++;
        if (standingCounter > 4) {
            standingCounter = 1;
        }
    }, 200);
    function getJumpingDelta() {
        if (!space) {
            return 0;
        }
        return (curveValue(jumpingCounter, doubleJump ? 10 : 5) * 20);
    }
    function update() {
        if (ctx === null) {
            return;
        }
        ctx.fillStyle = "gray";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!ending) {
            ctx.drawImage(document.getElementById("bg-1"), 0, 0);
        }
        else {
            ctx.drawImage(document.getElementById("bgending"), 0, 0);
        }
        ctx.drawImage(document.getElementById("roots-back"), x / 10, y + 1000);
        ctx.drawImage(document.getElementById("roots-front"), x / 5, y + 1000);
        // ctx.drawImage(<CanvasImageSource>document.getElementById("above-back"), 0 + x, -100);
        // ctx.drawImage(<CanvasImageSource>document.getElementById("above-front"), 0 + x + 2000, -100);
        // TODO: a little bit of a roof
        if (firstBranchRemainingLife > 0) {
            const animationDelta = firstBranchRemainingLife !== 3 ? Math.random() * 10 : 0;
            ctx.drawImage(document.getElementById("branch-1"), getFirstBranchX(), 200 + y + animationDelta);
        }
        ctx.drawImage(document.getElementById("little-tel"), 0 + x + 1200, 1000 + y);
        // Slope to the 3rd floor
        ctx.drawImage(document.getElementById("sw-curve-1"), x - 600, 100 + y + 950 + 200);
        ctx.drawImage(document.getElementById("ne-curve-1"), x - 300, y);
        ctx.drawImage(document.getElementById("we-s-curve-1"), x + 2300, y);
        ctx.drawImage(document.getElementById("flipped-cube"), x + 3050, y + 850);
        // todo: fine tun
        drawBlock(ctx, x - 100, 500 + y + 300, 500);
        drawBlock(ctx, x - 100, 500 + y + 400, 2700, 270);
        // block in the end of the level
        drawBlock(ctx, x + 3240, y, 2700, 1500);
        ctx.drawImage(document.getElementById("ground"), 0 + x + 200 + 100, 580 + y);
        ctx.drawImage(document.getElementById("edge-1"), 0 + x + 200 + 100 + 2200, 827 + y);
        ctx.drawImage(document.getElementById("west-curve-1"), 0 + x + 200 + 100 + 200, 1570 + y);
        ctx.drawImage(document.getElementById("roof-1"), 0 + x + 1200, 1350 + 500 + 100 + y);
        ctx.drawImage(document.getElementById("hill-1"), 0 + x + 1200, 1850 + 600 + y);
        ctx.drawImage(document.getElementById("valley-1"), 0 + x + 400 + 1850, 2390 + y);
        ctx.drawImage(document.getElementById("ground"), 0 + x + 400 + 1850 + 700, 2265 + y);
        ctx.drawImage(document.getElementById("ground"), 0 + x + 400 + 1850 + 700 + 2200, 2265 + y);
        if (secondBranchRemainingLife > 0) {
            const animationDelta = secondBranchRemainingLife !== 3 ? Math.random() * 10 : 0;
            ctx.drawImage(document.getElementById("branch-1"), getSecondBranchX(), 2000 + y + animationDelta);
        }
        ctx.drawImage(document.getElementById("hill-1"), 2200 + x + 400 + 1850 + 700 + 2500 + 600 + 300, 2300 + y);
        ctx.drawImage(document.getElementById("big-cube-1"), 2200 + x + 300 + 1850 + 700 + 2500 + 600 + 300 + 870, 1870 + y);
        collisionOccurring = false;
        for (let i = 0; i < platforms.length; i++) {
            drawPlatform(ctx, platforms[i]);
        }
        handleParticles(ctx);
        if (!isFacingRight) {
            ctx.scale(-1, 1);
            xMove *= -1;
            xMove -= 190;
        }
        if (space) {
            ctx.drawImage(document.getElementById("jumping" + jumpingCounter), xMove, playerY - getJumpingDelta() * 2);
        }
        else if (ending) {
            ctx.drawImage(document.getElementById("endtoro" + endingCounter), xMove, playerY);
        }
        else if (attack) {
            ctx.drawImage(document.getElementById("attack" + attackCounter), xMove, playerY);
        }
        else if (moveRight || moveLeft) {
            ctx.drawImage(document.getElementById("running" + runningCounter), xMove, playerY);
        }
        else if (!death) {
            ctx.drawImage(document.getElementById("standing" + standingCounter), xMove, playerY);
        }
        if (!isFacingRight) {
            ctx.scale(-1, 1);
            xMove *= -1;
            xMove -= 190;
        }
        if (debugMod) {
            ctx.fillStyle = "green";
            ctx.strokeRect(playerBox.x1, playerBox.y1, playerBox.x2 - playerBox.x1, playerBox.y2 - playerBox.y1);
        }
        termiteDraw(ctx, x, y);
    }
    window.addEventListener("keydown", (ev) => {
        if (firstTime) {
            soundtrackAudio.loop = true;
            soundtrackAudio.play();
            firstTime = false;
        }
        let wasSpace = false;
        if (space) {
            wasSpace = true;
        }
        space = ev.code === "Space" || ev.code === "ArrowUp" || ev.code === "KeyW";
        if (wasSpace && space) {
            doubleJump = true;
        }
        if (!space) {
            moveRight = isWalkRightEvent(ev);
            moveLeft = isWalkLeftEvent(ev);
            flyDown = isFlyDownEvent(ev);
            attack = ev.code === "KeyF";
            if (moveRight || moveLeft) {
                isFacingRight = moveRight;
                walkingSound = true;
                walkingAudio.loop = false;
                walkingAudio.currentTime = 0;
                walkingAudio.play();
            }
        }
        if (space) {
            jumpingCounter = 1;
        }
        if (attack) {
            attackingAudio.loop = false;
            attackingAudio.currentTime = 0;
            attackingAudio.play();
            attackCounter = 1;
            if (getFirstBranchX() - xMove > 20 && getFirstBranchX() - xMove < 200) {
                firstBranchRemainingLife--;
            }
            if (getSecondBranchX() - xMove > 20 && getSecondBranchX() - xMove < 200) {
                secondBranchRemainingLife--;
            }
        }
    });
    window.addEventListener("keyup", (ev) => {
        if (isWalkRightEvent(ev)) {
            moveRight = false;
            walkingSound = false;
            walkingAudio.pause();
        }
        if (isWalkLeftEvent(ev)) {
            moveLeft = false;
            walkingSound = false;
            walkingAudio.pause();
        }
        if (isFlyDownEvent(ev)) {
            flyDown = false;
        }
    });
    function updatePos() {
        if (moveRight) {
            if (x < -1200 && firstBranchRemainingLife > 0) {
            }
            else if (x < -2850 && secondBranchRemainingLife > 0) {
            }
            else if (x < -(6300 + 2200)) {
            }
            else {
                //if (x > -2200 && y > -800) {
                x -= 20;
                //}
            }
        }
        if (moveLeft) {
            if ((x > 400 && y > -800) || x > 1000) {
            }
            else {
                x += 20;
            }
        }
        flyDown = false;
        flyUp = false;
        if (x < -1550 && y > -550) {
            flyDown = true;
        }
        if (x > -1400 && y < -550 && y > -750) {
            flyDown = true;
        }
        if (x > 100 && y < -759 && y > -1850) {
            flyDown = true;
        }
        if (x < -550 && y > -1900 && y < -1700) {
            flyUp = true;
        }
        if (y < -1500) {
            antsSpeed = -2;
        }
        if (x < -7850 && x > -8050) {
            flyUp = true;
        }
        if (flyDown) {
            y -= 20;
        }
        if (flyUp) {
            y += 20;
        }
        playerBox.x1 = xMove + 50;
        playerBox.x2 = xMove + 150;
        playerBox.y1 = playerY - getJumpingDelta() * 2;
        playerBox.y2 = playerBox.y1 + 200;
        termiteUpdatePos(x, y);
        update();
        requestAnimationFrame(updatePos);
    }
    requestAnimationFrame(updatePos);
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const frameCountToClimp = 500;
    const numTermite = 400;
    let counterClimber = 0;
    const deathClimber = 100;
    const thresholdMusicClimber = 10;
    let isSoftMusicMode = true;
    class Stage {
        constructor() {
            this.context = undefined;
        }
        setContext(context) {
            this.context = context;
        }
    }
    class Termite {
        constructor(stage) {
            this.stage = stage;
            this.stage.setContext(this);
            this.destroy = false;
            this.breakLoop = false;
        }
        setStage(stage) {
            if (stage != undefined) {
                this.stage = stage;
                this.stage.setContext(this);
            }
            else {
                this.destroy = true;
            }
        }
        addClimberCounter() {
            counterClimber++;
        }
        subClimberCounter() {
            counterClimber--;
        }
        getClimberCounter() {
            return counterClimber;
        }
        setBreakLoop(breakLoop) {
            this.breakLoop = breakLoop;
        }
        needDestroy() {
            return this.destroy;
        }
        needBrealLoop() {
            return this.breakLoop;
        }
        draw(ctx, screenX, screenY) {
            this.stage.draw(ctx, screenX, screenY);
        }
        UpdatePos(screenX, screenY) {
            this.breakLoop = false;
            this.stage.UpdatePos(screenX, screenY);
        }
    }
    class TermiteNormal extends Stage {
        constructor(x, y) {
            super();
            this.x = x;
            this.y = y;
            this.frameCount = 0;
        }
        frameImg() {
            return 10;
        }
        draw(ctx, screenX, screenY) {
            ctx.drawImage(document.getElementById("termit-" + this.frameImg()), screenX + this.x, this.y);
        }
        UpdatePos(screenX, screenY) {
            var _a, _b, _c, _d;
            this.frameCount++;
            if (screenX + this.x > playerBox.x2 || screenX + this.x < playerBox.x1 || this.y > playerBox.y2 || this.y < playerBox.y1) {
                this.x -= randomIntFromInterval(antsSpeed - 2, antsSpeed + 2);
                this.y += randomIntFromInterval(-1, 1);
            }
            else {
                console.log("Climber");
                const spawnX = randomIntFromInterval(playerBox.x1, playerBox.x2);
                const spawny = randomIntFromInterval(playerBox.y1, playerBox.y2);
                const newStage = new TermiteClimber(spawnX, spawny);
                (_a = this.context) === null || _a === void 0 ? void 0 : _a.setStage(newStage);
                (_b = this.context) === null || _b === void 0 ? void 0 : _b.setBreakLoop(true);
                (_c = this.context) === null || _c === void 0 ? void 0 : _c.addClimberCounter();
            }
            if (this.frameCount > 2000) {
                (_d = this.context) === null || _d === void 0 ? void 0 : _d.setStage(undefined);
            }
        }
    }
    class TermiteClimber extends Stage {
        constructor(x, y) {
            super();
            this.x = x;
            this.y = y;
            this.frameCount = frameCountToClimp;
        }
        draw(ctx, screenX, screenY) {
            ctx.drawImage(document.getElementById("termit-10"), this.x, this.y);
        }
        UpdatePos(screenX, screenY) {
            var _a, _b;
            this.x -= randomIntFromInterval(-2, 2);
            this.y += randomIntFromInterval(-2, 2);
            this.frameCount++;
            if (this.frameCount > 1000) {
                const spawnX = randomIntFromInterval(playerBox.x1 - 50, playerBox.x1 + 50);
                const spawnY = randomIntFromInterval(playerBox.y2 - 50, playerBox.y2);
                const newStage = new TermiteAfterClimber(spawnX, spawnY);
                (_a = this.context) === null || _a === void 0 ? void 0 : _a.setStage(newStage); //destroy
                (_b = this.context) === null || _b === void 0 ? void 0 : _b.subClimberCounter();
            }
        }
    }
    class TermiteAfterClimber extends Stage {
        constructor(x, y) {
            super();
            this.x = x;
            this.y = y;
            this.frameCount = 0;
        }
        draw(ctx, screenX, screenY) {
            ctx.drawImage(document.getElementById("termit-10"), this.x, this.y);
        }
        UpdatePos(screenX, screenY) {
            var _a;
            this.frameCount++;
            this.x -= randomIntFromInterval(-2, +2);
            this.y += randomIntFromInterval(antsSpeed - 1, antsSpeed + 1);
            if (this.frameCount > 1000)
                (_a = this.context) === null || _a === void 0 ? void 0 : _a.setStage(undefined); //destroy            
        }
    }
    let termites = [];
    spawnLine(5000 / 2, 1600 / 2, 1400 / 2, numTermite);
    function spawnLine(x, top, borrom, many) {
        let count = 0;
        let intervalID = setInterval(() => {
            const spawnX = x;
            const spawny = randomIntFromInterval(top, borrom);
            termites.push(new Termite(new TermiteNormal(spawnX, spawny)));
            count++;
            if (count > many)
                clearInterval(intervalID);
        }, 15);
    }
    function termiteDraw(ctx, x, y) {
        for (let i = 0; i < termites.length; i++) {
            termites[i].draw(ctx, x, y);
        }
    }
    function termiteUpdatePos(x, y) {
        for (let i = 0; i < termites.length; i++) {
            termites[i].UpdatePos(x, y);
            if (termites[i].needDestroy()) {
                termites.splice(i, 1);
                break;
            }
            if (termites[i].needBrealLoop()) {
                break;
            }
            if (isSoftMusicMode && termites[i].getClimberCounter() > thresholdMusicClimber) {
                isSoftMusicMode = false;
                console.log("cange music");
            }
            if (!isSoftMusicMode && termites[i].getClimberCounter() < thresholdMusicClimber) {
                isSoftMusicMode = true;
                console.log("cange music");
            }
            if (termites[i].getClimberCounter() > deathClimber && !death) {
                playerDeath();
            }
        }
    }
    function playerDeath() {
        death = true;
        document.getElementById("game-over").style.display = "block";
    }
}
setup();
