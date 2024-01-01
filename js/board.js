var activeSettings = null;

var activeMineCount = function(m){
	mu = m.toUpperCase();
	let mEl = activeSettings.mines;
	return (mu in mEl) ? mEl[mu] : 0;
};

var board = {
	x: 1,
	y: 1,
	xwrap: 0,
	ywrap: 0,
	inbound: function(_x, _y){
		if(_x < 0 && board.xwrap > 0) {
			_x += board.x;
			if(board.xwrap > 1) {
				_y = board.y - 1 - _y;
			}
		}
		if(_x >= board.x && board.xwrap > 0) {
			_x -= board.x;
			if(board.xwrap > 1) {
				_y = board.y - 1 - _y;
			}
		}
		if(_y < 0 && board.ywrap > 0) {
			_y += board.y;
			if(board.ywrap > 1) {
				_x = board.x - 1 - _x;
			}
		}
		if(_y >= board.y && board.ywrap > 0) {
			_y -= board.y;
			if(board.ywrap > 1) {
				_x = board.x - 1 - _x;
			}
		}
		return [_x, _y];
	},
	at : function(_x, _y){
		let v = board.inbound(_x, _y);
		if(v[0] < 0) return null;
		if(v[0] >= board.x) return null;
		if(v[1] < 0) return null;
		if(v[1] >= board.y) return null;
		return board.tiles[v[0]][v[1]];
	},
	posEqual : function(x1, x2, y1, y2){
		let v1 = board.inbound(x1, y1);
		let v2 = board.inbound(x2, y2);
		return v1[0] == v2[0] && v1[1] == v2[1];
	},
	tiles: [],
};

var shape = {
	small: null,
	large: null,
	dogEffect: null,
	dogCount: null,
	slAnd: null,
	slOr: null,
	updateRange: null,
};

var chord = {
	x: 0,
	y: 0,
	time: 0,
};

var initBoard = function(){
	board.x = activeSettings.x;
	board.y = activeSettings.y;
	board.xwrap = ("xwrap" in activeSettings) ? activeSettings.xwrap : 0;
	board.ywrap = ("ywrap" in activeSettings) ? activeSettings.ywrap : 0;
	setCanvasSize();
	board.tiles = [];
	let fixedPattern = ("fixedPattern" in activeSettings) && activeSettings.fixedPattern;
	let fixedValues = {
		"65" : ["r", "R"],
		"86" : ["R", "RX"],
		"128" : ["g", "G"],
		"170" : ["G", "GX"],
		"191" : ["b", "B"],
		"223" : ["B", "BX"],
	};
	let hasStarterTile = false;
	if(fixedPattern){
		activeSettings.mines = {};
	}
	let rawData = decompress(activeSettings.board, board.x, board.y);
	for(let x = 0; x < board.x; x++){
		board.tiles[x] = [];
		for(let y = 0; y < board.y; y++){
			if(rawData[x][y] == 0){
				board.tiles[x][y] = null;
			}else{
				board.tiles[x][y] = {
					probability: (rawData[x][y] - 1) / 254,
					mine: "",
					surroundingMines: "",
					surroundingFlags: "",
					open: false,
					flag: "",
					effect: "",
				};
				if(fixedPattern){
					let t = board.tiles[x][y];
					if(rawData[x][y] == 1){
						t.starter = true;
						hasStarterTile = true;
					}else if(rawData[x][y] in fixedValues){
						let m = fixedValues[rawData[x][y]];
						t.mine = m[0];
						if(m[1] in activeSettings.mines){
							activeSettings.mines[m[1]]++;
						}else{
							activeSettings.mines[m[1]] = 1;
						}
					}
				}
			}
		}
	}
	if(fixedPattern){
		for(let i of ["r", "rx", "g", "gx", "b", "bx"]) {
			let element = counter["section_" + i];
			if(activeMineCount(i)){
				element.className = "";
			}else{
				element.className = "hide";
			}
		}
		if(!hasStarterTile){
			openWarning("<b>No Starter Tile!</b><br><br>When making a board in fixed pattern mode, you will need to include at least one starter tile. "
			+ "This is required so that the game can always be started on a guaranteed safe tile. Though in fixed pattern mode it is not necessary for this to be an empty tile.");
		}
	}
	let surrounding = surroundings["default"];
	if("shape" in activeSettings){
		surrounding = activeSettings.shape;
		if(typeof(surrounding) == "string"){
			surrounding = surroundings[surrounding];
		}
	}
	shape.small = surrounding.small;
	shape.large = surrounding.large;
	if("dogEffect" in surrounding){
		shape.dogEffect = surrounding.dogEffect;
	}else{
		shape.dogEffect = surroundings["default"].large;
	}
	shape.dogEffect = regionOr(shape.dogEffect, [[0, 0]]);

	if("dogCount" in surrounding){
		shape.dogCount = surrounding.dogCount;
	}else{
		shape.dogCount = surroundings["default"].small;
	}

	shape.slAnd = regionAnd(shape.small, shape.large);
	if("autoDig" in surrounding) {
		shape.slAnd = regionAnd(shape.slAnd, surrounding.autoDig);
	}
	shape.slOr = regionOr(shape.small, shape.large);
	shape.updateRange = regionOr(
		regionOr(shape.slOr, regionInvert(shape.slOr)),
		regionOr(surroundings["default"].small, surroundings["knight"].small)
	);
	Entities.clear();
	renderGame();
};

