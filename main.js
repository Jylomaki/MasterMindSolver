var length = 5;
var color_count = 6;
var secret = new secret_code(length,color_count);
secret.print_secret();

var random_guess = guess_at_random(secret);
//random_guess = create_single_color_code(length, color_count,1);
//console.log("randomGuess:");
//console.log(random_guess);
var random_guess_result = secret.try_guess(random_guess);

random_guess_result.print_result();

var game_displayer = new mastermind_display(
	document.getElementById("game_canvas"),
	30,
	30,
	30,
	length);

//console.log("the secret is:");
game_displayer.display_secret(secret.secret);

//console.log("the random guess is:");
game_displayer.display_code(random_guess);
game_displayer.go_back_up_one_line();
game_displayer.display_result(random_guess_result);


var solver = new mastermind_solver(length, color_count);

solver.extract_result(random_guess, random_guess_result);

console.log("les tables de possibilités");
game_displayer.display_truth_placement_table(solver.truth_table.color_placement_possible);
console.log(" color_placement:");
//console.log(solver.truth_table.color_placement_possible);

console.log("color_count possible");
game_displayer.display_truth_count_table(solver.truth_table.color_presence_count_possible);

game_displayer.display_truth_code_possibilities(solver.truth_table.color_placement_possible);
//console.log(solver.truth_table.color_presence_count_possible);