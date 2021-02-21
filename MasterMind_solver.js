


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

		this.SAT_table = [];
		console.log(this);
	}

	initialize_strategy(strategy){
		//TODO
	}

	extract_result(guess, guessResult){
		this.extract_basic_knowledge(guess, guessResult);
		this.extract_logique(guess, guessResult);
		this.expand_truth_table();

		//this.compute_next_proposition();
	}

	// extract basic things. that require no external knowledge
	extract_basic_knowledge(guess, guessResult){
		var total_ok_colors = guessResult.wellPlaced + guessResult.goodColor;
		//var guess_color_count = count_color(guess);

		// if no right, all chosen colors are wrong
		if(total_ok_colors==0){ 
			for(let i=0; i<guessResult.color_number; i++){
				//console.log("trying delete_color for " + color_id_to_color(i));
				if(guess.color_count[i]>0){
					this.delete_color(i);
				}
			}
		}

		// if no well placed, all placement for colors are wrong
		if(guessResult.wellPlaced == 0){
			for(let i=0; i<guessResult.length; i++){
				this.truth_table.color_placement_possible[guess[i]][i] = 0;
			}
		}


		//check for max and min of colors
		for(let col=0; col<guessResult.color_number; col++){

			// si la presence couleur est > a total_ok_color
			// alors on a un max de presence couleur
			if(guess.color_count[col]>total_ok_colors){
				this.set_max_color_presence(col,total_ok_colors);
			}

			// si le total ok color > la non presence couleur
			// alors on a un min de presence couleur
			other_cases = guess.length - guess.color_count[col];
			if(total_ok_colors > other_cases){
				this.set_min_color_presence(col,total_ok_colors - other_cases);
			}
		}

		console.log("I have extracted_result");
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


	delete_color(color){
		//delete all possible placement
		for(let i=0; i<this.length; i++){
			this.truth_table.color_placement_possible[color][i]=0;
		}
		//delete all possible counts
		for(let i=0; i<=this.length; i++){
			this.truth_table.color_presence_count_possible[color][i]=0;
		}
	}


	expand_truth_table(){
		//let's check for thing we can extrapolate from current knowleged
		//TODO

	}

	half_half_color_count_finder(){
		//let's get color distribution as dual clauses
		//TODO
	}

	extract_logique(guess,guessResult){
		// extract logique terms
		//TODO
	}

	compute_next_proposition(){
		// propose a next move.
		//TODO
	}
}

