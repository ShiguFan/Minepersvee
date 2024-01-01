var gamestate = "menu";
var startTime = 0;

var now = () => (new Date()).getTime();

var toMineCase = null;
var toMineX = null;
var flagCycle = null;

(function(){
	let toMineXLookup = {
		r : "R",
		R : "RX",
		g : "G",
		G : "GX",
		b : "B",
		B : "BX",
	};
	toMineX = (i) => toMineXLookup[i];
	let toMineCaseLookup = {
		R : "r",
		RX : "R",
		G : "g",
		GX : "G",
		B : "b",
		BX : "B",
	};
	toMineCase = (i) => toMineCaseLookup[i.toUpperCase()];
	let flagCycleLookup = {
		r : "R",
		R : "g",
		g : "G",
		G : "b",
		b : "B",
		B : "",
	};
	flagCycleLookup[""] = "r";
	flagCycle = (i) => flagCycleLookup[i];
})();

var updateTime = function(){
	if(gamestate != "running") return;
	setTimer(now() - startTime, counter.timer);
	timeCycle();
	requestAnimationFrame(updateTime);
};

var runGame = function(x, y){
	gamestate = "running";
	startTime = now();
	requestAnimationFrame(updateTime);
};

var explode = function(){
	console.log("Explode");
	gamestate = "dead";
	setTimer(now() - startTime, counter.timer);
	if(("autoRestart" in activeSettings) && activeSettings.autoRestart){
		restartButton.onclick();
	}
};

var complete = function(){
	console.log("Complete");
	gamestate = "complete";
	setTimer(now() - startTime, counter.timer);
};

var endOfGame = () => (gamestate == "dead") || (gamestate == "complete");
