(function(){
	let renderCanvas = document.createElement("canvas");
	renderCanvas.width = 16;
	renderCanvas.height = 16;
	let render = renderCanvas.getContext('2d');
	
	let canvasToImg = function(){
		let dataURL = renderCanvas.toDataURL();
		initSchedule.claim();
		let img = new Image();
		img.onerror = function(){
			initSchedule.finish();
		};
		img.onload = function(){
			initSchedule.finish();
		};
		img.src = dataURL;
		return img;
	};

	let drawOnto = function(base, num){
		render.clearRect(0, 0, 16, 16);
		render.drawImage(base, 0, 0);
		render.drawImage(num, 0, 0);
		return canvasToImg();
	};

	let drawOntoRecolor = function(base, num, r, g, b){
		render.clearRect(0, 0, 16, 16);
		render.drawImage(base, 0, 0);
		let dataBG = render.getImageData(0,0,16,16);
		render.clearRect(0, 0, 16, 16);
		render.drawImage(num, 0, 0);
		let dataNum = render.getImageData(0,0,16,16);
		let newData = render.createImageData(16, 16);
		for(let i = 0; i < 1024; i += 4){
			if(dataNum.data[i + 3] > 128){
				newData.data[i] = r;
				newData.data[i + 1] = g;
				newData.data[i + 2] = b;
			}else{
				newData.data[i] = dataBG.data[i];
				newData.data[i + 1] = dataBG.data[i + 1];
				newData.data[i + 2] = dataBG.data[i + 2];
			}
			newData.data[i + 3] = 255;
		}
		render.putImageData(newData, 0, 0);
		return canvasToImg();
	};

	let gamma = 2.5;
	let gammaInv = 1.0 / gamma;

	let mixColor = (n) => { return [Math.pow(n, gammaInv), Math.pow(1 - n, gammaInv)]; }
	let angleToColor = function(angle){
		let m = mixColor((angle % 120) / 120);
		m[0] = Math.round(m[0] * 255);
		m[1] = Math.round(m[1] * 255);
		if(angle < 120){
			return [m[1], m[0], 0];
		}else if(angle < 240){
			return [0, m[1], m[0]];
		}else{
			return [m[0], 0, m[1]];
		}
	};

	for(let n in Textures.template.number){
		Textures.background.number[n] = drawOnto(Textures.background.clear, Textures.template.number[n]);
		Textures.background.numberGrayscale[n] = drawOntoRecolor(Textures.background.clearGrayscale, Textures.template.number[n], 0x68, 0x68, 0x68);
	}

	const yx = -0.5;
	const yy = 0.5 * Math.sqrt(3);
	for(let x = -24; x < 25; x++){
		Textures.background.numberColorcharge[x] = [];
		for(let y = -24; y < 25; y++){
			if((x - 2 * y <= 24) && (y - 2 * x <= 24) && (x + y <= 24)){
				let x1 = x + y * yx;
				let y1 = y * yy;

				let rr = Math.round(x1 * x1 + y1 * y1);
				let ang = -Math.floor(Math.atan2(y1, x1) * 180 / Math.PI + 0.0001);
				if(ang < 0) ang += 360;
				let r = Math.sqrt(rr);
				let tex = null;
				if(r == Math.round(r)){
					tex = Textures.template.number[r];
				}else{
					tex = Textures.template.root[rr];
				}
				let color = angleToColor(ang);
				if(r == 0) color = [0x33, 0x33, 0x33];
				Textures.background.numberColorcharge[x][y] = drawOntoRecolor(Textures.background.clear, tex, color[0], color[1], color[2]);
				//console.log(name);0
				//Textures.background.numberColorcharge[x][y] = loadTexture(name, null);
			}
		}
	}
})();
