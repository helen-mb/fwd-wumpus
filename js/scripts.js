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
//Visual Elements
const $currentLocationDisplay = $('.current-location-display-value')[0];
//Interactive Components
const $viewInstructionsBtns = $('.view-instructions-btn');
const $enterBtn = $('.enter-btn');
const $exitInstructionsBtn = $('.hide-instructions-btn');
const $quitBtn = $('.quit-btn');
const $directionBtns = $('.direction-btn');
//END of "Collect Elements"

//Collect Variables-----------------------------------------------------------------
// const roomConnectionsArray = [
//     [1, 7, 4],
//     [2, 9, 0],
//     [3, 11, 1],
//     [4, 13, 2],
//     [0, 5, 3],
//     [6, 14, 4],
//     [7, 16, 5],
//     [8, 6, 0],
//     [9, 17, 7],
//     [10, 8, 1],
//     [11, 18, 9],
//     [12, 10, 2],
//     [13, 19, 11],
//     [14, 12, 3],
//     [5, 15, 13],
//     [16, 19, 14],
//     [17, 15, 6],
//     [18, 16, 8],
//     [19, 17, 10],
//     [15, 18, 12]
// ]
let game;

//Object ??? of ???: gameInterface Class
gameInterface = {
    //gameInterface Properties

    //END of 'gameInterface Properties'

    //gameInterface Methods
    printNewLocationInformation() {
        $currentLocationDisplay.innerText = game.player.currentLocation;
    }
    //END of 'gameInterface Methods'
}
// --------------------------------------------------------------------------------
//Collect Classes------------------------------------------------------------------

//Class ??? of ???: Game Class
class Game {
    //Game Properties
    constructor () {
        this.player = new Player('0');
        this.map = new Map();
    }
    //END of 'Game Properties'

    //Game Methods
    startGame() {
        this.map.populateMap();
    }
    //END of 'Game Methods'
}

//Class ??? of ???: Map Class
class Map {
    //Map Properties
    constructor () {
        // this.wumpus = new Wumpus(Math.floor(Math.random() * 20));
        // this.pits = new Array(2);
        // this.bats = new Array(2);
    }
    rooms = [
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
        [15, 18, 12]]
    //END of 'Map Properties'

    //Map Methods
    populateMap() {
        for (let i = 0; i < game.map.rooms.length; i++) {
            this.rooms[i] = new Room (i, undefined);
        }
    } 
    //END of 'Map Methods'
}

//Class ??? of ???: Room Class
class Room {
    //Room Properties
    constructor (index, hazard) {
        this.roomID = index;
        this.neighbors = game.map.rooms[index];
        this.hazard = hazard;
    }
    //END of 'Room Properties'

    //Room Methods

    //END of 'Room Methods'
}

//Class ??? of ???: Wumpus Class
class Wumpus {
    // //Wumpus Properties
    // constructor (locationID) {
    //     this.startLocation = locationID;
    //     this.currentLocation = locationID;
    //     this.previousLocation = undefined;
    // }
    // //END of 'Wumpus Properties'

    // //Wumpus Methods
    // relocateWumpus() {
    //     this.previousLocation = this.currentLocation;
    //     this.currentLocation = map.rooms[this.currentLocation].neighbors[Math.floor(Math.random()*3)];
    // }
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
    constructor (locationID) {
        this.currentLocation = locationID;
        this.previousLocation = undefined;
        this.startLocation = locationID;
        //this.arrowSupply = 5;
    }
    //END of 'Player Properties'

    //Player Methods
    movePlayer(selectedLocationID) {
        this.previousLocation = this.currentLocation;
        this.currentLocation = selectedLocationID;
    }
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
$viewInstructionsBtns.on('click', function() {
    $instructionsScreen.show();
})
$exitInstructionsBtn.on('click', function() {
    $instructionsScreen.hide();
})
$enterBtn.on('click', function() {
    $introductionScreen.hide();
    $headerNavigation.show();
    $gameBoardScreen.show();
    game = new Game();
    game.startGame();
})
$quitBtn.on('click', function() {
    //TODO: END GAME ()
    $gameBoardScreen.hide();
    $headerNavigation.hide();
    $introductionScreen.show();
})
$directionBtns.on('click', function() {
    game.player.movePlayer(this.value);
    gameInterface.printNewLocationInformation();
})
//END of "Add Event Listeners"



// --------------------------------------------------------------------------------
//Execute Game Logic---------------------------------------------------------------

//END of "Execute Game Logic"