var MAP_WIDTH = 10;
var MAP_HEIGHT = 10;
var MAX_WIDTH = 40;
var MAX_HEIGHT = 20;

var CANVAS = document.querySelector("canvas");
var CONTEXT = CANVAS.getContext("2d");

var INTRO = true;
var GAME_OVER = false;
var WIN = false;
var PAUSE = false;

var SNAKE = {
    position: [[0, 0], [1, 0]],
    head: [1, 0],
    tail: [0, 0],
    score: 10000,
    direction: "S" // WASD
};

var UPGRADES = {
    appleWorth: 1,
    appleAmount: 1,
    widthPrice: 15,
    heightPrice: 15,
    cutPrice: 20,
    appleWorthPrice: 4,
    appleAmountPrice: 4,
};

function drawGame(map){
    // Clear the canvas.
    CONTEXT.clearRect(0, 0, 1280, 720);

    drawGrid();
    drawGUI();

    for (row = 0; row < MAP_HEIGHT; row++){
        for (col = 0; col < MAP_WIDTH; col++){
           if (map[row][col] == "A"){
               drawApple(row, col);
           }

           else if (map[row][col] == "H"){
               drawHead(row, col);
           }

           else if (map[row][col] == "B"){
            drawBody(row, col);
            }

        }
    }
}

function createMap(){
    // H - Snake head
    // B - Snake body
    // A - Apple
    // X - Empty space on map
    map = [];
    for (i = 0; i < MAX_HEIGHT; i++){
        map.push([]);
        for (y = 0; y < MAX_WIDTH; y++){
            if (y < MAP_WIDTH && i < MAP_HEIGHT){
                map[i].push("X");
            }
            // else{
            //     map[i].push("0");
            // }
            
        }
    }
    map[0][0] = "B";
    map[0][1] = "H";
    return map;
}

function addApple(map){
    // Adds an apple to the map randomly.
    var row = Math.round(Math.random() * (MAP_HEIGHT - 1));
    var col = Math.round(Math.random() * (MAP_WIDTH - 1));
    while(map[row][col] != "X"){
    // If apple position is generated inproperly, keep generating.
        var row = Math.round(Math.random() * (MAP_HEIGHT - 1));
        var col = Math.round(Math.random() * (MAP_WIDTH - 1));
    }
    // Add apple and return map.
    map[row][col] = "A";
    return map;
}

function drawGrid(){
    // Draw the grid based on width and height.
    for (i = 0; i < MAP_WIDTH; i++){
        for (y = 0; y < MAP_HEIGHT; y++){
            CONTEXT.beginPath();
            CONTEXT.rect(i * 25, y * 25, 25, 25);
            CONTEXT.fillStyle = 'white';
            CONTEXT.fill();
            CONTEXT.lineWidth = 1;
            CONTEXT.strokeStyle = 'black';
            CONTEXT.stroke();
        }
    }
}

function drawApple(row, col){
    CONTEXT.beginPath();
    CONTEXT.rect(col * 25, row * 25, 25, 25);
    CONTEXT.fillStyle = 'red';
    CONTEXT.fill();
    CONTEXT.lineWidth = 1;
    CONTEXT.strokeStyle = 'black';
    CONTEXT.stroke();
}

function drawHead(row, col){
    CONTEXT.beginPath();
    CONTEXT.rect(col * 25, row * 25, 25, 25);
    CONTEXT.fillStyle = 'yellow';
    CONTEXT.fill();
    CONTEXT.lineWidth = 1;
    CONTEXT.strokeStyle = 'black';
    CONTEXT.stroke();
}

function drawBody(row, col){
    CONTEXT.beginPath();
    CONTEXT.rect(col * 25, row * 25, 25, 25);
    CONTEXT.fillStyle = 'green';
    CONTEXT.fill();
    CONTEXT.lineWidth = 1;
    CONTEXT.strokeStyle = 'black';
    CONTEXT.stroke();
}

