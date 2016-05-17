
CREATE TABLE levels (
    difficulty INT(1) UNSIGNED NOT NULL,
    level INT(2) UNSIGNED NOT NULL PRIMARY KEY,
    boardSize INT(1) UNSIGNED NOT NULL,
    goalX INT(1) UNSIGNED NOT NULL,
    goalY INT(1) UNSIGNED NOT NULL,
    jeepPiece INT(4) UNSIGNED ZEROFILL NOT NULL,
    pieces VARCHAR(200) NOT NULL
);

INSERT INTO levels
    (difficulty, level, boardSize, goalX, goalY, jeepPiece, pieces)
VALUES
    (1, 1, 6, 5, 2, 1221, "0021,5013,0113,3113,0412,4421,2531"),
    (1, 2, 6, 5, 2, 0221, "0012,3031,3112,5113,4212,0331,2412,4421,0521,3521"),
    (1, 3, 6, 5, 2, 1221, "3213,1321,5313,1412,2521"),
    (1, 4, 6, 5, 2, 1221, "0013,3013,2312,3331,5412,2531"),
    (1, 5, 6, 5, 2, 1221, "0021,3013,5012,0113,4113,5212,1331,0412,4421,4521"),
    (1, 6, 6, 5, 2, 1221, "0021,0121,0321,0412,2312,3012,3213,3531,4113,5113"),
    (1, 7, 6, 5, 2, 1221, "1012,2021,4012,5012,3112,5212,2321,3412"),
    (1, 8, 6, 5, 2, 0221, "0321,0421,0521,2121,2212,2412,3021,3212,3431,3531,4112,4321,5013"),
    (1, 9, 6, 5, 2, 0221, "0313,1012,1331,2021,2412,3112,4021,4121,4213,5212,5412"),
    (1, 10, 6, 5, 2, 1221, "0021,0121,0213,0521,2012,1331,3412,4021,4421,4521,5113");






CREATE TABLE leaderboard (
    name VARCHAR(30) NOT NULL,
    score INT(4) UNSIGNED NOT NULL
);

INSERT INTO leaderboard
    (name, score)
VALUES
    ('Christopher', 2000),
    ('Liam', 3000),
    ('Mason', 4000),
    ('Jacob', 5000),
    ('William', 6000),
    ('Ethan', 7000),
    ('James', 8000),
    ('Alexander', 9000),
    ('Megan', 1000),
    ('Benjamin', 9999);
    