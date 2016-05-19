/*
 * Functions to update the level button and change the level depending
 * on difficulty and level selected on the level selection modal
 *
 * Requires:
 *     - jQuery         [http://jquery.com/]
 */

// ----------------------------------------------------------
//               P U B L I C   F U N C T I O N S
// ----------------------------------------------------------

/*
 * Updates the level selection button to show current selected level
 */
// function updateLevelButton() {
//     $('#levelSelectionButton').html(
//         $('#difficulty').val().charAt(0).toUpperCase()
//         + $('#difficulty').val().substr(1)
//         + " - "
//         + $('#level').val()
//         + " <span class=\"glyphicon glyphicon-triangle-top\"></span>"
//     );
// }

/*
 * Changes the level based on the difficulty and level selected on the level selection modal.
 */
function changeLevel() {
    var diff = $('#difficulty').val();
    var lvl = parseInt($('#level').val());

    // Modify the level value depending on difficulty to get correct configuration
    if (diff == "intermediate") {
        lvl += 10;
    } else if (diff == "advanced") {
        lvl += 20;
    } else if (diff == "expert") {
        lvl += 30;
    }

    sr.loadLevel(lvl);

    // Hide the modal after level selection
    $('#levelModal').modal('hide');
    return false;
};
