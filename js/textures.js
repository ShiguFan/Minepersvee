var Textures = {
	fnct: {
		// Functions for loading textures
		load: null,
	},
	invalid : null,
	template : {
		number : [],
		root : {},
	},
	background : {
		clear : null,
		questionmark : null,
		mine : {},
		explodedMine : {},
		number : [],
		numberGrayscale : [],
		clearGrayscale : null,
		numberColorcharge : [],
		getColorCharge: null,
		fractions : {},
		starter: null,
	},
	closed : {
		clear : null,
		flags : {},
		finalFlags : {},
		wrongFlags : {},
		starter : null,
	},
	entities : {
		sheep : null,
		shoop : null,
		rat: null,
		cheese: null,
		dog: null,
		ball: null,
		horse: null,
		projectile: [],
		obstacle: null,
	},
	edit : {
		select: null,
		oob : null,
		count1: null,
		countR: null,
		countG: null,
		countB: null,
		eye: null,
	},
	list : [],
};

(function(){
	// Base Path where all resources are located
	const basePath = "images/";
	// Load an image and reserve a task for the time
	// it might take to load the image
	// onLoad will only be executed if the image
	// loads successfully
	const loadTexture = function(src, onLoad){
		initSchedule.claim();
		let img = new Image();
		Textures.list.push(src);
		let path = basePath + src;
		img.onerror = function(){
			console.log("Could not load:" + path);
			initSchedule.finish();
		};
		img.onload = function(){
			if(onLoad) onLoad();
			initSchedule.finish();
		};
		let b64Key = src.replace(".png", "");
		if(b64Key in b64){
			img.src = b64.prefix + b64[b64Key].replaceAll("&", "Y!f8/9h").replaceAll("_", "I$CQkWg2$B").replaceAll("%", "AA").replaceAll("$", "AAA").replaceAll("!", "AAAA");
		}else{
			img.src = path;
		}
		return img;
	};
	// Create all textures
	Textures.fnct.load = loadTexture;
	Textures.invalid = loadTexture("No_Image.png", null);
	Textures.background.clear = loadTexture("Ground.png", null);
	Textures.background.questionmark = loadTexture("questionmark.png", null);

	Textures.closed.clear = loadTexture("Closed.png", null);
	Textures.closed.starter = loadTexture("Starter.png", null);
	Textures.background.starter = loadTexture("Starter_Open.png", null);

	for(let s of ["R", "RX", "G", "GX", "B", "BX"]){
		Textures.closed.flags[s] = loadTexture("Flag_" + s + ".png", null);	
		Textures.closed.finalFlags[s] = loadTexture("Flag_" + s + "_Final.png", null);
		Textures.closed.wrongFlags[s] = {}
		for(let t of ["0", "R", "RX", "G", "GX", "B", "BX"]){
			if(s != t){
				Textures.closed.wrongFlags[s][t] = loadTexture("Flag_Wrong_" + s + "_" + t + ".png");
			}
		}
	}
	for(let s of ["0", "0X", "R", "RX", "G", "GX", "B", "BX"]){	
		Textures.background.mine[s] = loadTexture("Mine_" + s + ".png", null);
		Textures.background.explodedMine[s] = loadTexture("ExplodedMine_" + s + ".png", null);
	}
	
	for(let n = 0; n < 28; n++){
		Textures.template.number[n] = loadTexture("template/num_" + n + ".png", null);
	}

	for(let n = 1; n < 24; n++){
		Textures.template.number[-n] = loadTexture("template/num_negative_" + n + ".png", null);
	}

	let roots = [3, 7, 12, 13, 19, 21, 27, 28, 31, 37, 39, 43, 48, 52, 57, 61, 63, 67, 73, 75, 76, 79, 84, 91, 93, 97, 103, 108, 109, 111, 112, 117, 124, 127, 129, 133, 139, 147, 148, 151, 156, 157, 163, 171, 172, 175, 181, 183, 189, 192, 193, 199, 201, 208, 211, 217, 219, 223, 228, 229, 237, 241, 247, 252, 259, 268, 273, 279, 291, 292, 301, 307, 313, 327, 336, 343, 349, 364, 381, 387, 403, 421, 444, 463, 507];

	for(let r of roots){
		Textures.template.root[r] = loadTexture("template/num_sqrt_" + r + ".png", null);
	}

	Textures.background.getColorCharge = (r, g, b) => {
		if((r == 0) && (g == 0) && (b == 0)) return Textures.background.clear;
		let m = Math.min(r, g, b);
		r -= m;
		g -= m;
		b -= m;
		if(r + g + b > 24) return Textures.invalid;
		let x = r - g;
		let y = b - g;
		return Textures.background.numberColorcharge[x][y];
	};
	Textures.background.clearGrayscale = loadTexture("grayscale/Ground.png", null);

	Textures.entities.sheep = loadTexture("entities/Sheep.png", null);
	Textures.entities.shoop = loadTexture("entities/Shoop.png", null);
	Textures.entities.rat = loadTexture("entities/Rat.png", null);
	Textures.entities.cheese = loadTexture("entities/Cheese.png", null);
	Textures.entities.dog = loadTexture("entities/Dog.png", null);
	Textures.entities.ball = loadTexture("entities/Ball.png", null);
	Textures.entities.horse = loadTexture("entities/Horse.png", null);
	Textures.entities.projectile[0] = loadTexture("entities/Projectile_Right.png", null);
	Textures.entities.projectile[1] = loadTexture("entities/Projectile_Down.png", null);
	Textures.entities.projectile[2] = loadTexture("entities/Projectile_Left.png", null);
	Textures.entities.projectile[3] = loadTexture("entities/Projectile_Up.png", null);
	Textures.entities.obstacle = loadTexture("entities/Obstacle.png", null);

	Textures.background.fractions.epsilon = loadTexture("numbers/num_epsilon.png", null);
	Textures.background.fractions.frac_1_8 = loadTexture("numbers/num_frac_1_8.png", null);
	Textures.background.fractions.frac_1_4 = loadTexture("numbers/num_frac_1_4.png", null);
	Textures.background.fractions.frac_1_3 = loadTexture("numbers/num_frac_1_3.png", null);
	Textures.background.fractions.frac_1_2 = loadTexture("numbers/num_frac_1_2.png", null);
	Textures.background.fractions.frac_2_3 = loadTexture("numbers/num_frac_2_3.png", null);
	Textures.background.fractions.frac_3_4 = loadTexture("numbers/num_frac_3_4.png", null);
	Textures.background.fractions.frac_7_8 = loadTexture("numbers/num_frac_7_8.png", null);

	Textures.edit.select = loadTexture("Selected.png", null);
	Textures.edit.oob = loadTexture("OOB.png", null);
	Textures.edit.count1 = loadTexture("count/Count_1.png", null);
	Textures.edit.countR = loadTexture("count/Count_R.png", null);
	Textures.edit.countG = loadTexture("count/Count_G.png", null);
	Textures.edit.countB = loadTexture("count/Count_B.png", null);
	Textures.edit.eye = loadTexture("count/Ground_Eye.png", null);
})();
