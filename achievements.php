<?php
// Get database configurations
require_once('db/config.php');

// Make connection to DB
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

function getSQL($tableName) {
    return "SELECT name, numMoves, secondsUsed, score
            FROM " . $tableName . " ORDER BY score DESC
            LIMIT 10";
}

function formatTime($seconds) {
    return date('i:s', mktime(0, 0, $seconds));
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Safari Rush - Achievements</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

    <!-- Eric Meyer's Reset 2.0 -->
    <link rel="stylesheet" href="css/meyerreset.css">

    <!-- Safari Rush -->
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/achievements.css">
</head>
<body>

    <!-- Site navigation bar -->
    <nav class="navbar navbar-default">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="index.html">Safari Rush</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li><a href="index.html"><span class="glyphicon glyphicon-grain"></span> Play</a></li>
                    <li><a href="leaderboard.php"><span class="glyphicon glyphicon-sort-by-attributes-alt"></span> Leaderboard</a></li>
                    <li><a href="howtoplay.html"><span class="glyphicon glyphicon-question-sign"></span> How to Play</a></li>
                    <li><a href="achievements.php"><span class="glyphicon glyphicon-king"></span> Achievements</a></li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="aboutus.html"><span class="glyphicon glyphicon-user"></span> About Us</a></li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>

    <div id="main" class="container">
        <?php
            // $achieved = array of table names for achievements
            foreach ($achievedTableName as $index => $table_name) {
                $result = $conn->query(getSQL($table_name));
        ?>
        <div class="row">
            <div class="col-xs-12">
                <table class="table">
                    <!-- Title can be changed in db/config.php -->
                    <h1><?php echo $achievedName[$index]; ?></h1>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th># of Moves</th>
                        <th>Time Used</th>
                    </tr>
                    <?php
                        $rank = 0;
                        while ($row = $result->fetch_assoc()) {
                    ?>
                    <tr>
                        <td><?php echo ++$rank; ?></td>
                        <td><?php echo $row['name']; ?></td>
                        <td><?php echo $row['numMoves']; ?></td>
                        <td><?php echo formatTime($row['secondsUsed']); ?></td>
                    </tr>
                    <?php
                        }
                    ?>
                </table>
            </div>
        </div>
        <?php
            }
        ?>
    </div>

</body>
</html>

