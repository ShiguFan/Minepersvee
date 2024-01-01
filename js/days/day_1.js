registerDay(1, 
{
    "title" : "Mystsveeper 1A - Bullet Hell (Extra Stage)",
    "desc" : "<b>Minesveeper 60 - Bullet Hell</b>, but bullets are spawned independently of your clicks.<br><br>"
           + "The longer you take, the more bullets accumulate!",
    "mines" : {
        "R" : 40
    },
    "grayMines" : true,
    "display" : "default",
    "shape" : "default",
    "decrementing" : false,
    "x" : 26,
    "y" : 26,
    "disableChord" : true,
    "spawn" : ["sheep"],
    "board" : "0FSKM/709+f6ACEAEATd5Uw",
    "timeCycleFunction": function(){
        let n = (Math.random() > 0.95 ? 2 : (Math.random() > 0.7) ? 1 : 0);
        for(let i = 0; i < n; i++){
            switch(Math.floor(Math.random() * 4)){
                case 0:
                    x = 0;
                    y = 3 + Math.floor(Math.random() * (board.y - 6));
                    break;
                case 1:
                    x = 3 + Math.floor(Math.random() * (board.x - 6));
                    y = 0;
                    break;
                case 2:
                    x = board.x - 1;
                    y = 3 + Math.floor(Math.random() * (board.y - 6));
                    break;
                case 3:
                    x = 3 + Math.floor(Math.random() * (board.x - 6));
                    y = board.y - 1;
                    break;
            }
            Entities.spawn("projectile", x, y);
        }
    },
    "cycleDelay": 10
});
    
    