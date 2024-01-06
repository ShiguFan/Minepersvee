registerDay(1, 
{
    "title" : "Minepersvee 1 - Largely Against Following You",
    "desc" : "The first Minepersvee! Woo!<br><br>"
           + "When Day 61 began, my first custom variant was just a simple one featuring just Large and Anti Mines. It was nothing special.<br>"
		   + "But today, we're adding a new entity to the mix, the Shoop! It's an anti-Sheep so whatever the direction the sheep moves, the shoop moves the <b>opposite</b> direction.<br>"
		   + "Also, to minimize guessing, I made the Large Mines <b>double</b> so yeah.",
    "mines" : {
        "RX" : 35,
		"B": 35
    },
    "grayMines" : false,
    "display" : "minusgb",
    "shape": {
  "small": [
   [
    -1,
    -1
   ],
   [
    -1,
    0
   ],
   [
    -1,
    1
   ],
   [
    0,
    -1
   ],
   [
    0,
    1
   ],
   [
    1,
    -1
   ],
   [
    1,
    0
   ],
   [
    1,
    1
   ]
  ],
  "large": [
   [
    1,
    -1,
	"rr"
   ],
   [
    0,
    -1,
	"rr"
   ],
   [
    1,
    1,
	"rr"
   ],
   [
    -1,
    1,
	"rr"
   ],
   [
    0,
    1,
	"rr"
   ],
   [
    1,
    0,
	"rr"
   ],
   [
    -1,
    -1,
	"rr"
   ],
   [
    -1,
    0,
	"rr"
   ],
   [
    -2,
    -2,
	"rr"
   ],
   [
    -2,
    -1,
	"rr"
   ],
   [
    -2,
    0,
	"rr"
   ],
   [
    -2,
    1,
	"rr"
   ],
   [
    -2,
    2,
	"rr"
   ],
   [
    -1,
    2,
	"rr"
   ],
   [
    0,
    2,
	"rr"
   ],
   [
    1,
    2,
	"rr"
   ],
   [
    2,
    2,
	"rr"
   ],
   [
    2,
    1,
	"rr"
   ],
   [
    2,
    0,
	"rr"
   ],
   [
    2,
    -1,
	"rr"
   ],
   [
    2,
    -2,
	"rr"
   ],
   [
    1,
    -2,
	"rr"
   ],
   [
    0,
    -2,
	"rr"
   ],
   [
    -1,
    -2,
	"rr"
   ]
  ]
 },
    "decrementing" : true,
    "x" : 26,
    "y" : 26,
    "board": "70/6M/9ARZ6VHP8AaACiAC98xDQ",
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
    