"use strict";

/* MODEL */

const pageItems = {
	userImage: document.querySelector('#user_image'),
	compImage: document.querySelector('#comp_image'),
	reset: document.querySelector('#reset'),
	scoreBoard: document.querySelector('#result'),
	scoreHistory: document.querySelector('#winner_history'),
	limitGames: document.querySelector('#limit_games'),
	gameCount: document.querySelector('#game_count'),
}

let player_choice;
let score = {
	player: 0, 
	computer: 0, 
	tie: 0, 
	reset: function() {
		this.player = 0;
		this.computer = 0;
		this.tie = 0;
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

function writeScoreBoard(message) {
	const winner_list = document.querySelectorAll('.former_winner');
	
	updateImages('no_image.here', 'no_image.here');

	winner_list.forEach( li => pageItems.scoreHistory.removeChild(li));

	pageItems.scoreBoard.textContent = message;
}

function updateScoreBoard(result) {
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


pageItems.reset.addEventListener('click', () => {
	score.reset();
	writeScoreBoard('');
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
	finiteGame(score);
}

/* Allows for unlimited gameplay, or play to a score the user can set. */
function finiteGame(score) {
	if (pageItems.limitGames.checked && 
		(score.computer >= pageItems.gameCount.value ||
		score.player >= pageItems.gameCount.value)) 
	{
		let [comp, user] = [score.computer, score.player]
		score.reset();
		if (comp > user) {
			writeScoreBoard(`You lose! ${user}-${comp}`);
		} else {
			writeScoreBoard(`You win! ${user}-${comp}`);
		}
	}

	// Possibly add a game mode for best of five.
}
