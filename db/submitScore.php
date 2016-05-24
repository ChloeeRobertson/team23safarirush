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
$name        = clean($_GET['name']);
$totalScore  = clean($_GET['totalScore']);

// Split scores for individual levels
$levelsScore = explode(',', clean($_GET['levelsScore']));

// Non-empty total score and name
if ($totalScore && $name) {

	// Total score into leaderboard
	$sql = "INSERT INTO leaderboard (name, score)
            VALUES ('" . $name . "'," . $totalScore . ");";

            echo $sql;

    // Execute query
    $conn->query($sql);
}

?>
