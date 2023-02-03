let x = 1;
let y = 0;
var particlesTimer = 0;

interface Particle {
    x: number;
    y: number;
    rnd: number;
}

let particles: Particle[] = [];

function setupParticles(canvas: HTMLCanvasElement) {
    for (let i = 0; i < 15; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, rnd: Math.random() });
    }
}

function handleParticles(ctx: CanvasRenderingContext2D) {
    for (const particle of particles) {
        ctx.beginPath();
        ctx.fillStyle= "rgba(255,255,255, 0.2)";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "white";
        ctx.arc(particle.x + Math.floor(particlesTimer / 3) + x, particle.y + Math.floor(particle.rnd * 600), 5 + Math.floor(particle.rnd * 5), 0, 2 * Math.PI);
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

function setup() {
    let canvas = <HTMLCanvasElement>document.getElementById("game");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    setupParticles(canvas);

    window.addEventListener("resize", () => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        if (ctx === null) return;
        ctx.fillStyle ="#666";
        
        setupParticles(canvas);

    });


    var ctx = canvas.getContext("2d");
    let isFacingRight = true;
    let moveRight = false;
    let moveLeft = false;
    let space = false;
    let debugMod = true;

    if (ctx === null) {
        return;
    }

    ctx.fillStyle ="#666";
    let runningCounter = 1;
    let jumpingCounter = 1;
    let standingCounter = 1;
    let death = false;
    let playerBox = {top:0, left:0, right:0, bottom:0}
    
    

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

        return (curveValue(jumpingCounter, 5) * 20);
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
        
        ctx.drawImage(<CanvasImageSource>document.getElementById("platform-1"), 1000 + x, 450 );
        ctx.drawImage(<CanvasImageSource>document.getElementById("small-cube-1"), 500 + x, 450 );
        handleParticles(ctx);

       
        ctx.scale(0.1, 0.1);

        let xMove = 5000;

        if (!isFacingRight) {
            ctx.scale(-1, 1);
            xMove *= -1;
            xMove -= 1900;
        }
        
        if (space) {
            ctx.drawImage(<CanvasImageSource>document.getElementById("jumping" + jumpingCounter), xMove, 5400 - getJumpingDelta() * 20);
        }

        else if (moveRight || moveLeft) {
            ctx.drawImage(<CanvasImageSource>document.getElementById("running" + runningCounter), xMove, 5400);
        }
       
        else if(!death){
            ctx.drawImage(<CanvasImageSource>document.getElementById("standing" + standingCounter), xMove, 5400);
        }

        else{//death           
                  
        }

        if (!isFacingRight) {
            ctx.scale(-1, 1);
        }

        ctx.scale(10, 10);

        
        //colider
        if(debugMod){
            ctx.fillStyle = "green";
            ctx.strokeRect(playerBox.left,playerBox.top,playerBox.right - playerBox.left,playerBox.bottom - playerBox.top)
        }

        
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
            x -= 20;
        }

        if (moveLeft) {
            x += 20;
        }

        //colider
        playerBox.left = 5500/10
        playerBox.right = 6550/10
        playerBox.top = 5400/10
        playerBox.bottom = 8020/10

        if(space){
            playerBox.top = 3000/10
            playerBox.bottom = 6020/10
        }


        //termite     
        //console.log(x)     
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
            
            if(screenX+this.x > playerBox.right || screenX+this.x < playerBox.left || this.y > playerBox.bottom || this.y < playerBox.top){
                this.x -= randomIntFromInterval(speed-2,speed+2)
                this.y += randomIntFromInterval(-1,1)
            }            
            else{        
                console.log("Climber")    
                const spawnX = randomIntFromInterval(playerBox.left,playerBox.right)
                const spawny = randomIntFromInterval(playerBox.top,playerBox.bottom)
                
                const newStage = new TermiteClimber(spawnX,spawny)
      
                this.context?.setStage(newStage) 
                this.context?.setBreakLoop(true)  
                this.context?.addClimberCounter()
                
            }        

             if(this.frameCount > 2000)
                this.context?.setStage(undefined)//destroy        
            
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
                const spawnX = randomIntFromInterval(playerBox.left - 50,playerBox.left + 50)
                const spawnY = randomIntFromInterval(playerBox.bottom - 50,playerBox.bottom)

                const newStage = new TermiteAfterClimber(spawnX,spawnY)

                this.context?.setStage(newStage)//destroy
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
            //tenk to stackoverflow
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