function drawGUI(){
    // Draw score
    CONTEXT.font = '14pt Arial';
    CONTEXT.fillStyle = "black";
    CONTEXT.fillText('Score: ' + SNAKE.score, 0, 550);
    // Draw information about upgrades
    CONTEXT.fillText('H: Upgrade width ', 1050, 50);
    if (MAP_WIDTH < MAX_WIDTH){
        CONTEXT.fillText("Price: " + UPGRADES.widthPrice, 1050, 75);
    }
    else{
        CONTEXT.fillText("Max level reached ", 1050, 75);
    }
    CONTEXT.fillText('J: Upgrade height ', 1050, 110);
    if (MAP_HEIGHT < MAX_HEIGHT){
        CONTEXT.fillText("Price: " + UPGRADES.heightPrice, 1050, 135);
    }
    else{
        CONTEXT.fillText("Max level reached ", 1050, 135);
    }
    CONTEXT.fillText('K: Upgrade apple value ', 1050, 170);
    CONTEXT.fillText("Price: " + UPGRADES.appleWorthPrice, 1050, 195);
    CONTEXT.fillText('L: Upgrade apple spawn ', 1050, 230);
    CONTEXT.fillText("Price: " + UPGRADES.appleAmountPrice, 1050, 255);
    CONTEXT.fillText('G: Cut the snake ', 1050, 290);
    CONTEXT.fillText("Price: " + UPGRADES.cutPrice, 1050, 315);
    CONTEXT.fillText('P: Pause ', 1050, 350);
    if (PAUSE){
        CONTEXT.fillText('THE GAME IS PAUSED', 1050, 375);
    }
}

function drawGameOver(){
    CONTEXT.clearRect(0, 0, 1280, 720);
    CONTEXT.font = '20pt Arial';
    CONTEXT.fillStyle = "black";
    CONTEXT.fillText('YOU HAVE LOST, PRESS "A" TO START AGAIN', 320, 360);
}

function drawIntro(){
    CONTEXT.clearRect(0, 0, 1280, 720);
    CONTEXT.font = '20pt Arial';
    CONTEXT.fillStyle = "green";
    CONTEXT.fillText('1_000_000 SNAKE', 320, 360);
    CONTEXT.font = '14pt Arial';
    CONTEXT.fillStyle = "black";
    CONTEXT.fillText('Your goal is to reach 1_000_000 points. Press enter to start the game.', 320, 410);
}

function drawWin(){
    CONTEXT.clearRect(0, 0, 1280, 720);
    CONTEXT.font = '24pt Arial';
    CONTEXT.fillStyle = "green";
    CONTEXT.fillText('You have managed to become the 1_000_000 SNAKE!', 240, 360);
    CONTEXT.fillText('You are the best snake I know!', 240, 410);
}

function checkWin(){
    if (SNAKE.score >= 1000000){
        WIN = true;
    }
}

function snakeMove(map){
    // Moves the snake on the map

    // Turn the head into body
    map[SNAKE.head[1]][SNAKE.head[0]] = "B";
    // Remove tail
    map[SNAKE.tail[1]][SNAKE.tail[0]] = "X";

    // Move in desired direction
    if (SNAKE.direction == "D"){
        SNAKE.head[0] += 1;
    }

    else if (SNAKE.direction == "A"){
        SNAKE.head[0] -= 1;
    }

    else if (SNAKE.direction == "S"){
        SNAKE.head[1] += 1;
    }

    else if (SNAKE.direction == "W"){
        SNAKE.head[1] -= 1;
    }

    // Check if collision happened.
    if (collision(map, SNAKE.head[1], SNAKE.head[0])){
        GAME_OVER = true;
    }
    
    // If apple is found on the move, restore tail => the snake becomes bigger.
    if (appleFound(map, SNAKE.head[1], SNAKE.head[0])){
        // Restore the tail
        map[SNAKE.tail[1]][SNAKE.tail[0]] = "B";
        map[SNAKE.head[1]][SNAKE.head[0]] = "H";
        SNAKE.position.push([SNAKE.head[0], SNAKE.head[1]]);
    }

    else{
        SNAKE.position.shift();
        SNAKE.tail = SNAKE.position[0];
        map[SNAKE.head[1]][SNAKE.head[0]] = "H";
        SNAKE.position.push([SNAKE.head[0], SNAKE.head[1]]);
    } 
}

