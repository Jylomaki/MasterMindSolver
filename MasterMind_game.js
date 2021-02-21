
function randomInt(max){
	return	Math.floor(Math.random() * Math.floor(max))
}

function create_random_code(len,col_num){
	var code = [];
    for (let i = 0; i<len; i++) {
  		code[i] = randomInt(col_num);
	}
	return code;
}


class secret_code{
  constructor(length, color_number) {
    this.length = length;
    this.color_number = color_number;
    this.secret = create_random_code(length, color_number);
	this.secret_color_count = count_colors(this.secret, this.color_number);
  }

  print_secret(){
  	//TODO
  	console.log(this.secret);
  }

  try_guess(code){
  	var goodColor = 0;
  	var wellPlaced = 0;
  	var codeColorCount = count_colors(code, this.color_number);
  	//console.log("code_color_count  " + code_color_count);
	for (let i = 0; i < this.length; i++){
		if(code[i]==this.secret[i]) wellPlaced++;
  	}
  	for (let i = 0; i < this.color_number; i++){
		goodColor += Math.min(codeColorCount[i], this.secret_color_count[i]);
  	}
  	goodColor -= wellPlaced;
  	return new guess_result(wellPlaced, goodColor, this.length, this.color_number);
  }
}

class guess_result{
	constructor(wellPlaced, goodColor, length, color_number){
		this.wellPlaced = wellPlaced;
		this.goodColor = goodColor;
		this.length = length;
		this.color_number = color_number;
	}

	print_result(){
		console.log("Well placed: " + this.wellPlaced + "  and good colors:" + this.goodColor);

	}
}

class guess{
	constructor(code, length, color_number){
		this.code = code;
		this.color_count = count_colors(code, length, color_number);
		this.color_number = color_number;
	}

	print_try(){
		console.log(" Try:" + this.code + " color_counts:" + this.color_count);
	}
}

function count_colors(code,  color_number){
	var color_count = [];
	color_count.length = color_number; 
	color_count.fill(0);

	for (let i = 0; i < code.length; i++){
		color_count[code[i]]++;
	}
	return color_count;
}

function guess_at_random(secret_code){
	var code = create_random_code(secret_code.length, secret_code.color_number)
	code.color_count = count_colors(code, secret_code.color_number);
	return code;
}

function create_single_color_code(len,color_number,color){
	var code = [];
    for (let i = 0; i < len; i++) {
  		code[i] = color;
	}
	code.color_count = count_colors(code,color_number);
	return code;
}
