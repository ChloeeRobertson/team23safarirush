<?php

/**
 * Get board configurations for different levels.
 */

require_once('config.php');

// Make connection to DB
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Trim $_GET variables
$action = trim($_GET['action']);

// Grab top 10
if ($action == 'top10') {
    $sql = "SELECT name, score
            FROM leaderboard
            ORDER BY score DESC
            LIMIT 10";

    // Query and print results
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        echo $row['name'] . ',' . $row['score'] . "\n";
    }
}

// Post new high score
else if ($action == 'post') {
    $name  = trim($_GET['name']);
    $score = intval($_GET['score']);

    $sql = "INSERT INTO leaderboard (name, score)
            VALUES ('" . $name . "'," . $score . ")";

    // Query and print results
    echo $conn->query($sql);
}

?>
