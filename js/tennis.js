

$(document).ready($ => {

	let addPlayerButtons = $('.player_input');
	let generateFixtureListButtons = $('.generate_fixture_list');
	let resetButton = $('#reset_button');

	let inputPlayerList = [];  //  Stores user input player names
	let remainingPlayers = inputPlayerList;

	let round = 1;  		// Round number displayed in UI
	let roundTotal = 0;		// Number of rounds in the tournament

	
	addPlayerButtons.on('click', function () {

		let newName = $('#player_name').val();

		if (newName.length < 25) {

			if (newName.length > 0) {	// Check for content

				let formattedName = formatName(newName);	// Capitalise name

				if(notDuplicate(formattedName)) {	// Check for duplicates

					inputPlayerList.push(formattedName);  // Add name to player array
					displayPlayer(formattedName);

					$('.player_input').text(' Add Player ' + (inputPlayerList.length+1)); // Update button text
					$('#player_name').val('');  // Clear the input box

				} else {	// Duplicate name

					$('#player_name').val('');  // Clear the input box
					alert("This name already exists, please enter a unique name");
				}	

			} else {	// No content

				alert("Please enter a name");
			}

		} else {	// Name longer than 25 characters

			$('#player_name').val('');  // Clear the input box
			alert("Please keep name lenght below 25 characters");
		}	
	});


	generateFixtureListButtons.on('click', function () {

		displayFixtureList(shuffle(remainingPlayers));
	});


	resetButton.on('click', function () {

		let cancelText = "Creating a new tournament will erase any tournament information that already exists.  Do you really want to do this?";

		if(confirm(cancelText)) {

			location.reload();  //  Reolad the page!
		} 
	});


	//  Need to use this function format as the player class
	//  is appended dynamically after page load
	$(document).on('click', '.player', function(e) {

		let playerField = $(this);

		if (playerField.children('p').text() !== 'bye') {

			playerField.toggleClass('winner');

			// If winner set when the other player also has winner set, 
			// unset winner for the other player
			if (playerField.hasClass('winner') && playerField.siblings().hasClass('winner')) {

				playerField.siblings().toggleClass('winner');
			}
		}	
	});

	$(document).on('click', '.generate_next_round', function(e) { 

		let remainingPlayers = [];

		//  Get winners
		$('.winner').each(function() { remainingPlayers.push($(this).children('p').text()) });

		//  Set winners to old_winners before generating new round
		$('.winner').each(function() { $(this).addClass('old_winner'); $(this).toggleClass('winner'); });



		displayFixtureList(shuffle(remainingPlayers));
		

	});

	
	// Returns a name with correct capitalisation
	function formatName(name) {

		let lowerCaseName = name.toLowerCase();

		return lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);
	}


	// Adds entered players to UI list
	function displayPlayer(name) {

		$('#player_list_area ul').append($("<li>" + name + "</li>"));
	}


	// Checks if name already exists
	function notDuplicate(newName) {

		if (inputPlayerList.indexOf(newName) === -1) {

			return true;
		}
		return false;
	}


	function displayFixtureList(playerList) {

		let playerTotal = playerList.length;
		let HTMLString = '';

		//  Build a string & append once to avoid append parse issues

		if (playerTotal > 1) {	// Output player pairings

			HTMLString += "<div class='round_container'>";
			HTMLString += "<button class='generate_next_round'>Create Next Round</button>";
		    HTMLString += "<h3> Fixture List </h3><h4> " + getFixtureName(playerTotal) + "</h4>";

			for ( i = 0; i < playerTotal; i+=2) {

				HTMLString += "<div class='player_pairing'>";
				HTMLString +=   "<div class='player'><p>" + playerList[i] + "</p><h5 class='won_txt'>Winner!</h5></div>";
				HTMLString +=   "<div class='player'><p>" 
								+ (playerList[i+1] === undefined ? "bye" : playerList[i+1] + "</p><h5 class='won_txt'>Winner!</h5></div>")
				HTMLString += "</div>";
			}
			HTMLString += "</div>";

		} else {	// Display the winner

			HTMLString += "<div class='champ_container'>";
		    HTMLString +=   "<h4>!! " + getFixtureName(playerTotal) + " !!</h4>";
		    HTMLString +=   "<div class='player_pairing'>";
			HTMLString +=     "<div class='champion'><p>" + playerList[0] + "</p><h6 class='won_txt'>Champion</h6></div>";
			HTMLString +=   "</div>";
			HTMLString += "</div>";
		}

		$('.fixture_list_area').append(HTMLString);
	}

	
	function getFixtureName(playerTotal) {

		if (playerTotal > 8) {  return "Round " + round++;

		} else if (playerTotal >= 5) {  return 'Quarter Final';
		
		} else if (playerTotal >= 3) {  return 'Semi Final';
		
		} else if (playerTotal >= 2) {  return 'Final';

		} else if (playerTotal >= 1) { return 'We have a champion!';

		}	else {	//  PlayerTotal = 0

			return 'We need some players!';
		}
	}


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
