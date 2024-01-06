registerDay(1, 
{
    "title" : "Minepersvee 1 - Largely Against Following You",
    "desc" : "The first Minepersvee! Woo!<br><br>"
           + "When Day 61 began, my first custom variant was just a simple one featuring just Large and Anti Mines. It was nothing special.<br>"
		   + "But today, we're adding a new entity to the mix, the Shoop! It's an anti-Sheep so whatever the direction the sheep moves, the shoop move    s the <b>opposite</b> direction.<br>"
		   + "Also, to minimize guessing, I made the Anti Mines <b>double</b> so yeah.",
    "mines" : {
        "RX" : 30,
		"B": 30
    },
    "grayMines" : false,
    "display" : "minusgb",
    "shape": {
  "small": [
   [
    -1,
    -1,
    "bb"
   ],
   [
    -1,
    0,
    "bb"
   ],
   [
    -1,
    1,
    "bb"
   ],
   [
    0,
    -1,
    "bb"
   ],
   [
    0,
    1,
    "bb"
   ],
   [
    1,
    -1,
    "bb"
   ],
   [
    1,
    0,
    "bb"
   ],
   [
    1,
    1,
    "bb"
   ]
  ],
  "large": [
   [
    1,
    -1
   ],
   [
    0,
    -1
   ],
   [
    1,
    1
   ],
   [
    -1,
    1
   ],
   [
    0,
    1
   ],
   [
    1,
    0
   ],
   [
    -1,
    -1
   ],
   [
    -1,
    0
   ],
   [
    -2,
    -2
   ],
   [
    -2,
    -1
   ],
   [
    -2,
    0
   ],
   [
    -2,
    1
   ],
   [
    -2,
    2
   ],
   [
    -1,
    2
   ],
   [
    0,
    2
   ],
   [
    1,
    2
   ],
   [
    2,
    2
   ],
   [
    2,
    1
   ],
   [
    2,
    0
   ],
   [
    2,
    -1
   ],
   [
    2,
    -2
   ],
   [
    1,
    -2
   ],
   [
    0,
    -2
   ],
   [
    -1,
    -2
   ]
  ]
 },
    "decrementing" : false,
    "x" : 24,
    "y" : 24,
    "board": "0A/z/v+cP//pw",
	"spawn":[
	  "shoop"
	],
	"timeCycleFunction": function(){
        let n = 1;
        for(let i = 0; i < n; i++){
            switch(Math.floor(Math.random() * 4)){
                case 0:
                    x = 0;
                    y = Math.floor(Math.random() * (board.y));
                    break;
                case 1:
                    x = Math.floor(Math.random() * (board.x));
                    y = 0;
                    break;
                case 2:
                    x = board.x - 1;
                    y = Math.floor(Math.random() * (board.y));
                    break;
                case 3:
                    x = Math.floor(Math.random() * (board.x));
                    y = board.y - 1;
                    break;
            }
            Entities.spawn("obstacle", x, y);
        },
    "cycleDelay": 0
    }
});
    