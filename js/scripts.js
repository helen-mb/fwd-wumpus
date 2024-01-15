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
const $viewFinderContents = $('.view-finder-contents');
//Visual Elements
const $currentLocationIDDisplay = $('.current-location-id-display')[0];
const $clueDisplay = $('.clue-display')[0];
const $gameMessage = $('.game-message')[0];
const $encounterMessage = $('.encounter-message');
const $gameEndHeading = $('.game-end-heading')[0];
const $outcomeMessage = $('.outcome-message')[0];
const $currentActionDisplay = $('.current-action-display')[0];
const $moveActionImage = $('.move-action-image');
const $shootActionImage = $('.shoot-action-image');
const $defeatImage = $('.defeat-image');
const $victoryImage = $('.victory-image');
const $mapImage = $('.map')[0];
//Interactive Components
const $viewInstructionsBtns = $('.view-instructions-btn');
const $enterBtn = $('.enter-btn');
const $exitInstructionsBtn = $('.hide-instructions-btn');
const $quitBtn = $('.quit-btn');
const $directionBtns = $('.direction-btn');
const $actionBtns = $('.action-btn');
const $moveActionBtn = $('.move-action-btn');
const $prepareArrowBtn = $('.prepare-arrow-btn');
const $shootArrowBtn = $('.shoot-arrow-btn');
const $tryAgainBtn = $('.try-again-btn');
const $newGameBtn = $('.new-game-btn');
//END of "Collect Elements"