var polarisation = function(n, d){
	if(n == "") return n;
	if(d.length < 3) return n;
	switch(typeof(d[2])){
		case "string":
			return d[2];
		case "object":
			return (n in d[2]) ? d[2][n] : n;
	}
	return n;
};

var accumulateSurrounding = function(x, y, name){
	let t0 = board.at(x, y);
	let effect = (t0 == null) ? "" : t0.effect;
	let sum = "";
	if(effect == "grayscale"){
		for(let d of shape.dogCount){
			let t = board.at(x + d[0], y + d[1]);
			if(t == null) continue;
			let n = t[name];
			//console.log("N= " + n);
			sum += (n == n.toLowerCase()) ? n : "rr";
		}
	}else{
		for(let d of shape.small){
			let t = board.at(x + d[0], y + d[1]);
			if(t == null) continue;
			let n = t[name];
			if(n == n.toLowerCase()) sum += polarisation(n, d);
		}
		for(let d of shape.large){
			let t = board.at(x + d[0], y + d[1]);
			if(t == null) continue;
			let n = t[name];
			if(n == n.toUpperCase()) sum += polarisation(n, d);
		}
	}
	return sum;
};

var generate = function(x, y){
	let genType = function(t, count, exclude){
		for(let i = 0; i < count; i++){
			let x_ = Math.floor(Math.random() * board.x);
        	let y_ = Math.floor(Math.random() * board.y);
			let tile = board.at(x_, y_);
			let valid = true;
			if(tile == null) valid = false;
			if(x == x_ && y == y_) valid = false;
			if(valid && tile.mine != "") valid = false;
			if(valid && (Math.random() > tile.probability)) valid = false;
			if(valid){
				for(let d of exclude){
					if(board.posEqual(x + d[0], x_, y + d[1], y_)){
						valid = false;
						break;
					}
				}
			}
			if(valid){
				tile.mine = t;
			}else{
				i--;
			}
		}
	};
	let fixedPattern = ("fixedPattern" in activeSettings) && activeSettings.fixedPattern;
	if(!fixedPattern){
		genType("r", activeMineCount("R"), shape.small);
		genType("g", activeMineCount("G"), shape.small);
		genType("b", activeMineCount("B"), shape.small);
		genType("R", activeMineCount("RX"), shape.large);
		genType("G", activeMineCount("GX"), shape.large);
		genType("B", activeMineCount("BX"), shape.large);
	}
	for(let i = 0; i < board.x; i++){
		for(let j = 0; j < board.y; j++){
			tile = board.at(i, j);
			if(tile == null) continue;
			tile.surroundingMines = accumulateSurrounding(i, j, "mine");
		}
	}
	if("postGenFunction" in activeSettings){
		activeSettings["postGenFunction"](tile, x, y);
	}
	if("setter" in activeSettings){
		for(let s of activeSettings.setter){
			let t = board.at(s[0], s[1]);
			if(t != null) t.surroundingMines = s[2];
		}
	}
	if("spawn" in activeSettings){
		Entities.spawn(activeSettings.spawn, x, y);
	}
};

var voidClickLeft = function(x, y){
	Entities.onClick(x, y, Entities.events.voidClickL);
};

var voidClickRight = function(x, y){
	Entities.onClick(x, y, Entities.events.voidClickR);
};

var setFlag = function(x, y, v){
	let t = board.at(x, y);
	if(t == null) return;
	if(t.flag == v) return;
	t.flag = v;
	for(let d of shape.updateRange){
		let t2 = board.at(x + d[0], y + d[1]);
		if(t2 == null) continue;
		t2.surroundingFlags = accumulateSurrounding(x + d[0], y + d[1], "flag");
	}
};

var openSurrounding = function(x, y) {
	let tmp = board.inbound(x, y);
	x = tmp[0];
	y = tmp[1];
	for(let i of shape.slAnd){
		let t2 = board.at(x + i[0], y + i[1]);
		if((t2 != null) && (!t2.open)){
			setFlag(x + i[0], y + i[1], "");
			t2.open = true;
			if(t2.surroundingMines == "") openSurrounding(x + i[0], y + i[1]);
		}
	}
};

