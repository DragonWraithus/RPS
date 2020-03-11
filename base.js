"use strict";

let resultDisplay = document.querySelector('#result');
let submit = document.querySelector('#getPlayerChoice');
let player_choice;

/* CONTROLLER */

// return one of, rock, paper, scissors.
function getComputerChoice() {
	let choices = ["Rock", "Paper", "Scissors"];

	// get zero, one, or two randomly. 
	let rand = Math.floor(Math.random() * 3);

	return choices[rand];
}

function getPlayerChoice() {
	player_choice = document.querySelector('#playerChoice').value;
	return validateChoice(player_choice);
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

/* Extensible. Ugly. */
// Determines winner, returns whether the user lost or not.
function getWinner(playerSelection, computerSelection) {
	// Preempt setup, if tied.
	if (playerSelection === computerSelection) {
		return `Tied! Both chose ${playerSelection}.`
	}

	/* Cleaner way? rps, wraparound?*/
	// Ordered pairs, the first will lose to the second.
	const loser_tuples = [
		["Rock", "Paper"], 
		["Paper", "Scissors"], 
		["Scissors", "Rock"]
	];

	// Enumerate combinations until state found.
	for (let i = 0; i < loser_tuples.length; i++) { 
		let [loser, winner] = loser_tuples[i];

		// Finds player's choice.
		if (playerSelection === loser) {
			//Check players choice against computer's.
			let playerResult = computerSelection === winner ?
				`You Lose! ${computerSelection} beats ${playerSelection}` :
				`You Win! ${playerSelection} beats ${computerSelection}`;

			return playerResult;
		}
	};
}

function getGameWinner(userPick, compPick) {
	// Ordered. Each loses to the next.
	let nextIsBetter = ["Rock", "Paper", "Scissors", "Rock"];
	
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

function game(gameCount) {
	let playerScore = 0;
	let computerScore = 0;

	let result;

	for (let i = 0; i < gameCount; i++) {	
		result = getWinner(getPlayerChoice(), getComputerChoice());

		if (result.search("Win") > 0) {
			playerScore++;
		} else if (result.search("Lose") > 0) {
			computerScore++;
		}

		console.log(result);
	}

	console.log(`Score: \nPlayer: ${playerScore}\nComputer: ${computerScore}`);
}

function playGame(gameCount) {
	let score = {player: 0, computer: 0, tie: 0}

	while (gameCount > 0) {
		gameCount--;

		let result = getGameWinner(getPlayerChoice(), getComputerChoice());

		if (result === "Player") {
			score.player++;
		} else if (result === "Computer") {
			score.computer++;
		} else {
			score.tie++;
			result = "Nobody";
		}

		console.log(`${result} Wins!`);

	}

	resultDisplay.textContent = `
		Player: ${score.player}\n
		Computer ${score.computer}\n
		Ties: ${score.tie}`;

	
	console.log("Score:" +
		"\nPlayer: " + score.player +
		"\nComputer: " + score.computer
	)
}

function addWinnerLi(winner) {
	let scoreBody = document.querySelector('#gameScore');
	let listItem = document.createElement('li');

	listItem.textContent = `${winner}`;
	scoreBody.appendChild(listItem);

}

submit.onclick = function() {
	playGame(1);
}


// playGame(5)

