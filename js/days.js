var days = []

var surroundings = {};

registerDay = function(i, setting){
	days[i] = setting;	
};

let regionAnd = function(a, b){
	let res = [];
	for(let a_ of a){
		for(let b_ of b){
			if(a_[0] == b_[0] && a_[1] == b_[1]){
				res.push(a_);
				break;
			}
		}
	}
	return res;
};

let regionOr = function(a, b){
	let res = [];
	let append = function(c){
		for(let c_ of c){
			let contained = false;
			for(let r of res){
				if(r[0] == c_[0] && r[1] == c_[1]){
					contained = true;
					break;
				}
			}
			if(!contained) res.push(c_);
		}
	};
	append(a);
	append(b);
	return res;
};

let regionInvert = function(a){
	let res = [];
	for(let a_ of a){
		res.push([-a_[0], -a_[1]]);
	}
	return res;
};

var day59Fnct = () => 59;
var day61Fnct = null;
var day68Fnct = null;

(function(){
	for(let i = 1; i <= 1; i++) days[i] = null;
	for(let i = 101; i <= 101; i++) days[i] = null;

	let smallDefault = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
	let largeDefault = [
		[-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2],
		[-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2],
		[0, -2], [0, -1], [0, 1], [0, 2],
		[1, -2], [1, -1], [1, 0], [1, 1], [1, 2],
		[2, -2], [2, -1], [2, 0], [2, 1], [2, 2],
	];
	let knight = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
	surroundings["default"] = {
		small: smallDefault,
		large: largeDefault,
	};
	surroundings["knight"] = {
		small: knight,
		large: largeDefault,
	};
})();
