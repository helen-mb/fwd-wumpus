'use strict,'
//TODO: write instructions
// --------------------------------------------------------------------------------
//Collect Elements-----------------------------------------------------------------
//Game Screens
const $headerNavigation = $('.header-navigation');
const $introductionScreen = $('.introduction-screen');
const $instructionsScreen = $('.instructions-screen');
const $gameBoardScreen = $('.game-board-screen');
const $encounterScreen = $('.encounter-screen');
const $gameEndScreen = $('.game-end-screen');
//Visual Elements
const $currentLocationIDDisplay = $('.current-location-id-display')[0];
const $clueDisplay = $('.clue-display')[0];
const $encounterMessage = $('.encounter-message');
const $gameEndHeading = $('.game-end-heading')[0];
const $outcomeMessage = $('.outcome-message')[0];
//Interactive Components
const $viewInstructionsBtns = $('.view-instructions-btn');
const $enterBtn = $('.enter-btn');
const $exitInstructionsBtn = $('.hide-instructions-btn');
const $quitBtn = $('.quit-btn');
const $directionBtns = $('.direction-btn');
const $moveActionBtn = $('.move-action-btn')
const $prepareArrowBtn = $('.prepare-arrow-btn');
const $shootArrowBtn = $('.shoot-arrow-btn');
const $tryAgainBtn = $('.try-again-btn');
const $newGameBtn = $('.new-game-btn');
//END of "Collect Elements"

//Collect Variables-----------------------------------------------------------------

