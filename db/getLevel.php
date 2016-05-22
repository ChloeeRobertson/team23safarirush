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
$level = clean($_GET['level']);

// Grab level data from DB and convert to levelString format
if ($level) {

	$result = $conn->query(
		"SELECT level, boardSize, goalX, goalY, jeepPiece, pieces
        FROM levels
        WHERE level = " . $level . ";"
	);

	while ($row = $result->fetch_assoc()) {
	    echo $row['level'] . ',' . $row['boardSize'] . ',' . $row['goalX'] . ',' . $row['goalY'] . ',' . $row['jeepPiece'] . 'j,' . $row['pieces'];
	}
}

?>
