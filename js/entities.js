var Entities = {
	active: [],
	clear: null,
	spawn: null,
	onClick: null,
	draw: null,
	events : {
		voidClickR : 1,
		flagOrUnflag : 2,
		voidClickL : 3,
		digOrChord : 4,
		startGame : 5,
		timePassed : 6,
	},
	find: null,
};

let activeEntities = [];

(function(){

	let newEntity = (x_, y_) => { return {
		x: x_,
		y: y_,
		ai: (e, i, j, ev) => {},
		texture: Textures.invalid,
		placable: false,
		despawn: false,
		type: "?",
	}; };

	let choose = (tx, ty) => {
		if(tx == null) return 2;
		if(ty == null) return 1;
		if((tx.flag == "") ^ (ty.flag == "")) return (tx.flag == "") ? 1 : 2;
		if((tx.mine == "") ^ (ty.mine == "")) return (tx.mine == "") ? 1 : 2;
		return (Math.random() > 0.5) ? 1 : 2;
	};

	let findEntity = (typeName) => {
		for(let e of Entities.active){
			if(e.type == typeName) return e;
		}
		return null;
	};

	Entities.find = findEntity;

	let basicMove = (e, dx, dy) => {
		if(dx == 0 && dy == 0) return null;
		if(dx < 0) dx = -1;
		if(dx > 0) dx = 1;
		if(dy < 0) dy = -1;
		if(dy > 0) dy = 1;
		let t = null;
		if((dx == 0) ^ (dy == 0)){
			t = board.at(e.x + dx, e.y + dy);
			if(t == null) return null;
			e.x += dx;
			e.y += dy;
		}else{
			let t0 = board.at(e.x + dx, e.y + dy);
			if(t0 == null){
				tx = board.at(e.x + dx, e.y);
				ty = board.at(e.x, e.y + dy);
				if(tx == null && ty == null) return null;
				if(choose(tx, ty) == 1){
					t = tx;
					e.x += dx;
				}else{
					t = ty;
					e.y += dy;
				}
			}else{
				t = t0;
				e.x += dx;
				e.y += dy;
			}
		}
		return t;
	};

	let sheepAI = (e, i, j, ev) => {
		if(ev != Entities.events.digOrChord) return;
		let dog = findEntity("dog");
		if(dog != null){
			let ddx = e.x - dog.x;
			let ddy = e.y - dog.y;
			for(let dd of shape.dogEffect){
				if(ddx == dd[0] && ddy == dd[1]) return;
			}
		}
		let dx = i - e.x;
		let dy = j - e.y;
		let t = basicMove(e, dx, dy);
		if((t == null) || t.open) return;
		setFlag(e.x, e.y, "");
		t.open = true;
		if(t.surroundingMines.length != 0 || t.mine != "") return;
		openSurrounding(e.x, e.y);
		//console.log([dx, dy]);
	};
	
	let shoopAI = (e, i, j, ev) => {
		if(ev != Entities.events.digOrChord) return;
		let dog = findEntity("dog");
		if(dog != null){
			let ddx = e.x - dog.x;
			let ddy = e.y - dog.y;
			for(let dd of shape.dogEffect){
				if(ddx == dd[0] && ddy == dd[1]) return;
			}
		}
		let dx = -(i - e.x);
		let dy = -(j - e.y);
		let t = basicMove(e, dx, dy);
		if((t == null) || t.open) return;
		setFlag(e.x, e.y, "");
		t.open = true;
		if(t.surroundingMines.length != 0 || t.mine != "") return;
		openSurrounding(e.x, e.y);
		//console.log([dx, dy]);
	};
	
	let ratAI = (e, i, j, ev) => {	
		if(ev != Entities.events.digOrChord) return;
		let cheese = findEntity("cheese");
		if(cheese == null) return;
		let dx = cheese.x - e.x;
		let dy = cheese.y - e.y;
		let t = basicMove(e, dx, dy);
		if((t == null) || t.open) return;
		if(t.mine == ""){
			setFlag(e.x, e.y, "");
			t.open = true;
			if(t.surroundingMines.length != 0) return;
			openSurrounding(e.x, e.y);
		}else if(t.mine != t.flag){
			setFlag(e.x, e.y, t.mine);
		}
	};
		
	let dogEffect = (x, y, on) => {
		let t = board.at(x, y);
		for(let d of shape.dogEffect){
			t = board.at(x + d[0], y + d[1]);
			if(t == null) continue;
			t.effect = on ? "grayscale" : "";
			t.surroundingMines = accumulateSurrounding(x + d[0], y + d[1], "mine");
			t.surroundingFlags = accumulateSurrounding(x + d[0], y + d[1], "flag");
			if(on && t.surroundingMines == 0 && t.open && t.mine == "") openSurrounding(x + d[0], y + d[1]);
		}
	};

	let dogAI = (e, i, j, ev) => {	
		if(ev == Entities.events.startGame) dogEffect(e.x, e.y, true);
		if(ev != Entities.events.digOrChord) return;
		let ball = findEntity("ball");
		if(ball == null) return;
		let dx = ball.x - e.x;
		let dy = ball.y - e.y;
		if(dx == 0 && dy == 0) return;
		if(dx < 0) dx = -1;
		if(dx > 0) dx = 1;
		if(dy < 0) dy = -1;
		if(dy > 0) dy = 1;
		let t = null;
		if((dx == 0) ^ (dy == 0)){
			t = board.at(e.x + dx, e.y + dy);
			if((t == null) || !t.open) return;
		}else{
			let t0 = board.at(e.x + dx, e.y + dy);
			if((t0 != null) && t0.open){
				t = t0;
			}else{
				let tx = board.at(e.x + dx, e.y);
				let ty = board.at(e.x, e.y + dy);
				tx = (tx != null) && tx.open;
				ty = (ty != null) && ty.open;
				if(tx){
					if(ty && (Math.random() > 0.5)){
						dx = 0;	
					}else{
						dy = 0;
					}
				}else{
					if(!ty) return;
					dx = 0;
				}
			}
		}
		dogEffect(e.x, e.y, false);
		e.x += dx;
		e.y += dy;
		dogEffect(e.x, e.y, true);
	};

	let horseAI = (e, i, j, ev) => {	
		if(ev != Entities.events.digOrChord) return;
		let dx = i - e.x;
		let dy = j - e.y;
		if(dx == 0 || dy == 0 || Math.abs(dx) == Math.abs(dy)) return;
		if(Math.abs(dx) > Math.abs(dy)){
			dx = (dx > 0) ? 2 : -2;
			dy = (dy > 0) ? 1 : -1;
		}else{
			dx = (dx > 0) ? 1 : -1;
			dy = (dy > 0) ? 2 : -2;
		}
		let t0 = board.at(e.x, e.y);
		if((t0 != null) && Array.isArray(t0.surroundingMines)
			&& (t0.surroundingMines.length == 3)
			&& (t0.surroundingMines[1] == "zen")
			&& (t0.surroundingMines[2] == "carrots")){
			t0.surroundingMines[2] = "carrotsEaten";
			return;
		}
		let t = board.at(e.x + dx, e.y + dy);
		if(t == null) return;
		e.x += dx;
		e.y += dy;
		if(t.open) return;
		setFlag(e.x, e.y, "");
		t.open = true;
		if(t.surroundingMines.length != 0 || t.mine != "") return;
		openSurrounding(e.x, e.y);
	};

	let projectileAI = (e, i, j, ev) => {
		if(ev != Entities.events.digOrChord) return;
		switch(e.direction){
			case 0:
				e.x++;
				break;
			case 1:
				e.y++;
				break;
			case 2:
				e.x--;
				break;
			case 3:
				e.y--;
				break;
		}
		if((e.x < 0) || (e.x >= board.x) || (e.y < 0) || (e.y >= board.y)){
			e.despawn = true;
			return;
		}
		for(let e2 of Entities.active){
			if(e.x == e2.x && e.y == e2.y){
				switch(e2.type){
					case "sheep":
					case "shoop":
					case "rat":
					case "dog":
					case "horse":
						explode();
						break;
				}
			}
		}
	};

	let placingCycle = 0;

	Entities.clear = function(){
		placingCycle = 0;
		Entities.active = [];
	};

	Entities.spawn = function(name, x, y){
		if(typeof(name) == "object"){
			for(let n of name) {
				Entities.spawn(n, x, y);
			}
			return;
		}
		if(typeof(name) != "string") return;
		let E = newEntity(x, y);
		switch(name.toLowerCase()){
			case "sheep":	
				E.texture = Textures.entities.sheep;
				E.ai = sheepAI;
				break;
		    case "shoop":	
				E.texture = Textures.entities.shoop;
				E.ai = shoopAI;
				break;
			case "rat":
				E.texture = Textures.entities.rat;
				E.ai = ratAI;
				break;
			case "cheese":
				E.texture = Textures.entities.cheese;
				E.placable = true;
				break;
			case "dog":
				E.texture = Textures.entities.dog;
				E.ai = dogAI;
				break;
			case "ball":
				E.texture = Textures.entities.ball;
				E.placable = true;
				break;
			case "horse":
				E.texture = Textures.entities.horse;
				E.ai = horseAI;
				break;
			case "projectile":
				if(x == 0) {
					E.direction = 0;
				} else if(x == board.x - 1) {
					E.direction = 2;
				} else if(y == 0){
					E.direction = 1;
				} else {
					E.direction = 3;
				}
				E.ai = projectileAI;
				E.texture = Textures.entities.projectile[E.direction];
				break;
			default:
				console.log("Unknown Entity: " + name);
				return;
		}
		E.type = name;
		Entities.active.push(E);
	};

	Entities.onClick = function(x, y, ev){
		for(let e of Entities.active){
			e.ai(e, x, y, ev);
		}
		if(ev == Entities.events.voidClickR){
			for(let i = 0; i < Entities.active.length; i++){
				let j = (i + placingCycle) % Entities.active.length;
				let entity = Entities.active[j];
				if(entity.placable){
					entity.x = x;
					entity.y = y;
					placingCycle = (j + 1) % Entities.active.length;
					break;
				}
			}
		}
		for(let i = Entities.active.length - 1; i >= 0; i--){
			if(Entities.active[i].despawn){
				for(let j = i; j < Entities.active.length - 1; j++){
					Entities.active[j] = Entities.active[j + 1];
				}
				Entities.active.pop();
			}
		}
		if("entityEvents" in activeSettings){
			activeSettings.entityEvents(x, y, ev);
		}
	};

	Entities.draw = function(draw){
		for(let e of Entities.active){
			draw(e.texture, e.x, e.y);
		}
	};

})();
