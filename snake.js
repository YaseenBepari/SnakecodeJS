const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

// Game parameters
const gridSize = 20; // Size of each grid cell in pixels
const tileCount = canvas.width / gridSize;
let snake, direction, food, score, intervalId, isGameRunning = false;

// Event listener for directional keys
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;

    const key = e.key;

    // Prevent moving directly backward
    if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    else if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    else if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    else if (key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
});

function initializeGame() {
    // Reset game state
    snake = [{ x: 10, y: 10 }]; // Start at (10, 10)
    direction = { x: 1, y: 0 }; // Start moving right
    score = 0;
    scoreElement.textContent = `Score: 0`;
    startButton.disabled = true;
    isGameRunning = true;

    placeFood();
    drawGame(); // Initial draw

    // Clear any previous game loop and start a new one
    if (intervalId) clearInterval(intervalId);
    // Set game speed: 100ms is standard
    intervalId = setInterval(updateGame, 100);
}

function placeFood() {
    let newFood;
    do {
        // Place food at a random grid location
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)); // Ensure food is not on snake

    food = newFood;
}

function updateGame() {
    // 1. Calculate the new head position
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 2. Check for collisions (wall or self)
    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        endGame();
        return;
    }

    // 3. Add the new head to the front
    snake.unshift(head);

    // 4. Check if snake ate the food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        placeFood(); // Place new food
    } else {
        snake.pop(); // Remove the tail if no food was eaten (moves the snake)
    }

    // 5. Redraw the game
    drawGame();
}

function drawGame() {
    // Clear the canvas (draw game background)
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

    // Draw snake segments
    ctx.fillStyle = '#2ecc71'; // Green color for snake
    snake.forEach(segment => {
        // -1 offset creates a grid effect
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });
}

function endGame() {
    clearInterval(intervalId);
    startButton.disabled = false;
    isGameRunning = false;
    alert(`Game Over! Final Score: ${score}`);
}

// Start the game when the button is clicked
startButton.addEventListener('click', initializeGame);