


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
		//check guess format.
		if(guessCode.code == undefined){
			guessCode = new guess(guessCode, this.length, this.color_number);
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
		this.check_all_right_color(guess, guessResult);
		

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

	check_all_right_color(guess,guessResult){
		if(guessResult.total_ok_colors == this.length){
			this.set_all_right_color(guess);
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

	set_all_right_color(guess){
		for(let col =0; col<this.color_number; col++){
			this.set_min_color_presence(col,guess.color_count[col]);
			this.set_max_color_presence(col, guess.color_count[col]);
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
		var truth_table = this.truth_table.color_placement_possible;
		var possible_placement;
		for(let col = 0; col<this.color_number; col++){
			possible_placement = 0;
			for(let i=0; i<this.length;i++){
				possible_placement+=truth_table[col][i]
			}
			if(possible_placement == 0){
				this.set_delete_color(col);
			}
			else{
				
			}
		}
	}

	extract_logique(guess,guessResult){
		// extract logique terms
		//TODO
		var count_logic = this.extract_count_possibles(guess, guessResult);
		//will return smthing in the like of:
		//  OR
		//		AND
		//			C RED 1
		//			C BLUE 0 
		//			etc ...
		//		AND
		//			C RED 0
		//			etc...
		//for(let and_close in count_logic.term_array){
		//	this.extract_and_add_matching_placements(guess,guessResult,and_close);
		//}

	}
	
	extract_count_possibles(guess, guessResult){
		var or_clause_array = [];
		this.extract_color_distribution_(guess,guessResult);
	}

	extract_color_distribution_(guess,guessResult){
		var color_presence = [... guess.color_count];
		var color_distribution = new Array(color_presence.length).fill(-1);
		var count_possible = [];
		this.distribute_color_count(color_presence,color_distribution, 
			guessResult.total_ok_colors,
			0,
			count_possible);

		//console.log("count_possible");
		//console.log(count_possible);
		var possible_placement = this.distribute_color_placement(guess,guessResult,count_possible);
		console.log("possible_placement");
		console.log(possible_placement);
		var logic_counts = this.logic_tuple_from_distribution(count_possible);
		var logic_full = this.logic_tuple_from_placement(possible_placement);
		//console.log(logic_counts);
		//console.log(logic_to_string(logic_counts));
		console.log("logic full:")
		console.log(logic_full);
		console.log(logic_to_string(logic_full))
		return count_possible;
	}

	logic_tuple_from_distribution(count_possible){
		var or_tuple = []
		for(let i=0;i<count_possible.length; i++){
			var and_tuple = [];
			for(let col=0; col< this.color_number; col++){
				if(count_possible[i][col]>=0){
					and_tuple.push(new logic_term("count",col,count_possible[i][col]));
				}
			}
			or_tuple.push(new logic_tuple("and",and_tuple));
		}
		return new logic_tuple("or", or_tuple);
	}

	logic_tuple_from_placement(possible_placement){
		// TODO this.
		var or_tuple = [];
		for(let id_global=0;id_global<possible_placement.length; id_global++){
			//console.log("interatine global")
			//console.log(possible_placement[id_global]);
			var count = possible_placement[id_global]["color_distribution"];
			var placements = possible_placement[id_global]["color_placement"];

			// choose one code
			for(let id_code=0; id_code<possible_placement[id_global]["color_placement"].length; id_code++){
				//console.log("interatine code")

				var and_tuple = [];

				// get counts out
				for(let col=0; col< this.color_number; col++){
					//console.log("interatine count")

					if(possible_placement[id_global]["color_distribution"][col]>=0){
						//console.log("pushing into and")
						and_tuple.push(new logic_term("count",
							col,
							possible_placement[id_global]["color_distribution"][col]));
					}
				}

				//get all placement from the code
				for(let id_dot=0;id_dot< possible_placement[id_global]["color_placement"][id_code].length; id_dot++){
					//console.log("interatine pl")

					if(possible_placement[id_global]["color_placement"][id_code][id_dot]!= -1){
						//console.log("pushing into and")
						and_tuple.push(new logic_term("placement",
							possible_placement[id_global]["color_placement"][id_code][id_dot],
							id_dot,
							this.length
							)
						)
					}
				}
				//console.log("pushing into or")
				or_tuple.push(new logic_tuple("and",and_tuple));
			}	
		}
		return new logic_tuple("or", or_tuple);
	}

	distribute_color_count(color_presence,
		color_distribution,
		left_to_distribute, 
		begin_at, 
		return_possibilities)
	{
		if(left_to_distribute == 0){
			for(let col=0; col< color_presence.length; col++){
				if(color_presence[col]> 0){
					color_distribution[col] = Math.max(0,color_distribution[col]);
				}
			}
			return_possibilities.push([...color_distribution]);
			return; //we are done.
		}
		for(let col=begin_at;col< color_presence.length; col++){
			if(color_presence[col]){
				color_distribution[col] = Math.max(color_distribution[col],0) +1;
				color_presence[col]--;
				this.distribute_color_count(color_presence,color_distribution,left_to_distribute-1, col,return_possibilities);
				color_distribution[col]--;
				color_presence[col]++;
			}
		}
	}

	distribute_color_placement(guess,
		guessResult,
		count_possible)
	{
		//step 1: get 1 color distrib.
		var distribution;
		var build_possibilities = [];
		for(let i=0; i<count_possible.length; i++){
			var build_possibilities_for_distribution = []
			distribution= count_possible[i];
			var returned_placement = {
				wellPlaced:guessResult.wellPlaced,
				goodColor:guessResult.goodColor
			}
			this.distribute_color_placement_good_placement(
				guess,
				distribution,
				returned_placement,
				0,
				0,
				new Array(this.length).fill(-1),
				build_possibilities_for_distribution);
			//console.log("pushing a dict of possible");
			build_possibilities.push({"color_distribution":distribution,
				"color_placement":build_possibilities_for_distribution
			});
		}
		return build_possibilities;
	}

	// step 2: distribute good dots
	distribute_color_placement_good_placement(
		 guess,
		 color_distribution,
		 returned_placement,
		 begin_at_col,
		 begin_at_placement,
		 builded_code,
		 return_possibilities)
	{
		if(returned_placement.wellPlaced == 0){
			this.distribute_color_placement_wrong_place(
				guess,
				color_distribution,
				returned_placement,
				0,
				0,
				builded_code,
				return_possibilities
				)
			return;
		}
		// 
		returned_placement["wellPlaced"] --;
		for(let col=begin_at_col; col< this.color_number; col++){
			if(color_distribution[col]>0){
				color_distribution[col]--;
				for(let i= 0; i<this.length; i++){
					if(guess.code[i]==col
						&& builded_code[i]==-1){
						builded_code[i]=col;
						this.distribute_color_placement_good_placement(
							guess,
							color_distribution,
							returned_placement,
							col,
							begin_at_placement+1,
							builded_code,
							return_possibilities
						)
						builded_code[i]=-1;
						console.log("code at return of wellPlaced" + builded_code + "iter level " + returned_placement["wellPlaced"]);
					}
				}
				color_distribution[col]++;
			}
			// reset placement start on color change.
			begin_at_placement = 0;
		}
		returned_placement["wellPlaced"] ++;
	}

	// step 3: distribute bad dots.
	distribute_color_placement_wrong_place(
		guess, 
		color_distribution, 
		returned_placement, 
		begin_at_col, 
		begin_at_placement, 
		builded_code, 
		return_possibilities
	){
		if(returned_placement.goodColor == 0){
			console.log("pushing:" + builded_code);
			return_possibilities.push([...builded_code]);
			return;
		}
		returned_placement["goodColor"]--;
		for(let col=begin_at_col; col<this.color_number; col++){
			if(color_distribution[col]>0){
				color_distribution[col]--;
				for(let i=begin_at_placement; i<this.length; i++){
					if(builded_code[i]==-1
						&& guess.code[i] != col){
						builded_code[i]=col;
						this.distribute_color_placement_wrong_place(
							guess, 
							color_distribution, 
							returned_placement, 
							col, 
							begin_at_placement+1, 
							builded_code, 
							return_possibilities
						)
						builded_code[i]=-1;
					}
				}
				color_distribution[col]++;
			}
		}
		returned_placement["goodColor"]++;

	}

	check_logic_count_match_truth_tables(logic_count){

	}

	extract_and_add_matching_placements(guess,guessResult,and_tuple){

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



class logic_tuple{
	constructor(type_and_or_xor, term_array){
		this.type = type_and_or_xor;
		this.term_array = term_array;
	}
	clone(){
		var array = [];
		for(let i=0; i<this.term_array.length; i++){
			array.push(this.term_array[i].clone());
		}
		new logic_tuple(this.type, array);
	}
}


class logic_term{
	// type placement, not placement or count;
	constructor(type_placement_or_count, color, positions_or_counts, length){
		this.color = color;
		this.type = type_placement_or_count;
		this.data = positions_or_counts;
		this.length = length;
		if(this.type == "placement"){
			this.data_binary = 0;
			for(let i=0; i<positions_or_counts.length; i++){
				this.data_binary |= 1<<positions_or_counts[i];
			}
		}


	}

	clone(){
			return new logic_term(this.type,
				this.color,
				[...this.data],
				this.length);
	}
	//actually, we don't need this but a more global test
	is_compatible_with(that){
		return this.check_compatibility(this,that) 
			&& this.check_compatibility(that,this)
	}

	static are_compatible(logic_term_array){
		var position_array = [];
		var count_array = [];
		for(logic_tuple in logic_term_array){
			if(logic_tuple.type == "placement"){
				positions_array.push(logic_tuple);
			}else{
				count_array.push(logic_tuple);
			}
		}
	}

	are_compatible_positions(positions_arrays){
		var total_positions = 0;
		for(let logic_tuple in positions_arrays){
			if((total_positions & logic_tuple.data_binary)){
				return false;
			}
			total_positions |= logic_tuple.data_binary;
		}
		return true;
	}

	are_compatible_counts(count_array){
		var total =0;
		for(let logic_tuple in logic_array){
			total += logic_tuple.data;
		}
		return total <= this.length;
	}

	check_compatibility(a,b){
		if(a.color == b.color){
			if(a.type = "count" 
				&& b.type == a.type){
				return a.data == b.data;
			}
			else if(a.type == "count" 
				&& b.type == "placement"){
				return a.data == b.data.length;
			}
			else if(a.type == "placement"
				&& b.type == a.type){ // placement and placement
				return array_are_similar(a.data, b.data);
			}
		}
		if(a.type == "count"
			&& b.type == a.type){
			return a.data + b.data <= a.length;
		}
		if(a.type == "count" 
			&& b.type == "placement"){
			return a.data + b.data.length <= a.length;
		}
		if(a.type == "placement"
			&& b.type == a.type){
			return !(array_intersect(a.data, b.data));
		}
		return true; // the type order is not right, so return neutral element;
	}
}

function are_compatible(logic_array){
	return true;
}

//array hold at least one similar term.
function array_intersect(a,b){
	for(let i=0; i<a.length; i++){
		for(let j=0; j<b.length; j++){
			if(a[i] == b[j]){
				return true;
			}
		}
	}
	return false;
}

// arrays hold the same length and terms
function array_are_similar(a, b){
	if( a.length == b.length){
		for(let i=0; i<a.length; i++){
			if(a[i] != b[i]){
				return false;
			}
		}
		return true;
	}
	return false;
}
