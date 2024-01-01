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
			if(currentDay == 61){
				switch(gamestate){
					case "json":
						return;
					case "edit":
						if(event.button == 2){
							day61Fnct.editRight(i, j);
						}else{
							day61Fnct.editLeft(i, j);
						}
						return;
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

	let startGame = function(n){
		stopGame();
		currentDay = n;
		//console.log("Starting Day: " + n)
		activeSettings = days[n];
		for(let i of ["r", "rx", "g", "gx", "b", "bx"]) {
			let element = counter["section_" + i];
			if(activeMineCount(i)){
				element.className = "";
			}else{
				element.className = "hide";
			}
		}
		pageSections.titleDay.innerHTML = activeSettings.title;
		pageSections.descDay.innerHTML = "<div align=\"left\">" + activeSettings.desc + "</p>";
		gamestate = "start";
		toggleIndicator();
		initBoard();
	}

	stopGame = function(){
		//console.log("Stopping Day");
		gamestate = "menu";
		toggleIndicator();
		setTimer(0, counter.timer);
	}

	let openAndStartDay = function(n){
		if(n == 61) {
			currentDay = 61;
			setMenu(3);
			return;
		}
		setMenu(1);
		startGame(n);
	};

	let setStartDayEvent = function(e, d){
		if(d == 59){
			e.onclick = function(){ openAndStartDay(day59Fnct()); };
		}else{
			e.onclick = function(){ openAndStartDay(d); };
		}
	};

	for(let i = 1; i < 201; i++){
		let dayButton = document.getElementById("dayButton_" + i);
		if(dayButton == null) continue;
		if(i in days && days[i] != null){
			dayButton.className = "daybutton_active";
			setStartDayEvent(dayButton, i);
		}else{
			dayButton.onclick = function() { setMenu(2); stopGame(); };
		}
	}
	
	restartButton.onclick = function(){
		if(currentDay == 61){
			setMenu(3);
		}else{
			startGame(currentDay);
		}
	};

	document.getElementById("settingButton").onclick = function() { setMenu(0); stopGame(); };

	if(day61Fnct != null) day61Fnct.startCustom();
	
	console.log("=========================================================================");
	console.log("                     A NOTE TO ALL CODE DIGGERS");
	console.log("-------------------------------------------------------------------------");
	console.log("I am perfectly fine with you going through the code and I will also");
	console.log("upload the code for this once it's over. However, for the time that this");
	console.log("is going on I would like to request to keep any spoilers you find out");
	console.log("about in this way out of the Discord discussion. I am fine with educated");
	console.log("guesses about future days utilizing Information already given through the");
	console.log("publicly available days. But I would appreciate if you didn't go:");
	console.log("I looked at the code and saw that Day 60 is called \"Blackjack and Hookers\"");
	console.log("Thank You!            -Joshua");

})();
