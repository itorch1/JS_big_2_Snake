const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';

const frameLength = 70;

let growthAmount = 0;

let score = 0;

isGameOver = false;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('.score span');

const gameState = {
    player: {
        head: {x: 3, y: 10},
        vel: {x: 1, y: 0},
        snake: [
            {x: 3, y: 10},
            {x: 2, y: 10},
            {x: 1, y: 10},
        ],
    },
    food: {x: 7, y: 7},
    gridSize: 20,
};

function init() {
    canvas.width = canvas.height = 600;
    // drawGame();
    setFood();
    setInterval(changeState, frameLength);
}

init();

document.addEventListener('keydown', setVel);

function setVel(e) {
    const currVel = gameState.player.vel;
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
        let vel = gameState.player.vel;
        if (e.keyCode === 37 && vel.x != 1) vel = { x: -1, y: 0};
        if (e.keyCode === 38 && vel.y != 1) vel = { x: 0, y: -1};
        if (e.keyCode === 39 && vel.x != -1) vel = { x: 1, y: 0};
        if (e.keyCode === 40 && vel.y != -1) vel = { x: 0, y: 1};
        gameState.player.vel = vel;
    }
}

function drawGame() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const {food, gridSize, player:{snake}} = gameState;
    const size = canvas.width / gridSize;

    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    ctx.fillStyle = SNAKE_COLOR;
    for (let cell of snake)
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
}

function changeState() {
    if (isGameOver) return;
    // check if ate food
    const {player:{head}, food} = gameState;
    if (head.x === food.x && head.y === food.y) {
        isGrowing = true;
        growthAmount+= 2;
        score++;
        scoreEl.innerText = score;
        setFood();
    }
    // move snake
    const {player:{vel} } = gameState
    moveSnake(vel.x, vel.y);

    if (isGameOver) return;
    drawGame();
}

function moveSnake(x, y) {
    const {player} = gameState;
    player.head = {x: player.head.x + x, y: player.head.y + y};
    let oldPos = player.snake[0];
    player.snake[0] = {x: player.head.x, y: player.head.y};
    for (let i=1; i<player.snake.length; i++) {
        const swap = player.snake[i];
        player.snake[i] = oldPos;
        oldPos = swap;
    }
    if (growthAmount) {
        player.snake.push({oldPos});
        growthAmount--;
    }
    // game over conditions
    for (let cell1 of player.snake) {
        for (let cell2 of player.snake) {
            if (cell1 != cell2 && cell1.x === cell2.x && cell1.y === cell2.y) {
                isGameOver = true;
                document.body.style.backgroundColor = '#f7665e';
            }
        }
        if (cell1.x === 20 || cell1.x === -1 || cell1.y === 20 || cell1.y === -1) {
            isGameOver = true;
            document.body.style.backgroundColor = '#f7665e';
        }
    }
}

function setFood() {
    let xPos = -1; let yPos = -1;

    xPos = Math.floor(Math.random() * gameState.gridSize);
    yPos = Math.floor(Math.random() * gameState.gridSize);

    gameState.food = {x: xPos, y: yPos};
}