function userInput(event){
    // Function handling user input
    keyCode = event.keyCode
    keyPressed = String.fromCharCode(event.keyCode);

    if (INTRO){
        if (keyCode == 13){
            INTRO = false;
            return;
        }
        else{
            return;
        }
    }

    if (GAME_OVER){
        if (keyPressed == "A"){
            GAME_OVER = false;
            return;
        }
        else{
            return;
        }
    }

    // Changes the direction of snake. Cannot change direction to the opposite.
    // I remove the event listener to prevent the player from making multiple moves in a round.
    if (keyPressed == "W" && SNAKE.direction != "S"){
        SNAKE.direction = keyPressed;
        document.removeEventListener("keydown", userInput);
    }

    else if (keyPressed == "A" && SNAKE.direction != "D"){
        SNAKE.direction = keyPressed;
        document.removeEventListener("keydown", userInput);
    }

    else if (keyPressed == "S" && SNAKE.direction != "W"){
        SNAKE.direction = keyPressed;
        document.removeEventListener("keydown", userInput);
    }

    else if (keyPressed == "D" && SNAKE.direction != "A"){
        SNAKE.direction = keyPressed;
        document.removeEventListener("keydown", userInput);
    }

    // Changes the direction of snake. Input for arrows.
    if (keyCode == 38 && SNAKE.direction != "S"){
        SNAKE.direction = "W";
        document.removeEventListener("keydown", userInput);
    }

    else if (keyCode == 37 && SNAKE.direction != "D"){
        SNAKE.direction = "A";
        document.removeEventListener("keydown", userInput);
    }

    else if (keyCode == 40 && SNAKE.direction != "W"){
        SNAKE.direction = "S";
        document.removeEventListener("keydown", userInput);
    }

    else if (keyCode == 39 && SNAKE.direction != "A"){
        SNAKE.direction = "D";
        document.removeEventListener("keydown", userInput);
    }

    // Pauses the game
    else if (keyPressed == "P"){
        if(PAUSE){
            PAUSE = false;
        }

        else{
            PAUSE = true;
        }
    }

    else {
        upgradeSnake(keyPressed);
    }
}

function appleFound(map, row, col){
    // Increments score if apple is found. Generates new apple.
    // Makes the snake bigger. Returns true if an apple is found.
    if (map[row][col] == "A"){
        SNAKE.score += UPGRADES.appleWorth;
        addApple(map);
        return true;
    }
    return false;
}

function collision(map, row, col){
    // Returns true if collision happens.
    // (Snake gets out of boundaries or overlaps.)
    if (row == -1 || row >= MAP_HEIGHT ){
        return true;
    }

    else if (col == -1 || col >= MAP_WIDTH ){
        return true;
    }

    else if (map[row][col] == "B"){
        return true;
    }
}

function addCol(){
    // Adds a col to the map.
    for (i = 0; i < MAP_HEIGHT; i++){
        map[i].push("X");
    }
}

function addRow(){
    // Adds a row to the map.
    map.push([]);
    for (i = 0; i < MAP_WIDTH; i++){
        map[MAP_HEIGHT].push("X");
    }
}

function checkApples(map){
    // The apple sometimes does not appear for some reason.
    // This function adresses this issue.
    var ctr = 0;
    for (i = 0; i < MAP_HEIGHT; i++){
        for (y = 0; y < MAP_WIDTH; y++){
            if (map[i][y] == "A"){
                ctr += 1;
            }
        }
    }
    if (ctr != UPGRADES.appleAmount){
        addApple(map);
    }
}