// TODO: Move game interface to Game class??
//Object ??? of ???: gameInterface Object
//An object to handle the user interface changes:
gameInterface = {
    //gameInterface Properties

    //END of 'gameInterface Properties'

    //gameInterface Methods
    //Called by $directionBtns' click listener:
    printNewLocationInformation() {
        $moveActionBtn.addClass('active-action');
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
        if (nearbyHazards.includes('wumpus') && nearbyHazards.includes('pit') && nearbyHazards.includes('bat') ) {
            clueContent = "It stinks, it's breezy, and I hear screeching... Am I trapped??"
        } else if (nearbyHazards.includes('wumpus') && nearbyHazards.includes('pit')) {
            clueContent = "It stinks and there's a breeze..."
        } else if (nearbyHazards.includes('pit') && nearbyHazards.includes('bat')) {
            clueContent = "I hear screeching and there's a breeze..."
        } else if (nearbyHazards.includes('wumpus') && nearbyHazards.includes('bat')) {
            clueContent = "It stinks and I hear screeching..."
        } else if (nearbyHazards.includes('wumpus')) {
            clueContent = 'Ugh, this room stinks!'
        } else if (nearbyHazards.includes('pit')) {
            clueContent = 'Where is that breeze coming from?'
        } else if (nearbyHazards.includes('bat')) {
            clueContent = 'What is that screeching... bats!?'
        } else {
            clueContent = 'Nothing...'
        }
        $clueDisplay.innerText = clueContent;
    },

    getEncounterScreen(encounterType) {
        const printEncounterMessage = () => {
            $encounterMessage[0].innerText = encounterMessageContent;
        }
        const returnToGameBoard = () => {
            this.printNewLocationInformation();
            $encounterScreen.hide();
            $gameBoardScreen.show();
        }
        const checkDropPoint = () => {
            game.getPresentHazards();
            game.getNearbyHazards();
            if(game.gameMap.rooms[game.player.currentLocation].hazards.length === 0) {
                returnToGameBoard();
            }
        }
        const triggerVictoryState = () => {
            $encounterMessage.hide();
            game.endGame('victory');
        }
        const triggerDefeatState = () => {
            $encounterMessage.hide();
            game.endGame('defeat');
        }
        let encounterMessageContent = '!!!';
        $gameBoardScreen.hide();
        $encounterMessage.show();
        $encounterScreen.show();
        printEncounterMessage();
        setTimeout(printEncounterMessage, 2000);
        switch (encounterType) {
            case 'carried away':
                encounterMessageContent = 'Huge bat, HUGE BAT!!!';
                setTimeout(checkDropPoint, 4000);
                break;
            case 'fallen':
                encounterMessageContent = 'Fallen...';
                setTimeout(triggerDefeatState, 4000);
                break;
            case 'eaten':
                encounterMessageContent = 'Eaten...';
                setTimeout(triggerDefeatState, 4000);
                break;
            case 'wumpus hit':
                encounterMessageContent = 'What an awful noise...';
                setTimeout(triggerVictoryState, 4000);
                break;
            default:
                encounterMessageContent = 'What was that?!'
                setTimeout(returnToGameBoard, 3000);
                break;
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
        this.player;
        this.gameMap;
        this.wumpus;
        this.pit;
        this.bat;
    }
    //END of 'Game Properties'

    //Game Methods
    startGame() {
        this.player = new Player('0');
        this.gameMap = new GameMap();
        this.wumpus = new Wumpus(Math.floor(Math.random() * 19)+1);
        this.pit = new Pit(Math.floor(Math.random() * 19)+1);
        this.bat = new Bat(Math.floor(Math.random() * 19)+1);
        this.gameMap.populateGameMap();
        this.gameMap.rooms[this.wumpus.currentLocation].hazards.push('wumpus');
        this.gameMap.rooms[this.pit.location].hazards.push('pit');
        this.gameMap.rooms[this.bat.location].hazards.push('bat');
        this.getNearbyHazards();
        gameInterface.printNewLocationInformation();
    }

    getNearbyHazards() {
        let nearbyHazards = [];
        this.gameMap.rooms[this.player.currentLocation].neighbors.forEach(
            (neighbor) => {
                if(this.gameMap.rooms[neighbor].hazards?.length !== 0) {
                    this.gameMap.rooms[neighbor].hazards.forEach(
                        (hazard) => {
                            if(hazard){
                                nearbyHazards.push(hazard) 
                            }
                        }
                    )
                    // nearbyHazards = [...nearbyHazards, ...this.gameMap.rooms[neighbor].hazards];
                }
            }
        )
        gameInterface.printClue(nearbyHazards);
    }

    getPresentHazards() {
        if (this.gameMap.rooms[this.player.currentLocation].hazards.includes('pit')) {
            gameInterface.getEncounterScreen('fallen');
        } else if (this.gameMap.rooms[this.player.currentLocation].hazards.includes('bat')) {
            this.relocatePlayer();
        } else if (this.gameMap.rooms[this.player.currentLocation].hazards.includes('wumpus')) {
            this.runWumpusEncounter();
        }
    }

    runWumpusEncounter() {
        let randomReaction;
        const randomReactionPicker = () => randomReaction = Math.floor(Math.random()*2)
        randomReactionPicker();
        switch (randomReaction) {
            case 1:
                gameInterface.getEncounterScreen('eaten');
                break;
            default:
                gameInterface.getEncounterScreen('close call');
                this.relocateWumpus();
                break;
        }
    }

    relocateWumpus() {
        this.wumpus.previousLocation = this.wumpus.currentLocation;
        this.wumpus.currentLocation = this.gameMap.rooms[this.wumpus.currentLocation].neighbors[Math.floor(Math.random()*3)];
        this.gameMap.rooms[this.wumpus.previousLocation].hazards.splice(this.gameMap.rooms[this.wumpus.previousLocation].hazards.indexOf('wumpus'), 1);
        this.gameMap.rooms[this.wumpus.currentLocation].hazards.push('wumpus');
    }

    relocatePlayer() {
        this.player.getNewPlayerLocation(Math.floor(Math.random() * 20));
        gameInterface.getEncounterScreen('carried away');
    }

    resetGame() {
        //Resets wumpus
        this.wumpus.previousLocation = this.wumpus.currentLocation;
        this.wumpus.currentLocation = this.wumpus.startLocation;
        //Resets map
        this.gameMap.rooms[this.wumpus.previousLocation].hazards.splice(this.gameMap.rooms[this.wumpus.previousLocation].hazards.indexOf('wumpus'), 1);
        this.gameMap.rooms[this.wumpus.currentLocation].hazards.push('wumpus');
        //Resets player
        this.player.previousLocation = this.player.currentLocation;
        this.player.currentLocation = this.player.startLocation;
        //this.player.arrowSupply = 5;
        this.getNearbyHazards();
        gameInterface.printNewLocationInformation();
        $encounterScreen.hide();
        $gameEndScreen.hide();
        $gameBoardScreen.show();
    }

    endGame(gameOutcome) {
        switch (gameOutcome) {
            case 'victory':
                $gameEndHeading.innerText = 'You Did It!';
                $outcomeMessage.innerText = 'You killed the Wumpus. Your colony is safe again...for now...';
                $tryAgainBtn.hide();
                break;
            default:
                $gameEndHeading.innerText = 'Game Over';
                $outcomeMessage.innerText = 'So much for bravery.';
                $tryAgainBtn.show();
                break;
        }
        $gameEndScreen.show()
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
    //TODO: Move methods to game class??
    //Updates player's location properties to reflect chosen direction;
    //Called by $directionBtns' click listener:
    getNewPlayerLocation(selectedLocationID) {
        this.previousLocation = this.currentLocation;
        this.currentLocation = selectedLocationID;
    }
    prepareArrow() {
        this.currentAction = 'preparing arrow'
        this.preparedArrow = new Arrow();
        $moveActionBtn.removeClass('active-action');
        $shootArrowBtn.addClass('active-action');
        $directionBtns.addClass('preparing-to-shoot');
    }
    putArrowAway() {
        this.currentAction = 'move';
        this.preparedArrow = undefined;
    }
    shootArrow() {
        this.currentAction = 'move';
        $moveActionBtn.addClass('active-action');
        $directionBtns.removeClass('selected-direction');
        $shootArrowBtn.removeClass('preparing-to-shoot')
        // FIXME: How to reference the parent class so I'm not calling on "game"?
        // Or should this method belong elsewhere?:
        if (this.preparedArrow.direction == game.wumpus.currentLocation) {
            gameInterface.getEncounterScreen('wumpus hit');
        } else {
            return;
        }
    }
    //END of 'Player Methods'
}

//Class ??? of ???: GameMap Class
class GameMap {
    //GameMap Properties
    // constructor () {

    // }
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
            this.rooms[i] = new Room (i);
        }
    } 
    //END of 'GameMap Methods'
}

