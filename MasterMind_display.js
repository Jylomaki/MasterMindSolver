class mastermind_display{

	constructor(canvas, offsetX, offsetY, stepSize, codeLength, color_number){
		//size in percentage


		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.dot_radius = stepSize/2;
		this.current_line_start = [offsetX, offsetY];

		this.context.canvas.width = window.innerWidth;
		this.context.canvas.height = window.innerHeight;
		this.context.fillStyle = "lightGray";
		this.context.fillRect(0, 0, canvas.width, canvas.height);

		this.dot_spacing = 1.5;

		this.result_spacing = 3;
		this.result_ratio = 0.8;

		this.truth_table_ratio = 1;
		this.truth_code_possibilities_ratio = 0.5;

		this.length = codeLength;
		this.color_number = color_number;
		
		var xTruthStart = 
			offsetX
			+ this.dot_spacing *(1+this.result_ratio) * this.dot_radius * codeLength
			+ this.dot_radius * this.result_spacing;
		this.current_truth_table_start = [xTruthStart  ,offsetY];

		this.good_color = 'green';
		this.wrong_color = "red";
	}

	display_one_line(guess, guessResult, solver){
		this.display_code(guess);
		this.display_result(guessResult);
		this.display_truth_placement_table(solver.truth_table.color_placement_possible);
		this.display_truth_count_table(solver.truth_table.color_presence_count_possible	);
		this.display_truth_code_possibilities(solver.truth_table.color_placement_possible);
		this.go_forward_truth_table_height();
	}

	display_dot(x,y,size,color){
		//this.context.arc(x, y, size, 0, 2 * Math.PI, false);
		//this.context.fillStyle = color;
		//this.context.fill();
		//this.context.lineWidth = 5;
		//this.context.strokeStyle = '#000000';
		//this.context.stroke();
		this.context.fillStyle = color;
		this.context.fillRect(x, y, size, size);
		//console.log("called for display dot " + x + " " + y  + " size " + size);
	}

	display_secret(code){
		this.context.fillStyle = "lightGreen";
		this.context.fillRect(this.current_line_start[0]-5,
		this.current_line_start[1]-5,
		this.dot_radius * code.length *this.dot_spacing +10,
		this.dot_radius+10);
		this.display_code(code);
	}

	display_code(code){
		for(let i=0; i<code.length; i++){
			this.display_dot(this.current_line_start[0] + i*this.dot_spacing*this.dot_radius,
			this.current_line_start[1],
			this.dot_radius,
			color_id_to_color(code[i]))
			//console.log("this color is " + this.color_id_to_color(code[i]));
		}
	}

	display_result(guessResult){
		var start_x = this.dot_spacing * this.dot_radius * (guessResult.length+this.result_spacing);
		this.context.fillStyle = "black";
		this.context.fillRect(start_x-5,
		this.current_line_start[1]-5,
		this.dot_radius* this.result_ratio * guessResult.length *this.dot_spacing +10,
		this.dot_radius+10);
		for(let i=0; i<guessResult.wellPlaced; i++){
			this.display_dot(start_x,
				this.current_line_start[1],
				this.dot_radius* this.result_ratio,
				this.good_color);
			start_x += this.dot_radius* this.result_ratio *this.dot_spacing ;		
		}
		for(let i=0; i<guessResult.goodColor; i++){
			this.display_dot(start_x,
				this.current_line_start[1],
				this.dot_radius* this.result_ratio,
				"white");
			start_x += this.dot_radius* this.result_ratio *this.dot_spacing ;
		}
		for(let i=0; i<guessResult.length- (guessResult.goodColor + guessResult.wellPlaced); i++){
			this.display_dot(start_x,
				this.current_line_start[1],
				this.dot_radius* this.result_ratio,
				this.wrong_color);
			start_x += this.dot_radius* this.result_ratio *this.dot_spacing ;
		}
		this.current_line_start[1] += this.dot_radius * this.dot_spacing;
	}

	go_back_up_one_line(){
		this.current_line_start[1] -= this.dot_radius * this.dot_spacing;	
	}

	go_forward_one_line(){
		this.current_line_start[1] += this.dot_radius * this.dot_spacing;	
	}

	go_forward_truth_table_height(){
		this.current_line_start[1] += this.dot_radius * (this.color_number + this.dot_spacing) * this.truth_table_ratio;
	}

	go_back_up_truth_table_height(){
		this.current_line_start[1] -= this.dot_radius * (this.length + this.dot_spacing) * this.truth_table_ratio ;
	}


	display_truth_placement_table(truth_placement_table){
		this.go_back_up_one_line();
		var dot_size = this.dot_radius * this.truth_table_ratio;
		var x = this.current_truth_table_start[0];
		var y = this.current_line_start[1];
		var color=0;
		for(let col=0; col< truth_placement_table.length; col++){
			x = this.current_truth_table_start[0];

			this.display_dot(x,y,dot_size,color_id_to_color(col));
			x += dot_size * this.dot_spacing;

			for(let i=0; i<truth_placement_table[col].length; i++){
				if(truth_placement_table[col][i]>0){
					color = this.good_color;
				}else{
					color = this.wrong_color;
				}
				this.display_dot(x,y,dot_size,color)
				x+= dot_size;
			}
			y+= dot_size;
		}
		//console.log(truth_placement_table);
	}

	display_truth_count_table(truth_count_table){
		//this.go_back_up_one_line();
		var dot_size = this.dot_radius * this.truth_table_ratio;
		var start_x = this.current_truth_table_start[0] 
			+ dot_size * (1 + this.dot_spacing + this.length);
		var x = start_x;
		var y = this.current_line_start[1];
		var color=0;
		for(let col=0; col< truth_count_table.length; col++){
			x = start_x;

			this.display_dot(x,y,dot_size,color_id_to_color(col));
			x += dot_size * this.dot_spacing;

			for(let i=0; i<truth_count_table[col].length; i++){
				if(truth_count_table[col][i]>0){
					color = this.good_color;
				}else{
					color = this.wrong_color;
				}
				this.display_dot(x,y,dot_size,color)
				x+= dot_size;
			}
			y+= dot_size;
		}
	}

	display_truth_code_possibilities(truth_placement_table){
		var dot_size = this.dot_radius * this.truth_table_ratio;
		var start_x = this.current_truth_table_start[0] 
			+ dot_size * ((1 + this.dot_spacing + this.length) + (1 + this.dot_spacing + this.length));
		var x = start_x;
		var y = this.current_line_start[1];
		for(let i=0; i<truth_placement_table[0].length; i++){
			x += dot_size;
			y=this.current_line_start[1];
			for(let col=0; col<truth_placement_table.length; col++){
				
				if(truth_placement_table[col][i]){
					this.display_dot(x,y,dot_size,color_id_to_color(col));
					y+= dot_size;	
				}
			}
		}
	}


	color_id_to_color(id){
		color_id_to_color(id);
	}
}

function color_id_to_color(id){
		switch (id) {
			case 0:
				return 'black';
			case 1:
				return 'white';
			case 2:
				return 'red';
			case 3:
				return 'yellow';
			case 4:
				return 'green';
			case 5:
				return 'blue';
			case 6:
				return 'cyan';
			case 7:
				return 'orange';
			case 8:
				return 'pink';
			case 9:
				return 'brown';
			break;
			default:
		}
	}