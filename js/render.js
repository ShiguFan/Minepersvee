var renderModes = {
	"default" : function(tile, draw){
		let number = tile.surroundingMines.length;
		if(number == 0 && ((!activeSettings.decrementing) || (tile.surroundingFlags == ""))){
			draw(Textures.background.clear);
			return;
		}
		if(activeSettings.decrementing) number -= tile.surroundingFlags.length;
		if(number in Textures.background.number){
			draw(Textures.background.number[number]);
		}else{
			draw(Textures.invalid);
		}
	},
	"colorcharge" : function(tile, draw){
		let data = tile.surroundingMines.toLowerCase();
		let r = 0;
		let g = 0;
		let b = 0;
		for(let i of data){
			if(i == "r") r++;
			if(i == "g") g++;
			if(i == "b") b++;
		}
		if(activeSettings.decrementing){
			for(let i of tile.surroundingFlags.toLowerCase()){
				if(i == "r") { g++; b++; }
				if(i == "g") { r++; b++; }
				if(i == "b") { r++; g++; }
			}
		}
		draw(Textures.background.getColorCharge(r, g, b));
	},
	"grayscale" : function(tile, draw){
		let number = tile.surroundingMines.length;
		if(number == 0 && ((!activeSettings.decrementing) || (tile.surroundingFlags == ""))){
			draw(Textures.background.clearGrayscale);
			return;
		}
		if(activeSettings.decrementing) number -= tile.surroundingFlags.length;
		if(number in Textures.background.numberGrayscale){
			draw(Textures.background.numberGrayscale[number]);
		}else{
			draw(Textures.invalid);
		}
	},
	"probability" : function(tile, draw){
		let p = tile.probability;
		if(p == 0){
			draw(Textures.background.number[0]);
		}else if(p < 0.064){
			draw(Textures.background.fractions.epsilon);
		}else if(p < 0.188){
			draw(Textures.background.fractions.frac_1_8);
		}else if(p < 0.292){
			draw(Textures.background.fractions.frac_1_4);
		}else if(p < 0.417){
			draw(Textures.background.fractions.frac_1_3);
		}else if(p < 0.583){
			draw(Textures.background.fractions.frac_1_2);
		}else if(p < 0.708){
			draw(Textures.background.fractions.frac_2_3);
		}else if(p < 0.813){
			draw(Textures.background.fractions.frac_3_4);
		}else if(p < 0.938){
			draw(Textures.background.fractions.frac_7_8);
		}else{
			draw(Textures.background.number[1]);
		}
	},
	"fixedPattern" : function(tile, draw){
		let p = Math.floor(254 * tile.probability + 0.01);
		let tex = Textures.background.clear;
		switch(p){
			case 0:
				tex = Textures.background.starter;
				break;
			case 64:
				tex = Textures.background.mine.R;
				break;
			case 85:
				tex = Textures.background.mine.RX;
				break;
			case 127:
				tex = Textures.background.mine.G;
				break;
			case 169:
				tex = Textures.background.mine.GX;
				break;
			case 190:
				tex = Textures.background.mine.B;
				break;
			case 222:
				tex = Textures.background.mine.BX;
				break;
		}
		draw(tex);
	},
	"minusgb" : function(tile, draw) {
		let data = tile.surroundingMines.toLowerCase();
		let r = 0;
		let gb = 0;
		for(let i of data){
			if(i == "r") r++;
			if(i == "g") gb++;
			if(i == "b") gb++;
		}
		if(activeSettings.decrementing){
			for(let i of tile.surroundingFlags.toLowerCase()){
				if(i == "r") gb++;
				if(i == "g") r++;
				if(i == "b") r++;
			}
		}
		if(r == 0 && gb == 0){
			draw(Textures.background.clear);
		}else{
			let number = r - gb;
			if(number in Textures.background.number){
				draw(Textures.background.number[number]);
			}else{
				draw(Textures.invalid);
			}
		}
	},
};

var canvasPadLeft = 0;
var canvasPadTop = 0;

