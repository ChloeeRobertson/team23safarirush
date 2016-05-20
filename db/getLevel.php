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
$level      = trim($_GET['level']);
$difficulty = trim($_GET['difficulty']);

// Grab 1 level from DB
if ($level) {
    $sql = "SELECT level, boardSize, goalX, goalY, jeepPiece, pieces
            FROM levels
            WHERE level = " . $level;
}

// Grab all levels in a difficulty rating
else if ($difficulty) {
    $sql = "SELECT level, boardSize, goalX, goalY, jeepPiece, pieces
            FROM levels
            WHERE difficulty = " . $difficulty;
}

// Query and print results
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    echo $row['level'] . ',' . $row['boardSize'] . ',' . $row['goalX'] . ',' . $row['goalY'] . ',' . $row['jeepPiece'] . 'j,' . $row['pieces'] . "\n";
}

?>
