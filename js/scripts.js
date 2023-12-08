'use strict,'
// --------------------------------------------------------------------------------
//Collect Elements-----------------------------------------------------------------
//Game Screens
const $headerNavigation = $('.header-navigation');
const $introductionScreen = $('.introduction-screen');
const $instructionsScreen = $('.instructions-screen');
const $gameBoardScreen = $('.game-board-screen');
const $eventScreen = $('.event-screen');
const $gameEndScreen = $('.game-end-screen');
//Interactive Components
const $viewInstructionsBtn = $('.view-instructions-btn');
const $enterBtn = $('.enter-btn');
const $exitInstructionsBtn = $('.hide-instructions-btn');
const $quitBtn = $('.quit-btn')
//END of "Collect Elements"

//Collect Variables-----------------------------------------------------------------
const roomConnectionsArray = [
    [1, 7, 4],
    [2, 9, 0],
    [3, 11, 1],
    [4, 13, 2],
    [0, 5, 3],
    [6, 14, 4],
    [7, 16, 5],
    [8, 6, 0],
    [9, 17, 7],
    [10, 8, 1],
    [11, 18, 9],
    [12, 10, 2],
    [13, 19, 11],
    [14, 12, 3],
    [5, 15, 13],
    [16, 19, 14],
    [17, 15, 6],
    [18, 16, 8],
    [19, 17, 10],
    [15, 18, 12]
]


// --------------------------------------------------------------------------------
//Collect Classes------------------------------------------------------------------
//Class ??? of ???: Interface Class
class Interface {
    //Interface Properties

    //END of 'Interface Properties'

    //Interface Methods

    //END of 'Interface Methods'
}

//Class ??? of ???: Game Class
class Game {
    //Game Properties

    //END of 'Game Properties'

    //Game Methods

    //END of 'Game Methods'
}

//Class ??? of ???: Map Class
class Map {
    //Map Properties

    //END of 'Map Properties'

    //Map Methods

    //END of 'Map Methods'
}

//Class ??? of ???: Room Class
class Room {
    //Room Properties
    constructor (index, hazard) {
        this.roomID = index + 1;
        this.neighbors = roomConnectionsArray[index];
        this.hazard = hazard;
    }
    //END of 'Room Properties'

    //Room Methods

    //END of 'Room Methods'
}

//Class ??? of ???: Wumpus Class
class Wumpus {
    //Wumpus Properties

    //END of 'Wumpus Properties'

    //Wumpus Methods

    //END of 'Wumpus Methods'
}

//Class ??? of ???: Bat Class
class Bat {
    //Bat Properties

    //END of 'Bat Properties'

    //Bat Methods

    //END of 'Bat Methods'
}

//Class ??? of ???: Pit Class
class Pit {
    //Pit Properties

    //END of 'Pit Properties'

    //Pit Methods

    //END of 'Pit Methods'
}

//Class ??? of ???: Player Class
class Player {
    //Player Properties

    //END of 'Player Properties'

    //Player Methods

    //END of 'Player Methods'
}

//Class ??? of ???: Arrow Class
class Arrow {
    //Arrow Properties

    //END of 'Arrow Properties'

    //Arrow Methods

    //END of 'Arrow Methods'
}
//END of "Collect Classes"



// --------------------------------------------------------------------------------
//Add Event Listeners--------------------------------------------------------------
$viewInstructionsBtn.on('click', function() {
    $instructionsScreen.show();
})
$exitInstructionsBtn.on('click', function() {
    $instructionsScreen.hide();
})
$enterBtn.on('click', function() {
    $introductionScreen.hide();
    $headerNavigation.show();
    $gameBoardScreen.show();
})
$quitBtn.on('click', function() {
    //TODO: END GAME ()
    $gameBoardScreen.hide();
    $headerNavigation.hide();
    $introductionScreen.show();
})
//END of "Add Event Listeners"



// --------------------------------------------------------------------------------
//Execute Game Logic---------------------------------------------------------------

//END of "Execute Game Logic"