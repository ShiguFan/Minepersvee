var initSchedule = null;

/* =========================================================================
*                     A NOTE TO ALL CODE DIGGERS
*  -------------------------------------------------------------------------
*  I am perfectly fine with you going through the code and I will also
*  upload the code for this once it's over. However, for the time that this
*  is going on I would like to request to keep any spoilers you find out
*  about in this way out of the Discord discussion. I am fine with educated
*  guesses about future days utilizing Information already given through the
*  publicly available days. But I would appreciate if you didn't go:
*
*  I looked at the code and saw that Day 60 is called "Blackjack and Hookers"
*
*  Thank You!            -Joshua
*/

addOnLoadEvent(() => {
	// Base Path where all scripts are located
	const basePath = "js/";
	// List of all scripts and their dependencies
	let scriptList = {
		pageElements : {
			name: "pageElements.js",
			dependencies: [],
		},
		mobileMode : {
			name: "mobileMode.js",
			dependencies: [],
		},
		compression : {
			name: "compression.js",
			dependencies: [],
		},
		coreLogic : {
			name: "coreLogic.js",
			dependencies: [],
		},
		b64: {
			name: "b64.js",
			dependencies: [],
		},
		/*loadStatus: {
			name: "loadStatus.js",
			dependencies: ["pageElements",],
		},*/
		settings : {
			name : "settings.js",
			dependencies: ["mobileMode"],
		},
		textures: {
			name: "textures.js",
			dependencies: ["b64"],
		},
		maketextures : {
			name: "makeTextures.js",
			dependencies: ["textures"],
		},
		days : {
			name: "days.js",
			dependencies: ["compression", "textures"]
		},
		board : {
			name : "board.js",
			dependencies: ["days", "coreLogic"],
		},
		entities : {
			name : "entities.js",
			dependencies: ["board", "textures"],
		},
		render : {
			name : "render.js",
			dependencies: ["board", "textures", "entities"],
		},
		/*imgtest : {
			name : "imgtest.js",
			dependencies: ["render"],
		},*/
	};

	// Run this script last to start the game
	// Depends on everything else being done
	let startScript = "minesveeperMain.js";
	// = = = = = = = = = = = = = = = = = = = = = = = = = =
	// Load the day specific scripts
	for(let i = 1; i <= 1; i++){
		scriptList["day_" + i] = {
			name : "days/day_" + i + ".js",
			dependencies: ["days"],
		};
	}
	for(let i = 101; i <= 100; i++){
		scriptList["day_" + i] = {
			name : "days/day_" + i + ".js",
			dependencies: ["days"],
		};
	}
	// = = = = = = = = = = = = = = = = = = = = = = = = = =
	const loadMetadata = document.getElementById("loadMetadata");
	const fileVersion = loadMetadata.getAttribute("version");
	const customGame = loadMetadata.getAttribute("custom") + "";
	// = = = = = = = = = = = = = = = = = = = = = = = = = =
	if((customGame.length == 6) && ("day_24" in scriptList)){
		scriptList["custom"] = {
			name : "custom/setting_" + customGame + ".js",
			dependencies: ["day_24"],
		};
	}
	// = = = = = = = = = = = = = = = = = = = = = = = = = =
	for(let key in scriptList){
		scriptList[key].key = key;
	}
	// Count how many scripts there are to load
	let orderedScripts = [];
	let toLoad = 0;
	for(let i in scriptList){
		toLoad++;
		scriptList[i].loadState = 0;
	}
	// Go through all scripts
	// Recursively go thorugh there dependencies until the script can be loaded
	const loadRecursive = (i) => {
		switch(scriptList[i].loadState){
			case 0:
				// Check if this can be loaded
				// Mark that this script is about to be loaded
				let script_i = scriptList[i];
				script_i.loadState = 2;
				let script = scriptList[i];
				for(let j in script_i.dependencies){
					if(scriptList[script_i.dependencies[j]] === undefined){
						console.log("Script " + i + " depends on " + script_i.dependencies[j] + " which does not exist!");
						return -1;
					}
					let retVal = loadRecursive(script_i.dependencies[j]);
					if(retVal === -1) return -1;
					if(retVal !== 0){
						if(script_i.loadState == 3){
							console.log("Cyclic dependency: " + i + retVal);
							return -1;
						}else{
							return " -> " + i + retVal;
						}
					}
				}
				// Script can be loaded at this point
				orderedScripts.push(script_i);
				// Mark as loaded
				scriptList[i].loadState = 1;
				return 0;
			case 1:
				return 0;
			case 2:
				// Cyclic dependency
				// Backwards exit condition
				scriptList[i].loadState = 3;
				return " -> " + i; 
			case 3:
				return -1;
		}
	}
	// Make sure that no matter how the browser
	// sorts scripts the load status gets added
	// as soon as possible
	/*if(loadRecursive('loadStatus') !== 0){
		console.log("Could not load all scripts!");
		return;
	}*/
	// Go through all scripts
	for(let i in scriptList){
		if(loadRecursive(i) !== 0){
			console.log("Could not load all scripts!");
			return;
		}
	}
	// Use this to make sure scripts can load images
	initSchedule = {
		name: null,
		completed: 0,
		tasks: 0,
		claim: function(){
			this.tasks++;
		},
		finish: function(){
			this.tasks--;
			this.completed++;
			if(this.tasks == 0){ this.next(); };
		},
		next: () => {},
	};
	// Loads a script
	const headElement = document.getElementsByTagName('head')[0];
	const addScript = (scriptName, loadNext) => {
		let newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = basePath + scriptName + "?v=" + fileVersion;
		newScript.onload = loadNext;
		newScript.onerror = function(){console.log(scriptName + " could not be loaded!");};
		headElement.appendChild(newScript);
	};

	let position = 0;
	let loadLowest = () => {
		initSchedule.claim();
		if(position == orderedScripts.length){
			initSchedule.next = () => { addScript(startScript, () => {initSchedule = undefined;}); };
			initSchedule.finish();
			return;
		}
		let start = position;
		let stop = position + 1;
		for(let i = stop; i < orderedScripts.length; i++){
			let loadable = true;
			for(let d of orderedScripts[i].dependencies){
				for(let j = start; j < i; j++){
					if(orderedScripts[j].key == d){
						loadable = false;
						break;
					}
				}
				if(!loadable) break;
			}
			if(loadable){
				stop = i + 1;
				//console.log("could load: " + orderedScripts[i].name);
			}else{
				break;
			}
		}
		//console.log(start + " to " + stop);
		for(let i = start; i < stop; i++){
			initSchedule.claim();
			initSchedule.name = orderedScripts[i];
			addScript(orderedScripts[i].name, ()=>{initSchedule.finish();});
		}
		position = stop;
		initSchedule.finish();
	};
	
	// After loading some script check which we can load next
	initSchedule.next = loadLowest;

	// Start with loading the first script
	loadLowest();

	// Nothing should happen after this!
	// Anything that should happen after needs
	// to be specified as the final onload function

});
