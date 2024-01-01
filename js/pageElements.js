var mainCanvas = document.getElementById("main_canvas");
mainCanvas.oncontextmenu = () => false;
var context = mainCanvas.getContext("2d");
var clearMainCanvas = function(){
	context.clearRect(0,0,mainCanvas.width,mainCanvas.height);
}

var mobileButton = document.getElementById("mobileLR");

var restartButton = document.getElementById("restartButton");

var counter = {
	opened : document.getElementById("count_tex_open"),
	flag_r : document.getElementById("count_tex_rflag"),
	flag_rx : document.getElementById("count_tex_rxflag"),
	flag_g : document.getElementById("count_tex_gflag"),
	flag_gx : document.getElementById("count_tex_gxflag"),
	flag_b : document.getElementById("count_tex_bflag"),
	flag_bx : document.getElementById("count_tex_bxflag"),
	section_r : document.getElementById("count_sec_rflag"),
	section_rx : document.getElementById("count_sec_rxflag"),
	section_g : document.getElementById("count_sec_gflag"),
	section_gx : document.getElementById("count_sec_gxflag"),
	section_b : document.getElementById("count_sec_bflag"),
	section_bx : document.getElementById("count_sec_bxflag"),
	timer : document.getElementById("regularTimer"),
};

var pageSections = {
	titleWelcome : document.getElementById("title_base"),
	titleDay : document.getElementById("title_day"),
	titlePatience : document.getElementById("title_patience"),
	board : document.getElementById("board-section"),
	descWelcome : document.getElementById("description-welcome"),
	descDay : document.getElementById("description-day"),
	descPatience : document.getElementById("description-patience"),
};


/*var sideNumbers = {
	left  : document.getElementById("left-numbers"),
	right : document.getElementById("right-numbers"),
	top   : document.getElementById("top-numbers"),
	bottom: document.getElementById("bottom-numbers"),
};*/


var setTimer = function(time, T){
  var ms = time % 1000;
  time /= 1000;
  var sec = time % 60;
  time = Math.floor(time / 60);
  sec = Math.floor(sec);
  if(ms < 100){
    if(ms < 10){
      ms = "0" + ms;
    }
    ms = "0" + ms;
  }
  if(sec < 10){
    sec = "0" + sec;
  }
  T.innerText = time + ":" + sec + "." + ms;
}

var hideElement = function(e){
	e.classList.add("hide");	
};

var revealElement = function(e){
	e.classList.remove("hide");	
};

var setMenu = function(m){
	switch(m){
		case 0:
			revealElement(pageSections.titleWelcome);
			hideElement(pageSections.titleDay);
			hideElement(pageSections.titlePatience);
			hideElement(pageSections.board);
			revealElement(pageSections.descWelcome);
			hideElement(pageSections.descDay);
			hideElement(pageSections.descPatience);
			if(day61Fnct != null) day61Fnct.close();
			if(day68Fnct != null) day68Fnct.close();
			break;
		case 1:
			hideElement(pageSections.titleWelcome);
			revealElement(pageSections.titleDay);
			hideElement(pageSections.titlePatience);
			revealElement(pageSections.board);
			hideElement(pageSections.descWelcome);
			revealElement(pageSections.descDay);
			hideElement(pageSections.descPatience);
			if(day61Fnct != null) day61Fnct.close();
			if(day68Fnct != null) day68Fnct.close();
			break;
		case 2:
			hideElement(pageSections.titleWelcome);
			hideElement(pageSections.titleDay);
			revealElement(pageSections.titlePatience);
			hideElement(pageSections.board);
			hideElement(pageSections.descWelcome);
			hideElement(pageSections.descDay);
			revealElement(pageSections.descPatience);
			if(day61Fnct != null) day61Fnct.close();
			if(day68Fnct != null) day68Fnct.close();
			break;
		case 3:
			hideElement(pageSections.titleWelcome);
			revealElement(pageSections.titleDay);
			hideElement(pageSections.titlePatience);
			revealElement(pageSections.board);
			hideElement(pageSections.descWelcome);
			hideElement(pageSections.descDay);
			hideElement(pageSections.descPatience);
			if(day61Fnct != null) day61Fnct.open();
			if(day68Fnct != null) day68Fnct.close();
			break;
		case 4:
			hideElement(pageSections.titleWelcome);
			revealElement(pageSections.titleDay);
			hideElement(pageSections.titlePatience);
			hideElement(pageSections.board);
			hideElement(pageSections.descWelcome);
			hideElement(pageSections.descDay);
			hideElement(pageSections.descPatience);
			if(day61Fnct != null) day61Fnct.close();
			if(day68Fnct != null) day68Fnct.open();
			break;
	}
};

var closeOverlays = 0;

var openWarning = 0;
var openChoice = 0;

(function(){
	let overlayBG = document.getElementById("grayBg");
	let warningOverlay = document.getElementById("warning-overlay");
	let warningContent = document.getElementById("warning-content");
	let choiceOverlay = document.getElementById("choice-overlay");
	let choiceContent = document.getElementById("choice-content");
	let noPropagation = function(e) { e.stopPropagation(); };
	let cancelChoice = null;
	let continueChoice = null;
	
	let scrollToTop = function() { document.body.scrollTop = document.documentElement.scrollTop = 0; };
	warningOverlay.onclick = noPropagation;
	choiceOverlay.onclick = noPropagation;
	closeOverlays = function(){
		overlayBG.className = "hide";
		warningOverlay.className = "hide";
		choiceOverlay.className = "hide";
		if(cancelChoice != null){
			cancelChoice();
			cancelChoice = null;
		}
		continueChoice = null;
	};
	overlayBG.onclick = closeOverlays;
	document.getElementById("overlayContainer").onclick = closeOverlays;
	openWarning = function(message){
		choiceOverlay.className = "hide";
		overlayBG.className = "grayScreen";
		warningOverlay.className = "overlayText";
		warningContent.innerHTML = message;
		scrollToTop();
	};
	openChoice = function(message, onContinue, onCancel){
		warningOverlay.className = "hide";
		overlayBG.className = "grayScreen";
		choiceOverlay.className = "overlayText";
		choiceContent.innerHTML = message;
		scrollToTop();
		cancelChoice = onCancel;
		continueChoice = onContinue;
	};
	document.getElementById("warning-got-it").onclick = closeOverlays;
	document.getElementById("choice-cancel").onclick = closeOverlays;
	document.getElementById("choice-continue").onclick = function(){
		if(continueChoice != null){
			continueChoice();
			continueChoice = null;
		}
		cancelChoice = null;
		closeOverlays();
	};
})();
