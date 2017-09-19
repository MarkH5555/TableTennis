
<img width="977" alt="screen shot 2017-09-19 at 20 44 21" src="https://user-images.githubusercontent.com/24626768/30612167-9e85b5c4-9d7b-11e7-9d6e-d36698c8380e.png">

## A match scheduler for table tennis

Table Tennis Tracker allows the user to create a fixture table for a table tennis tournament.  Users input a list of players which is then used to generate randomly matched rounds, tracking winners through each round.

## Installation

Copy the file structure into your chosen directory then open the index.html file in your browser.   Once installed, your file structure will look like this.

`````
css/
images/
js/
index.html
`````

## User Guide

<img width="500" alt="screen shot 2017-09-19 at 20 21 53" src="https://user-images.githubusercontent.com/24626768/30612706-5ec36a88-9d7d-11e7-8693-fd2695222820.png">

Enter players, one at a time into the UI using the _Enter Key_ or by clicking on the _Add Player_ button.  As players are entered, they will be added to the _Player List_ and the _Add Player_ button will increment to tell you how many players are in the tournament.  If an odd number of players are added, one player will recieve an automatic _'bye'_ into the next round.  Duplicate names cannot be entered and names cannot be longer than 20 characters.

Feel free to add as many players as you like, however, a large player list will will require you to scroll down to access early round information and scroll right as fixtures progress across the screen.

<img width="500" alt="screen shot 2017-09-19 at 20 24 06" src="https://user-images.githubusercontent.com/24626768/30613635-bbc5b094-9d80-11e7-9f31-c2b0e1518a61.png">

Once all players have been added, click _Generate Fixture list_ to generate the first random match pairings.  As matches complete, click on the winning player to set them as the match winner.  Once all matches in the round have been decided, click _Generate Next Round_ to move winning players into the next round.  Continue until a winner is found.

<img width="500" alt="screen shot 2017-09-19 at 20 26 03" src="https://user-images.githubusercontent.com/24626768/30613769-2cd9531c-9d81-11e7-9f46-db7e3eb1b30a.png">

You can start a new tournament at any time by selecting _New Tournament_ at the top right of the screen, this will erase all current tournament data.
