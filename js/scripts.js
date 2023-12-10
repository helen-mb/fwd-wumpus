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
const $currentLocationIDDisplay = $('.current-location-id-display')[0];
const $clueDisplay = $('.clue-display')[0];
const $encounterMessage = $('.encounter-message');
//Interactive Components
const $viewInstructionsBtns = $('.view-instructions-btn');
const $enterBtn = $('.enter-btn');
const $exitInstructionsBtn = $('.hide-instructions-btn');
const $quitBtn = $('.quit-btn');
const $directionBtns = $('.direction-btn');
const $prepareArrowBtn = $('.prepare-arrow-btn');
const $shootArrowBtn = $('.shoot-arrow-btn');
//END of "Collect Elements"

//Collect Variables-----------------------------------------------------------------
let game;

//Object ??? of ???: gameInterface Object
//An object to handle the user interface changes:
gameInterface = {
    //gameInterface Properties

    //END of 'gameInterface Properties'

    //gameInterface Methods
    //Called by $directionBtns' click listener:
    printNewLocationInformation() {
        //Updates the printed display of the player's current location:
        $currentLocationIDDisplay.innerText = game.player.currentLocation;
        //Updates the direction controls' values and displays to reflect
        //the new neighbors of the player's current location:
        for (let i = 0; i < $directionBtns.length; i++) {
            $directionBtns[i].value = game.gameMap.rooms[game.player.currentLocation].neighbors[i];
            $directionBtns[i].innerText = `Room ${$directionBtns[i].value}`;
        }
    },

    printClue(nearbyHazards) {
        let clueContent;
        if (nearbyHazards.includes('wumpus')) {
            clueContent = 'Ugh, this room stinks!'
        } else {
            clueContent = 'Nothing...'
        }
        $clueDisplay.innerText = clueContent;
    },

    getEventScreen(encounterType) {
        const printEncounterMessage = () => {
            $encounterMessage[0].innerText = encounterMessageContent;
        }
        const returnToGameBoard = () => {
            $eventScreen.hide();
            $gameBoardScreen.show();
        }
        let encounterMessageContent = '!!!';
        $gameBoardScreen.hide();
        $eventScreen.show();
        printEncounterMessage();
        setTimeout(printEncounterMessage, 2000);
        switch (encounterType) {
            case 'eaten':
                encounterMessageContent = 'Eaten...'
                break;
            default:
                encounterMessageContent = 'What was that?!'
                setTimeout(returnToGameBoard, 3000);
        }
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
        this.gameMap = new GameMap();
        this.wumpus = new Wumpus(Math.floor(Math.random() * 19)+1);
    }
    //END of 'Game Properties'

    //Game Methods
    startGame() {
        this.gameMap.populateGameMap();
        this.gameMap.rooms[this.wumpus.currentLocation].hazard = 'wumpus';
    }

    getNearbyHazards() {
        let nearbyHazards = [];
        this.gameMap.rooms[this.player.currentLocation].neighbors.forEach(
            (neighbor) => {
                if (this.gameMap.rooms[neighbor].hazard === 'wumpus') {
                    nearbyHazards.push('wumpus');
                };
            }
        )
        gameInterface.printClue(nearbyHazards);
    }

    getPresentHazards() {
        if (game.gameMap.rooms[game.player.currentLocation].hazard === 'wumpus') {
            game.wumpus.runWumpusEncounter();
        }
    }

    endGame() {
        console.log('GAME OVER');
    }
    //END of 'Game Methods'
}

//Class ??? of ???: Player Class
class Player {
    //Player Properties
    constructor (locationID) {
        this.currentLocation = locationID;
        this.previousLocation = undefined;
        this.startLocation = locationID;
        this.currentAction = 'move';
        this.arrowSupply = 1;
        this.preparedArrow = undefined;
    }
    //END of 'Player Properties'

    //Player Methods
    //Updates player's location properties to reflect chosen direction;
    //Called by $directionBtns' click listener:
    getNewPlayerLocation(selectedLocationID) {
        this.previousLocation = this.currentLocation;
        this.currentLocation = selectedLocationID;
    }
    prepareArrow() {
        this.currentAction = 'preparing arrow'
        this.preparedArrow = new Arrow();
    }
    shootArrow() {
        this.currentAction = 'move';
        if (this.preparedArrow.direction == game.wumpus.currentLocation) {
            alert('you did it!');
        } else {
            return;
        }
    }
    //END of 'Player Methods'
}

//Class ??? of ???: GameMap Class
class GameMap {
    //GameMap Properties
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
    //END of 'GameMap Properties'

    //GameMap Methods
    //Modifies game.gameMap.rooms to contain an array of new Room objects;
    //Called by game.startGame():
    populateGameMap() {
        for (let i = 0; i < game.gameMap.rooms.length; i++) {
            this.rooms[i] = new Room (i, undefined);
        }
    } 
    //END of 'GameMap Methods'
}

//Class ??? of ???: Room Class
class Room {
    //Room Properties
    constructor (index, hazard) {
        this.roomID = index;
        this.neighbors = game.gameMap.rooms[index];
        this.hazard = hazard;
    }
    //END of 'Room Properties'

    //Room Methods

    //END of 'Room Methods'
}

//Class ??? of ???: Wumpus Class
class Wumpus {
    // //Wumpus Properties
    constructor (locationID) {
        this.currentLocation = locationID;
        this.previousLocation = undefined;
        this.startLocation = locationID;
    }
    // //END of 'Wumpus Properties'

    // //Wumpus Methods
    runWumpusEncounter() {
        let randomReaction;
        let randomReactionPicker = () => randomReaction = Math.floor(Math.random()*2)
        randomReactionPicker();
        switch (randomReaction) {
            case 1:
                gameInterface.getEventScreen('eaten');
                game.endGame();
                break;
            default:
                gameInterface.getEventScreen('close call');
                game.wumpus.relocateWumpus();
        }
    }

    relocateWumpus() {
        this.previousLocation = this.currentLocation;
        game.gameMap.rooms[game.wumpus.currentLocation].hazard = undefined;
        this.currentLocation = game.gameMap.rooms[this.currentLocation].neighbors[Math.floor(Math.random()*3)];
        game.gameMap.rooms[game.wumpus.currentLocation].hazard = 'wumpus';
    }
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

//Class ??? of ???: Arrow Class
class Arrow {
    //Arrow Properties
    constructor () {
        this.direction = undefined;
    }
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
    game = new Game();
    game.startGame();
    $introductionScreen.hide();
    $headerNavigation.show();
    $gameBoardScreen.show();
    game.getNearbyHazards();
})
$quitBtn.on('click', function() {
    //TODO: END GAME ()
    $gameBoardScreen.hide();
    $headerNavigation.hide();
    $introductionScreen.show();
})
$directionBtns.on('click', function() {
    if (game.player.currentAction === 'move') {
        game.player.getNewPlayerLocation(this.value);
        game.getPresentHazards();
        game.getNearbyHazards();
        gameInterface.printNewLocationInformation();
    } else if (game.player.currentAction === 'preparing arrow') {
        game.player.preparedArrow.direction = this.value;
    }
})
$prepareArrowBtn.on('click', function() {
    $prepareArrowBtn.hide();
    game.player.prepareArrow();
    $shootArrowBtn.show();
})
$shootArrowBtn.on('click', function() {
    $shootArrowBtn.hide();
    game.player.shootArrow();
    $prepareArrowBtn.show();
})
//END of "Add Event Listeners"



// --------------------------------------------------------------------------------
//Execute Game Logic---------------------------------------------------------------

//END of "Execute Game Logic"