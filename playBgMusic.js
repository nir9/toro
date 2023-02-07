let beat = new Audio('Toro_Main_Menu_Soundtrack.mp3');
            let isPlay = false
            
            function mouseClick(){
                if(!isPlay){
                    isPlay = true

                    beat.play();
                    beat.loop = true
                    console.log("play")
                }                
            }
           