//Class ??? of ???: Room Class
class Room {
    //Room Properties
    constructor (index) {
        this.roomID = index;
        // FIXME: How to reference parent class - or should this move?:
        this.neighbors = game.gameMap.rooms[index];
        this.hazards = [];
    }
    //END of 'Room Properties'

    //Room Methods
    //END of 'Room Methods'
}

//Class ??? of ???: Wumpus Class
class Wumpus {
    //Wumpus Properties
    constructor (locationID) {
        this.currentLocation = locationID;
        this.previousLocation = undefined;
        this.startLocation = locationID;
    }
    //END of 'Wumpus Properties'

    //Wumpus Methods
    //END of 'Wumpus Methods'
}

//Class ??? of ???: Bat Class
class Bat {
    //Bat Properties
    constructor (locationID){
        this.location = locationID;
    }
    //END of 'Bat Properties'

    //Bat Methods
    //END of 'Bat Methods'
}

//Class ??? of ???: Pit Class
class Pit {
    //Pit Properties
    constructor (locationID){
        this.location = locationID;
    }
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
//Execute Game Logic---------------------------------------------------------------
let game = new Game();
//END of "Execute Game Logic"


// --------------------------------------------------------------------------------
//Add Event Listeners--------------------------------------------------------------
//TODO: Should event listeners live in the Game class as methods?
$viewInstructionsBtns.on('click', function() {
    $instructionsScreen.show();
})
$exitInstructionsBtn.on('click', function() {
    $instructionsScreen.hide();
})
$enterBtn.on('click', function() {
    game.startGame();
    $introductionScreen.hide();
    $headerNavigation.show();
    $gameBoardScreen.show();
})
$newGameBtn.on('click', function() {
    game.startGame();
    $gameEndScreen.hide();
    $encounterScreen.hide();
    $gameBoardScreen.show();
})
$quitBtn.on('click', function() {
    //TODO: END GAME ()
    $gameBoardScreen.hide();
    $encounterScreen.hide();
    $gameEndScreen.hide();
    $headerNavigation.hide();
    $introductionScreen.show();
})
//FIXME: Should I refactor this to call a Game class method?
$directionBtns.on('click', function() {
    if (game.player.currentAction === 'move') {
        game.player.getNewPlayerLocation(this.value);
        game.getPresentHazards();
        game.getNearbyHazards();
        gameInterface.printNewLocationInformation();
    } else if (game.player.currentAction === 'preparing arrow') {
        game.player.preparedArrow.direction = this.value;
        $directionBtns.removeClass('preparing-to-shoot');
        $directionBtns.removeClass('selected-direction');
        this.classList.add('selected-direction');
        $shootArrowBtn.removeClass('active-action');
        $shootArrowBtn.addClass('preparing-to-shoot');

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
$moveActionBtn.on('click', function() {
    if (game.player.currentAction === 'preparing arrow') {
        game.player.putArrowAway();
        $directionBtns.removeClass('preparing-to-shoot selected-direction');
        $shootArrowBtn.removeClass('preparing-to-shoot active-action');
        $shootArrowBtn.hide();
        $prepareArrowBtn.show();
        $moveActionBtn.addClass('active-action');
    } else {
        return;
    }
})
$tryAgainBtn.on('click', function() {
    game.resetGame();
})
//END of "Add Event Listeners"
