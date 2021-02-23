


class mastermind_solver{
	constructor(length, color_number){
		this.length = length;
		this.color_number = color_number;
		this.tried_code = [];

		//creating a table to know what is possible and what is not.
		this.truth_table = {
			color_presence_count_possible: [], // which number of presence are possibles
			color_placement_possible: [] // where can each color be placed

		};

		this.truth_table.color_presence_count_possible.length = color_number;
		this.truth_table.color_placement_possible.length = color_number;

		for(let col=0; col<color_number; col++){
			// initializing 
			this.truth_table.color_presence_count_possible[col] = []; 
			this.truth_table.color_presence_count_possible[col].length = length;
			for(let len=0; len<=length; len++){
					this.truth_table.color_presence_count_possible[col][len]=1; // it is possible to have LEN dots of COL colors
			}

			this.truth_table.color_placement_possible[col] = []; 
			this.truth_table.color_placement_possible[col].length = length;

			for(let len=0; len<length; len++){
					this.truth_table.color_placement_possible[col][len]=1; // it is possible to have a dots of COL color at LEN placement
			}
		}

		this.previous_guess = {
			guess:[],
			guessResult: []
		}
		this.logic_terms = [];
		console.log(this);
	}
 
	initialize_strategy(strategy){
		//TODO
		this.strategy = strategy;
		switch(strategy){
			case 'half_and_half':
				this.guess_generator = new half_and_half_proposition_solver(this.length, this.color_number);
				break;
			default:
				console.error("Couldn't make out the strategy");
				return;
		}
	}

	first_step(){
		//console.log("going into the code_generator");
		//console.log(this.guess_generator);
		return this.guess_generator.compute_first();
	}


	next_step(guessCode, guessResult){
		if(guessCode.code == undefined){
			//console.log(guessCode);
			guessCode = new guess(guessCode, this.length, this.color_number);
			//console.log(guessCode);
		}
		this.extract_result(guessCode, guessResult);
		if(this.guess_generator.is_finished()){
			//default to disambiguous
		}
		return this.guess_generator.compute_next(guessCode, guessResult);
	}

	extract_result(guess, guessResult){

		// handling the present
		this.extract_basic_knowledge(guess, guessResult);
		this.extract_logique(guess, guessResult);
		this.expand_truth_table();

		// remembering the past
		this.previous_guess.guess.push(guess);
		this.previous_guess.guessResult.push(guessResult);
	}

	// extract basic things. that require no external knowledge
	extract_basic_knowledge(guess, guessResult){
		var total_ok_colors = guessResult.total_ok_colors;
		//var guess_color_count = count_color(guess);
		var other_cases;

		this.check_no_good_placement(guess,guessResult);
		this.check_mins_and_maxs(guess,guessResult);
		this.check_only_possible_placement(guess, guessResult);
		this.check_all_wrong(guess,guessResult);
		

		console.log("I have extracted_result");
	}

	check_mins_and_maxs(guess,guessResult){
		//check for max and min of colors
		for(let col=0; col<guessResult.color_number; col++){

			// si la presence couleur est > a total_ok_color
			// alors on a un max de presence couleur
			if(guess.color_count[col]>guessResult.total_ok_colors){
				this.set_max_color_presence(col,guessResult.total_ok_colors);
			}

			// si le total ok color > la non presence couleur
			// alors on a un min de presence couleur
			var other_cases = guess.code.length - guess.color_count[col];
			if(guessResult.total_ok_colors > other_cases){
				this.set_min_color_presence(col,guessResult.total_ok_colors - other_cases);
			}
		}
	}

	check_all_wrong(guess,guessResult){
		if(guessResult.total_ok_colors==0){ 
			for(let i=0; i<guessResult.color_number; i++){
				if(guess.color_count[i]>0){
					this.set_delete_color(i);
				}
			}
		}
	}

	check_no_good_placement(guess,guessResult){
		if(guessResult.wellPlaced == 0){
			for(let i=0; i<guessResult.length; i++){
				this.truth_table.color_placement_possible[guess.code[i]][i] = 0;
			}
		}
	}

	check_only_possible_placement(guess,guessResult){
		// if col count > total_ok_color
		// 		and goodColor ==0
		// then there is no other placement than the one we proposed
		for(let col=0; col<this.color_number; col++){
			if(guess.color_count[col] > guessResult.total_ok_colors 
				&& guessResult.goodColor == 0){
				var possible_placement = [];
				for(let i =0; i<this.length; i++){
					if(guess.code[i]==col){
						possible_placement.push(i);
					}
				}
				this.set_only_possible_placement(col,possible_placement);
			}
		}
	}

	set_only_possible_placement(color, possible_placement){
		var truth_table = this.truth_table.color_placement_possible[color];
		for(let i=0; i<truth_table.length; i++){
			if(truth_table[i] && possible_placement.includes(i)){
				truth_table[possible_placement[i]] = 1;	
			}
			else{
				truth_table[i] = 0;
			}
		}
	}

	set_max_color_presence(color, max){
		for(let i=max+1 ; i<=this.length ; i++){
			this.truth_table.color_presence_count_possible[color][i]=0;
		}
	}

	set_min_color_presence(color, min){
		for(let i = 0; i<min ;i++){
			this.truth_table.color_presence_count_possible[color][i]=0;
		}
	}	

	set_delete_color(color){
		//delete all possible placement
		for(let i=0; i<this.length; i++){
			this.truth_table.color_placement_possible[color][i]=0;
		}
		//delete all possible counts but 0 presence
		for(let i=1; i<=this.length; i++){
			this.truth_table.color_presence_count_possible[color][i]=0;
		}
		this.truth_table.color_presence_count_possible[color].is_wrong = true;
	}


	expand_truth_table(){
		//let's check for thing we can extrapolate from current knowleged
		//TODO

	}

	extract_logique(guess,guessResult){
		// extract logique terms
		//TODO
	}

	compute_next_disambiguous_logics(){

	}
}

class half_and_half_proposition_solver{
	constructor(length, color_number){
		this.length = length;
		this.color_number = color_number;
		this.color_found = 0;
		this.next_color =0;
		this.half_length = Math.floor(length/2);
		this.finished = false;
	}

	compute_first(){
		return this.compute_next("unnecessary_arg", {wellPlaced:0, goodColor:0});
	}

	compute_next(guessCode, guessResult){
		this.update_color_count(guessCode, guessResult);

		var code = [];
		for(let i=0; i<this.half_length; i++){
			code[i]=this.next_color;
		};
		this.update_color();		
		for(let i=this.half_length; i< this.length;i++){
			code[i] = this.next_color;
		};
		this.update_color();
		return code;
	}

	update_color(){
		this.next_color++;
		if(this.next_color == this.color_number){
			this.next_color --;
			this.finished =true;
		}
	}

	update_color_count(guess, guessResult){
		this.color_found += guessResult.wellPlaced + guessResult.goodColor;
	}

	is_finished(){
		return this.color_found == this.length
			|| this.finished ;
	}


}