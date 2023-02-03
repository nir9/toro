function setup() {
    let canvas = <HTMLCanvasElement>document.getElementById("game");
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

    window.addEventListener("resize", () => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    });


    var ctx = canvas.getContext("2d");
    let isFacingRight = true;
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
    let death = false;
    
    

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
    }, 200);

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

        let xMove = 5000;

        if (!isFacingRight) {
            ctx.scale(-1, 1);
            xMove *= -1;
            xMove -= 1500;
        }
        
        if (space) {
            ctx.drawImage(<CanvasImageSource>document.getElementById("jumping" + jumpingCounter), xMove, 6000 - (jumpingCounter * 300));
        }
        else if (moveRight || moveLeft) {

            ctx.drawImage(<CanvasImageSource>document.getElementById("running" + runningCounter), xMove, 6000);

        }
       
        else if(!death){
            ctx.drawImage(<CanvasImageSource>document.getElementById("standing" + standingCounter), xMove, 6000);
        }

        else{//death           
            ctx.drawImage(<CanvasImageSource>document.getElementById("death"), xMove, 6000);            
        }

        if (!isFacingRight) {
            ctx.scale(-1, 1);
        }

        ctx.scale(10, 10);
        

        //termite    
        termiteDraw(ctx,x,y)
       
        
        //ctx.restore();
    }

    window.addEventListener("keydown", (ev) => {
        space = ev.code === "Space" || ev.code === "ArrowUp" || ev.code === "KeyW";

        if (!space) {
            moveRight = ev.code === "ArrowRight" || ev.code === "KeyD";
            moveLeft = ev.code === "ArrowLeft" || ev.code === "KeyA";

            if (moveRight || moveLeft) {
                isFacingRight = moveRight;
            }
        }

        if (space) {
            jumpingCounter = 1;
        }
    });

    window.addEventListener("keyup", (ev) => {
        if (ev.code === "ArrowRight") {
            moveRight = false;
        }

        if (ev.code === "ArrowLeft") {
            moveLeft = false;
        }
    });

    function updatePos() {
        
        if (moveRight) {
            x -= 40;
        }

        if (moveLeft) {
            x += 40;
        }

        //termite        
        termiteUpdatePos(x,y)

        update();
        requestAnimationFrame(updatePos);
    }

    requestAnimationFrame(updatePos);
    
    

    function randomIntFromInterval(min:any, max:any) { // min and max included 
    
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    /////////// termits
    const speed = 8
    const playerX = 1190

    class Termite{
        x: any
        y: any

        constructor(x:any,y:any){
            this.x = x
            this.y = y
        }

        public draw(ctx: any,screenX:number,screenY:number): void {
            ctx.drawImage(<CanvasImageSource>document.getElementById("termite") ,screenX+this.x, this.y)         
        }

        public UpdatePos(screenX:number,screenY:number): boolean{
            if(this.x > playerX){
                this.x -= randomIntFromInterval(speed-2,speed+2)
                this.y += randomIntFromInterval(-1,1)
            }            
            else{
                return true //death            
            }

            return false        
            
        }
        
    }

    let termites:Termite[] = []

    //up 1500 down 1700
    spawn(5000,1600,100,10)

    function spawn(x:any,y:any,radius:any,many:any){
        
        for (var _i = 0; _i < many; _i++) {
            const spawnX = randomIntFromInterval(x-radius,x+radius)
            const spawny = randomIntFromInterval(y-radius,y+radius)
            termites.push(new Termite(spawnX,spawny))
        }
    }
        

    function termiteDraw(ctx: any,x:any,y:any) {
        
        ctx.scale(0.5, 0.5);
        
        for (let i in termites) {
            termites[i].draw(ctx,x,y)
        }
        

        ctx.scale(2, 2);
    }

    function termiteUpdatePos(x: any,y:any) {
        
        for (let i in termites) {
            const death = termites[i].UpdatePos(x,y)
            if(death){
                playerDeath()
                delete termites[i]
                break
            }
        }    
    }

    function playerDeath(){   
        death = true;
        termites = [] ;    
        console.log("death")
    }
}


setup();
