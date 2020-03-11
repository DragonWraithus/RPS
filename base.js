"use strict";

/* MODEL */

const userImage = document.querySelector('#user_image');
const compImage = document.querySelector('#comp_image');
const reset = document.querySelector('#reset');
let player_choice;
let score = {player: 0, computer: 0, tie: 0};


/* VIEW */

function addWinnerLi(winner) {
	const scoreBody = document.querySelector('#winner_history');
	const listItem = document.createElement('li');

	listItem.textContent = `${winner}`;
	listItem.setAttribute('class', 'former_winner');
	listItem.setAttribute('id', winner);
	scoreBody.appendChild(listItem);
}

function updateImages(userPick, compPick) {

	let imgDestination = './images/' + userPick.toLowerCase() + '.svg';
	userImage.setAttribute('src', imgDestination);

	imgDestination = './images/' + compPick.toLowerCase() + '.svg';
	compImage.setAttribute('src', imgDestination);
}

function clearScoreBoand() {
	const scoreBody = document.querySelector('#winner_history');
	const winner_list = document.querySelectorAll('.former_winner');
	const scoreBoard = document.querySelector('#result');
	
	updateImages('no_image.here', 'no_image.here');

	winner_list.forEach( li => scoreBody.removeChild(li));

	scoreBoard.textContent = `All at zero!`;
}

function updateScoreBoard(result) {
	const scoreBoard = document.querySelector('#result');

	scoreBoard.textContent = `
		Player: ${score.player}\n
		Computer ${score.computer}\n
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


reset.addEventListener('click', () => {
	score = {player: 0, computer: 0, tie: 0};
	clearScoreBoand();
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
}