function upgradeSnake(key){
    // Upgrades the Snake if he has got enough points.
    if (key == "H" && MAP_WIDTH != MAX_WIDTH && SNAKE.score >= UPGRADES.widthPrice){
        MAP_WIDTH += 1;
        SNAKE.score -= UPGRADES.widthPrice;
        UPGRADES.widthPrice *= 1.5;
        UPGRADES.widthPrice = Math.ceil(UPGRADES.widthPrice);
        addCol();
    }

    else if (key == "J" && MAP_HEIGHT != MAX_HEIGHT && SNAKE.score >= UPGRADES.heightPrice){
        MAP_HEIGHT += 1;
        SNAKE.score -= UPGRADES.heightPrice;
        UPGRADES.heightPrice *= 2;
        UPGRADES.heightPrice = Math.ceil(UPGRADES.heightPrice);
        addRow();
    }

    else if (key == "K" && SNAKE.score >= UPGRADES.appleWorthPrice){
        UPGRADES.appleWorth *= 2;
        SNAKE.score -= UPGRADES.appleWorthPrice;
        UPGRADES.appleWorthPrice = Math.ceil(UPGRADES.appleWorthPrice * 2.3);
    }

    else if (key == "L" && SNAKE.score >= UPGRADES.appleAmountPrice){
        UPGRADES.appleAmount += 1;
        SNAKE.score -= UPGRADES.appleAmountPrice;
        UPGRADES.appleAmountPrice *= 3;
    }

    else if(key == "G" && SNAKE.score >= UPGRADES.cutPrice){
        if(cutInHalf()){
            SNAKE.score -= UPGRADES.cutPrice;
            UPGRADES.cutPrice *= 2;
        }
    }
}

function cutInHalf(){
    // Cuts off half of the snake.
    // Can only be done when snake is bigger then 2.
    // Returns true if cutting occured.
    cutOff = Math.floor(SNAKE.position.length / 2);
    if (SNAKE.position.length > 2){
        while (cutOff != 0){
            map[SNAKE.position[0][1]][SNAKE.position[0][0]] = "X";
            SNAKE.position.shift();
            SNAKE.tail = SNAKE.position[0];
            cutOff -= 1;
        }
        return true;
    }
    return false;
}

function resetGame(map){
    // Resets the game.
    // Waits for user input to start again.

    // Clear the map
    for (i = 0; i <= MAP_HEIGHT; i++){
        if (i == MAX_HEIGHT){
            break;
        }
        for (y = 0; y <= MAP_WIDTH; y++){
            if (y == MAX_WIDTH){
                break;
            }
            map[i][y] = "X";
        }
    }
    addApple(map);
    MAP_WIDTH = 10;
    MAP_HEIGHT = 10;
    SNAKE.position = [[0, 0], [1, 0]];
    SNAKE.head = [1, 0];
    SNAKE.tail = [0, 0];
    SNAKE.score = 0;
    SNAKE.direction = "S";
    UPGRADES.appleWorth = 1;
    UPGRADES.appleAmount = 1;
    UPGRADES.widthPrice = 15;
    UPGRADES.heightPrice = 15;
    UPGRADES.cutPrice = 20;
    UPGRADES.appleWorthPrice = 4;
    UPGRADES.appleAmountPrice = 4;
    document.addEventListener("keydown", userInput);
    drawGameOver();
}

function gameLoop(map){
    // map = addApple(map);
    // Add event listener for the input.
    if (INTRO){
        document.addEventListener("keydown", userInput);
        drawIntro();
    }
    else{
        if (WIN){
            drawWin();
        }
        else if (!GAME_OVER){
        document.addEventListener("keydown", userInput);
        if(!PAUSE){
        snakeMove(map);
        }
        drawGame(map);
        checkApples(map);
        checkWin();
        }
        else{
            resetGame(map);
        }
}
}

function main(){
    // Initialize map.
    map = createMap();
    // Add the first apple.
    addApple(map);
    setInterval(gameLoop, 400, map);
}

main();