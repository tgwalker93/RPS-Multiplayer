
var config = {
    apiKey: "AIzaSyAynd79JHkYLT9PRWNIBTPwCJFSYQley-w",
    authDomain: "rps-multiplayer-6494b.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-6494b.firebaseio.com",
    projectId: "rps-multiplayer-6494b",
    storageBucket: "rps-multiplayer-6494b.appspot.com",
    messagingSenderId: "404048043830"
  };
  firebase.initializeApp(config);


	// Links to Firebase
	var presenceRef = firebase.database().ref("/.info/connected");
	var playersRef = firebase.database().ref("/playersRef");
	var turnRef = firebase.database().ref("/turn");
	var chatRef = firebase.database().ref("/chat");


	var playerChoice;
	var player;
	var otherPlayer;
	var name = {};
	var userRef;
	var wins1, wins2, losses1, losses2;

	var choicesArray = ["<button data-choice='rock' type='button' class='btn btn-primary'>Rock</button>", "<button data-choice='paper' type='button' class='btn btn-primary'>Paper</button>", "<button data-choice='scissors' type='button' class='btn btn-primary'>Scissors</button>"];

	var name = "";

	// Remove turn and chat when either player disconnects
	turnRef.onDisconnect().remove();
	chatRef.onDisconnect().remove();

	var player2Name = "";
	var player2Wins = 0;
	var player2Losses = 0;




  var database = firebase.database().ref();



  	// Remove turn and chat when either player disconnects
	turnRef.onDisconnect().remove();
	chatRef.onDisconnect().remove();

	// Game Object
	var game = {
		listeners: function() {
			// Start button click
			$('#addName').one('click',function() {
				game.setPlayer();
				return false;
			});
			// Show player name in box
			playersRef.on('child_added', function(childSnapshot) {
				// Gets player number
				 var key = childSnapshot.key();
				// Gets player names
				 name[key] = childSnapshot.val().name;
				// Remove loading and add player name
				var waiting = $('.player' + key + ' > .waiting');
				waiting.empty();
				var $h1 = $('<h1>').text(name[key]);
				waiting.append($h1);				
				// Get player wins and losses
				var wins = childSnapshot.val().wins;
				var losses = childSnapshot.val().losses;
				var $wins = $('<h2>').text('Wins: ' + wins);
				var $losses = $('<h2>').text('Losses: ' + losses);
				$wins.addClass('float-left');
				$losses.addClass('float-right');
				$('.score' + key).append($wins).append($losses);
			});
			// Remove player name from box on disconnect
			playersRef.on('child_removed', function(childSnapshot) {
				// Find player that was removed
				var key = childSnapshot.key();
				// Show 'player has disconnected' on chat
				// Empty turn message
				$('h4').text('Waiting for another player to join.');
				// Display beginning message
				var waiting = $('.player' + key + ' > .waiting');
				waiting.empty();
				var $h1 = $('<h1>').text('Waiting for player ' + key);
				waiting.append($h1).append($i);
				// Empty score
				$('.score' + key).text('');
				// Empty divs
				$('.choices1').empty();
				$('.results').empty();
				$('.choices2').empty();
			});
			// Listen for each turn to direct to proper turn function
			turnRef.on('value', function(snapshot) {
				var turnNum = snapshot.val();
				if (turnNum	== 1) {
					// Empty divs
					$('.choices1').empty();
					$('.results').empty();
					$('.choices2').empty();
					game.turn1();
				} else if (turnNum == 2) {
					game.turn2();
				} else if (turnNum == 3){
					game.turn3();
				}
			});
			// Listen for change in wins and losses for players 1
			playersRef.child(1).on('child_changed', function(childSnapshot) {
				if (childSnapshot.key() == 'wins') {
					wins1 = childSnapshot.val();
				} else if (childSnapshot.key() == 'losses') {
					losses1 = childSnapshot.val();
				}
				// Update score display
				if (wins1 !== undefined) {
					$('.score1 .float-left').text('Wins: ' + wins1);
					$('.score1 .float-right').text('Losses: ' + losses1);
				}
			});
			// Listen for change in wins and losses for player 2
			playersRef.child(2).on('child_changed', function(childSnapshot) {
				if (childSnapshot.key() == 'wins') {
					wins2 = childSnapshot.val();
				} else if (childSnapshot.key() == 'losses') {
					losses2 = childSnapshot.val();
				}
				// Update score display
				$('.score2 .float-left').text('Wins: ' + wins2);
				$('.score2 .float-right').text('Losses: ' + losses2);
			});
		},
		setPlayer: function() {
			// Query database
			database.once('value', function(snapshot) {
				var playerObj = snapshot.child('playersRef');
				var num = playerObj.numChildren();
				// Add player 1
			  if (num == 0) {
					// Sets player to 1
			  	player = 1;
			  	game.addPlayer(player);
			  // Check if player 1 disconnected and re-add
			  } else if (num == 1 && playerObj.val()[2] !== undefined) {
					// Sets player to 1
			  	player = 1;
			  	game.addPlayer(player);
			  	// Start turn by setting turn to 1
			  	turnRef.set(1);
			  // Add player 2
			  } else if (num == 1) {
					// Sets player to 2
			  	player = 2;
			  	game.addPlayer(player);
			  	// Start turn by setting turn to 1
					turnRef.set(1);
			  }
			});
		},
		addPlayer: function(count) {
			// Gets player name
			var playerName = $('#name-input').val();
			// Remove form
			var greeting = $('.greeting');
			greeting.empty();
			// Show greeting
			var $hi = $('<h3>').text('Hi ' + playerName + '! You are Player ' + player);
			var $h4 = $('<h4>');
			greeting.append($hi).append($h4);
			// Create new child with player number
			userRef = playersRef.child(count);
			// Allows for disconnect
			userRef.onDisconnect().remove();
			// Sets children of player number
			userRef.set({
				'name': playerName,
				'wins': 0,
				'losses': 0
			});
		}


	}
 game.listeners();
	// // Start chat
	// chat.listeners();
