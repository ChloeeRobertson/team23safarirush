<?php

/**
 * Submit scores to leaderboard and update levels' statistics
 */

require_once('config.php');
require_once('functions.php');

// Make connection to DB
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Clean $_GET variables
$name        	= clean($_GET['name']);
$totalScore  	= clean($_GET['totalScore']);
$achievements  	= clean($_GET['achievements']);

// Non-empty total score and name
if ($totalScore && $name) {

	// Total score into leaderboard
	$sql = "INSERT INTO leaderboard (name, score)
            VALUES ('" . $name . "'," . $totalScore . ");";

    if ($achievements) {
    	$parts = explode('_', $achievements);

    	foreach($parts as $achievement) {
    		$pieces = explode(',', $achievement);
    		$difficulty = $pieces[0];
    		$numMoves = $pieces[1];
    		$secondsUsed = $pieces[2];
    		$score = $pieces[3];

    		$sql .= "INSERT INTO " . $achievedTableName[$difficulty] . " (name, numMoves, secondsUsed, score) VALUES ('" . $name . "', " . $numMoves . ", " . $secondsUsed . ", " . $score . ");";
    	}
    }

    // Execute query
    $result = $conn->multi_query($sql);

    if (!$result) {
        echo 'error: ';
    } else {
        echo 'success';
    }
}

$conn->close();

?>
