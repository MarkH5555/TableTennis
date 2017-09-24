

$(document).ready($ => {

	let addPlayerButtons = $('.player_input');
	let generateFixtureListButton = $('.generate_fixture_list');
	let resetButton = $('#reset_button');
	let playerInput = $('#player_name');

	let inputPlayerList = [];  //  Stores user input player names

	let round = 1;  		// Round number displayed in UI
	let roundTotal = 0;		// Number of rounds in the tournament

	const MAX_STR_LEN = 20;	// Max player name string len


	playerInput.keypress(function(e) {
	    if(e.which == 13) {

	        getInput();
	    }
	});


	addPlayerButtons.on('click', function () {

		getInput();
	});

	//  FUNCTION gets player names from the users and feeds them into the
	//  inputPlayerList array.
	//  Error checking is carried out on the user input

	function getInput() {

		let newName = $('#player_name').val();

		if (newName.length <= MAX_STR_LEN) {

			if (newName.length > 0) {	// Check for content

				let formattedName = formatName(newName);	// Set Capitalisation

				if(notDuplicate(formattedName)) {	// Check that name hasn't already been entered

					// EVERYTHING OK, ADD THE PLAYER
					inputPlayerList.push(formattedName);  // Add name to player array
					displayPlayer(formattedName);

					$('.player_input').text(' Add Player ' + (inputPlayerList.length+1)); // Update button counter text
					$('#player_name').val('');  // Clear the input box ready for the next player

				} else {	// Duplicate name error

					$('#player_name').val('');  // Clear the input box
					errorModal('Duplicate name', 'This name already exists, please enter a unique name.');
				}

			} else {	// No content error

				errorModal('Missing name', 'Please enter a name.');				
			}

		} else {	// Name longer than MAX_STR_LEN error

			$('#player_name').val('');  // Clear the input box
			errorModal('Name too long', 'Please keep name lenght below ' + MAX_STR_LEN + ' characters.');
		}	
	}
	
	// FUNCTION creates the initial fixture list

	generateFixtureListButton.on('click', function () {

		if (inputPlayerList.length >= 2) {	// Check that there at least two players

			$('#player_input_a').hide();	// Hide the input areas
			$('#player_list_a').hide();

			displayFixtureList(shuffle(inputPlayerList));

		} else {	// < two players error

			errorModal('Insuficient Players for a tournament', 'At least two players are needed for a tournament, please add some more.');
		}
	});

	// FUNCTION resets the app ready for a new tournament

	resetButton.on('click', function () {	//  Reolad the page?

		$('#choice-modal').modal();	// Check if they really want to reload

		$('#confirmYes').click(function(){

	     	$('#confirmYes').modal('hide');
	   		location.reload();
    	});
	});

	//  FUNCTION toggles winner status when a player is clicked

	//  Need to use this function format as the player class
	//  is appended dynamically after page load

	$(document).on('click', '.player', function(e) {

		let playerField = $(this);

		// Don't set/unset winner if player = bye
		// or
		// Other player = bye (player will already be set as a winner if the other player is a bye)
		if (playerField.children('h6').text() !== 'bye' && playerField.next().children('h6').text() !== 'bye') {

			playerField.toggleClass('winner');

			// If winner set when the other player also has winner set, then toggle winner
			// status for the other player
			if (playerField.hasClass('winner') && playerField.siblings().hasClass('winner')) {

				playerField.siblings().toggleClass('winner');
			}
		}	
	});

	// FUNCTION gets all winners and generates the next round

	//  Need to use this function format as the player class
	//  is appended dynamically after page load
	$(document).on('click', '.generate_next_round', function(e) { 

		let winningPlayers = [];
		let playersInRound = 0;

		//  Get winners
		$('.winner').each(function() { winningPlayers.push($(this).children('h6').text()) });
		// Update player counter for the next round
		$('.player').each(function() { playersInRound++ });

		if (playersInRound/winningPlayers.length === 2) { // Check that half the players set as winners

			//  Set winners to old_winners, then remove winner class before generating new round
			$('.winner').each(function() { $(this).addClass('old_winner'); $(this).toggleClass('winner'); });
			// Set players to old_players so that they cannot be modified in old rounds
			$('.player').each(function() { $(this).addClass('old_player'); $(this).toggleClass('player'); });

			$('.generate_next_round').hide();

			displayFixtureList(shuffle(winningPlayers));

		} else {

			errorModal('Missing winner', 'Please select a winner for each match.');
		}
	});

	
	// FUNCTION returns a name with first letter caps, the rest lowercase
	function formatName(name) {

		let lowerCaseName = name.toLowerCase();

		return lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);
	}


	// FUNCTION Adds entered players to the initial player list during the game setup
	function displayPlayer(name) {

		$('#player_list_a nl').append($("<h6>" + name + "</h6>"));
	}


	// FUNCTION checks if a newly entered name already exists in the player array
	function notDuplicate(newName) {

		if (inputPlayerList.indexOf(newName) === -1) {

			return true;
		}
		return false;
	}

	//  FUNCTION creates a fixture list by pairing and displaying all players in 
	// a 'player-pairing' div

	// THIS FUNCTION NEEDS RE-FACTORING TO USE THE STANDARD JQUERY HTML FUNCTIONS
	function displayFixtureList(playerList) {

		let playerTotal = playerList.length;
		let HTMLString = '';

		//  Build a string & append() once to avoid append JQuery parse issues

		if (playerTotal > 1) {	// Output player pairings  card card-success

			HTMLString += "<div class='round_container'>";
			HTMLString += "<button class='generate_next_round btn btn-primary btn-sm'>Create Next Round</button>";
		    HTMLString += "<h4> " + getFixtureName(playerTotal) + "</h4>";

			for ( i = 0; i < playerTotal; i+=2) {

				let isBye = playerList[i+1] === undefined ? true : false;  // If 2nd player isn't there, set 2nd = 'bye'

				HTMLString += "<div class='player_pairing'>";
				HTMLString +=   "<div " + ( isBye ? "class='player winner' " : "class='player'") + "><h6>" + playerList[i] + "</h6><h7 class='won_txt'>W</h7></div>";
				HTMLString +=   "<div class='player'><h6>" + (isBye ? "<i>bye</i>" : playerList[i+1] + "</h6><h7 class='won_txt'>W</h7></div>")
				HTMLString += "</div>";
			}
			HTMLString += "</div>";
			$('.fixture_list_area').append(HTMLString);

		} else {	// Display the winner

			$('#champ-modal .modal-body h3').text("The winner is " + playerList[0]);
			$('#champ-modal').modal();
		}
	}

    // FUNCTION returns the name of the round based on how many winning players remain
    
	function getFixtureName(playerTotal) {

		if (playerTotal > 8) {  return "Round " + round++;

		} else if (playerTotal >= 5) {  return 'Quarter Final';
		
		} else if (playerTotal >= 3) {  return 'Semi Final';
		
		} else if (playerTotal >= 2) {  return 'Final';

		} else if (playerTotal >= 1) { return 'Champion';

		}	else {	//  PlayerTotal = 0

			return 'We need some players!';
		}
	}

	// FUNCTION displays a Bootstrap Modal, called when an user input 
	// error has been detected.

	function errorModal(titleTxt, bodyTxt) {

		$('#error-modal .modal-title').text(titleTxt);
		$('#error-modal .modal-body p').text(bodyTxt);

		$('#error-modal').modal();
	}

	// Functions neded to pass focus to the modal, otherwise
	// app hangs when enter pressed as focus remains on
	// page and is not passed to the modal.
	$("#error-modal").on('shown.bs.modal', function(){

		 $(this).find('#error-button').focus();
 	});

	$("#choice-modal").on('shown.bs.modal', function(){

		 $(this).find('#confirmYes').focus();
 	}); 

 	$("#champ-modal").on('shown.bs.modal', function(){

		 $(this).find('#champ-close').focus();
 	}); 


	// Fisher-Yates Sort algorithm
	// Sourced from: http://www.itsmycodeblog.com/shuffling-a-javascript-array
	function shuffle(array) {

  		let currentIndex = array.length, temporaryValue, randomIndex ;

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }
  		return array;
	}
});