var setCanvasSize = function(){
	canvasPadLeft = (board.xwrap == 0) ? 0 : 19;
	canvasPadTop = (board.ywrap == 0) ? 0 : 14;
	mainCanvas.width = 2 + 16 * board.x + 2 * canvasPadLeft;
	mainCanvas.height = 2 + 16 * board.y + 2 * canvasPadTop;
};

var renderTileRunning = function(tile, count, draw){
	if(tile.open){
		count.open++;
		let data = tile.surroundingMines;
		if(typeof(data) == "object"){
			let t = Textures;
			for(let i of data){
				t = t[i];
			}
			draw(t);
		}else if(tile.effect == "grayscale"){
			renderModes["grayscale"](tile, draw);
		}else{
			let displayMode = activeSettings.display;
			if(typeof(displayMode) == "string"){
				displayMode = renderModes[displayMode];
			}
			displayMode(tile, draw);
		}
	}else{
		if(tile.flag == ""){
			draw((("starter" in tile) && tile.starter) ? Textures.closed.starter :  Textures.closed.clear);
		}else{
			draw(Textures.closed.flags[toMineX(tile.flag)])
			count[tile.flag]++;
		}
	}
};

var renderTileDead = function(tile, count, draw){
	if(tile.mine == "" && tile.flag == ""){
		renderTileRunning(tile, count, draw);
		return;
	}
	if(tile.open){
		if(activeSettings.grayMines){
			draw(Textures.background.explodedMine["0" + toMineX(tile.mine).substr(1)]);
		}else{
			draw(Textures.background.explodedMine[toMineX(tile.mine)]);
		}
	}else if(tile.flag == ""){
		if(activeSettings.grayMines){
			draw(Textures.background.mine["0" + toMineX(tile.mine).substr(1)]);
		}else{
			draw(Textures.background.mine[toMineX(tile.mine)]);
		}
	}else if(tile.mine == tile.flag){
		draw(Textures.closed.flags[toMineX(tile.flag)]);
		count[tile.flag]++;
	}else{
		let m = toMineX(tile.mine);
		if(m == undefined) m = "0";
		draw(Textures.closed.wrongFlags[toMineX(tile.flag)][m]);
	}
};

var renderTileComplete = function(tile, count, draw){
	if(tile.mine == ""){
		renderTileRunning(tile, count, draw);
	}else{
		draw(Textures.closed.finalFlags[toMineX(tile.mine)]);
		count[tile.mine]++;
	}
};

var renderTileProbability = function(tile, count, draw){
	renderModes.probability(tile, draw);
};

var renderFixedPattern = function(tile, count, draw){
	renderModes.fixedPattern(tile, draw);
};

var iterateTileRender = function(f, flagsPlaced){
	let x = 0;
	let y = 0;
	let draw = function(tex){
		if(typeof(tex) != "object") tex = Textures.invalid;
		if((!("complete" in tex)) && (!tex.complete)) tex = Textures.invalid;
		context.drawImage(tex, 1 + 16 * x + canvasPadLeft, 1 + 16 * y + canvasPadTop);	
	};
	let tileCount = 0;
	for(x = 0; x < board.x; x++){
		for(y = 0; y < board.y; y++){
			tile = board.at(x, y);
			if(tile != null){
				tileCount += 1;
				f(tile, flagsPlaced, draw);
			}
		}
	}
	return tileCount;
};

