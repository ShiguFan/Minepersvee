var noSwitchAnimation = 0;

const optionOrder = ["offsetToOne", "invertMobile", "disableShovel", "userContent"];

var options = {
	"offsetToOne" : false,
	"invertMobile" : false,
	"disableShovel" : false,
	"userContent" : false,
};

var setOptions = function(){
	optTxt = "1|";
	for(let i of optionOrder){
		if(Number.isInteger(options[i])){
			if(options[i] < 0) options[i] = 0;
			if(options[i] > 35) options[i] = 35;
			optTxt += options[i].toString(36);
		}else{
			optTxt += options[i] ? "1" : "0";
		}
	}
	window.localStorage["mine23Opt"] = optTxt;
};

(function(){
	let buttonList = [];
	let knobHTML = "<div class=\"switch-knob\"></div>"
	let initButton = function(id, f){
		let b = { state:false, el:document.getElementById("switch-" + id), name:id, func:f };
		b.el.innerHTML = knobHTML;
		b.el.onclick = function(){
			if(b.state){
				b.state = false;
				b.el.className = "switch-off-x";
			}else{
				b.state = true;
				b.el.className = "switch-on-x";
			}
			b.func(b.state);
		}
		buttonList.push(b);
	};

	let toggleOffset = function(b){
		for(let i = 1; i <= 31; i++){
			let e = document.getElementById("dayButton_" + i);
			if(e == null) continue;
			e.innerText = "" + (i + (b ? 0 : 37));

		}
	};
	noSwitchAnimation = function(){
		for(let x of buttonList){
			if(x.state){
				x.el.className = "switch-on";
			}else{
				x.el.className = "switch-off";
			}
		}
	};
	initButton("inv-mobile",
		function(b){
			options.invertMobile = b;
			setOptions();
			updateMobileMode();
			toggleIndicator();
		});
	initButton("disable-shovel",
		function(b){
			options.disableShovel = b;
			setOptions();
			updateMobileMode();
			toggleIndicator();
		});
	document.getElementById("delete-my-data").onclick = function(){
		window.localStorage.removeItem("mine23Opt");
		alert("Refresh the page and your settings should be gone!");
	}


	if("mine23Opt" in window.localStorage){
		let data = window.localStorage["mine23Opt"].split("|");
		// data[0] just indicates the version
		let settingStr = data[1];
		for(let i = 0; i < Math.min(settingStr.length, optionOrder.length); i++){
			options[optionOrder[i]] = (settingStr[i] == "1");
		}
	}


	for(b of buttonList){
		//console.log(b);
		if((b.name == "inv-mobile") && options.invertMobile){
			b.state = true;
		}
		if((b.name == "disable-shovel") && options.disableShovel){
			b.state = true;
			toggleIndicator();
		}
	}
	noSwitchAnimation();
	updateMobileMode();

})();
