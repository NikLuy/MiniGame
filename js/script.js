let score = 0;
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const mouse = document.getElementById('mouse');
const cheese = document.getElementById('cheese');
let mouseX = 100, mouseY = 100;
let catX = 0, catY = 0;
let currentDirection = 'right';
const labyrinthWidth = 15; // Adjust as needed
const labyrinthHeight = 15; // Adjust as needed
let labyrinth = [];

document.addEventListener('keydown', moveMouse);
startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    scoreDisplay.textContent = `Punkte: ${score}`;
    mouse.style.display = 'block';
    cheese.style.display = 'block';
    updateMousePosition();
    startButton.style.display = 'none';
    generateLabyrinth(labyrinthWidth, labyrinthHeight);
    // displayLabyrinth();
    placeCheese();
    // placeCat();
}

function moveMouse(event) {
    switch(event.key) {
        case 'ArrowUp':
            // mouseY -= 10;
            currentDirection = 'up';
            break;
        case 'ArrowDown':
            // mouseY += 10;
            currentDirection = 'down';
            break;
        case 'ArrowLeft':
            // mouseX -= 10;
            currentDirection = 'left';
            break;
        case 'ArrowRight':
            // mouseX += 10;
            currentDirection = 'right';
            break;
    }
    updateMousePosition();
    checkCheeseCollision();
    checkCatCollision();
}

function updateMousePosition() {
    switch (currentDirection) {
        case 'up':
            mouse.style.transform = 'rotate(180deg)';
            if(!checkWallCollision(mouseX, mouseY-10)){
                mouseY -= 10;
            }
            break;
        case 'down':
            mouse.style.transform = 'rotate(0deg)';
            if(!checkWallCollision(mouseX, mouseY+10)){
                mouseY += 10;
            }
            break;
        case 'left':
            mouse.style.transform = 'rotate(90deg)';
            if(!checkWallCollision(mouseX-10, mouseY)){
                mouseX -= 10;
            }
            break;
        case 'right':
            mouse.style.transform = 'rotate(-90deg)';
            if(!checkWallCollision(mouseX+10, mouseY)){
                mouseX += 10;
            }
            break;
    }
    mouse.style.left = `${mouseX}px`;
    mouse.style.top = `${mouseY}px`;
}

function checkWallCollision(x, y) {
    // Check if the coordinates (x, y) collide with a wall in the labyrinth array
    // return labyrinth[y][x] === 1;
    return false;
  }

  function generateLabyrinth(width, height) {
    // Create an empty labyrinth array
    labyrinth = [];
    for (let y = 0; y < height; y++) {
      labyrinth[y] = [];
      for (let x = 0; x < width; x++) {
        labyrinth[y][x] = 1; // Initialize all cells as walls
      }
    }
  
    // Recursive backtracking algorithm (example)
    const generatePath = (x, y) => {
      // Mark current cell as empty space
      labyrinth[y][x] = 0;
  
      // Randomly choose unvisited neighbor cells
      const directions = [
        [0, 1], // Up
        [0, -1], // Down
        [1, 0], // Right
        [-1, 0], // Left
      ];
      directions.sort(() => Math.random() - 0.5); // Randomize direction order
  
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
  
        // Check if neighbor is within bounds and unvisited
        if (0 <= newX && newX < width && 0 <= newY && newY < height && labyrinth[newY][newX] === 1) {
          generatePath(newX, newY); // Recursively carve path in neighbor
        }
      }
    };
  
    // Start carving path from a random cell
    generatePath(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
  }
  function displayLabyrinth() {
    const container = document.getElementById('game-container'); // Assuming your container element
  
    // Clear any existing content
    container.innerHTML = '';
  
    // Create a table element to represent the labyrinth
    const table = document.createElement('table');
    for (let y = 0; y < labyrinth.length; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < labyrinth[y].length; x++) {
        const cell = document.createElement('td');
        cell.classList.add('labyrinth-cell'); // Add CSS class for styling
  
        // Set background color based on cell value (0 - empty, 1 - wall)
        cell.style.backgroundColor = labyrinth[y][x] === 0 ? 'white' : 'black';
  
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
  
    container.appendChild(table);
  }

function placeCheese() {
    const x = Math.floor(Math.random() * 760) + 20;
    const y = Math.floor(Math.random() * 560) + 20;
    cheese.style.left = `${x}px`;
    cheese.style.top = `${y}px`;
}

function checkCheeseCollision() {
    const mouseRect = mouse.getBoundingClientRect();
    const cheeseRect = cheese.getBoundingClientRect();
    if (mouseRect.left < cheeseRect.left + cheeseRect.width &&
        mouseRect.left + mouseRect.width > cheeseRect.left &&
        mouseRect.top < cheeseRect.top + cheeseRect.height &&
        mouseRect.top + mouseRect.height > cheeseRect.top) {
        score += 10;
        scoreDisplay.textContent = `Punkte: ${score}`;
        placeCheese();
    }
}

function placeCat() {
    // Find a random empty space within the labyrinth
    do {
      catX = Math.floor(Math.random() * labyrinthWidth);
      catY = Math.floor(Math.random() * labyrinthHeight);
    } while (labyrinth[catY][catX] === 1); // Keep searching if it's a wall
  
    const catImage = document.getElementById('cat');
    catImage.style.left = `${catX * cellSize}px`; // Update cat position based on cell size
    catImage.style.top = `${catY * cellSize}px`;
  }
  
  function moveCat() { // Called periodically (e.g., using requestAnimationFrame)
    const directions = [
      [0, 1], // Up
      [0, -1], // Down
      [1, 0], // Right
      [-1, 0], // Left
    ];
    directions.sort(() => Math.random() - 0.5); // Randomize direction order
  
    for (const [dx, dy] of directions) {
      const newX = catX + dx;
      const newY = catY + dy;
  
      // Check if neighbor is within bounds and empty space
      if (0 <= newX && newX < labyrinthWidth && 0 <= newY && newY < labyrinthHeight && labyrinth[newY][newX] === 0) {
        catX = newX;
        catY = newY;
        break; // Move to the first valid neighbor and stop iterating
      }
    }
  
    const catImage = document.getElementById('cat');
    catImage.style.left = `${catX * cellSize}px`;
    catImage.style.top = `${catY * cellSize}px`;
  }

function checkCatCollision() {
    const mouseRect = mouse.getBoundingClientRect();
    const catRect = cat.getBoundingClientRect();
    if (mouseRect.left < catRect.left + catRect.width &&
        mouseRect.left + mouseRect.width > catRect.left &&
        mouseRect.top < catRect.top + catRect.height &&
        mouseRect.top + mouseRect.height > catRect.top) {
        score += 10;
        scoreDisplay.textContent = `Punkte: ${score}`;
        gameOver(); // Call a new function to handle game over
    }
}


function gameOver() {
// Display game over message, stop the game loop, etc.
alert("Oh no! The cat got you! Game Over!");
}
