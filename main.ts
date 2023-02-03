function curveValue(value: number, middle: number) {
    if (value > middle) {
        return middle - (value - middle);
    }

    return value;
}

function isWalkLeftEvent(e: KeyboardEvent) {
    return e.code === "ArrowLeft" || e.code === "KeyA";
}

function isWalkRightEvent(e: KeyboardEvent) {
    return e.code === "ArrowRight" || e.code === "KeyD";
}

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
        ctx.drawImage(<CanvasImageSource>document.getElementById("bg-1"), 0, 0, 11246, 1714);
        ctx.drawImage(<CanvasImageSource>document.getElementById("roots-back"), x / 10, 0, 11246, 1714);
        ctx.drawImage(<CanvasImageSource>document.getElementById("roots-front"), x / 10, 0, 11246, 1714);
        ctx.drawImage(<CanvasImageSource>document.getElementById("ground"), 0 + x, 200 + y, 11246, 1714);
        ctx.scale(0.5, 0.5);
        ctx.drawImage(<CanvasImageSource>document.getElementById("above-back"), 0 + x, 0, 11246, 1714);
        ctx.drawImage(<CanvasImageSource>document.getElementById("above-front"), 0 + x + 8000, 0, 11246, 1714);
        ctx.scale(2, 2);
       
        ctx.scale(2, 2);
        ctx.scale(0.1, 0.1);

        let xMove = 5000;

        if (!isFacingRight) {
            ctx.scale(-1, 1);
            xMove *= -1;
            xMove -= 1500;
        }
        
        if (space) {
            ctx.drawImage(<CanvasImageSource>document.getElementById("jumping" + jumpingCounter), xMove, 6000 - (curveValue(jumpingCounter, 5) * 300));
        }
        else if (moveRight || moveLeft) {

            ctx.drawImage(<CanvasImageSource>document.getElementById("running" + runningCounter), xMove, 6000);

        }
       
        else if(!death){
            ctx.drawImage(<CanvasImageSource>document.getElementById("standing" + standingCounter), xMove, 6000);
        }

        else{//death           
                  
        }

        if (!isFacingRight) {
            ctx.scale(-1, 1);
        }

        ctx.scale(10, 10);
        

        //termite    
        termiteDraw(ctx,x,y)
    }

    window.addEventListener("keydown", (ev) => {
        space = ev.code === "Space" || ev.code === "ArrowUp" || ev.code === "KeyW";

        if (!space) {
            moveRight = isWalkRightEvent(ev);
            moveLeft = isWalkLeftEvent(ev);

            if (moveRight || moveLeft) {
                isFacingRight = moveRight;
            }
        }

        if (space) {
            jumpingCounter = 1;
        }
    });

    window.addEventListener("keyup", (ev) => {
        if (isWalkRightEvent(ev)) {
            moveRight = false;
        }

        if (isWalkLeftEvent(ev)) {
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
    const frameCountToClimp = 500
    let numTermite = 400

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
                return true //nextStage
            }

            return false        
            
        }
        
    }

    class TermiteClimber{
        x: any
        y: any
        frameCount:any

        constructor(x:any,y:any){
            this.x = x
            this.y = y
            this.frameCount = frameCountToClimp
        }

        public draw(ctx: any,screenX:number,screenY:number): void {
            ctx.drawImage(<CanvasImageSource>document.getElementById("termite") ,screenX+this.x, this.y)         
        }

        public UpdatePos(screenX:number,screenY:number): boolean{   
              
            this.x -= randomIntFromInterval(-2,2)
            this.y += randomIntFromInterval(-2,2)         
            
            this.frameCount++
            
            if(this.frameCount > 1000)
                return true //nextStage

            return false //nextStage
        }
        
    }


    class TermiteAfterClimber{
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
           
            this.x -= randomIntFromInterval(speed-2,speed+2)
            this.y += randomIntFromInterval(-1,1)
                
            return false
        }
        
    }

    let termites:Termite[] = []
    let termitesClimbers:TermiteClimber[] = []
    let termitesAfterClimbers:TermiteAfterClimber[] = []

    //up 1500 down 1700
    spawn(5000,1600,100,numTermite)

    function spawn(x:any,y:any,radius:any,many:any){
        
        for (var _i = 0; _i < many; _i++) {
            const spawnX = randomIntFromInterval(x-radius,x+radius)
            const spawny = randomIntFromInterval(y-radius,y+radius)
            termites.push(new Termite(spawnX,spawny))
        }
    }

    function spawnclimber(x:any,y:any,horizontalRange:any,verticalRange:any){
        
        
        const spawnX = randomIntFromInterval(x-horizontalRange,x+horizontalRange)
        const spawny = randomIntFromInterval(y-verticalRange,y+verticalRange)
        termitesClimbers.push(new TermiteClimber(spawnX,spawny))
        
    }

    function spawnAfterClimber(x:any,y:any,radius:any){
        
        const spawnX = randomIntFromInterval(x-radius,x+radius)
        const spawny = randomIntFromInterval(y-radius,y+radius)
        termitesAfterClimbers.push(new TermiteAfterClimber(spawnX,spawny))
        
    }
        

    function termiteDraw(ctx: any,x:any,y:any) {
        
        ctx.scale(0.5, 0.5);
        
        for (let i in termites) {
            termites[i].draw(ctx,x,y)
        }

        for (let i in termitesClimbers) {
            termitesClimbers[i].draw(ctx,x,y)
        }
        
        for (let i in termitesAfterClimbers) {
            termitesAfterClimbers[i].draw(ctx,x,y)
        }

        ctx.scale(2, 2);
    }

    function termiteUpdatePos(x: any,y:any) {        
        for (let i in termites) {
            const nextStage = termites[i].UpdatePos(x,y)
            if(nextStage){                
                delete termites[i]    
                numTermite--                           
            
                if(numTermite == 0){
                    playerDeath()
                }                    

                spawnclimber(1200,1400,60,200)
                break
            }
        }
               
        for (let i in termitesClimbers) {
           
            const nextStage = termitesClimbers[i].UpdatePos(x,y)
            if(nextStage){       
                delete termitesClimbers[i] 

                spawnAfterClimber(1200,1600,100)
            }
        }

        for (let i in termitesAfterClimbers) {
            termitesAfterClimbers[i].UpdatePos(x,y)
        }
    }

    function playerDeath(){   
        death = true;          
        console.log("death")
    }
}


setup();
