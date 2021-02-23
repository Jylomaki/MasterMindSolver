var length = 4;
var color_count = 6;

var secret = new secret_code(length,color_count);

var solver = new mastermind_solver(length, color_count);
solver.initialize_strategy("half_and_half");

var game_displayer = new mastermind_display(
	document.getElementById("game_canvas"),
	30,
	30,
	30,
	length,
	color_count);

function random_guess_one_line(solver, game_displayer){
	var random_guess = guess_at_random(secret);
	var guessResult = secret.try_guess(random_guess);
	var next_code = solver.next_step(random_guess, guessResult);
	game_displayer.display_one_line(random_guess, guessResult,solver);
}

game_displayer.display_secret(secret.secret);
game_displayer.go_forward_one_line();

//random_guess_one_line(solver, game_displayer);
//random_guess_one_line(solver, game_displayer);
//random_guess_one_line(solver, game_displayer);

var guess_code = solver.first_step();

console.log("first code:");
console.log(guess_code);
function do_one_line(guess, secret, solver, game_displayer){
	var guessResult = secret.try_guess(guess);
	var next_code = solver.next_step(guess, guessResult);
	game_displayer.display_one_line(guess, guessResult,solver);
	return next_code;
}

for(let i=0; i<color_count/2; i++){
	guess_code = do_one_line(guess_code, secret, solver, game_displayer);
}
for(let i=0; i<3; i++){
	random_guess_one_line(solver,game_displayer);
}
