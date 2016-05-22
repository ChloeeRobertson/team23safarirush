<?php

/**
 * Get score averages for different levels.
 */

require_once('config.php');
require_once('functions.php');

// Make connection to DB
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Grab level data from DB and convert to levelString format
$result = $conn->query(
    "SELECT level, avgNumMoves, avgSecondsUsed
    FROM levelStatistics;"
);

// Print results out
while ($row = $result->fetch_assoc()) {
    echo $row['level'] . ',' . $row['avgNumMoves'] . ',' . $row['avgSecondsUsed'] . "\n";
}

?>
