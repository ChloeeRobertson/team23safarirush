  _________   _____  ________________ __________.___  __________ ____ ___  _________ ___ ___  
 /   _____/  /  _  \ \_   _____/  _  \\______   \   | \______   \    |   \/   _____//   |   \ 
 \_____  \  /  /_\  \ |    __)/  /_\  \|       _/   |  |       _/    |   /\_____  \/    ~    \
 /        \/    |    \|     \/    |    \    |   \   |  |    |   \    |  / /        \    Y    /
/_______  /\____|__  /\___  /\____|__  /____|_  /___|  |____|_  /______/ /_______  /\___|_  / 
        \/         \/     \/         \/       \/              \/                 \/       \/  


----------------
Team Information
----------------

Team number:    23
Team members:   Wyatt Ariss
                Johnny Lee
                Kenneth Li
                Chloee Robertson
                Mike Zhou

----------------
Project Overview
----------------

Game title:     Safari Rush
Description:    The game features a 6X6 grid containing puzzles that must be solved. Each game board
                configuration is a unique puzzle. The objective of the game is to help the jeep escape
                by moving the various wild animals out of its way (ie. solving the puzzle). Each piece
                on the game board can only move along the axis that it is longer in. The scoring system
                is based on the number of moves made and amount of time needed to complete the level;
                the lower the number of moves and time needed, the higher your score. Also, completing
                a puzzle with a higher difficulty scores more points than a level of lower difficulty.

--------------------------
Technologies and Libraries
--------------------------

HTML and CSS:   Used to provide and style a webpage for our game.

Javascript:
AJAX:           Used for retrieving board configurations and submitting scores to leaderboard.
jQuery:         Mainly used for creating and manipulating DOM elements for animals and jeep.
jQuery.pep:     Makes dragging compatible with both desktop and touchscreen devices.
                Also makes game mechanics (collision & boundary detection) easier to code.

PHP & MySQL:    Used to store scores on the server side to be displayed on the leaderboard page.
                The board configurations are also stored and pulled from the database using php.

--------------
Code Structure
--------------

File List:  

HTML
index.html:         Contains the main page of the website where the game is played.
aboutus.html:       Contains some information regarding our development team.
howtoplay.html:     Displays a brief tutorial explaining the game and its various features.
leaderboard.php:    Displays the name and scores of the top 10 players.

CSS
base.css:           Provides styling consistent throughout each of the webpages.
aboutus.css:        Contains styling specific to the aboutus page.
howtoplay.css:      Contains styling specific to the howtoplay page.
leaderboard.css:    Contains styling specific to the leaderboard page.
meyerreset.css:     Standardizes the default styling inherent of different browsers.
gameboard.css:      Provides styling for the game board.

Javascript
autoload.js:        Automatically sets up the game board and loads the first level when the document
                    is ready.
global.js:          Contains global variables and objects for referencing.
loadLevel.js:       Loads a level (board configuration) onto the game board.
loadMechanics.js:   With the assistance of the jQuery.pep library, provides the game mechanics for
                    the game pieces.
loadPieceAssets.js: Loads the audio and images associated with the game pieces.
mute.js             Provides sound toggling for the game.
playerTracking.js:  Tracks and computes a player's score and the levels completed.

---------------
Issues/Problems
---------------

Audio lag on mobile devices: the sounds that play when a game piece is touched are delayed by half to a
full second.

Out-of-bounds detection does not work on Nexus 5X: pieces can be dragged out of the board and off screen.
