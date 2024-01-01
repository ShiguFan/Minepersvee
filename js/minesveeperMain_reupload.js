let stopGame = 0;

(function(){
	let screenscale = 16;

	mainCanvas.addEventListener('mouseup', function(event) {
		let i = event.pageX - mainCanvas.getBoundingClientRect().left - 2 - window.pageXOffset - canvasPadLeft;
		let j = event.pageY - mainCanvas.getBoundingClientRect().top - 2 - window.pageYOffset - canvasPadTop;
		i = Math.floor(i / screenscale);
		j = Math.floor(j / screenscale);
		if((i >= 0) && (j >= 0) && (i < board.x) && (j < board.y)){
			if(event.button == 0){
				if(document.selection && document.selection.empty) {
					document.selection.empty();
				} else if(window.getSelection) {
					let sel = window.getSelection();
					sel.removeAllRanges();
				}
			}
			if(board.tiles[i][j] == null) return;
			let confusion = (activeSettings != null) && ("confusion" in activeSettings) && !!activeSettings.confusion;
			if(confusion ^ (isMobile ? (mobileAction == "right") : (event.button == 2))){
				rightClick(i, j);
			}else{
				leftClick(i, j);
			}
		}
	}, false);

	let currentDay = 0;

	let startGame = function(){
		stopGame();
		for(let i of ["r", "rx", "g", "gx", "b", "bx"]) {
			let element = counter["section_" + i];
			if(activeMineCount(i)){
				element.className = "";
			}else{
				element.className = "hide";
			}
		}
		gamestate = "start";
		toggleIndicator();
		initBoard();
	}

	stopGame = function(){
		gamestate = "menu";
		toggleIndicator();
		setTimer(0, counter.timer);
	};

	restartButton.onclick = startGame;

	startGame();

})();
