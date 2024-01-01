var makeDesc45 = null;
var makeDesc46 = null;
(function(){
	let testCanvas = null;
	let testContext = null;
	let baseOpen = function(){
		setMenu(1);
		pageSections.descDay.innerHTML = "<canvas id=\"test_canvas\" width=\"1000\" height=\"1000\" style=\"border:1px solid #000000;\"></canvas>";
		testCanvas = document.getElementById("test_canvas");
		testCanvas.oncontextmenu = () => false;
		testContext = testCanvas.getContext("2d");
	};
	let offsetX = 0;
	let offsetY = 0;
	let unitLength = 40;
	let drawTile = function(x, y, texture){
		x = Math.round(x + offsetX) - 8;
		y = Math.round(y + offsetY) - 8;
		testContext.drawImage(texture, x, y);
		testContext.fillStyle = "black";
		testContext.fillRect(x - 1, y - 1, 1, 18);
		testContext.fillRect(x - 1, y - 1, 18, 1);
		testContext.fillRect(x + 16, y - 1, 1, 18);
		testContext.fillRect(x - 1, y + 16, 18, 1);
	};
	let drawLine = function(x1, y1, x2, y2, color){
		testContext.strokeStyle = color;
		testContext.beginPath();
		testContext.moveTo(Math.round(x1 + offsetX), Math.round(y1 + offsetY) + 0.5);
		testContext.lineTo(Math.round(x2 + offsetX), Math.round(y2 + offsetY) + 0.5);
		testContext.stroke();
	};
	makeDesc45 = function(){
		baseOpen();
		offsetX = 500;
		offsetY = 20;
		for(let g = 0; g <= 8; g++){
			for(let b = 0; b <= 8; b++){
				if(g + b > 8) continue;
				if(g > 0){
					drawLine((b - g) * Math.sqrt(3) * 0.5 * unitLength, (b + g) * 0.5 * unitLength, (b - g + 1) * Math.sqrt(3) * 0.5 * unitLength, (b + g - 1) * 0.5 * unitLength, "#00ff00");
				}
				if(b > 0){
					drawLine((b - g) * Math.sqrt(3) * 0.5 * unitLength, (b + g) * 0.5 * unitLength, (b - g - 1) * Math.sqrt(3) * 0.5 * unitLength, (b + g - 1) * 0.5 * unitLength, "#0000ff");
				}
			}
		}
		for(let g = 0; g <= 8; g++){
			for(let b = 0; b <= 8; b++){
				if(g + b > 8) continue;
				let x = (b - g) * Math.sqrt(3) * 0.5 * unitLength;
				let y = (b + g) * 0.5 * unitLength;
				if(g == 0 & b == 0){
					drawTile(x, y, Textures.background.clear);
				}else{
					drawTile(x, y, Textures.background.getColorCharge(0, g, b));
				}
			}
		}
	};
	makeDesc46 = function(){
		let n = 4;
		baseOpen();
		offsetX = 500;
		offsetY = 500;
		for(let x = -n; x <= n; x++){
			for(let y = -n; y <= n; y++){
				let r = x;
				let g = y;
				let b = 0;
				if(r < 0){
					b -= r;
					g -= r;
					r = 0;
				}
				if(g < 0){
					b -= g;
					r -= g;
					g = 0;
				}
				if(r > n) continue;
				if(g > n) continue;
				if(b > n) continue;
				if((g < n && b < n) || r > 0) drawLine((r - 0.5 * (b + g)) * unitLength, (b - g) * Math.sqrt(3) * 0.5 * unitLength, (r - 1 - 0.5 * (b + g)) * unitLength, (b - g) * Math.sqrt(3) * 0.5 * unitLength, "#ff0000");
				if((b < n && r < n) || g > 0) drawLine((r - 0.5 * (b + g)) * unitLength, (b - g) * Math.sqrt(3) * 0.5 * unitLength, (r - 0.5 * (b + g - 1)) * unitLength, (b - g + 1) * Math.sqrt(3) * 0.5 * unitLength, "#00ff00");
				if((g < n && r < n) || b > 0) drawLine((r - 0.5 * (b + g)) * unitLength, (b - g) * Math.sqrt(3) * 0.5 * unitLength, (r - 0.5 * (b + g - 1)) * unitLength, (b - g - 1) * Math.sqrt(3) * 0.5 * unitLength, "#0000ff");
				//if(r + g + b > n) continue;
				//if(g + b < (n-1) || r > 0) drawLine((r - 0.5 * (b + g)) * unitLength, (b - g) * Math.sqrt(3) * 0.5 * unitLength, (r - 1 - 0.5 * (b + g)) * unitLength, (b - g) * Math.sqrt(3) * 0.5 * unitLength, "#ff0000");
				//if(r + b < (n-1) || g > 0) drawLine((r - 0.5 * (b + g)) * unitLength, (b - g) * Math.sqrt(3) * 0.5 * unitLength, (r - 0.5 * (b + g - 1)) * unitLength, (b - g + 1) * Math.sqrt(3) * 0.5 * unitLength, "#00ff00");
				//if(g + r < (n-1) || b > 0) drawLine((r - 0.5 * (b + g)) * unitLength, (b - g) * Math.sqrt(3) * 0.5 * unitLength, (r - 0.5 * (b + g - 1)) * unitLength, (b - g - 1) * Math.sqrt(3) * 0.5 * unitLength, "#0000ff");
			}
		}
		for(let x = -n; x <= n; x++){
			for(let y = -n; y <= n; y++){
				let r = x;
				let g = y;
				let b = 0;
				if(r < 0){
					b -= r;
					g -= r;
					r = 0;
				}
				if(g < 0){
					b -= g;
					r -= g;
					g = 0;
				}
				if(r > n) continue;
				if(g > n) continue;
				if(b > n) continue;
				//if(r + g + b > n) continue;
				let x_ = (r - 0.5 * (b + g)) * unitLength;
				let y_ = (b - g) * Math.sqrt(3) * 0.5 * unitLength;
				if(r + g + b == 0){
					r = 1;
					g = 1;
					b = 1;
				}
				drawTile(x_, y_, Textures.background.getColorCharge(r, g, b));
			}
		}
	};
	makeDesc49 = function(){
		baseOpen();
		offsetX = 500;
		offsetY = 20;
		for(let g = 0; g <= 6; g++){
			for(let b = 0; b <= 6; b++){
				if(g > 0){
					drawLine((b - g) * Math.sqrt(3) * 0.5 * unitLength, (b + g) * 0.5 * unitLength, (b - g + 1) * Math.sqrt(3) * 0.5 * unitLength, (b + g - 1) * 0.5 * unitLength, "#ff0000");
				}
				if(b > 0){
					drawLine((b - g) * Math.sqrt(3) * 0.5 * unitLength, (b + g) * 0.5 * unitLength, (b - g - 1) * Math.sqrt(3) * 0.5 * unitLength, (b + g - 1) * 0.5 * unitLength, "#0000ff");
				}
			}
		}
		for(let r = 0; r <= 6; r++){
			for(let b = 0; b <= 6; b++){
				let x = (b - r) * Math.sqrt(3) * 0.5 * unitLength;
				let y = (b + r) * 0.5 * unitLength;
				if(r == 0 & b == 0){
					drawTile(x, y, Textures.background.clear);
				}else{
					drawTile(x, y, Textures.background.getColorCharge(r, 0, b));
				}
			}
		}
	};
})();
