let x = 1;
let y = 0;
const defaultPlayerY = 540;
let playerY = defaultPlayerY;
var particlesTimer = 0;

interface Particle {
    x: number;
    y: number;
    rnd: number;
}

let particles: Particle[] = [];

function setupParticles(canvas: HTMLCanvasElement) {
    for (let i = 0; i < 100; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, rnd: Math.random() });
    }
}

function handleParticles(ctx: CanvasRenderingContext2D) {
    for (const particle of particles) {
        ctx.beginPath();
        ctx.fillStyle= "rgba(255,255,255, " + particle.rnd / 10 + ")";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "white";
        ctx.arc(particle.x + Math.floor(particlesTimer / 3) + x, particle.y, 5 + Math.floor(particle.rnd * 5), 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    particlesTimer++;
}

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

interface GameObject {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

function areObjectColliding(obj1: GameObject, obj2: GameObject): boolean {
    if (obj2.x1 > obj1.x1 && obj2.x1 < obj1.x2) {

        if ((obj2.y1 > obj1.y1 && obj2.y1 < obj1.y2)) {
            return true;
        }

        if (obj2.y2 > obj1.y1 && obj2.y1 < obj1.y1) {
            return true;
        }
    }
    
    return false;
}

function setup() {
    let canvas = <HTMLCanvasElement>document.getElementById("game");

    canvas.height = 1080;
    canvas.width = 1920;
    setupParticles(canvas);

    var ctx = canvas.getContext("2d");
    let isFacingRight = true;
    let moveRight = false;
    let moveLeft = false;
    let space = false;
    let doubleJump = false;
    let debugMod = true;

    if (ctx === null) {
        return;
    }

    ctx.fillStyle ="#666";
    let runningCounter = 1;
    let jumpingCounter = 1;
    let standingCounter = 1;
    let death = false;
    let playerBox: GameObject = {y1:0, x1:0, x2:0, y2:0}
    
    

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


        ctx.drawImage(<CanvasImageSource>document.getElementById("bg-1"), 0, 0);

        ctx.drawImage(<CanvasImageSource>document.getElementById("roots-back"), x / 10, 0);
        ctx.drawImage(<CanvasImageSource>document.getElementById("roots-front"), x / 5, 0);

        ctx.drawImage(<CanvasImageSource>document.getElementById("above-back"), 0 + x, -100);
        ctx.drawImage(<CanvasImageSource>document.getElementById("above-front"), 0 + x + 2000, -100);
        ctx.drawImage(<CanvasImageSource>document.getElementById("ground"), 0 + x, 100 + y);
        
        const platX = 1000 + x;
        const platY = 250;
        const platformElm = <CanvasImageSource>document.getElementById("platform-1");
        const platformBox: GameObject = { x1: platX, y1: platY, x2: (platX + <number>platformElm.width), y2: (platY + <number>platformElm.height) };

        ctx.drawImage(platformElm, platX, platY);

        if (areObjectColliding(platformBox, playerBox)) {
            playerY = platY-150;
        } else {
            playerY = defaultPlayerY;
        }

        ctx.drawImage(<CanvasImageSource>document.getElementById("small-cube-1"), 500 + x, 450 );

        handleParticles(ctx);

       

        let xMove = 500;

        if (!isFacingRight) {
            ctx.scale(-1, 1);
            xMove *= -1;
            xMove -= 190;
        }
        
        if (space) {
            ctx.drawImage(<CanvasImageSource>document.getElementById("jumping" + jumpingCounter), xMove, playerY - getJumpingDelta() * 2);
        }

        else if (moveRight || moveLeft) {
            ctx.drawImage(<CanvasImageSource>document.getElementById("running" + runningCounter), xMove, playerY);
        }
       
        else if(!death){
            ctx.drawImage(<CanvasImageSource>document.getElementById("standing" + standingCounter), xMove, playerY);
        }

        else{//death           
                  
        }

        if (!isFacingRight) {
            ctx.scale(-1, 1);
        }

        //colider
        if(debugMod){
            ctx.fillStyle = "green";
            ctx.strokeRect(playerBox.x1,playerBox.y1,playerBox.x2 - playerBox.x1,playerBox.y2 - playerBox.y1)
        }

        
        //termite    
        termiteDraw(ctx,x,y)
    }

    window.addEventListener("keydown", (ev) => {
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
            x -= 20;
        }

        if (moveLeft) {
            x += 20;
        }

        //colider
        playerBox.x1 = 550
        playerBox.x2 = 655
        playerBox.y1 = playerY
        playerBox.y2 = playerY + 200

        if(space){
            playerBox.y1 = 300
            playerBox.y2 = 602
        }
        if(doubleJump){
            playerBox.y1 = 100
            playerBox.y2 = 402
        }


        // termite     
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
    //const playerX = 1190
    const frameCountToClimp = 500
    const numTermite = 400
    let counterClimber = 0
    const deathClimber = 100;
    const thresholdMusicClimber = 10;
    let isSoftMusicMode = true    

    abstract class Stage{
        protected context: Termite | undefined = undefined;       

        public setContext(context: Termite) {
            this.context = context;
        }

        public abstract draw(ctx: any,screenX:number,screenY:number): void 
        public abstract UpdatePos(screenX:number,screenY:number): void
    }

    class Termite{
        stage:Stage
        destroy:Boolean
        breakLoop:boolean
        
        constructor(stage:Stage){
            this.stage = stage
            this.stage.setContext(this)
            this.destroy = false
            this.breakLoop = false            
        }

        public setStage(stage:Stage | undefined):void{
            if(stage != undefined){
                this.stage = stage
                this.stage.setContext(this)
            }                
            else{

                this.destroy = true                
            }
                
        }

        public addClimberCounter(){  
            counterClimber++                     
        }

        public subClimberCounter(){
            counterClimber--
        }

        public getClimberCounter():any{
            return counterClimber
        }

        public setBreakLoop(breakLoop:boolean){
            this.breakLoop = breakLoop
        }

        public needDestroy():Boolean{        
            return this.destroy
        }

        public needBrealLoop():boolean{
            return this.breakLoop
        }

        public draw(ctx: any,screenX:number,screenY:number): void {
            this.stage.draw(ctx,screenX,screenY)
        }

        public UpdatePos(screenX:number,screenY:number): void{   
            this.breakLoop = false      
            this.stage.UpdatePos(screenX,screenY)
        }
    }

    class TermiteNormal extends Stage{
        x: any
        y: any
        frameCount:any
        constructor(x:any,y:any){   
            super()        
            this.x = x
            this.y = y  
            this.frameCount = 0          
        }

        public draw(ctx: any,screenX:number,screenY:number): void {
            ctx.drawImage(<CanvasImageSource>document.getElementById("termite") ,screenX+this.x, this.y)         
        }

        public UpdatePos(screenX:number,screenY:number): void{
            this.frameCount++
            
            if(screenX+this.x > playerBox.x2 || screenX+this.x < playerBox.x1 || this.y > playerBox.y2 || this.y < playerBox.y1){
                this.x -= randomIntFromInterval(speed-2,speed+2)
                this.y += randomIntFromInterval(-1,1)
            }            
            else{        
                console.log("Climber")    
                const spawnX = randomIntFromInterval(playerBox.x1,playerBox.x2)
                const spawny = randomIntFromInterval(playerBox.y1,playerBox.y2)
                
                const newStage = new TermiteClimber(spawnX,spawny)
      
                this.context?.setStage(newStage) 
                this.context?.setBreakLoop(true)  
                this.context?.addClimberCounter()
                
            }        

             if(this.frameCount > 2000) {
                this.context?.setStage(undefined) //destroy        
             }
            
        }
        
    }

    class TermiteClimber extends Stage{
        x: any
        y: any
        frameCount:any

        constructor(x:any,y:any){
            super()
            this.x = x
            this.y = y
            this.frameCount = frameCountToClimp            
        }

        public draw(ctx: any,screenX:number,screenY:number): void {
            ctx.drawImage(<CanvasImageSource>document.getElementById("termite") ,this.x, this.y)         
        }

        public UpdatePos(screenX:number,screenY:number): void{   
              
            this.x -= randomIntFromInterval(-2,2)
            this.y += randomIntFromInterval(-2,2)         
            
            this.frameCount++
            
            if(this.frameCount > 1000){               
                const spawnX = randomIntFromInterval(playerBox.x1 - 50,playerBox.x1 + 50)
                const spawnY = randomIntFromInterval(playerBox.y2 - 50,playerBox.y2)

                const newStage = new TermiteAfterClimber(spawnX,spawnY)

                this.context?.setStage(newStage) //destroy
                this.context?.subClimberCounter()
            }                                                
        }
    }

    class TermiteAfterClimber extends Stage{
        x: any
        y: any
        frameCount:any

        constructor(x:any,y:any){
            super()
            this.x = x
            this.y = y
            this.frameCount = 0
        }

        public draw(ctx: any,screenX:number,screenY:number): void {
            ctx.drawImage(<CanvasImageSource>document.getElementById("termite") ,this.x, this.y)         
        }

        public UpdatePos(screenX:number,screenY:number): void{
            this.frameCount++
            this.x -= randomIntFromInterval(-2,+2)
            this.y += randomIntFromInterval(speed-1,speed+1)
                
            if(this.frameCount > 1000)
                this.context?.setStage(undefined)//destroy            
        }
        
    }

    let termites:Termite[] = []   

    spawnLine(5000/2,1600/2,1400/2,numTermite)
    //spawnInCircle(5000/2,1600/2,100,numTermite)
    //spawnCircle(5000/2,1600/2,100,numTermite)
    //spawnRectangle(5000/2,1600/2,100,numTermite)

    function spawnLine(x:any,top:any,borrom:any,many:any){
        let count = 0
        let intervalID = setInterval(
            ()=>{
                
                const spawnX = x
                const spawny = randomIntFromInterval(top,borrom)
                termites.push(new Termite(new TermiteNormal( spawnX,spawny)))

                count++
                if(count>many)
                    clearInterval(intervalID)
        },15)
    }

    function spawnCircle(x:any,y:any,radius:any,many:any){
        
        for (var _i = 0; _i < many; _i++) {
            // tenk to stackoverflow
            var angle = Math.random()*Math.PI*2;
            const spawnX = x+Math.cos(angle)*radius;
            const spawny = y+Math.sin(angle)*radius;            
           
            termites.push(new Termite(new TermiteNormal( spawnX,spawny)))
        }
    }

    function spawnInCircle(x:any,y:any,radius:any,many:any){
        
        for (var _i = 0; _i < many; _i++) {
            //tenk to stackoverflow
            var angle = Math.random()*Math.PI*2;
            const newradius = randomIntFromInterval(0,radius)
            const spawnX = x+Math.cos(angle)*newradius;
            const spawny = y+Math.sin(angle)*newradius;            
           
            termites.push(new Termite(new TermiteNormal( spawnX,spawny)))
        }
    }

    function spawnRectangle(x:any,y:any,radius:any,many:any){
        
        for (var _i = 0; _i < many; _i++) {
            const spawnX = randomIntFromInterval(x-radius,x+radius)
            const spawny = randomIntFromInterval(y-radius,y+radius)

            termites.push(new Termite(new TermiteNormal( spawnX,spawny)))
        }
    }

        

    function termiteDraw(ctx: any,x:any,y:any) {
        
        //ctx.scale(0.5, 0.5);
        
        for (let i = 0; i < termites.length;i++) {
            termites[i].draw(ctx,x,y)
        }
    
    }

    function termiteUpdatePos(x: any,y:any) {            
        //satge 1
        for (let i = 0; i < termites.length;i++) {
                       
            termites[i].UpdatePos(x,y)

            if(termites[i].needDestroy()){
                termites.splice(i, 1);               
                break
            }

            if(termites[i].needBrealLoop()){
                break
            }              
            
            if(isSoftMusicMode && termites[i].getClimberCounter() > thresholdMusicClimber){
                isSoftMusicMode = false
                console.log("cange music")
            }  
            
            if(!isSoftMusicMode && termites[i].getClimberCounter() < thresholdMusicClimber){
                isSoftMusicMode = true
                console.log("cange music")
            }   
         
            if(termites[i].getClimberCounter() > deathClimber && !death)
                playerDeath()
        }
                       
    }

    function playerDeath(){   
        death = true;          
        console.log("death")
    }
}


setup();