//gameInterface Object
//An object to handle the user interface changes:
gameInterface = {
    //gameInterface Methods
    //---Updates the map to reflect the player's current room
    updateMap(roomID) {
        let newImageSrc = `images/map.${roomID}.png`
        $mapImage.setAttribute('src', newImageSrc);
    },

    printNewLocationInformation() {
        $moveActionBtn.addClass('active-action');
        //---Updates the printed display of the player's current location:
        $currentLocationIDDisplay.innerText = game.player.currentLocation;
        //---Updates the direction controls' values and displays to reflect
        //---the neighbors of the player's new location:
        for (let i = 0; i < $directionBtns.length; i++) {
            $directionBtns[i].value = game.gameMap.rooms[game.player.currentLocation].neighbors[i];
            $directionBtns[i].innerText = `Room ${$directionBtns[i].value}`;
        }
    },
    //---Sets the contents of the printed clue based on which hazards are in neighboring rooms
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
            clueContent = 'Ugh, this room stinks! It must be close.'
        } else if (nearbyHazards.includes('pit')) {
            clueContent = 'Where is that breeze coming from?'
        } else if (nearbyHazards.includes('bat')) {
            clueContent = 'What is that screeching... bats!?'
        } else {
            clueContent = 'Nothing...'
        }
        $clueDisplay.innerText = clueContent;
    },
    //---Handles the DOM manipulation during encounter events
    getEncounterScreen(encounterType) {
        const printEncounterMessage = () => {
            $gameMessage.innerText = encounterMessageContent;
        }
        const returnToGameBoard = () => {
            encounterMessageContent = "Which room do you want to investigate?";
            gameInterface.updateMap(game.player.currentLocation);
            printEncounterMessage();
            this.printNewLocationInformation();
            $directionBtns.prop('disabled', false);
            $actionBtns.prop('disabled', false);
            $encounterScreen.hide();
            $viewFinderContents.show();
        }
        const checkDropPoint = () => {
            game.getPresentHazards();
            game.getNearbyHazards();
            if(game.gameMap.rooms[game.player.currentLocation].hazards.length === 0) {
                returnToGameBoard();
            }
        }
        const triggerVictoryState = () => {
            encounterMessageContent = "Victory!";
            $victoryImage.show();
            printEncounterMessage();
            game.endGame('victory');
        }
        const triggerDefeatState = () => {
            encounterMessageContent = "You are dead.";
            $moveActionImage.hide();
            $shootActionImage.hide();
            $currentActionDisplay.innerText = 'Hopefully Resting In Peace';
            $defeatImage.show();
            printEncounterMessage();
            game.endGame('defeat');
        }
        let encounterMessageContent = '!!!';
        $directionBtns.prop('disabled', true);
        $actionBtns.prop('disabled', true);
        $viewFinderContents.hide();
        $encounterScreen.show();
        printEncounterMessage();
        setTimeout(printEncounterMessage, 1000);
        switch (encounterType) {
            case 'carried away':
                encounterMessageContent = 'Something carried you to a new room!';
                setTimeout(checkDropPoint, 3000);
                break;
            case 'fallen':
                encounterMessageContent = 'Fallen...';
                setTimeout(triggerDefeatState, 3000);
                break;
            case 'eaten':
                encounterMessageContent = 'Eaten...';
                setTimeout(triggerDefeatState, 3000);
                break;
            case 'wumpus hit':
                encounterMessageContent = 'What an awful noise...';
                setTimeout(triggerVictoryState, 3000);
                break;
            default:
                encounterMessageContent = 'That was close! It almost got you.'
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
        $gameMessage.innerText = "Which room do you want to investigate?";
        gameInterface.updateMap(0);
        gameInterface.printNewLocationInformation();
    }

    getNearbyHazards() {
        let nearbyHazards = [];
        this.gameMap.rooms[this.player.currentLocation].neighbors.forEach(
            (neighbor) => {
                if(this.gameMap.rooms[neighbor].hazards.length !== 0) {
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
        $gameMessage.innerText = "Which room do you want to investigate?";
        gameInterface.updateMap(game.player.currentLocation);
        gameInterface.printNewLocationInformation();
        $encounterScreen.hide();
        $gameEndScreen.hide();
        $viewFinderContents.show();
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
        $directionBtns.prop('disabled', true);
        $actionBtns.prop('disabled', true);
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
    }
    putArrowAway() {
        this.currentAction = 'move';
        this.preparedArrow = undefined;
    }
    shootArrow() {
        this.currentAction = 'move';
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

// --------------------------------------------------------------------------------
//Add Event Listeners--------------------------------------------------------------

//---Handlers for instruction screen behavior:
$viewInstructionsBtns.on('click', function() {
    $instructionsScreen.show();
})

$exitInstructionsBtn.on('click', function() {
    $instructionsScreen.hide();
})

//---Handlers for buttons that start/restart the game:
$enterBtn.on('click', function() {
    game.startGame();
    $introductionScreen.hide();
    $headerNavigation.show();
    $viewFinderContents.show();
    $gameBoardScreen.show();
    $currentActionDisplay.innerText = 'MOVING';
    $victoryImage.hide();
    $defeatImage.hide();
    $moveActionImage.show();
    $directionBtns.prop('disabled', false);
    $actionBtns.prop('disabled', false);
})

$newGameBtn.on('click', function() {
    game.startGame();
    $gameEndScreen.hide();
    $encounterScreen.hide();
    $viewFinderContents.show();
    $currentActionDisplay.innerText = 'MOVING';
    $victoryImage.hide();
    $defeatImage.hide();
    $moveActionImage.show();
    $directionBtns.prop('disabled', false);
    $actionBtns.prop('disabled', false);
})

$tryAgainBtn.on('click', function() {
    game.resetGame();
    $defeatImage.hide();
    $moveActionImage.show();
    $currentActionDisplay.innerText = 'MOVING';
    $directionBtns.prop('disabled', false);
    $actionBtns.prop('disabled', false);
})

//---Handler for buttons that quit the game:
    //Basically hides the active game so the player is forced to start a new game
$quitBtn.on('click', function() {
    //TODO: END GAME ()
    $gameBoardScreen.hide();
    $encounterScreen.hide();
    $gameEndScreen.hide();
    $headerNavigation.hide();
    $introductionScreen.show();
})

//---Handlers for game control buttons:
    //*** A note on added/removed classes:
    //They add/remove glow effects to reflect and help guide user behavior
$directionBtns.on('click', function() {
    //By default, player action is set to "move"
    if (game.player.currentAction === 'move') {
        gameInterface.updateMap(this.value);
        game.player.getNewPlayerLocation(this.value);
        game.getPresentHazards();
        game.getNearbyHazards();
        gameInterface.printNewLocationInformation();
    //Function of the direction btns change if user is prepping an arrow
    } else if (game.player.currentAction === 'preparing arrow') {
        $gameMessage.innerText = `Aiming for Room ${this.value}. Shoot!`;
        game.player.preparedArrow.direction = this.value;
        $directionBtns.removeClass('preparing-to-shoot');
        $directionBtns.removeClass('selected-direction');
        this.classList.add('selected-direction');
        $shootArrowBtn.prop('disabled', false);
        $shootArrowBtn.removeClass('active-action');
        $shootArrowBtn.addClass('preparing-to-shoot');
    }
})

$prepareArrowBtn.on('click', function() {
    $currentActionDisplay.innerText = 'PREPARING TO SHOOT'
    $gameMessage.innerText = 'You are preparing an arrow. What room are you aiming for?';
    $moveActionImage.hide();
    $shootActionImage.show();
    $moveActionBtn.removeClass('active-action');
    $shootArrowBtn.addClass('active-action');
    $shootArrowBtn.prop('disabled', true);
    $prepareArrowBtn.hide();
    $shootArrowBtn.show();
    $directionBtns.addClass('preparing-to-shoot');
    game.player.prepareArrow();
})

$shootArrowBtn.on('click', function() {
    $currentActionDisplay.innerText = 'MOVING'
    $gameMessage.innerText = 'You are on the move. What room do you want to investigate?';
    $shootActionImage.hide();
    $moveActionImage.show();
    $directionBtns.removeClass('selected-direction');
    $directionBtns.removeClass('selected-direction');
    $shootArrowBtn.removeClass('preparing-to-shoot')
    $shootArrowBtn.hide();
    $prepareArrowBtn.show();
    $moveActionBtn.addClass('active-action');
    game.player.shootArrow();
})

$moveActionBtn.on('click', function() {
    if (game.player.currentAction === 'preparing arrow') {
        $currentActionDisplay.innerText = 'MOVING'
        $gameMessage.innerText = 'You are on the move. What room do you want to investigate?'; 
        $shootActionImage.hide();
        $moveActionImage.show();
        $directionBtns.removeClass('preparing-to-shoot selected-direction');
        $shootArrowBtn.removeClass('preparing-to-shoot active-action');
        $shootArrowBtn.hide();
        $prepareArrowBtn.show();
        $moveActionBtn.addClass('active-action');
        game.player.putArrowAway();
    } else {
        return;
    }
})

//END of "Add Event Listeners"
