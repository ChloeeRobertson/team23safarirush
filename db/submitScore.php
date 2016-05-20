<?php

/**
 * Get board configurations for different levels.
 */

require_once('config.php');
require_once('functions.php');

// Make connection to DB
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Clean $_GET variables
$name  = clean($_GET['name']);
$score = intval(clean($_GET['score']));

// Submit score and print results
if ($score && $name) {
    
    echo $conn->query(
        "INSERT INTO leaderboard (name, score)
        VALUES ('" . $name . "'," . $score . ")"
    );
}

?>