var checkCompletion = function() {
	let completed = true;
	for(let x = 0; x < board.x; x++){
		for(let y = 0; y < board.y; y++){
			let t = board.at(x, y);
			if(t != null){
				if(t.mine == ""){
					if(!t.open){
						completed = false;
					}
				}else if(t.open){
					explode();
					return;	
				}
			}
		}
	}
	if(completed) {
		for(let x = 0; x < board.x; x++){
			for(let y = 0; y < board.y; y++){
				let t = board.at(x, y);
				if(t != null) setFlag(x, y, t.mine);
			}
		}
		if("postFlagFunction" in activeSettings){
			activeSettings["postFlagFunction"](null, -1, -1);
		}
		complete();
	}
};

var chordCondition = function(tile){
	if("disableChord" in activeSettings && activeSettings.disableChord) return false;
	if(typeof(tile.surroundingMines) != "string") return false;
	if(activeSettings.display == "colorcharge"){
		let r = 0;
		let g = 0;
		let b = 0;
		for(let a of tile.surroundingMines.toLowerCase()){
			if(a == "r") r++;
			if(a == "g") g++;
			if(a == "b") b++;
		}
		for(let a of tile.surroundingFlags.toLowerCase()){
			if(a == "r") r--;
			if(a == "g") g--;
			if(a == "b") b--;
		}
		r -= b;
		g -= b;
		return (r == 0) && (g == 0);
	}else if(activeSettings.display == "minusgb"){
		let r = 0;
		for(let a of tile.surroundingMines.toLowerCase()){
			if(a == "r") r++;
			if(a == "g") r--;
			if(a == "b") r--;
		}
		for(let a of tile.surroundingFlags.toLowerCase()){
			if(a == "r") r--;
			if(a == "g") r++;
			if(a == "b") r++;
		}
		return (r == 0);
	}else{
		return tile.surroundingMines.length == tile.surroundingFlags.length;
	}
};

var leftClick = function(x, y) {
	if(endOfGame()) return;
	//console.log("Left click (" + x + ", " + y + ")");
	let tile = board.at(x, y);
	let fixedPattern = ("fixedPattern" in activeSettings) && activeSettings.fixedPattern;
	if(fixedPattern && gamestate == "start" && !(("starter" in tile) && tile.starter)) return;
	if(tile.open) {
		voidClickLeft(x, y);
		if((x == chord.x) && (y == chord.y) && (chord.time + 400 > now()) && chordCondition(tile)){
			if("preDigFunction" in activeSettings){
				activeSettings["preDigFunction"](tile, x, y);
			}
			let anyOpened = false;
			for(let i of shape.slAnd){
				let t2 = board.at(x + i[0], y + i[1]);
				if((t2 != null) && (t2.flag == 0) && (!t2.open)){
					setFlag(x + i[0], y + i[1], "");
					t2.open = true;
					anyOpened= true;
					if(t2.surroundingMines == "") openSurrounding(x + i[0], y + i[1]);
				}
			}
			if(anyOpened) Entities.onClick(x, y, Entities.events.digOrChord);
		}else{
			chord.x = x;
			chord.y = y;
			chord.time = now();
		}
	}else{
		if(tile.flag != "") return;
		if("preDigFunction" in activeSettings){
			activeSettings["preDigFunction"](tile, x, y);
		}
		if("customDigFunction" in activeSettings){
			activeSettings["customDigFunction"](tile, x, y);
		}else{
			let start = false;
			if(gamestate == "start"){
				runGame();
				start = true;
				generate(x, y);
			}
			tile.open = true;
			if((tile.surroundingMines == "") && (tile.mine == "")) openSurrounding(x, y);
			Entities.onClick(x, y, start ? Entities.events.startGame : Entities.events.digOrChord);
		}
		if(day61Fnct != null) day61Fnct.verify();
	}
	checkCompletion();
	renderGame();
};

var rightClick = function(x, y) {
	if(endOfGame()) return;
	//console.log("Right click (" + x + ", " + y + ")");
	let tile = board.at(x, y);
	if(tile.open) {
		voidClickRight(x, y);
		renderGame();
		return;
	}
	if("customFlagFunction" in activeSettings){
		activeSettings["customFlagFunction"](tile, x, y);
	}else{
		let fVal = tile.flag;
		while(true){
			fVal = flagCycle(fVal);
			if(fVal == "") break;
			if(activeMineCount(toMineX(fVal)) > 0) break;
		}
		setFlag(x, y, fVal);
		if("postFlagFunction" in activeSettings){
			activeSettings["postFlagFunction"](tile, x, y);
		}
	}
	Entities.onClick(x, y, Entities.events.flagOrUnflag);
	renderGame();
};

var timeCycle = function() {
	if (endOfGame()) return;
	if ("timeCycleFunction" in activeSettings && "cycleDelay" in activeSettings){
		if ((now() - startTime) % activeSettings["cycleDelay"] == 0){
			activeSettings["timeCycleFunction"]();
		}
	}
	renderGame();
}
