"use strict";
// TODO: 
// * write tests.
/* MODEL */

const pageItems = {
	userImage: document.querySelector('#user_image'),
	compImage: document.querySelector('#comp_image'),
	resetBtn: document.querySelector('#reset'),
	scoreBoard: document.querySelector('#result'),
	scoreHistory: document.querySelector('#winner_history'),
	gameType: document.querySelector('#limit_game'),
	gameCount: document.querySelector('#game_count'),
}

let player_choice;
let score = {
	player: 0, 
	computer: 0, 
	tie: 0, 
	gamesPlayed: 0,
	reset: function() {
		this.player = 0;
		this.computer = 0;
		this.tie = 0;
		this.gamesPlayed = 0;
	}
};


/* VIEW */

function addWinnerLi(winner) {
	const listItem = document.createElement('li');

	listItem.textContent = `${winner}`;
	listItem.setAttribute('class', 'former_winner');
	listItem.setAttribute('id', winner);
	pageItems.scoreHistory.appendChild(listItem);
}

function updateImages(userPick, compPick) {
	let imgDestination = './images/' + userPick.toLowerCase() + '.svg';
	pageItems.userImage.setAttribute('src', imgDestination);

	imgDestination = './images/' + compPick.toLowerCase() + '.svg';
	pageItems.compImage.setAttribute('src', imgDestination);
}

function writeVictor(message, textColor='black') {	
	pageItems.scoreBoard.textContent = message;
	pageItems.scoreBoard.style.color = textColor;
}

function clearHistory() {
	//updateImages('no_image.here', 'no_image.here');
	
	const winner_list = document.querySelectorAll('.former_winner');
	winner_list.forEach( li => pageItems.scoreHistory.removeChild(li));
}

function updateScoreBoard(result) {
	pageItems.scoreBoard.style.color = 'black';
	pageItems.scoreBoard.textContent = `
		Player: ${score.player} |\n
		Computer ${score.computer} |\n
		Ties: ${score.tie}`;

	addWinnerLi(result);
}

/* CONTROLLER */

// When choice is clicked, play a game.
let playButtons = document.querySelectorAll('.choice');
playButtons.forEach(choice_btn => {
	choice_btn.addEventListener('click', () => {
		player_choice = validateChoice(choice_btn.id);
		playGame(player_choice, score);
	})
});


pageItems.resetBtn.addEventListener('click', () => {
	score.reset();
	writeVictor('');
});



// return randomly: rock, paper, or scissors.
function getComputerChoice() {
	let choices = ["Rock", "Paper", "Scissors"];

	// get zero, one, or two randomly. 
	let rand = Math.floor(Math.random() * 3);

	return choices[rand];
}

// Check that choice is rock, paper, scissors, or the first letter of any.
function validateChoice(choice) {
	choice = choice.toLowerCase();
	let valid = ['r', 'rock', 'p', 'paper', 's', 'scissors']

	// Players choice is in the array of valid choices.
	if (valid.indexOf(choice) > -1) { 
		return titleCase(choice);
	} else { 
		return "Rock";
	}
}

function titleCase(string) {
	return string[0].toUpperCase().concat(string.slice(1));
}

function getGameWinner(userPick, compPick) {
	// Ordered. Each loses to the next.
	let nextIsBetter = ["Rock", "Paper", "Scissors", "Rock"];
	
	updateImages(userPick, compPick);
	if (userPick === compPick) {
		return "Tied";
	}

	let userChoiceIndex = nextIsBetter.indexOf(userPick)
	let winningChoice = nextIsBetter[userChoiceIndex + 1];

	let winner = compPick === winningChoice ?
		"Computer" :
		"Player";

	return winner;
}

function playGame(playerChoice, score) {
	if (score.gamesPlayed < 1) clearHistory();
	score.gamesPlayed++;
	let result = getGameWinner(playerChoice, getComputerChoice());

	if (result === "Player") {
		score.player++;
	} else if (result === "Computer") {
		score.computer++;
	} else {
		score.tie++;
		result = "Nobody";
	}

	updateScoreBoard(result);
	if (pageItems.gameType.options.selectedIndex != 0) {
		finiteGame(score);
	}
}

/* Allows for unlimited gameplay, or play to a score the user can set. */
function finiteGame(score) {
	/* TODO: force gameCount value to have a number */
	let board = {
		message: '',
		color: '',
	};

	// Play to specefied number of victories
	if (pageItems.gameType.options.selectedIndex == 2 &&
		(score.computer >= pageItems.gameCount.value ||
		score.player >= pageItems.gameCount.value))
	{
		let [comp, user] = [score.computer, score.player]
		score.reset();
		if (user > comp) {
			board.message = `You win! ${user}-${comp}`;
			board.color = 'palegreen';
		} else {
			board.message = `You lose! ${user}-${comp}`;
			board.color = 'palegreen';
		}
		writeVictor(board.message, board.color);
	// Best of maximum games
	} else if (pageItems.gameType.options.selectedIndex == 1 &&
		pageItems.gameCount.value <= score.gamesPlayed) 
	{
		if (score.player > score.computer) {
			board.message = `You win! ${score.player}-${score.computer}`;
			board.color = 'palegreen';
		} else if (score.player < score.computer) {
			board.message = `You lose! ${score.player}-${score.computer}`;
			board.color = 'orange';
		} else {
			board.message = `Perfect tie! ${score.player}-${score.computer}`;
			board.color = 'pink';
		}
		score.reset();
		writeVictor(board.message, board.color);
	}

	// Possibly add a game mode for best of five.
}
