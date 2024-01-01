var compress = null;
var decompress = null;

/*
* The board is stored as a byte array
* 0 - NoTile
* 1..255 - Tile with relative mine probability (n - 1)/254
*
* The board is compressed as a list of either numbers or as repeat instructions of a previous range.
* Those are then compressed through a Huffman coding, thus we first need to read the huffman tree
* before we keep reading instructions from it until we have read the needed amount of tiles.
* The bit array is padded with zeros at the end and converted to Base64
*/

(function(){
	let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	let b64Lookup = {};
	for(let i = 0; i < 64; i++){
		b64Lookup[b64[i]] = i;
	}
	//console.log(b64Lookup);

	decompress = function(str, x, y){
		let bits = [];
		for(let c of str){
			let n = b64Lookup[c];
			for(let b = 32; b >= 1; b /= 2){
				bits.push(((b & n) != 0) ? 1 : 0);
			}
		}
		//console.log(bits.join(""));
		let pos = 0;
		let get = function(){
			if(pos >= bits.length) return 0;
			let b = bits[pos];
			pos += 1
			return b;
		};
		let parseByte = function(){
			return get() * 128 + get() * 64 + get() * 32 + get() * 16 + get() * 8 + get() * 4 + get() * 2 + get();
		};
		let parseTree = null;
		parseTree = function(){
			if(get() == 1){
				return ["b", parseTree(), parseTree()];
			} else if(get() == 1){
				return ["r", parseByte() + 1, parseByte() + 3];
			} else {
				return ["n", parseByte()];
			}
		};
		var tree = parseTree();
		//console.log(tree);
		var boardLinear = [];
		while(boardLinear.length < x * y){
			i = tree;
			while(i[0] == "b"){
				i = i[1 + get()];
			}
			//console.log(i);
			if(i[0] == "n"){
				boardLinear.push(i[1]);
			}else{
				for(let j = 0; j < i[2]; j++){
					boardLinear.push(boardLinear[boardLinear.length - i[1]]);
				}
			}
		}
		//console.log(boardLinear);
		let board = [];
		for(let i = 0; i < x; i++){
			board[i] = [];
			for(let j = 0; j < y; j++){
				board[i][j] = boardLinear[j + i * y];
			}
		}
		//console.log(board);
		return board;
	};

	let codeSort = function(codes){
		codes.sort((a, b) => {return b[b.length - 1] - a[a.length - 1]});
	};

	compress = function(data){
		let l = data.length;
		let pos = 0;
		let sym = [];
		while(pos < l){
			let j = Math.max(0, pos - 256);
			let maxLen = 2;
			let maxStart = 0;
			while(j < pos){
				let c = 0;
				while((pos + c < l) && (data[pos + c] == data[j + c]) && (c < 258)) c++;
				if(c > maxLen){
					maxLen = c;
					maxStart = j;
				}
				j++;
			}
			if(maxLen >= 3){
				sym.push("r" + (pos - maxStart - 1) + "," + (maxLen - 3))
				pos += maxLen;
			}else{
				sym.push("" + data[pos]);
				pos++;
			}
		}
		let frequencies = {};
		for(let s of sym){
			if(s in frequencies){
				frequencies[s]++;
			}else{
				frequencies[s] = 1;
			}
		}
		let codes = [];
		for(let k in frequencies){
			codes.push(["l", k, frequencies[k]]);
		}
		codeSort(codes);
		while(codes.length > 1){
			let a = codes.pop();
			let b = codes.pop();
			codes.push(["b", a, b, a[a.length - 1] + b[b.length - 1]]);
			codeSort(codes);
		}
		res = [];
		let addNum = (n) => {
			n = parseInt(n);
			let i = 128;
			while(i > 0){
				res.push(((n & i) != 0) ? 1 : 0);
				i >>= 1;
			}
		};
		let createCodes = (code, prefix) => {
			if (code[0] == "b"){
				res.push(1);
				createCodes(code[1], prefix + "0");
				createCodes(code[2], prefix + "1");
			}else{
				res.push(0);
				let s = code[1];
				frequencies[s] = prefix.split("");
				if(s[0] == "r"){
					res.push(1);
					let t = s.substr(1).split(",");
					addNum(t[0]);
					addNum(t[1]);
				}else{
					res.push(0);
					addNum(s);
				}
			}
		};
		createCodes(codes[0], "");
		//console.log(codes[0]);
		//console.log(res.join(""));
		for(let s of sym){
			for(let c of frequencies[s]){
				res.push(+c);
			}
		}
		while((res.length % 6) != 0){
			res.push(0);
		}
		l = res.length / 6;
		let res64 = [];
		for(let i = 0; i < l; i++){
			let n = 0;
			for(let j = 0; j < 6; j++){
				n *= 2;
				n += res[i * 6 + j];
			}
			res64.push(b64[n]);
		}
		//console.log(sym);
		//console.log(res.join(""));
		return res64.join("");
	};
})();