var renderGame = function(){
	clearMainCanvas();
	if(gamestate == "json"){
		day61Fnct.jsonRender();
		return;
	}
	for(let x = 0; x < board.x; x++){
		for(let y = 0; y < board.y; y++){
			tile = board.at(x, y);
			if(tile == null) continue;
			context.fillStyle = "black";
			if(board.at(x - 1, y) == null){
				context.fillRect(16 * x + canvasPadLeft, 16 * y + canvasPadTop, 1, 18);
			}
			if(board.at(x + 1, y) == null){
				context.fillRect(16 * x + 17 + canvasPadLeft, 16 * y + canvasPadTop, 1, 18);
			}
			if(board.at(x, y - 1) == null){
				context.fillRect(16 * x + canvasPadLeft, 16 * y + canvasPadTop, 18, 1);
			}
			if(board.at(x, y + 1) == null){
				context.fillRect(16 * x + canvasPadLeft, 16 * y + 17 + canvasPadTop, 18, 1);
			}
		}
	}
	context.font = "10px Arial";
	context.textAlign = "center";
	if(board.xwrap > 0){
		context.fillStyle = (board.xwrap == 1) ? "#2020b0" : "#902020";
		let count = 0;
		for(let y = 0; y < board.y; y++){
			if(board.at(-1, y) != null && board.at(0, y) != null){
				context.fillRect(canvasPadLeft - 1, 16 * y + canvasPadTop, 2, 18);
				count++;
				context.fillText("" + count, 9, 16 * y + canvasPadTop + 13);
				if(board.xwrap == 1){
					context.fillRect(16 * board.x + 1 + canvasPadLeft, 16 * y + canvasPadTop, 2, 18);
					context.fillText("" + count, 16 * board.x + 11 + canvasPadLeft, 16 * y + canvasPadTop + 13);
				}else{
					let yInv = board.y - y - 1;
					context.fillRect(16 * board.x + 1 + canvasPadLeft, 16 * yInv + canvasPadTop, 2, 18);
					context.fillText("" + count, 16 * board.x + 11 + canvasPadLeft, 16 * yInv + canvasPadTop + 13);
				}
			}
		}
	}
	if(board.ywrap > 0){
		context.fillStyle = (board.ywrap == 1) ? "#2020b0" : "#902020";
		let count = 0;
		for(let x = 0; x < board.x; x++){
			if(board.at(x, -1) != null && board.at(x, 0) != null){
				context.fillRect(16 * x + canvasPadLeft, canvasPadTop - 1, 18, 2);
				count++;
				context.fillText("" + count, 16 * x + canvasPadLeft + 8, 10);
				if(board.ywrap == 1){
					context.fillRect(16 * x + canvasPadLeft, 16 * board.y + 1 + canvasPadTop, 18, 2);
					context.fillText("" + count, 16 * x + canvasPadLeft + 8, 16 * board.y + 14 + canvasPadTop);
				}else{
					let xInv = board.x - x - 1;
					context.fillRect(16 * xInv + canvasPadLeft, 16 * board.y + 1 + canvasPadTop, 18, 2);
					context.fillText("" + count, 16 * xInv + canvasPadLeft + 8, 16 * board.y + 14 + canvasPadTop);
				}
			}
		}
	}
	let tileCount = 0;
	let count = { open:0, r:0, R:0, g:0, G:0, b:0, B:0 };
	if(gamestate != "edit" && activeSettings != null && "renderFunction" in activeSettings) {
		tileCount = iterateTileRender(activeSettings.renderFunction, count);
	}else if(gamestate == "dead"){
		tileCount = iterateTileRender(renderTileDead, count);
	}else if(gamestate == "complete"){
		tileCount = iterateTileRender(renderTileComplete, count);
	}else if(gamestate == "edit"){
		if(day61Fnct.isFixed()){
			tileCount = iterateTileRender(renderFixedPattern, count);
		}else{
			tileCount = iterateTileRender(renderTileProbability, count);
		}
	}else{
		tileCount = iterateTileRender(renderTileRunning, count);
	}
	Entities.draw((tex, x, y) => {
		if(typeof(tex) != "object") tex = Textures.invalid;
		if((!("complete" in tex)) && (!tex.complete)) tex = Textures.invalid;
		context.drawImage(tex, 1 + 16 * x + canvasPadLeft, 1 + 16 * y + canvasPadTop);	
	});
	var openCount = tileCount;
	for(let i of ["r", "rx", "g", "gx", "b", "bx"]) openCount -= activeMineCount(i);
	counter.opened.innerText = count.open + " / " + (openCount);
	counter.flag_r.innerText = count.r + " / " + (activeMineCount("r"));
	counter.flag_rx.innerText = count.R + " / " + (activeMineCount("rx"));
	counter.flag_g.innerText = count.g + " / " + (activeMineCount("g"));
	counter.flag_gx.innerText = count.G + " / " + (activeMineCount("gx"));
	counter.flag_b.innerText = count.b + " / " + (activeMineCount("b"));
	counter.flag_bx.innerText = count.B + " / " + (activeMineCount("bx"));
};
