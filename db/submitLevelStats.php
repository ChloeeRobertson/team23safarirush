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
$level       = clean($_GET['level']);
$numMoves    = clean($_GET['numMoves']);
$secondsUsed = clean($_GET['secondsUsed']);

// Non-empty
if ($level && $numMoves && $secondsUsed) {

    // Get current level stats
    $sql = "SELECT avgNumMoves, avgSecondsUsed, totalNumMoves, totalSecondsUsed, numScores
        FROM levelStatistics
        WHERE level = " . $level . ";";
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $numScores        = $row['numScores'];
        $totalNumMoves    = $row['totalNumMoves'];
        $totalSecondsUsed = $row['totalSecondsUsed'];
        $avgNumMoves      = $row['avgNumMoves'];
        $avgSecondsUsed   = $row['avgSecondsUsed'];
    }

    // No stats from database, create it
    if ($numScores <= 0) {
        $numScores        = 1;
        $totalNumMoves    = $numMoves;
        $totalSecondsUsed = $secondsUsed;
        $avgNumMoves      = $numMoves;
        $avgSecondsUsed   = $secondsUsed;
    }

    // Re-calculate stats combining player's level scores
    else {
        $numScores        += 1;
        $totalNumMoves    += $numMoves;
        $totalSecondsUsed += $secondsUsed;
        $avgNumMoves       = $totalNumMoves / $numScores;
        $avgSecondsUsed    = $totalSecondsUsed / $numScores;
    }

    // Push new stats into database
    $sql = "UPDATE levelStatistics
        SET numScores='" . $numScores . "',
            totalNumMoves='" . $totalNumMoves . "',
            totalSecondsUsed='" . $totalSecondsUsed . "',
            avgNumMoves='" . $avgNumMoves . "',
            avgSecondsUsed='" . $avgSecondsUsed . "'
        WHERE level='" . $level . "'";

    // echo $sql;

    // Update database stats
    $conn->query($sql);
}

$conn->close();

?>
