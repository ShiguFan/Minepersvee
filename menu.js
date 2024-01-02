/*
 * Deal with size changes, mainly the top bar
 * but there might be page specific ones too
*/

var addResizeEvent = null;
var addOnLoadEvent = null;

(function(){
	// Build Menu
	let headTable = document.getElementById("topbarDyn");

	let menuStructure = {
		"dd1" : {
			"buttonText" : "Minesveeper",
			"content" : [
				//["Periodle", "https://heptaveegesimal.com/periodle/", true],
				//["Minesveeper", "https://heptaveegesimal.com/2023/advent-calendar", true],
				["0", "https://heptaveegesimal.com/2022/minesveeper-zero", true],
				["1 - 24", "https://heptaveegesimal.com/2018/advent-calendar", true],
				["25 - 31", "https://heptaveegesimal.com/2018/advent-calendar/bonus-days.php", true],
				["32", "https://heptaveegesimal.com/2019/carbonnanosweeper/", true],
				["33 - 35", "https://heptaveegesimal.com/2019/graphsveeper/", true],
				["38 - 61", "https://heptaveegesimal.com/2023/advent-calendar/", true],
				["Discord Server", "https://discord.com/invite/ZqEXjqB", true],
				//["VVOVOV", "https://heptaveegesimal.com/vvovov.html", true],
				//["OpenCYOA", "https://heptaveegesimal.com/opencyoa/", true],
			]
		},
	};

	for(let dd in menuStructure){
		let td = document.createElement("td");
		let struct = menuStructure[dd];
		td.style = "padding-right: 3px;";
		let html = "<div class=\"dropdown\" id=\"tbarcont-"+dd+"\"><button class=\"dropbtn\">" + struct.buttonText + "</button><div class=\"dropdown-content\">"
		for(let line of struct.content){
			html += "<a class=\"" + (line[2] ? "menu" : "sublink") + "\"";
			if(line[1] != null) html += " href=\"" + line[1] + "\""
			html += ">" + line[0] + "</a>";
		}
		html += "</div></div>"
		td.innerHTML = html;
		headTable.appendChild(td);
	}

	let resizeEvents = [];
	addResizeEvent = function(f){
		resizeEvents.push(f);
	};
	let onLoadEvents = [];
	addOnLoadEvent = function(f){
		onLoadEvents.push(f);
	};
	let adjustSize = function(){
		let width = window.innerWidth;
		let height = window.innerHeight;
		for(let e of resizeEvents){
			e(width, height);
		};
	};
	window.onload = function(){
		adjustSize();
		for(let e of onLoadEvents){
			e();
		};
	};
	window.addEventListener("resize", adjustSize);
	// Print the size
	addResizeEvent(
		function(width, height){
			console.log("width: " + width + "   height: " + height);
		});
	let topBars = {
		"topbar-1" : { "object" : null, "build" : true, },
		"topbar-2" : { "object" : null, "build" : false, },
		"topbar-3" : { "object" : null, "build" : false, },
	};
	let activeBar = "topbar-1";
	for(let i in topBars){
		topBars[i]["object"] = document.getElementById(i);
	}
	let topBarContent = {};
	for(s of ["home", "dd1", "dd2", "about"]){
		let tBarObj = document.getElementById("tbarcont-" + s);
		topBarContent[s] = (tBarObj.classList.contains("dropdown") ? "<div class=\"dropdown\">" : "<div>") + tBarObj.innerHTML.replace(/[\t\n]/g,"") + "</div>";
	}
	//console.log(topBarContent);
	let tableHTML = function(content, fullWidth, allignRight){
		let style = "";
		if(fullWidth) style += "width:100%;";
		if(allignRight) style += "float: right; display: inline-block;";
		let r = "<table style=\"" + style + "\">";
		for(let row = 0; row < content.length; row++){
			r += "<tr height=\"50px\">";
			let rowContent = content[row];
			for(let column = 0; column < rowContent.length; column++){
				r += (column == (rowContent.length - 1)) ? "<td>" : "<td style=\"padding-right: 3px\">"
				r += rowContent[column];
			}
		}
		r += "</table>"
		return r;
	};
	let getBarHTML = function(version){
		if(version == "topbar-2"){
			return tableHTML([
					[tableHTML([[topBarContent["home"], topBarContent["dd1"]]], false, false)],
					[tableHTML([[topBarContent["dd2"], topBarContent["about"]]], false, false)]
				],true, false);
		/*}else if(version == "topbar-3"){
			return tableHTML([
					[tableHTML([[topBarContent["home"], topBarContent["dd1"], topBarContent["dd2"]]], false, false)],
					[tableHTML([[topBarContent["dd3"], topBarContent["about"]]], false, true)],
				],true, false);
		}else if(version == "topbar-4"){
			return tableHTML([
					[tableHTML([[topBarContent["home"], topBarContent["dd1"]]], false, false)],
					[tableHTML([[topBarContent["dd2"], topBarContent["dd3"]]], false, false)],
					[tableHTML([[topBarContent["about"]]], false, true)],
				],true, false);*/
		}else if(version == "topbar-3"){
			return tableHTML([
					[tableHTML([[topBarContent["home"]]], false, false)],
					[tableHTML([[topBarContent["dd1"]]], false, false)],
					[tableHTML([[topBarContent["dd2"]]], false, false)],
					[tableHTML([[topBarContent["about"]]], false, false)],
				],true, false);
		}else{
			console.log(version + " is not a known state for the top bar!");
			return "This website is unable to create a fitting header for this screen width!";
		}
	};
	let setTopBar = function(version){
		if(activeBar == version) return;
		// Check if the new has not yet been created
		if(!topBars[version]["build"]){
			topBars[version]["object"].innerHTML = getBarHTML(version);
			topBars[version]["build"] = true;
		}
		// Display the new one
		topBars[activeBar]["object"].classList.add("hide");
		topBars[version]["object"].classList.remove("hide");
		activeBar = version;
	};
	addResizeEvent(
		function(width, height){
			if(width > 400){
				setTopBar("topbar-1");
			}else if(width > 210){
				setTopBar("topbar-2");
			}else{
				setTopBar("topbar-3");
			}
		});
})();
