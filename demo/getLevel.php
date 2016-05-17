<?php

$host = 'mysql1.000webhost.com';
$db   = 'a3917352_safari';
$user = 'a3917352_safari';
$pass = 'safarirush23';

$levelNum = trim($_GET['level']);
$conn     = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

$sql = "SELECT level, boardSize, goalX, goalY, jeepPiece, pieces
        FROM levels
        WHERE level = " . $levelNum;

$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    echo $row['boardSize'] . ',' . $row['goalX'] . ',' . $row['goalY'] . ',' . $row['jeepPiece'] . ',' . $row['pieces'];
}

?>
