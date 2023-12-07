'use strict,'
// --------------------------------------------------------------------------------
//Collect Elements-----------------------------------------------------------------
//Game Screens
const $introductionScreen = $('.introduction-screen');
const $instructionsScreen = $('.instructions-screen');
const $gameBoardScreen = $('.game-board-screen');
const $eventScreen = $('.event-screen');
const $gameEndScreen = $('.game-end-screen');
//Interactive Components
const $viewInstructionsBtn = $('.view-instructions-btn');
const $enterBtn = $('.enter-btn');
const $exitInstructionsBtn = $('.exit-instructions-btn');
//END of "Collect Elements"



// --------------------------------------------------------------------------------
//Collect Classes------------------------------------------------------------------

//END of "Collect Classes"



// --------------------------------------------------------------------------------
//Add Event Listeners--------------------------------------------------------------
$viewInstructionsBtn.on('click', function() {
    $introductionScreen.hide();
    $instructionsScreen.show();
})
$exitInstructionsBtn.on('click', function() {
    $instructionsScreen.hide();
    $introductionScreen.show();
})
$enterBtn.on('click', function() {
    $introductionScreen.hide();
    $gameBoardScreen.show();
})
//END of "Add Event Listeners"



// --------------------------------------------------------------------------------
//Execute Game Logic---------------------------------------------------------------

//END of "Execute Game Logic"